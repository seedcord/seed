import { BuilderComponent, RegisterCommand } from '@seedcord/http';

import { COMMAND_CONTEXTS, COMMAND_INSTALL_TYPES } from '#lib/commandScope';

@RegisterCommand()
export class Emojis extends BuilderComponent<'command'> {
    constructor() {
        super('command');

        this.instance
            .setName('emojis')
            .setDescription('Manage guild and app emojis')
            .addSubcommandGroup(new DeleteEmojis().component)
            .setContexts(...COMMAND_CONTEXTS)
            .setIntegrationTypes(...COMMAND_INSTALL_TYPES);
    }
}

class DeleteEmojis extends BuilderComponent<'group'> {
    constructor() {
        super('group');

        this.instance
            .setName('delete')
            .setDescription('Pick emojis to delete')
            .addSubcommand((subcommand) =>
                subcommand.setName('guild').setDescription("Pick this server's emojis to delete")
            )
            .addSubcommand((subcommand) =>
                subcommand.setName('app').setDescription("Pick the bot's own emojis to delete")
            );
    }
}
