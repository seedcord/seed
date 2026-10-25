import { Seedcord } from '@seedcord/http';
import { Converters, Envapter } from 'envapt';

import { Search } from './plugins/Search';

export const seedcord = new Seedcord({
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
        path: null
    },
    botColor: '#f8555a',
    notifications: {
        developerUsername: 'materwelonDhruv'
    }
}).attach('search', Search);

export default seedcord;
