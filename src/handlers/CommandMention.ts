import {
    AutocompleteHandler,
    AutocompleteRoute,
    Commands,
    Cooldown,
    Gated,
    SlashHandler,
    SlashRoute
} from '@seedcord/http';

import { UnknownCommand } from '#lib/notices';
import { fitChoiceName } from '#lib/text';

@AutocompleteRoute('command')
export class CommandMentionAutocomplete extends AutocompleteHandler<'command'> {
    public async execute(): Promise<void> {
        const typed = this.focused.value.toLowerCase().replaceAll(' ', '/');
        const matches = Object.values(Commands).filter(({ route }) => route.includes(typed));

        await this.respond(
            matches.map(({ route, description }) => ({
                name: fitChoiceName(`/${route.replaceAll('/', ' ')} - ${description}`),
                value: route
            }))
        );
    }
}

@Gated(Cooldown('1m', { limit: 10 }))
@SlashRoute('command')
export class CommandMention extends SlashHandler<'command'> {
    public async execute(): Promise<void> {
        const name = this.options.getString('name');
        const command = Object.values(Commands).find(({ route }) => route === name);
        if (!command) throw new UnknownCommand(name);

        const ping = this.options.getUser('ping');
        await this.reply(ping ? `<@${ping.id}> ${command.mention}` : command.mention, { ephemeral: false });
    }
}
