import { BuilderComponent, RegisterCommand } from '@seedcord/http';
import {
    ApplicationCommandType,
    ApplicationIntegrationType,
    InteractionContextType,
    PermissionFlagsBits
} from 'discord-api-types/v10';

import { COMMAND_CONTEXTS, COMMAND_INSTALL_TYPES } from '#lib/commandScope';

@RegisterCommand()
export class AddAsServerEmoji extends BuilderComponent<'context_menu'> {
    constructor() {
        super('context_menu');

        this.instance
            .setName('Add as Server Emoji')
            .setType(ApplicationCommandType.Message)
            .setContexts(InteractionContextType.Guild)
            .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
            .setDefaultMemberPermissions(PermissionFlagsBits.CreateGuildExpressions);
    }
}

@RegisterCommand()
export class AddAsAppEmoji extends BuilderComponent<'context_menu'> {
    constructor() {
        super('context_menu');

        this.instance
            .setName('Add as App Emoji')
            .setType(ApplicationCommandType.Message)
            .setContexts(...COMMAND_CONTEXTS)
            .setIntegrationTypes(...COMMAND_INSTALL_TYPES);
    }
}
