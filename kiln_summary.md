# Kiln Product Suite Overview

## Introduction

Kiln offers a modular suite of products designed to simplify and enhance Ethereum staking and DeFi integrations for platforms, wallets, and custodians. The suite is built to be validator-agnostic, supporting both in-house and third-party validators, and provides flexible options for staking, integration, and account management.

## Product Components

### 1. Kiln Onchain

- **Purpose:** Enables Ethereum staking through a set of smart contracts.
- **Features:**
  - Fully automated on-chain rewards and commission management.
  - Marketplace of integrated node operators.
  - Modular design allows:
    - Dedicated staking (multiples of 32 ETH).
    - Pooled staking (any amount).
    - Optional issuance of a dedicated liquid staking token.
- **Compatibility:** Validator-agnostic—works with in-house or third-party validators.

### 2. Kiln DeFi

- **Purpose:** Facilitates native integration of DeFi protocols into wallets or platforms.
- **Features:**
  - 100% on-chain and fully automated.
  - Simplified integration process.
  - Kiln API for direct, native integration.
  - Customizable widget for tailored user experiences.
  - Enables platforms to earn fees from DeFi activities.

### 3. Kiln Connect

- **Purpose:** Provides programmatic control and management of staking operations.
- **Features:**
  - Manage staking accounts programmatically.
  - Craft staking and unstaking transactions.
  - Sign and broadcast transactions with your custodian.
  - Retrieve rewards and monitoring data for each stake.
  - Real-time, network-wide, and validator-agnostic (not limited to Kiln Validators).

### 4. Kiln Validators

- **Purpose:** Serve as the foundation of the Kiln platform.
- **Features:**
  - Operate and secure networks across supported blockchains.
  - Ensure reliability and security for staking operations.
- **Note:** While Validators are central, Onchain, Dashboard, and Connect products can operate independently of Kiln Validators.

## Key Product Principles

- **Modularity:** Each product can be used independently or in combination, depending on client needs.
- **Validator-Agnostic:** Most components are compatible with any validator setup, not just Kiln's own.
- **Automation:** Processes such as rewards, commissions, and integrations are fully automated for efficiency and reliability.
- **Customization:** APIs and widgets allow for deep integration and tailored user experiences.

## Summary Table

| Product         | Main Functionality                                      | Key Features                                 | Validator-Agnostic |
|-----------------|--------------------------------------------------------|----------------------------------------------|--------------------|
| Kiln Onchain    | Ethereum staking via smart contracts                   | Modular, pooled/dedicated, liquid token      | Yes                |
| Kiln DeFi       | DeFi protocol integration                              | API, widget, fee earning, full automation    | Yes                |
| Kiln Connect    | Programmatic staking management                        | Real-time, network-wide, custodian support   | Yes                |
| Kiln Validators | Core network operation and security                     | Multichain, platform foundation              | N/A                |


