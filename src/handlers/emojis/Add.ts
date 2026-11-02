import {
    Gated,
    GuildOnly,
    MessageContextMenuHandler,
    MessageContextMenuRoute,
    OwnerOnly,
    RequireBotPermissions,
    RequirePermissions
} from '@seedcord/http';
import { PermissionFlagsBits } from 'discord-api-types/v10';

import { addImages, emojiStore } from '#lib/emojiStore';

@Gated(
    GuildOnly(),
    RequirePermissions([PermissionFlagsBits.CreateGuildExpressions]),
    RequireBotPermissions([PermissionFlagsBits.CreateGuildExpressions])
)
@MessageContextMenuRoute('Add as Server Emoji')
export class AddAsServerEmoji extends MessageContextMenuHandler<'Add as Server Emoji'> {
    public async execute(): Promise<void> {
        await this.defer();
        await this.edit(await addImages(emojiStore('server', this.api, this.event), this.target.attachments));
    }
}

@Gated(OwnerOnly())
@MessageContextMenuRoute('Add as App Emoji')
export class AddAsAppEmoji extends MessageContextMenuHandler<'Add as App Emoji'> {
    public async execute(): Promise<void> {
        await this.defer();
        await this.edit(await addImages(emojiStore('app', this.api, this.event), this.target.attachments));
    }
}
