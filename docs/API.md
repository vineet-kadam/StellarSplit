# API Documentation

## Frontend Utilities

### stellar.js

#### getAccountBalance(publicKey)
Fetches the XLM balance for a given Stellar account.

**Parameters:**
- `publicKey` (string): Stellar public key (G...)

**Returns:**
- Promise<string>: Balance in XLM

**Throws:**
- Error if account not found or network error

**Example:**
```javascript
const balance = await getAccountBalance('GABC...');
console.log(`Balance: ${balance} XLM`);
```

#### sendPayment(sourcePublicKey, destinationPublicKey, amount, signTransaction)
Sends XLM from source to destination.

**Parameters:**
- `sourcePublicKey` (string): Sender's public key
- `destinationPublicKey` (string): Recipient's public key
- `amount` (string): Amount in XLM
- `signTransaction` (Function): Transaction signing function

**Returns:**
- Promise<object>: `{ success: true, hash: string, ledger: number }`

**Throws:**
- Error for insufficient balance, invalid address, or transaction failure

**Example:**
```javascript
const result = await sendPayment(
  'GABC...',
  'GDEF...',
  '10',
  signTransactionWithFreighter
);
console.log(`Transaction hash: ${result.hash}`);
```

#### formatXLM(amount)
Formats XLM amount by removing trailing zeros.

**Parameters:**
- `amount` (string): Amount to format

**Returns:**
- string: Formatted amount

**Example:**
```javascript
formatXLM('10.0000000') // Returns "10"
formatXLM('10.5000000') // Returns "10.5"
```

#### shortenAddress(address, chars)
Shortens a Stellar address for display.

**Parameters:**
- `address` (string): Full Stellar address
- `chars` (number): Characters to show on each side (default: 4)

**Returns:**
- string: Shortened address

**Example:**
```javascript
shortenAddress('GABC123...XYZ789', 4) // Returns "GABC...Z789"
```

#### isValidAddress(address)
Validates a Stellar public key.

**Parameters:**
- `address` (string): Address to validate

**Returns:**
- boolean: True if valid

**Example:**
```javascript
isValidAddress('GABC...') // Returns true/false
```

### wallet.js

#### connectFreighter()
Connects to Freighter wallet.

**Returns:**
- Promise<string>: User's public key

**Throws:**
- Error if wallet not found or user rejects

**Example:**
```javascript
try {
  const publicKey = await connectFreighter();
  console.log('Connected:', publicKey);
} catch (error) {
  console.error('Connection failed:', error);
}
```

#### signTransactionWithFreighter(xdr)
Signs a transaction using Freighter.

**Parameters:**
- `xdr` (string): Transaction XDR

**Returns:**
- Promise<string>: Signed transaction XDR

**Throws:**
- Error if user rejects or signing fails

#### getWalletErrorMessage(error)
Converts error to user-friendly message.

**Parameters:**
- `error` (Error): Error object

**Returns:**
- string: User-friendly error message

## Smart Contract API

### GroupExpenseContract

#### initialize(settlement_contract: Address)
Initializes the contract with settlement contract address.

**Parameters:**
- `settlement_contract`: Address of SettlementContract

**Authorization:** Contract deployer

**Example:**
```bash
soroban contract invoke \
  --id CONTRACT_ID \
  -- initialize \
  --settlement_contract SETTLEMENT_CONTRACT_ID
```

#### create_group(creator: Address, name: String) → u64
Creates a new expense group.

**Parameters:**
- `creator`: Group creator's address
- `name`: Group name

**Returns:**
- u64: Group ID

**Authorization:** Creator must sign

**Events:**
- GroupCreated(group_id, creator, name)

**Example:**
```bash
soroban contract invoke \
  --id CONTRACT_ID \
  -- create_group \
  --creator GABC... \
  --name "Weekend Trip"
```

#### add_member(group_id: u64, member: Address, caller: Address)
Adds a member to a group.

**Parameters:**
- `group_id`: Group ID
- `member`: Member's address to add
- `caller`: Address making the call (must be creator)

**Authorization:** Creator only

**Events:**
- MemberAdded(group_id, member)

**Errors:**
- Panics if caller is not creator
- Panics if member already exists
- Panics if group not found

#### add_expense(group_id: u64, description: String, amount: i128, paid_by: Address, split_among: Vec<Address>) → u64
Records a new expense.

**Parameters:**
- `group_id`: Group ID
- `description`: Expense description
- `amount`: Amount in stroops (1 XLM = 10,000,000 stroops)
- `paid_by`: Who paid
- `split_among`: Members to split among

**Returns:**
- u64: Expense ID

**Authorization:** paid_by must sign

**Events:**
- ExpenseAdded(group_id, expense_id, paid_by, description, amount)

**Errors:**
- Panics if paid_by is not a member
- Panics if group not found

#### calculate_settlements(group_id: u64) → Vec<Settlement>
Calculates optimal settlements for a group.

**Parameters:**
- `group_id`: Group ID

**Returns:**
- Vec<Settlement>: List of settlements needed

**Example:**
```bash
soroban contract invoke \
  --id CONTRACT_ID \
  -- calculate_settlements \
  --group_id 1
```

#### create_settlement(group_id: u64, from: Address, to: Address, amount: i128) → u64
Creates a settlement record.

**Parameters:**
- `group_id`: Group ID
- `from`: Debtor address
- `to`: Creditor address
- `amount`: Amount in stroops

**Returns:**
- u64: Settlement ID

**Authorization:** from must sign

**Events:**
- SettlementCreated(group_id, settlement_id, from, to, amount)

#### get_group(group_id: u64) → Group
Retrieves group details.

**Parameters:**
- `group_id`: Group ID

**Returns:**
- Group struct with all details

**Errors:**
- Panics if group not found

#### get_expenses(group_id: u64) → Vec<Expense>
Gets all expenses for a group.

**Parameters:**
- `group_id`: Group ID

**Returns:**
- Vec<Expense>: All expenses

#### get_settlements(group_id: u64) → Vec<Settlement>
Gets all settlements for a group.

**Parameters:**
- `group_id`: Group ID

**Returns:**
- Vec<Settlement>: All settlements

### SettlementContract

#### record_settlement(group_id: u64, from: Address, to: Address, amount: i128) → u64
Records a new settlement.

**Parameters:**
- `group_id`: Group ID
- `from`: Debtor
- `to`: Creditor
- `amount`: Amount in stroops

**Returns:**
- u64: Settlement ID

**Authorization:** from must sign

**Events:**
- SettlementRecorded(settlement_id, from, to, amount)

#### mark_settled(settlement_id: u64, transaction_hash: String, caller: Address)
Marks settlement as completed.

**Parameters:**
- `settlement_id`: Settlement ID
- `transaction_hash`: Stellar transaction hash
- `caller`: Address marking as settled (must be payer)

**Authorization:** Payer only

**Events:**
- SettlementSettled(settlement_id, caller, transaction_hash)

**Errors:**
- Panics if caller is not the payer
- Panics if settlement not found

#### get_settlement(settlement_id: u64) → SettlementRecord
Gets settlement details.

**Parameters:**
- `settlement_id`: Settlement ID

**Returns:**
- SettlementRecord: Full settlement details

#### get_group_settlements(group_id: u64) → Vec<SettlementRecord>
Gets all settlements for a group.

**Parameters:**
- `group_id`: Group ID

**Returns:**
- Vec<SettlementRecord>: All settlements

#### get_pending_settlements(address: Address) → Vec<SettlementRecord>
Gets pending settlements for an address.

**Parameters:**
- `address`: User's address

**Returns:**
- Vec<SettlementRecord>: Pending settlements

## Event Schema

### GroupCreated
```rust
{
  topic: ("GRP_CRTD", group_id),
  data: (creator: Address, name: String)
}
```

### MemberAdded
```rust
{
  topic: ("MBR_ADD", group_id),
  data: (member: Address)
}
```

### ExpenseAdded
```rust
{
  topic: ("EXP_ADD", group_id, expense_id),
  data: (paid_by: Address, description: String, amount: i128)
}
```

### SettlementCreated
```rust
{
  topic: ("STL_CRTD", group_id, settlement_id),
  data: (from: Address, to: Address, amount: i128)
}
```

### SettlementRecorded
```rust
{
  topic: ("STL_REC", settlement_id),
  data: (from: Address, to: Address, amount: i128)
}
```

### SettlementSettled
```rust
{
  topic: ("STL_DONE", settlement_id),
  data: (caller: Address, transaction_hash: String)
}
```

## Error Codes

### Frontend Errors
- `WALLET_NOT_FOUND`: Wallet extension not installed
- `USER_REJECTED`: User declined transaction
- `INSUFFICIENT_BALANCE`: Not enough XLM
- `INVALID_ADDRESS`: Invalid Stellar address
- `NETWORK_ERROR`: Network or RPC failure

### Contract Errors
Contracts use `panic!` with descriptive messages:
- "Group not found"
- "Only group creator can add members"
- "Member already exists in group"
- "Payer must be a group member"
- "Only the payer can mark settlement as settled"
- "Settlement not found"

## Rate Limits

### Stellar Horizon
- 3600 requests per hour per IP
- Use with caution in production

### Soroban RPC
- Varies by provider
- Implement exponential backoff

## Best Practices

1. **Always validate addresses** before submitting to blockchain
2. **Handle errors gracefully** with user-friendly messages
3. **Cache balances** to reduce API calls
4. **Use events** for real-time updates
5. **Batch operations** when possible
6. **Implement retry logic** for network failures
7. **Store transaction hashes** for audit trail
