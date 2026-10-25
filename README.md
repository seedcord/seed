# seed

A Discord bot built with [seedcord](https://seedcord.org) on the http transport, running on Cloudflare Workers.

## Running it

```sh
bun run dev
```

That starts the dev server with hot reload and opens a tunnel so Discord can reach your interactions endpoint.

## Scripts

<!-- prettier-ignore-start -->

| script | what it does |
| --- | --- |
| `bun run dev` | dev server with hot reload |
| `bun run build` | build the worker into `.cloudflare/output/` |
| `bun run deploy` | build, then upload the worker with `cf deploy` |
| `bun run codegen` | regenerate `src/seedcord-gen.d.ts` |
| `bun run types` | regenerate the binding types in `.cloudflare/types/` |
| `bun run commands` | list, deploy, or clean up your commands on Discord |
| `bun run commands:deploy` | send your commands to Discord |
| `bun run tc` | type-check |
| `bun run lint` | eslint |
| `bun run check` | type-check, lint, and check formatting |

<!-- prettier-ignore-end -->

Run `codegen` after you add a command or change its options. It writes the types behind `this.options`, and the generated file is committed.

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

The two webhook keys take Discord webhook URLs. Set them to get error reports posted to a channel.

A worker gets only the keys that `cloudflare.config.ts` declares. Add a line there for each new one your bot reads. `bun run dev` takes their values from `.env`.

Cloudflare refuses to deploy a new worker until every declared secret has a value. Put the production values in a file like `.env.production`, then deploy the first time with:

```sh
bun run build && bun x cf deploy --prebuilt --secrets-file .env.production
```

After that, `bun run deploy` is enough. `TESTING_GUILD_IDS` can stay empty there, since a deployed worker never deploys commands.

## Where things go

- `src/commands/` holds command definitions, one class per command.
- `src/handlers/` holds the code that runs when someone uses one.
- `src/bot.ts` is the config.

## Docs

- Guide: <https://seedcord.org/guide>
- API reference: <https://seedcord.org/docs>
