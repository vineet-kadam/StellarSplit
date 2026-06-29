# 👋 Welcome to StellarSplit!

## 🎯 You're in the right place!

StellarSplit is a **complete, production-ready** decentralized application for splitting expenses on the Stellar blockchain.

---

## ⚡ Quick Start (Choose Your Path)

### 🚀 I want to use it NOW! (5 minutes)
**→ Read [QUICKSTART.md](QUICKSTART.md)**

Steps:
1. `cd frontend && npm install`
2. `npm run dev`
3. Connect Freighter wallet
4. Done! 🎉

---

### 📖 I want to understand it first
**→ Read [README.md](README.md)**

Learn about:
- What StellarSplit does
- All features
- How it works
- Screenshots (coming soon)

---

### 🔧 I want to deploy to production
**→ Read [DEPLOYMENT.md](DEPLOYMENT.md)**

Learn how to:
- Deploy smart contracts
- Configure environment
- Deploy to Vercel
- Test in production

---

### 👨‍💻 I want to contribute code
**→ Read [CONTRIBUTING.md](CONTRIBUTING.md)**

Learn about:
- Development setup
- Code standards
- Testing requirements
- Pull request process

---

### 🏗️ I want to understand the architecture
**→ Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**

Explore:
- System design
- Data flow
- Component structure
- Technical decisions

---

### 📚 I want the complete overview
**→ Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)**

Everything:
- Complete feature list
- All metrics
- Technology stack
- Quality measures

---

## 📂 Important Files

| File | What's Inside | When to Read |
|------|---------------|--------------|
| [README.md](README.md) | Main project docs | First read |
| [QUICKSTART.md](QUICKSTART.md) | 5-min setup | Getting started |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deploy guide | Going to production |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute | Want to help |
| [ENVIRONMENT.md](ENVIRONMENT.md) | Config guide | Setting up |
| [docs/API.md](docs/API.md) | API reference | Using functions |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design | Understanding tech |
| [NEXT_STEPS.md](NEXT_STEPS.md) | What to do next | After setup |

---

## 🎯 By Role

### I'm a Student 🎓
1. Read [README.md](README.md)
2. Follow [QUICKSTART.md](QUICKSTART.md)
3. Explore [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
4. Study the code

**Learn:** Full-stack blockchain development

### I'm a Developer 👨‍💻
1. Read [QUICKSTART.md](QUICKSTART.md)
2. Check [docs/API.md](docs/API.md)
3. Read [CONTRIBUTING.md](CONTRIBUTING.md)
4. Start coding!

**Build:** Add features, fix bugs, improve

### I'm a DevOps Engineer 🔧
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Check [ENVIRONMENT.md](ENVIRONMENT.md)
3. Review `.github/workflows/ci.yml`
4. Deploy!

**Deploy:** Get it running in production

### I'm a Product Manager 📊
1. Read [README.md](README.md)
2. Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
3. View [PROJECT_STATUS.md](PROJECT_STATUS.md)
4. Plan features

**Understand:** What it does, what's next

---

## 🔍 By Task

### Setting Up Development
```bash
# 1. Install frontend
cd frontend
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# http://localhost:3000
```
**Docs:** [QUICKSTART.md](QUICKSTART.md)

### Deploying Contracts
```bash
# 1. Build contracts
cd contracts/group_expense_contract
cargo build --target wasm32-unknown-unknown --release

# 2. Deploy
soroban contract deploy --wasm target/.../contract.wasm ...
```
**Docs:** [DEPLOYMENT.md](DEPLOYMENT.md)

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Contract tests
cd contracts/group_expense_contract
cargo test
```
**Docs:** [CONTRIBUTING.md](CONTRIBUTING.md)

### Configuring Environment
```bash
# 1. Copy template
cd frontend
cp .env.example .env

# 2. Edit variables
# (use your favorite editor)
```
**Docs:** [ENVIRONMENT.md](ENVIRONMENT.md)

---

## 📚 All Documentation

### Getting Started
- [START_HERE.md](START_HERE.md) ← You are here!
- [README.md](README.md) - Main documentation
- [QUICKSTART.md](QUICKSTART.md) - 5-minute setup

### Guides
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to production
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribute code
- [ENVIRONMENT.md](ENVIRONMENT.md) - Configure environment
- [NEXT_STEPS.md](NEXT_STEPS.md) - What to do next

### Technical
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design
- [docs/API.md](docs/API.md) - API reference
- [docs/INDEX.md](docs/INDEX.md) - Doc navigation
- [contracts/README.md](contracts/README.md) - Contracts

### Project Info
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete overview
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Current status
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - File structure
- [COMPLETION_REPORT.md](COMPLETION_REPORT.md) - Completion details
- [DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md) - What's included

---

## ❓ Common Questions

### What is StellarSplit?
A dApp for splitting expenses with friends using Stellar blockchain.
**→** [README.md](README.md)

### How do I run it?
Install dependencies, start dev server, connect wallet.
**→** [QUICKSTART.md](QUICKSTART.md)

### What tech does it use?
React, Vite, Rust, Soroban, Stellar SDK, Freighter.
**→** [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

### How do I deploy it?
Deploy contracts to Stellar, deploy frontend to Vercel.
**→** [DEPLOYMENT.md](DEPLOYMENT.md)

### Can I contribute?
Yes! Read the contributing guide and open a PR.
**→** [CONTRIBUTING.md](CONTRIBUTING.md)

### Where's the API docs?
Complete API reference in docs folder.
**→** [docs/API.md](docs/API.md)

### How does it work?
Architecture docs explain system design.
**→** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

### Is it production ready?
Yes! All features complete, tested, and documented.
**→** [PROJECT_STATUS.md](PROJECT_STATUS.md)

---

## 🎯 Most Popular Paths

### Path 1: Quick Demo (10 minutes)
1. [QUICKSTART.md](QUICKSTART.md) - Setup
2. Run locally
3. Test features
4. Explore code

### Path 2: Full Understanding (1 hour)
1. [README.md](README.md) - Overview
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Design
3. [docs/API.md](docs/API.md) - Reference
4. Explore code

### Path 3: Production Deploy (2 hours)
1. [QUICKSTART.md](QUICKSTART.md) - Setup locally
2. [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy contracts
3. [ENVIRONMENT.md](ENVIRONMENT.md) - Configure
4. Deploy frontend
5. Test production

---

## 🚀 Ready to Start?

### Absolute Beginner?
**→** Start with [README.md](README.md), then [QUICKSTART.md](QUICKSTART.md)

### Experienced Developer?
**→** Jump to [QUICKSTART.md](QUICKSTART.md), scan [docs/API.md](docs/API.md)

### Want to Deploy?
**→** Read [DEPLOYMENT.md](DEPLOYMENT.md) thoroughly

### Just Exploring?
**→** Browse [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md), check out code

---

## 💡 Tips

1. **Start small** - Run locally first
2. **Read docs** - They're comprehensive
3. **Ask questions** - Open GitHub issues
4. **Experiment** - Code is yours to modify
5. **Share** - Tell others about StellarSplit

---

## 📞 Need Help?

### Check Documentation
All answers are documented:
- Setup issues → [QUICKSTART.md](QUICKSTART.md)
- Config problems → [ENVIRONMENT.md](ENVIRONMENT.md)
- Deploy questions → [DEPLOYMENT.md](DEPLOYMENT.md)
- Code questions → [docs/API.md](docs/API.md)

### Still Stuck?
1. Search [docs/INDEX.md](docs/INDEX.md)
2. Check troubleshooting in [README.md](README.md)
3. Open GitHub issue
4. Ask on Stellar Discord

---

## 🎉 What You Get

✅ **48 files** - Complete project  
✅ **2 smart contracts** - Production ready  
✅ **11 React components** - Beautiful UI  
✅ **15+ docs** - Comprehensive guides  
✅ **Full tests** - Frontend + contracts  
✅ **CI/CD** - GitHub Actions  
✅ **Deployment ready** - Vercel config  

**No placeholder code. Everything works!** 🚀

---

## 🌟 Next Step

Pick one:

- **Quick start?** → [QUICKSTART.md](QUICKSTART.md)
- **Full docs?** → [README.md](README.md)
- **Deploy?** → [DEPLOYMENT.md](DEPLOYMENT.md)
- **Contribute?** → [CONTRIBUTING.md](CONTRIBUTING.md)

**Or just run:**
```bash
cd frontend && npm install && npm run dev
```

---

**Welcome aboard! Let's split some expenses! 🎊**

---

*Last updated: June 25, 2026*
