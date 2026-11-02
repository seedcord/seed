import { BuilderComponent, RegisterCommand } from '@seedcord/http';
import { ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits } from 'discord-api-types/v10';

import { COMMAND_CONTEXTS, COMMAND_INSTALL_TYPES } from '#lib/commandScope';

@RegisterCommand()
export class DeleteServerEmojis extends BuilderComponent<'command'> {
    constructor() {
        super('command');

        this.instance
            .setName('delete-server-emojis')
            .setDescription("Pick this server's emojis to delete")
            .setContexts(InteractionContextType.Guild)
            .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions);
    }
}

@RegisterCommand()
export class DeleteAppEmojis extends BuilderComponent<'command'> {
    constructor() {
        super('command');

        this.instance
            .setName('delete-app-emojis')
            .setDescription("Pick the bot's own emojis to delete")
            .setContexts(...COMMAND_CONTEXTS)
            .setIntegrationTypes(...COMMAND_INSTALL_TYPES);
    }
}
