import { bindings, defineConfig } from 'cf/config';

const BOT_HOST = 'bot.seedcord.org';

// cf workers types calls this without a mode
export default defineConfig(({ mode = 'production' }) => ({
    worker: {
        name: 'seed',
        compatibilityDate: '2026-08-04',
        // bot's on seedcord.org so fetching the docs 404s without this
        compatibilityFlags: ['global_fetch_strictly_public'],
        domains: [BOT_HOST],
        env: {
            DISCORD_BOT_TOKEN: bindings.secret(),
            DISCORD_CLIENT_SECRET: bindings.secret(),
            GITHUB_TOKEN: bindings.secret(),
            UNKNOWN_EXCEPTION_WEBHOOK_URL: bindings.secret(),
            HANDLED_EXCEPTION_WEBHOOK_URL: bindings.secret(),
            TESTING_GUILD_IDS: bindings.secret(),
            ENV: bindings.text(mode),
            BOT_HOST: bindings.text(BOT_HOST),
            DB: bindings.d1(),
            GUIDE: bindings.worker({
                worker: mode === 'production' ? 'seedcord-guide' : 'seedcord-guide-next',
                dev: { remote: true }
            })
        }
    }
}));
