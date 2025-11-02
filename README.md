# Stellium

Project Visual

## About me

I’m Berke Sağlam, a computer science student at Ostim Teknik University with a growing passion for blockchain and gaming. I began coding just a year ago and quickly dove into the world of Web3, even joining the Solana Hackathon 2024 to challenge myself and learn by building. Beyond code, I find inspiration in gaming worlds and quiet sunsets—both reminding me that creation and reflection go hand in hand.

## Description

Stellium is an innovative gaming platform built on the XX Blockchain that connects game developers with dedicated testers in a fast, transparent, and rewarding way. Using blockchain technology, Stellium ensures instant, low-cost, and secure payments directly to testers for their time and completed tasks. Developers benefit from detailed feedback, reliable performance metrics, and a trustworthy testing environment. By combining decentralized payments with an intuitive user experience, Stellium empowers testers to earn fairly while helping developers launch higher-quality games faster.

## Vision

Stellium aims to reshape the gaming industry by merging blockchain innovation with the world of game testing. We envision a future where every gamer can earn real value for their time and skill, and every developer can access fair, efficient, and transparent testing. By harnessing the power of the XX Blockchain’s speed and low fees, Stellium eliminates payment delays, empowers global participation, and builds trust between creators and players. Our goal is to create a new, inclusive gaming economy where over 10,000 testers worldwide earn sustainable income while helping developers deliver better, more polished games to everyone.

## Project Ideas

Step 1: Smart Contract Architecture Design
Define core entities: Developer, Tester, Game, and Task.
Establish token standards (native XX token or custom Stellium token).
Design reward mechanisms: time-based and completion-based payouts.
Include roles and permissions for developers and testers.

Step 2: Smart Contract Development
Implement core functions:
registerDeveloper() / registerTester()
submitGame() / createTask()
assignTester() / submitFeedback()
calculateReward() / releasePayment()
Integrate escrow and dispute resolution logic.
Include audit-friendly event logging for transparency.

Step 3: Testing & Security
Write unit and integration tests for all smart contract functions.
Conduct internal and third-party audits to ensure safety and compliance.

Step 4: Backend Integration
Develop APIs for user authentication, task management, and blockchain communication.
Implement analytics and feedback aggregation modules.

Step 5: Front-End Development
Build a responsive dashboard for developers and testers.
Integrate wallet connection (e.g., Stellar or XX Blockchain wallet).
Provide game listing, task progress tracking, and payment history views.

Step 6: Deployment & Launch
Deploy contracts to XX mainnet.
Launch beta with limited users, followed by global rollout.

## Transactions
Gamehub: https://stellar.expert/explorer/testnet/account/GCXKTYCVMCAJK76RHN5UDKFAZKMEQ6OIXKNS7I7URR6OTJU7MAPVFTUF
Gamecreator:
https://stellar.expert/explorer/testnet/account/GCMBX3QNPOQV7YUCZBSGWVEK2IOLOSWMZG6JBPB5A6AHB2PIMHRAC7RR
Player:
https://stellar.expert/explorer/testnet/account/GCXKTYCVMCAJK76RHN5UDKFAZKMEQ6OIXKNS7I7URR6OTJU7MAPVFTUF


##Setup Enviroment

Stellium is a blockchain-powered gaming platform that connects developers and testers through instant, transparent, and rewarding interactions. Built on the XX Blockchain, Stellium enables real-time crypto payments, fair testing environments, and a global network of passionate gamers.

⚙️ Installation Guide
1. Clone the Repository
git clone https://github.com/<your-username>/stellium.git
cd stellium

2. Install Dependencies

Make sure you have Node.js (v18+) and npm installed.
Then, run:

npm install

3. Configure Environment

Create a .env file in the root directory and set your configuration:

VITE_BLOCKCHAIN_NETWORK=xx-testnet
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
VITE_API_URL=https://api.xx-blockchain.io

4. Run Development Server
npm run dev


This starts the project locally at http://localhost:5173
.

5. Build for Production
npm run build

6. Deploy Smart Contracts

If you’re using Hardhat or a similar framework:

npx hardhat run scripts/deploy.js --network xx-testnet

💻 Tech Stack

Frontend: React + TailwindCSS (Minimal Futurism UI)

Smart Contracts: Solidity / Soroban (XX Blockchain)

Backend: Node.js + Express

Wallet Integration: Stellar/XX Wallet API

🧠 Contributing

Pull requests are welcome!
For major changes, please open an issue first to discuss what you’d like to improve.

📜 License

MIT © 2025 Stellium
