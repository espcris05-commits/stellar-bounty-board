# Bounty Status State Machine

```mermaid
stateDiagram-v2
    [*] --> Open: Issue created
    Open --> Reserved: Contributor assigned
    Open --> Expired: Deadline passed (no assignee)
    Reserved --> Submitted: PR submitted
    Reserved --> Expired: Deadline passed (with assignee)
    Submitted --> Released: PR merged & payout released
    Submitted --> Refunded: PR rejected / no merge
    Released --> [*]: Payout complete
    Refunded --> [*]: Funds returned
    Expired --> [*]: Bounty closed
```

## Transitions

| From | To | Trigger |
|------|-----|---------|
| `Open` | `Reserved` | Contributor signs reservation transaction |
| `Open` | `Expired` | Deadline passes without reservation |
| `Reserved` | `Submitted` | Contributor submits pull request |
| `Reserved` | `Expired` | Deadline passes with reservation but no submission |
| `Submitted` | `Released` | Maintainer merges PR and releases payment |
| `Submitted` | `Refunded` | Maintainer rejects PR or closes without merge |
