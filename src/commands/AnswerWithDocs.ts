import { BuilderComponent, RegisterCommand } from '@seedcord/http';
import { ApplicationCommandType } from 'discord-api-types/v10';

import { COMMAND_CONTEXTS, COMMAND_INSTALL_TYPES } from '#lib/commandScope';

@RegisterCommand()
export class AnswerWithDocs extends BuilderComponent<'context_menu'> {
    constructor() {
        super('context_menu');

        this.instance
            .setName('Answer with docs')
            .setType(ApplicationCommandType.Message)
            .setContexts(...COMMAND_CONTEXTS)
            .setIntegrationTypes(...COMMAND_INSTALL_TYPES);
    }
}
