import { ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';

import type { API } from '@seedcord/http';
import type { APIInteraction } from 'discord-api-types/v10';

type SearchEvent = Pick<APIInteraction, 'guild_id' | 'context' | 'authorizing_integration_owners'>;

// discord sends both when the server has the app and the user installed it too
function installs(server: boolean, user: boolean): string {
    if (server && user) return 'the server and user installs';
    return server ? 'the server install' : 'the user install';
}

async function place(api: API, event: SearchEvent, serverInstall: boolean): Promise<string> {
    const guildId = event.guild_id;
    if (!guildId) return event.context === InteractionContextType.BotDM ? 'my DMs' : 'a DM or group DM';

    // and it gives a 404 unknown guild when the server added the app without the bot
    const guild = serverInstall ? await api.guilds.get(guildId).catch(() => null) : null;
    return guild ? `**${guild.name}**` : `a server i'm not in \`${guildId}\``;
}

export async function searchedIn(api: API, event: SearchEvent): Promise<string> {
    const owners = event.authorizing_integration_owners;
    const server = ApplicationIntegrationType.GuildInstall in owners;
    const user = ApplicationIntegrationType.UserInstall in owners;
    return `${await place(api, event, server)} through ${installs(server, user)}`;
}
