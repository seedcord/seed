import { ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';

export const COMMAND_CONTEXTS = [
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel
];

export const COMMAND_INSTALL_TYPES = [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall];
