# Contributing to StellarSplit

Thank you for your interest in contributing to StellarSplit! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/stellarsplit.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit with meaningful messages
7. Push to your fork
8. Create a Pull Request

## Development Setup

```bash
# Install frontend dependencies
cd frontend
npm install

# Install Rust toolchain
rustup target add wasm32-unknown-unknown

# Install Soroban CLI
cargo install --locked soroban-cli
```

## Project Structure

```
stellarsplit/
├── contracts/
│   ├── group_expense_contract/    # Main expense tracking contract
│   └── settlement_contract/        # Settlement management contract
├── frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── utils/                  # Utility functions
│   │   └── App.jsx                 # Main app component
│   └── package.json
├── .github/
│   └── workflows/                  # CI/CD pipelines
└── README.md
```

## Coding Standards

### Rust/Soroban

- Follow Rust naming conventions
- Add doc comments to public functions
- Write unit tests for new functionality
- Run `cargo fmt` before committing
- Run `cargo clippy` to catch common mistakes

### JavaScript/React

- Use functional components with hooks
- Follow React best practices
- Add PropTypes or TypeScript types
- Write component tests
- Keep components focused and small

### CSS

- Use semantic class names
- Follow BEM naming convention
- Keep styles modular
- Ensure mobile responsiveness

## Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Contract Tests

```bash
cd contracts/group_expense_contract
cargo test

cd ../settlement_contract
cargo test
```

## Commit Messages

Use conventional commit format:

```
type(scope): subject

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(contracts): add expense categorization
fix(wallet): handle disconnection errors
docs(readme): update deployment instructions
test(frontend): add SendXLM component tests
```

## Pull Request Process

1. Update documentation for any new features
2. Add tests for new functionality
3. Ensure all tests pass
4. Update README.md if needed
5. Request review from maintainers

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added for new features
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts
- [ ] Screenshots added for UI changes

## Feature Requests

Open an issue with:
- Clear description of the feature
- Use cases
- Proposed implementation (if any)
- Mockups or examples (if applicable)

## Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/OS information
- Contract IDs (if relevant)

## Areas for Contribution

### High Priority

- [ ] Enhanced settlement algorithm (minimize transactions)
- [ ] Export expense reports
- [ ] Multi-currency support
- [ ] Push notifications for settlements
- [ ] Group chat/comments

### Medium Priority

- [ ] Expense categories
- [ ] Recurring expenses
- [ ] Split by percentage
- [ ] Expense attachments (receipts)
- [ ] Dark/light theme toggle

### Good First Issues

- [ ] Add loading skeletons
- [ ] Improve error messages
- [ ] Add more unit tests
- [ ] Update documentation
- [ ] Fix UI inconsistencies

## Questions?

- Open a discussion on GitHub
- Join Stellar Discord
- Check existing issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to StellarSplit! 🌟
