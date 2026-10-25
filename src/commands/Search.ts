import { BuilderComponent, RegisterCommand } from '@seedcord/http';
import { ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';

@RegisterCommand()
export class Search extends BuilderComponent<'command'> {
    constructor() {
        super('command');

        this.instance
            .setName('search')
            .setDescription('Search for symbols or documentation')
            .addSubcommand(new SubSearch('docs', 'Search the reference docs').component)
            .addSubcommand(new SubSearch('guide', 'Search the guide').component)
            .setContexts(
                InteractionContextType.BotDM,
                InteractionContextType.Guild,
                InteractionContextType.PrivateChannel
            )
            .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall);
    }
}

class SubSearch extends BuilderComponent<'subcommand'> {
    constructor(name: string, description: string) {
        super('subcommand');

        this.instance
            .setName(name)
            .setDescription(description)
            .addStringOption((o) =>
                o.setName('query').setDescription('The query to search for').setRequired(true).setAutocomplete(true)
            )
            .addBooleanOption((o) =>
                o.setName('public').setDescription('Make the search result public').setRequired(false)
            )
            .addUserOption((o) =>
                o.setName('ping').setDescription('Ping a user with the search result').setRequired(false)
            );
    }
}
