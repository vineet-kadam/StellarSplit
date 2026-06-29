#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, String, Vec, symbol_short,
};

// Settlement record structure
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SettlementRecord {
    pub id: u64,
    pub group_id: u64,
    pub from: Address,
    pub to: Address,
    pub amount: i128,
    pub is_settled: bool,
    pub transaction_hash: String,
    pub settled_at: u64,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    SettlementCounter,
    Settlement(u64),
    GroupSettlements(u64),
}

#[contract]
pub struct SettlementContract;

#[contractimpl]
impl SettlementContract {
    /// Record a new settlement
    pub fn record_settlement(
        env: Env,
        group_id: u64,
        from: Address,
        to: Address,
        amount: i128,
    ) -> u64 {
        from.require_auth();

        // Get and increment counter
        let mut counter: u64 = env.storage().instance().get(&DataKey::SettlementCounter).unwrap_or(0);
        counter += 1;

        // Create settlement record
        let settlement = SettlementRecord {
            id: counter,
            group_id,
            from: from.clone(),
            to: to.clone(),
            amount,
            is_settled: false,
            transaction_hash: String::from_str(&env, ""),
            settled_at: 0,
            created_at: env.ledger().timestamp(),
        };

        // Store settlement
        env.storage().instance().set(&DataKey::Settlement(counter), &settlement);
        env.storage().instance().set(&DataKey::SettlementCounter, &counter);

        // Add to group settlements list
        let mut group_settlements: Vec<u64> = env.storage()
            .instance()
            .get(&DataKey::GroupSettlements(group_id))
            .unwrap_or(Vec::new(&env));
        group_settlements.push_back(counter);
        env.storage().instance().set(&DataKey::GroupSettlements(group_id), &group_settlements);

        // Emit event
        env.events().publish(
            (symbol_short!("STL_REC"), counter),
            (from, to, amount),
        );

        counter
    }

    /// Mark a settlement as settled with transaction hash
    pub fn mark_settled(
        env: Env,
        settlement_id: u64,
        transaction_hash: String,
        caller: Address,
    ) {
        caller.require_auth();

        // Get settlement
        let mut settlement: SettlementRecord = env.storage()
            .instance()
            .get(&DataKey::Settlement(settlement_id))
            .expect("Settlement not found");

        // Verify caller is the payer
        if settlement.from != caller {
            panic!("Only the payer can mark settlement as settled");
        }

        // Update settlement
        settlement.is_settled = true;
        settlement.transaction_hash = transaction_hash.clone();
        settlement.settled_at = env.ledger().timestamp();

        // Store updated settlement
        env.storage().instance().set(&DataKey::Settlement(settlement_id), &settlement);

        // Emit event
        env.events().publish(
            (symbol_short!("STL_DONE"), settlement_id),
            (caller, transaction_hash),
        );
    }

    /// Get settlement details
    pub fn get_settlement(env: Env, settlement_id: u64) -> SettlementRecord {
        env.storage()
            .instance()
            .get(&DataKey::Settlement(settlement_id))
            .expect("Settlement not found")
    }

    /// Get all settlements for a group
    pub fn get_group_settlements(env: Env, group_id: u64) -> Vec<SettlementRecord> {
        let settlement_ids: Vec<u64> = env.storage()
            .instance()
            .get(&DataKey::GroupSettlements(group_id))
            .unwrap_or(Vec::new(&env));

        let mut settlements = Vec::new(&env);
        for id in settlement_ids.iter() {
            if let Some(settlement) = env.storage().instance().get(&DataKey::Settlement(id)) {
                settlements.push_back(settlement);
            }
        }

        settlements
    }

    /// Get pending settlements for an address
    pub fn get_pending_settlements(env: Env, address: Address) -> Vec<SettlementRecord> {
        let counter: u64 = env.storage().instance().get(&DataKey::SettlementCounter).unwrap_or(0);
        
        let mut pending = Vec::new(&env);
        for id in 1..=counter {
            if let Some(settlement) = env.storage().instance().get::<DataKey, SettlementRecord>(&DataKey::Settlement(id)) {
                if !settlement.is_settled && (settlement.from == address || settlement.to == address) {
                    pending.push_back(settlement);
                }
            }
        }

        pending
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_record_settlement() {
        let env = Env::default();
        let contract_id = env.register_contract(None, SettlementContract);
        let client = SettlementContractClient::new(&env, &contract_id);

        let from = Address::generate(&env);
        let to = Address::generate(&env);
        let amount = 5000i128;

        env.mock_all_auths();

        let settlement_id = client.record_settlement(&1u64, &from, &to, &amount);
        assert_eq!(settlement_id, 1);

        let settlement = client.get_settlement(&settlement_id);
        assert_eq!(settlement.from, from);
        assert_eq!(settlement.to, to);
        assert_eq!(settlement.amount, amount);
        assert_eq!(settlement.is_settled, false);
    }

    #[test]
    fn test_mark_settled() {
        let env = Env::default();
        let contract_id = env.register_contract(None, SettlementContract);
        let client = SettlementContractClient::new(&env, &contract_id);

        let from = Address::generate(&env);
        let to = Address::generate(&env);
        let amount = 5000i128;

        env.mock_all_auths();

        let settlement_id = client.record_settlement(&1u64, &from, &to, &amount);
        
        let tx_hash = String::from_str(&env, "abc123xyz");
        client.mark_settled(&settlement_id, &tx_hash, &from);

        let settlement = client.get_settlement(&settlement_id);
        assert_eq!(settlement.is_settled, true);
        assert_eq!(settlement.transaction_hash, tx_hash);
    }

    #[test]
    fn test_get_group_settlements() {
        let env = Env::default();
        let contract_id = env.register_contract(None, SettlementContract);
        let client = SettlementContractClient::new(&env, &contract_id);

        let from = Address::generate(&env);
        let to = Address::generate(&env);

        env.mock_all_auths();

        let group_id = 1u64;
        client.record_settlement(&group_id, &from, &to, &5000);
        client.record_settlement(&group_id, &to, &from, &3000);

        let settlements = client.get_group_settlements(&group_id);
        assert_eq!(settlements.len(), 2);
    }
}
