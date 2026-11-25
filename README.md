# WellnessTern

**Better product information for adult wellness supply chains.**

AI product information management software that helps adult wellness manufacturers organize specifications, supplier documents, approved descriptions and catalogue revisions.

Marketing website and interactive product demonstration for WellnessTern.

- Industry: SexTech, Manufacturing, Product Information Management
- Founder: Nathan Chidiebere (Founder & CEO)
- Co-founder: Omotola Akinyemi (Co-founder & CTO)
- Contact: nathan@wellnesstern.top
- Business model: Managed product subscriptions

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · React Router · Lucide React · Recharts.

No API keys or backend are needed. The workspace demo runs on seeded mock data kept in the browser (localStorage), and `npm test` runs the Vitest unit tests.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check and build into dist/
npm run preview    # serve the production build
npm test           # unit tests
```

Requires Node 20 or later.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home — problem, solution, features, workflow, AWS, safeguards, customers, MVP, pricing, team, roadmap, FAQ |
| `/product` | Core features in detail |
| `/how-it-works` | Step-by-step workflow |
| `/use-cases` | Adult wellness manufacturers, Distributors, Specialty retailers |
| `/technology` | How WellnessTern uses AWS (Textract, Bedrock, S3, DynamoDB, Lambda) |
| `/security` | Safeguards and data handling |
| `/pricing` | Managed product subscriptions (illustrative) |
| `/about` | Story, principles and team |
| `/contact` | Contact and demo request (`?type=demo`) |
| `/privacy`, `/terms` | Legal drafts |
| `/workspace/*` | Interactive demo: Product workspace |

## Editing content

Everything — copy, founders, pricing, AWS services, theme colours and fonts, and the workspace data model — lives in `src/config/business.ts`. After changing the theme there, regenerate `src/theme.css` with the values shown in that file (or edit `src/theme.css` directly).

## Deploying

`npm run build` produces a static site in `dist/`. `vercel.json` (Vercel) and `public/_redirects` + `public/_headers` (Netlify / Cloudflare Pages) set the SPA fallback, security headers and caching.

The proposed AWS architecture is described in `docs/architecture.md`.

### Before launch

- Pricing, roadmap, FAQ, privacy notice and terms are drafts.
- The workspace uses fictional demo data; the organisation and people in it are not real.
