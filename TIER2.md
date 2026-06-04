# Tier 2 — Sede Electrónica Copilot

## Codebase inspection (before Tier 2)

| Area | Status |
|------|--------|
| Framework | Next.js 14 App Router, TypeScript, Tailwind |
| Database | **Added:** Prisma + SQLite (`DATABASE_URL`) |
| Auth | Session cookie `reclama_session_id` (no accounts) |
| File storage | Local `data/uploads/` (private, per case) |
| PDF | `pdf-lib` — complaint, cover sheet, evidence index |
| Complaint generation | DeepSeek API + `lib/claude-prompt.ts` |
| Tier 1 email | Stub page `/casos/[caseId]/tier1-email` |
| UI | shadcn-style components, warm minimal theme |

## Setup

```bash
# .env.local
DATABASE_URL="file:./prisma/dev.db"
DEEPSEEK_API_KEY=...
ADMIN_SECRET=your_admin_secret
UPLOAD_DIR=./data/uploads

npm run db:setup   # migrate + seed Madrid
npm run dev
```

## Madrid seed

```bash
npm run db:seed
```

Creates OMIC Madrid authority + `madrid-omic-reclamaciones-consumo` route with step guide JSON.

## Test flow (Madrid)

1. Complete wizard with ciudad `Madrid` and CP `28001`.
2. On `/resultado`, click **Presentar en Sede Electrónica**.
3. Tier 2: readiness → generate package → open Sede → mark submitted → upload receipt.

## API endpoints

- `POST /api/cases/sync`
- `GET /api/cases/:caseId/tier2/route`
- `POST /api/cases/:caseId/tier2/start`
- `GET /api/cases/:caseId/tier2/status`
- `POST /api/cases/:caseId/tier2/readiness`
- `GET|POST /api/cases/:caseId/tier2/package`
- `GET /api/tier2/packages/:packageId/copy-fields`
- `POST /api/tier2/packages/:packageId/open-official-site`
- `POST /api/tier2/packages/:packageId/mark-submitted`
- `POST /api/tier2/packages/:packageId/receipt/upload`
- `POST /api/tier2/packages/:packageId/receipt/manual`
- `GET /api/tier2/packages/:packageId/files/[complaint|cover|evidence]`
- Admin: `GET /api/admin/official-routes` (header `x-admin-secret`)

## Known limitations

- No Cl@ve/certificate collection (by design).
- No browser automation or auto-submit.
- Only Madrid route seeded; other cities need admin registry entries.
- No ZIP package yet (individual PDF downloads).
- Receipt PDF parsing not implemented (manual + upload only).
- Tier 1 email does not send mail — guidance only.

## Next steps

- Add Barcelona, Valencia routes via admin seed.
- PostHog analytics after privacy review.
- Receipt OCR / registry number parsing.
- ZIP download bundle.
- User accounts + Postgres for production.
