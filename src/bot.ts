import { Seedcord } from '@seedcord/http';
import { Converters, Envapter } from 'envapt';

import { Search } from './plugins/Search';
import { Versions } from './plugins/Versions';

export default new Seedcord({
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
        path: null
    },
    botColor: '#f8555a',
    ownerIds: ['287135364127129601'],
    notifications: {
        developerUsername: 'materwelonDhruv'
    }
})
    .attach('search', Search)
    .attach('versions', Versions);
