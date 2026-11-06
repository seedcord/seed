import { Seedcord, UnstorageDriver } from '@seedcord/http';
import { createDatabase } from 'db0';
import cloudflareD1 from 'db0/connectors/cloudflare-d1';
import { Converters, Envapter } from 'envapt';
import { createStorage } from 'unstorage';
import db0Driver from 'unstorage/drivers/db0';

import { Search } from './plugins/Search';
import { Versions } from './plugins/Versions';

const database = createDatabase(cloudflareD1({ bindingName: 'DB' }));

export default new Seedcord({
    kv: new UnstorageDriver(createStorage({ driver: db0Driver({ database }) })),
    bot: {
        interactions: {
            path: './handlers'
        },
        commands: {
            path: './commands',
            guilds: Envapter.getAs('TESTING_GUILD_IDS', Converters.array(), [])
        },
        emojis: {
            Core: 'core',
            Libs: 'libs',
            Plugins: 'plugins',
            Tools: 'tools',
            Latest: 'latest',
            Next: 'next',
            Caret: 'caret',
            Dot: 'dot'
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
    .attach('versions', Versions);
