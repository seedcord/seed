# seed

A Discord bot that searches the [seedcord](https://seedcord.org) guide and reference docs. It runs on Cloudflare Workers, and you can add it to a server or install it on your account.

## Commands

- `/search guide`: ask a question in your own words, or pick a section from the suggestions.
- `/search docs`: find a symbol by name. `kind` limits the results to one kind of symbol, and `transport` hides results from the transport you don't use.

Both commands reply only to you by default, and each one allows 10 uses a minute per person. They also take these options:

- `public`: everyone in the channel sees the reply.
- `ping`: mentions someone in the reply.
- `suppress-embed`: wraps the link in `<>` to hide its preview.

## Running it

```sh
pnpm dev
```

This opens a tunnel for Discord and hot reloads your changes. Run `pnpm check` for types, lint, and formatting.

`/search guide` calls the `seedcord-guide` worker through a service binding. Dev and production bind to different workers, and this worker has to be on the same Cloudflare account as both.

## Environment

`.env` holds your secrets and is gitignored.

<!-- prettier-ignore-start -->

| key | required |
| --- | --- |
| `DISCORD_BOT_TOKEN` | yes |
| `UNKNOWN_EXCEPTION_WEBHOOK_URL` | no |
| `HANDLED_EXCEPTION_WEBHOOK_URL` | no |
| `TESTING_GUILD_IDS` | no, empty deploys your commands globally |

<!-- prettier-ignore-end -->

A worker only gets the keys that `cloudflare.config.ts` declares.

## Deploying

```sh
pnpm commands:deploy
pnpm run deploy
```

Cloudflare needs a value for every declared secret before it accepts a new worker, so deploy the first time with:

```sh
pnpm build && pnpm exec cf deploy --prebuilt --secrets-file .env.production
```
