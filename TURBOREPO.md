# QuickAir - Turborepo Monorepo

This is a Turborepo monorepo containing the QuickAir application.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `apps/frontend`: a [Next.js](https://nextjs.org/) app for the QuickAir frontend
- `apps/strapi`: a [Strapi](https://strapi.io/) headless CMS backend

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Turbo (already installed globally)

### Install Dependencies

From the root directory, run:

```bash
npm install
```

This will install dependencies for all workspaces.

### Development

To run all apps in development mode:

```bash
npm run dev
```

Or use Turbo directly:

```bash
turbo dev
```

To run a specific app:

```bash
turbo dev --filter=@quickair/frontend
# or
turbo dev --filter=@quickair/strapi
```

### Build

To build all apps:

```bash
npm run build
```

To build a specific app:

```bash
turbo build --filter=@quickair/frontend
```

### Other Commands

- `npm run start` - Start all apps in production mode
- `npm run lint` - Lint all apps
- `npm run clean` - Clean build artifacts

## Useful Links

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Strapi Documentation](https://docs.strapi.io)

## Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

To enable Remote Caching you will need a Vercel account. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```bash
npx turbo login
npx turbo link
```
