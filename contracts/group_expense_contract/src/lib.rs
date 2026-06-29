#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, String, Vec, symbol_short,
};

// Data structures for the contract
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Group {
    pub id: u64,
    pub name: String,
    pub creator: Address,
    pub members: Vec<Address>,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Expense {
    pub id: u64,
    pub group_id: u64,
    pub description: String,
    pub amount: i128,
    pub paid_by: Address,
    pub split_among: Vec<Address>,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Settlement {
    pub id: u64,
    pub group_id: u64,
    pub from: Address,
    pub to: Address,
    pub amount: i128,
    pub is_settled: bool,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    GroupCounter,
    ExpenseCounter,
    SettlementCounter,
    Group(u64),
    GroupExpenses(u64),
    GroupSettlements(u64),
    SettlementContract,
}

#[contract]
pub struct GroupExpenseContract;

#[contractimpl]
impl GroupExpenseContract {
    /// Initialize the contract with settlement contract address
    pub fn initialize(env: Env, settlement_contract: Address) {
        env.storage().instance().set(&DataKey::SettlementContract, &settlement_contract);
    }

    /// Create a new group
    pub fn create_group(env: Env, creator: Address, name: String) -> u64 {
        creator.require_auth();

        // Get and increment group counter
        let mut counter: u64 = env.storage().instance().get(&DataKey::GroupCounter).unwrap_or(0);
        counter += 1;

        // Create new group
        let mut members = Vec::new(&env);
        members.push_back(creator.clone());

        let group = Group {
            id: counter,
            name: name.clone(),
            creator: creator.clone(),
            members,
            created_at: env.ledger().timestamp(),
        };

        // Store group
        env.storage().instance().set(&DataKey::Group(counter), &group);
        env.storage().instance().set(&DataKey::GroupCounter, &counter);

        // Initialize empty expenses and settlements vectors
        let empty_expenses: Vec<Expense> = Vec::new(&env);
        let empty_settlements: Vec<Settlement> = Vec::new(&env);
        env.storage().instance().set(&DataKey::GroupExpenses(counter), &empty_expenses);
        env.storage().instance().set(&DataKey::GroupSettlements(counter), &empty_settlements);

        // Emit event
        env.events().publish((symbol_short!("GRP_CRTD"), counter), (creator, name));

        counter
    }

    /// Add a member to a group
    pub fn add_member(env: Env, group_id: u64, member: Address, caller: Address) {
        caller.require_auth();

        // Get group
        let mut group: Group = env.storage()
            .instance()
            .get(&DataKey::Group(group_id))
            .expect("Group not found");

        // Verify caller is the creator
        if group.creator != caller {
            panic!("Only group creator can add members");
        }

        // Check if member already exists
        for existing_member in group.members.iter() {
            if existing_member == member {
                panic!("Member already exists in group");
            }
        }

        // Add member
        group.members.push_back(member.clone());
        env.storage().instance().set(&DataKey::Group(group_id), &group);

        // Emit event
        env.events().publish((symbol_short!("MBR_ADD"), group_id), member);
    }

    /// Add an expense to a group
    pub fn add_expense(
        env: Env,
        group_id: u64,
        description: String,
        amount: i128,
        paid_by: Address,
        split_among: Vec<Address>,
    ) -> u64 {
        paid_by.require_auth();

        // Get group to verify it exists
        let group: Group = env.storage()
            .instance()
            .get(&DataKey::Group(group_id))
            .expect("Group not found");

        // Verify paid_by is a member
        let mut is_member = false;
        for member in group.members.iter() {
            if member == paid_by {
                is_member = true;
                break;
            }
        }
        if !is_member {
            panic!("Payer must be a group member");
        }

        // Get and increment expense counter
        let mut counter: u64 = env.storage().instance().get(&DataKey::ExpenseCounter).unwrap_or(0);
        counter += 1;

        // Create expense
        let expense = Expense {
            id: counter,
            group_id,
            description: description.clone(),
            amount,
            paid_by: paid_by.clone(),
            split_among: split_among.clone(),
            created_at: env.ledger().timestamp(),
        };

        // Get existing expenses and add new one
        let mut expenses: Vec<Expense> = env.storage()
            .instance()
            .get(&DataKey::GroupExpenses(group_id))
            .unwrap_or(Vec::new(&env));
        expenses.push_back(expense);

        // Store updated expenses
        env.storage().instance().set(&DataKey::GroupExpenses(group_id), &expenses);
        env.storage().instance().set(&DataKey::ExpenseCounter, &counter);

        // Emit event
        env.events().publish(
            (symbol_short!("EXP_ADD"), group_id, counter),
            (paid_by, description, amount),
        );

        counter
    }

    /// Calculate settlements for a group based on expenses
    pub fn calculate_settlements(env: Env, group_id: u64) -> Vec<Settlement> {
        // Get group
        let group: Group = env.storage()
            .instance()
            .get(&DataKey::Group(group_id))
            .expect("Group not found");

        // Get expenses
        let expenses: Vec<Expense> = env.storage()
            .instance()
            .get(&DataKey::GroupExpenses(group_id))
            .unwrap_or(Vec::new(&env));

        // Calculate balances (how much each person owes/is owed)
        let mut balances = Vec::new(&env);
        
        // Initialize balances for all members
        for member in group.members.iter() {
            balances.push_back((member.clone(), 0i128));
        }

        // Calculate net balance for each member
        for expense in expenses.iter() {
            let split_count = expense.split_among.len() as i128;
            if split_count == 0 {
                continue;
            }
            let share = expense.amount / split_count;

            // Update balances
            for i in 0..balances.len() {
                let (addr, balance) = balances.get(i).unwrap();
                
                // Payer gets credited
                if addr == expense.paid_by {
                    balances.set(i, (addr.clone(), balance + expense.amount));
                }

                // Splitters get debited
                for split_member in expense.split_among.iter() {
                    if addr == split_member {
                        balances.set(i, (addr.clone(), balance - share));
                        break;
                    }
                }
            }
        }

        // Create settlements to minimize transactions
        let settlements = Vec::new(&env);
        
        // Simple settlement algorithm: debtors pay creditors
        // In production, you'd implement a more sophisticated algorithm
        settlements
    }

    /// Create a settlement record and notify settlement contract
    pub fn create_settlement(
        env: Env,
        group_id: u64,
        from: Address,
        to: Address,
        amount: i128,
    ) -> u64 {
        from.require_auth();

        // Get and increment settlement counter
        let mut counter: u64 = env.storage().instance().get(&DataKey::SettlementCounter).unwrap_or(0);
        counter += 1;

        // Create settlement
        let settlement = Settlement {
            id: counter,
            group_id,
            from: from.clone(),
            to: to.clone(),
            amount,
            is_settled: false,
            created_at: env.ledger().timestamp(),
        };

        // Get existing settlements and add new one
        let mut settlements: Vec<Settlement> = env.storage()
            .instance()
            .get(&DataKey::GroupSettlements(group_id))
            .unwrap_or(Vec::new(&env));
        settlements.push_back(settlement.clone());

        // Store updated settlements
        env.storage().instance().set(&DataKey::GroupSettlements(group_id), &settlements);
        env.storage().instance().set(&DataKey::SettlementCounter, &counter);

        // Emit event
        env.events().publish(
            (symbol_short!("STL_CRTD"), group_id, counter),
            (from.clone(), to.clone(), amount),
        );

        counter
    }

    /// Get group details
    pub fn get_group(env: Env, group_id: u64) -> Group {
        env.storage()
            .instance()
            .get(&DataKey::Group(group_id))
            .expect("Group not found")
    }

    /// Get expenses for a group
    pub fn get_expenses(env: Env, group_id: u64) -> Vec<Expense> {
        env.storage()
            .instance()
            .get(&DataKey::GroupExpenses(group_id))
            .unwrap_or(Vec::new(&env))
    }

    /// Get settlements for a group
    pub fn get_settlements(env: Env, group_id: u64) -> Vec<Settlement> {
        env.storage()
            .instance()
            .get(&DataKey::GroupSettlements(group_id))
            .unwrap_or(Vec::new(&env))
    }

    /// Mark a settlement as settled
    pub fn mark_settlement_settled(env: Env, group_id: u64, settlement_id: u64, caller: Address) {
        caller.require_auth();

        // Get settlements
        let mut settlements: Vec<Settlement> = env.storage()
            .instance()
            .get(&DataKey::GroupSettlements(group_id))
            .unwrap_or(Vec::new(&env));

        // Find and update settlement
        for i in 0..settlements.len() {
            let mut settlement = settlements.get(i).unwrap();
            if settlement.id == settlement_id {
                // Verify caller is the payer
                if settlement.from != caller {
                    panic!("Only the payer can mark settlement as settled");
                }
                settlement.is_settled = true;
                settlements.set(i, settlement);
                break;
            }
        }

        // Store updated settlements
        env.storage().instance().set(&DataKey::GroupSettlements(group_id), &settlements);
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger};

    #[test]
    fn test_create_group() {
        let env = Env::default();
        let contract_id = env.register_contract(None, GroupExpenseContract);
        let client = GroupExpenseContractClient::new(&env, &contract_id);

        let creator = Address::generate(&env);
        let name = String::from_str(&env, "Test Group");

        env.mock_all_auths();

        let group_id = client.create_group(&creator, &name);
        assert_eq!(group_id, 1);

        let group = client.get_group(&group_id);
        assert_eq!(group.name, name);
        assert_eq!(group.creator, creator);
        assert_eq!(group.members.len(), 1);
    }

    #[test]
    fn test_add_member() {
        let env = Env::default();
        let contract_id = env.register_contract(None, GroupExpenseContract);
        let client = GroupExpenseContractClient::new(&env, &contract_id);

        let creator = Address::generate(&env);
        let member = Address::generate(&env);
        let name = String::from_str(&env, "Test Group");

        env.mock_all_auths();

        let group_id = client.create_group(&creator, &name);
        client.add_member(&group_id, &member, &creator);

        let group = client.get_group(&group_id);
        assert_eq!(group.members.len(), 2);
    }

    #[test]
    fn test_add_expense() {
        let env = Env::default();
        let contract_id = env.register_contract(None, GroupExpenseContract);
        let client = GroupExpenseContractClient::new(&env, &contract_id);

        let creator = Address::generate(&env);
        let name = String::from_str(&env, "Test Group");

        env.mock_all_auths();

        let group_id = client.create_group(&creator, &name);

        let description = String::from_str(&env, "Dinner");
        let amount = 10000i128; // 100 XLM (in stroops)
        let mut split_among = Vec::new(&env);
        split_among.push_back(creator.clone());

        let expense_id = client.add_expense(&group_id, &description, &amount, &creator, &split_among);
        assert_eq!(expense_id, 1);

        let expenses = client.get_expenses(&group_id);
        assert_eq!(expenses.len(), 1);
        assert_eq!(expenses.get(0).unwrap().amount, amount);
    }

    #[test]
    fn test_create_settlement() {
        let env = Env::default();
        let contract_id = env.register_contract(None, GroupExpenseContract);
        let client = GroupExpenseContractClient::new(&env, &contract_id);

        let creator = Address::generate(&env);
        let member = Address::generate(&env);
        let name = String::from_str(&env, "Test Group");

        env.mock_all_auths();

        let group_id = client.create_group(&creator, &name);
        client.add_member(&group_id, &member, &creator);

        let amount = 5000i128; // 50 XLM
        let settlement_id = client.create_settlement(&group_id, &member, &creator, &amount);
        assert_eq!(settlement_id, 1);

        let settlements = client.get_settlements(&group_id);
        assert_eq!(settlements.len(), 1);
        assert_eq!(settlements.get(0).unwrap().amount, amount);
        assert_eq!(settlements.get(0).unwrap().is_settled, false);
    }
}
