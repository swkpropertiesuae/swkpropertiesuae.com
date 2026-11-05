This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Cloudflare production deployment

The existing `swkpropertiesuae-site` Worker serves this Next.js application through
the OpenNext Cloudflare adapter. Keep the Workers Builds settings in sync:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | `/` |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npm run deploy` |

Cloudflare installs dependencies from `package-lock.json` before the build.
The old `python3 build.py` command belonged to the retired static site and must
not be used for this app. `npm run build` remains the normal Next.js build;
the Cloudflare build also packages its output for the Workers runtime.

For local validation, run `npm ci`, `npm run build:cloudflare`, and
`npx wrangler deploy --dry-run`. `npm run preview:cloudflare` serves the resulting
Worker locally. `npm run cf-typegen` regenerates binding types after config changes.

`wrangler.jsonc` retains both production custom domains and the existing
`MEDIA` binding to the `swk-media` R2 bucket. `worker/index.js` preserves the
legacy redirects and video byte-range responses, then forwards application
requests to Next.js. The server-side `/api/enquiries` handler requires this
Worker deployment; a static-only export cannot replace it.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
