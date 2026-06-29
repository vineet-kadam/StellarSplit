import * as StellarSdk from 'stellar-sdk';

// Initialize Stellar SDK with testnet
const server = new StellarSdk.Horizon.Server(
  import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org'
);

/**
 * Get account balance for a given public key
 * @param {string} publicKey - Stellar public key
 * @returns {Promise<string>} - XLM balance
 */
export async function getAccountBalance(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);
    const xlmBalance = account.balances.find(
      (balance) => balance.asset_type === 'native'
    );
    return xlmBalance ? xlmBalance.balance : '0';
  } catch (error) {
    console.error('Error fetching balance:', error);
    if (error.response?.status === 404) {
      throw new Error('Account not found. Please fund your account from the Stellar testnet faucet.');
    }
    throw new Error('Failed to fetch balance');
  }
}

/**
 * Send XLM payment
 * @param {string} sourcePublicKey - Sender's public key
 * @param {string} destinationPublicKey - Recipient's public key
 * @param {string} amount - Amount in XLM
 * @param {Function} signTransaction - Function to sign transaction (from wallet)
 * @returns {Promise<object>} - Transaction result
 */
export async function sendPayment(sourcePublicKey, destinationPublicKey, amount, signTransaction) {
  try {
    // Validate destination address
    if (!StellarSdk.StrKey.isValidEd25519PublicKey(destinationPublicKey)) {
      throw new Error('Invalid destination address');
    }

    // Load source account
    const sourceAccount = await server.loadAccount(sourcePublicKey);

    // Check if destination account exists, if not we need to create it
    let isNewAccount = false;
    try {
      await server.loadAccount(destinationPublicKey);
    } catch (error) {
      if (error.response?.status === 404) {
        isNewAccount = true;
      }
    }

    // Build transaction
    let transaction;
    const fee = await server.fetchBaseFee();

    if (isNewAccount) {
      // Create account operation (minimum 1 XLM)
      if (parseFloat(amount) < 1) {
        throw new Error('Minimum 1 XLM required to create new account');
      }
      transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: fee.toString(),
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.createAccount({
            destination: destinationPublicKey,
            startingBalance: amount,
          })
        )
        .setTimeout(180)
        .build();
    } else {
      // Payment operation
      transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: fee.toString(),
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationPublicKey,
            asset: StellarSdk.Asset.native(),
            amount: amount,
          })
        )
        .setTimeout(180)
        .build();
    }

    // Sign transaction using wallet
    const signedTx = await signTransaction(transaction.toXDR());

    // Submit transaction
    const transactionResult = await server.submitTransaction(
      StellarSdk.TransactionBuilder.fromXDR(signedTx, StellarSdk.Networks.TESTNET)
    );

    return {
      success: true,
      hash: transactionResult.hash,
      ledger: transactionResult.ledger,
    };
  } catch (error) {
    console.error('Payment error:', error);
    
    if (error.message.includes('Insufficient balance')) {
      throw new Error('Insufficient XLM balance');
    }
    if (error.message.includes('Invalid destination')) {
      throw new Error('Invalid destination address');
    }
    if (error.response?.data?.extras?.result_codes) {
      const resultCodes = error.response.data.extras.result_codes;
      throw new Error(`Transaction failed: ${JSON.stringify(resultCodes)}`);
    }
    
    throw new Error(error.message || 'Failed to send payment');
  }
}

/**
 * Format XLM amount (remove trailing zeros)
 * @param {string} amount - Amount to format
 * @returns {string} - Formatted amount
 */
export function formatXLM(amount) {
  return parseFloat(amount).toFixed(7).replace(/\.?0+$/, '');
}

/**
 * Shorten address for display
 * @param {string} address - Full Stellar address
 * @param {number} chars - Number of characters to show on each side
 * @returns {string} - Shortened address
 */
export function shortenAddress(address, chars = 4) {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Validate Stellar address
 * @param {string} address - Address to validate
 * @returns {boolean} - Whether address is valid
 */
export function isValidAddress(address) {
  try {
    return StellarSdk.StrKey.isValidEd25519PublicKey(address);
  } catch {
    return false;
  }
}

/**
 * Get transaction details
 * @param {string} txHash - Transaction hash
 * @returns {Promise<object>} - Transaction details
 */
export async function getTransaction(txHash) {
  try {
    const transaction = await server.transactions().transaction(txHash).call();
    return transaction;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw new Error('Failed to fetch transaction details');
  }
}

/**
 * Stream account payments (for real-time updates)
 * @param {string} publicKey - Account public key
 * @param {Function} onPayment - Callback for each payment
 * @returns {Function} - Close stream function
 */
export function streamPayments(publicKey, onPayment) {
  const closeStream = server
    .payments()
    .forAccount(publicKey)
    .cursor('now')
    .stream({
      onmessage: (payment) => {
        onPayment(payment);
      },
      onerror: (error) => {
        console.error('Stream error:', error);
      },
    });

  return closeStream;
}

export { server };
