import {
    ButtonHandler,
    ButtonRoute,
    Cooldown,
    Emojis,
    Gated,
    isSeedcordError,
    SeedcordErrorCode,
    SlashHandler,
    SlashRoute
} from '@seedcord/http';

import { RolesCard, RolesRefreshId, WHERE_TO_CLAIM } from '#components/RolesCard';
import { RolesNotConnected, RolesRefused } from '#lib/notices';
import { roleLines } from '#lib/roles';

@SlashRoute('roles')
export class Roles extends SlashHandler<'roles'> {
    public async execute(): Promise<void> {
        await this.reply({ components: [new RolesCard(this.core.roles.verifyUrl()).component] });
    }
}

@Gated(Cooldown('1m', { limit: 3 }))
@ButtonRoute(RolesRefreshId)
export class RolesRefresh extends ButtonHandler<[typeof RolesRefreshId]> {
    public async execute(): Promise<void> {
        await this.defer();
        const result = await this.core.roles.push(this.user.id).catch((error: unknown) => {
            if (isSeedcordError(error, 'SeedcordError', SeedcordErrorCode.PluginOAuthLoginNeeded)) {
                throw new RolesNotConnected();
            }
            throw error;
        });
        if (result.kind === 'refused') throw new RolesRefused(result.message);

        const lines = roleLines(result.connection).map(({ name, has, missing }) =>
            has ? `${Emojis.Check} **${name}**` : `${Emojis.Cross} **${name}**: ${missing}`
        );
        await this.edit([...lines, `\n${WHERE_TO_CLAIM}`].join('\n'));
    }
}
