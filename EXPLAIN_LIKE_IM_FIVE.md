# EXPLAIN LIKE I'M FIVE

## What problem does this repo solve?

Open source maintainers work hard but often can't pay contributors. **Stellar Bounty Board** lets maintainers put real money (Stellar lumens) on GitHub issues so contributors get paid when they fix them.

## How does it work in 3 bullet points?

1. **A maintainer creates a bounty** — they pick a GitHub issue, set a reward amount (in Stellar), and the money goes into a secure escrow.
2. **A contributor claims the bounty** — they say "I'm working on this!" and the issue is locked so nobody else takes it.
3. **The maintainer reviews and pays** — when the PR is submitted and approved, the money is released from escrow to the contributor. If the work isn't done, the money goes back.

```
┌─────────────┐     Creates bounty     ┌───────────────┐
│  Maintainer │ ──────────────────────▶ │  Bounty Board │
│   (paying)  │                        │   (escrow)    │
│             │ ◀────────────────────── │               │
│             │    Releases payment     │               │
└─────────────┘                        └───────┬───────┘
                                               │
                                    Claims     │
                                    issue      │
                                               ▼
                                     ┌───────────────┐
                                     │  Contributor  │
                                     │  (developer)  │
                                     └───────────────┘
```

## Who should use this?

- **Open source maintainers** who want to incentivize contributions with crypto payments
- **Developers** looking to earn Stellar for open source work
- **DAO treasuries** wanting to fund public goods development
- **Anyone learning Stellar/Soroban** who wants to see a real escrow pattern in action
