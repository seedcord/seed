# seed

A Discord bot built with [seedcord](https://seedcord.org). It runs on Cloudflare Workers, and you can [add it to a server or install it on your account](https://discord.com/oauth2/authorize?client_id=1195232619718254663).

## Commands

### Docs

- `/search guide`: ask a question in your own words, or pick a section from the suggestions.
- `/search docs`: find a symbol by name. `kind` limits the results to one kind of symbol, `transport` hides results from the transport you don't use, and `prerelease` searches the `@next` versions.
- `Not what I needed`: a button under a private answer to a typed `/search guide` question that you can use to report that the answer didn't help you.
- `Answer with docs`: right-click a message to pick a guide section that answers it. The bot posts the section's link and mentions the message's author.

Both `/search` commands reply only to you by default, and each one allows 10 uses a minute per person. They also take these options:

- `public`: everyone in the channel sees the reply.
- `ping`: mentions someone in the reply.
- `suppress-embed`: wraps the link in `<>` to hide its preview.

### Versions

- `/versions`: shows the latest and next version of each seedcord package and when each was released. Each version links to its npmx page.

### Command mentions

- `/command`: posts a clickable mention of one of the bot's commands, so you can point someone at it. `ping` mentions them in the same message.

### Emojis

- `Add as Server Emoji` and `Add as App Emoji`: right-click a message to add its images as emojis, each named after its file.
- `/emojis delete guild` and `/emojis delete app`: pick emojis to delete.

The app emoji commands only work for me.

## Running it

```sh
bun run dev
```

This opens a tunnel for Discord and hot reloads your changes. Run `bun run check` for types, lint, and formatting.

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
NODE_ENV=production bun run commands:deploy
bun run deploy
```

Cloudflare needs a value for every declared secret before it accepts a new worker, so deploy the first time with:

```sh
bun run build && bun x cf deploy --prebuilt --secrets-file .env.production
```
