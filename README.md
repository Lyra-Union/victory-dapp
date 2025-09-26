# Victory Exchange

**Victory Exchange** is a decentralized platform built on Ethereum, offering interaction with three primary tokens: **SPARK**, **AXIS**, and **PRISM**. The platform allows users to purchase, contribute, and exchange these tokens while providing integration for Ethereum.

## Table of Contents

- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [License](#license)
- [Contributing](#contributing)

## Key Features

- **Multi-Chain Wallet Integration**:
  - Supports Ethereum-based wallets using `wagmi` and `RainbowKit`.
  - NEAR Protocol wallet integration for interacting with NEAR tokens.
  
- **Token Interaction**:
  - **SPARK Token**: Community token for contributions and exchanges within the platform.
  - **AXIS Token**: Utility token used for long-term staking and cooperative project contributions.
  - **PRISM Token**: NFT tokens representing governance roles within the LyraUnion cooperative ecosystem.

- **Purchase History**:
  - Displays transaction history of token purchases and contributions.
  
- **Real-Time Token Stats**:
  - Provides updates on circulating supply, maximum supply, and real-time token prices.

## Project Structure

```plaintext
.
├── /components           # Reusable UI components (Sidebar, Buttons)
├── /wallet_components    # Ethereum connection components
├── /abi                  # Smart contract ABIs for Ethereum tokens
├── /pages                # Token pages (SPARK, AXIS, PRISM)
└── /public               # Public assets
```

## Installation
- Clone the Repository:
  ```bash
  git clone https://github.com/your-username/victory-exchange.git
  cd victory-exchange
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Run the development server:
  ```bash
  npm run dev
  ```
- Open http://localhost:3000 in your browser to see the application.

## Usage
After setting up the project and running the development server, users can:
- **Connect their wallets:** Users can connect both Ethereum and NEAR wallets to interact with the platform.
- **Purchase tokens:** Users can buy SPARK, AXIS, and PRISM tokens using the provided interfaces.
- **View stats and history:** The platform provides real-time updates on token stats (circulating supply, maximum supply) and displays purchase history.

## Technologies Used
- **NextJs:** Framework for building the frontend.
- **React:** Core library for building user interfaces.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **Wagmi & Rainbowkit:** For Ethereum wallet integrations.
- **ethersJS:** For Ethereum-based smart contract interactions.
