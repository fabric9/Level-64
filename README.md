# Level 64

Level 64 is a sponsored competitive chess platform built around head-to-head progression across 64 levels.

Players sign up, choose a sponsor-backed entry, join a level queue, play a match, and either withdraw winnings or continue advancing. The platform is designed around clear progression, auditable wallet accounting, strong admin controls, and a clean path to later fiat and crypto payout integrations.

## Vision

Level 64 combines competitive chess, sponsor-funded entry, structured progression, and operational control into one product.

Core principles:
- sponsored entry into competitive chess runs
- level-based progression from 1 to 64
- separate long-term skill ratings and run progression
- internal wallet ledger and controlled withdrawals
- admin-first controls for users, sponsors, queues, matches, and payouts
- staged support for fiat and crypto rails

## V1 scope

The first release should prioritize a stable operational core over broad payment complexity.

Included in v1:
- player authentication
- sponsor selection
- Level 1 entry and progression run creation
- level-based queueing and matchmaking
- result recording
- rating updates
- wallet balances and immutable ledger
- withdrawal requests with admin review
- admin panel for users, sponsors, matches, levels, withdrawals, and audit

Not included in initial v1:
- automatic crypto settlement everywhere
- support for all currencies and all rails
- self-serve sponsor console
- wallet-only authentication
- advanced split-payout mechanics

## Authentication

Recommended launch methods:
- email OTP or magic link
- Google
- Apple

Admin access:
- email and password
- MFA required
- role-gated admin routes

## Product loop

1. Player signs up.
2. Player creates a profile and chooses a sponsor-backed entry.
3. Sponsor funding is reserved for that run.
4. Player joins the queue for the current eligible level.
5. The system matches two eligible players.
6. The match result is recorded.
7. The winner advances and can either withdraw winnings or continue.
8. The loser is eliminated from that run.

## Recommended stack

- Next.js
- TypeScript
- Supabase Auth
- Supabase Postgres
- Supabase Realtime
- Supabase Storage
- Railway deployment

Possible later additions:
- Resend for transactional email
- fiat payout integration
- crypto payout integration
- dispute tooling and fraud controls

## Initial documentation

- `docs/product-blueprint.md`
- `docs/v1-rules.md`
- `docs/data-model.md`
- `docs/admin-panel.md`

## Repository goal

This repository should start with a clean operational foundation:
- product rules defined before UI expansion
- schema-led build sequence
- admin controls from the beginning
- auditability for balances, matches, and decisions

## Status

Repository initialized with product and architecture documents.
