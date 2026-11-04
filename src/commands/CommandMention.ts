import { BuilderComponent, RegisterCommand } from '@seedcord/http';

import { COMMAND_CONTEXTS, COMMAND_INSTALL_TYPES } from '#lib/commandScope';

@RegisterCommand()
export class CommandMention extends BuilderComponent<'command'> {
    constructor() {
        super('command');

        this.instance
            .setName('command')
            .setDescription('Post a clickable mention of one of my commands')
            .addStringOption((o) =>
                o.setName('name').setDescription('The command to mention').setRequired(true).setAutocomplete(true)
            )
            .addUserOption((o) => o.setName('ping').setDescription('Ping a user with the mention').setRequired(false))
            .setContexts(...COMMAND_CONTEXTS)
            .setIntegrationTypes(...COMMAND_INSTALL_TYPES);
    }
}
