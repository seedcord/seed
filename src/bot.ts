import { env } from 'cloudflare:workers';

import { Seedcord, UnstorageDriver } from '@seedcord/http';
import { createDatabase } from 'db0';
import cloudflareD1 from 'db0/connectors/cloudflare-d1';
import { Converters, Envapter } from 'envapt';
import { createStorage } from 'unstorage';
import db0Driver from 'unstorage/drivers/db0';

import { Pages } from './plugins/Pages';
import { Roles } from './plugins/Roles';
import { Search } from './plugins/Search';
import { Versions } from './plugins/Versions';

const database = createDatabase(cloudflareD1({ bindingName: 'DB' }));

export default new Seedcord({
    kv: new UnstorageDriver(createStorage({ driver: db0Driver({ database }) })),
    // seedcord dev uses the tunnel's address when this is unset
    ...(Envapter.isProduction && { server: { url: `https://${env.BOT_HOST}` } }),
    bot: {
        interactions: {
            path: './handlers'
        },
        commands: {
            path: './commands',
            guilds: Envapter.getAs('TESTING_GUILD_IDS', Converters.array(), [])
        }
    },
    subscribers: {
        path: './subscribers'
    },
    botColor: '#f8555a',
    ownerIds: ['287135364127129601'],
    notifications: {
        developerUsername: 'materwelonDhruv'
    }
})
    .attach('search', Search)
    .attach('versions', Versions)
    .attach('pages', Pages)
    .attach('roles', Roles);
