# Glossary

A reference for bounty statuses, actions, and Stellar concepts used in Stellar Bounty Board.

## Bounty Statuses

| Status | Meaning | Actions Available |
|--------|---------|-------------------|
| **Open** | The bounty is available for any contributor to reserve and work on. | Reserve |
| **Reserved** | A specific contributor has claimed this bounty and is actively working on it. | Submit work, Refund (maintainer) |
| **Submitted** | The contributor has submitted their work (PR link) for maintainer review. | Release payment, Refund |
| **Released** | Payment has been released to the contributor. This is a final state. | — |
| **Refunded** | Funds were returned to the maintainer (e.g., work was unsatisfactory or bounty was cancelled). Final state. | — |
| **Expired** | The bounty deadline passed without completion. Funds can be reclaimed. | Refund (for funded bounties) |
| **Disputed** | A dispute has been raised by either party. An arbiter reviews the case. | Resolve dispute |

## Status Flow

```
Open → Reserved → Submitted → Released (final)
  ↘                            ↗
    → Expired → Refunded (final)
```

## Actions

| Action | Who Can Perform | Description |
|--------|----------------|-------------|
| **Reserve** | Any contributor | Claims the bounty and signals intent to work |
| **Submit** | The reserved contributor | Provides the completed work URL for review |
| **Release** | The maintainer | Releases escrowed funds to the contributor |
| **Refund** | The maintainer | Returns funds to the maintainer's wallet |
| **Expire** | System (cron job) | Auto-transitions after deadline passes |

## Stellar Concepts

| Term | Definition |
|------|------------|
| **Stellar** | An open-source, decentralized blockchain for cross-border payments and asset issuance |
| **Soroban** | Stellar's smart contract platform for building programmable dApps |
| **XLM** | The native token of the Stellar network (Lumens) |
| **Public Key (G…)** | Stellar account address starting with `G`, 56 characters, used to send/receive funds |
| **Secret Key (S…)** | Private key starting with `S`, used to sign transactions (never share this) |
| **Freighter** | A browser extension wallet for Stellar (similar to MetaMask for Ethereum) |
| **Testnet** | A free Stellar network for development and testing (no real XLM) |
| **Horizon** | The HTTP API server that connects applications to the Stellar network |

## How to Get Testnet XLM

1. Install the [Freighter wallet](https://freighter.app/) browser extension
2. Switch to **Testnet** mode in Freighter settings
3. Visit the [Stellar Lab Friendbot](https://laboratory.stellar.org/#account-creator?network=test) and enter your `G…` public address
4. You will receive 10,000 free test XLM

## FAQ

See [`docs/FAQ.md`](./FAQ.md) for more common questions.

## Related Documents

- [`CONTRIBUTING.md`](../CONTRIBUTING.md) — How to contribute code
- [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) — System architecture and flow diagrams
