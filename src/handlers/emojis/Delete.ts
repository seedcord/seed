import {
    ButtonHandler,
    ButtonRoute,
    Gated,
    GuildOnly,
    OwnerOnly,
    RequireBotPermissions,
    RequirePermissions,
    SlashHandler,
    SlashRoute,
    StringMenuHandler,
    StringMenuRoute
} from '@seedcord/http';
import { PermissionFlagsBits } from 'discord-api-types/v10';

import { EmojiDeleteCard, EmojiDeleteId, EmojiPageId } from '#components/emojis/EmojiDeleteCard';
import { emojiStore } from '#lib/emojiStore';

@Gated(
    GuildOnly(),
    RequirePermissions([PermissionFlagsBits.ManageGuildExpressions]),
    RequireBotPermissions([PermissionFlagsBits.ManageGuildExpressions])
)
@SlashRoute('delete-server-emojis')
export class DeleteServerEmojis extends SlashHandler<'delete-server-emojis'> {
    public async execute(): Promise<void> {
        await this.defer();

        const emojis = await emojiStore('server', this.api, this.event).list();
        await this.edit({ components: [new EmojiDeleteCard('server', 0, emojis).component] });
    }
}

@Gated(OwnerOnly())
@SlashRoute('delete-app-emojis')
export class DeleteAppEmojis extends SlashHandler<'delete-app-emojis'> {
    public async execute(): Promise<void> {
        await this.defer();

        const emojis = await emojiStore('app', this.api, this.event).list();
        await this.edit({ components: [new EmojiDeleteCard('app', 0, emojis).component] });
    }
}

@ButtonRoute(EmojiPageId)
export class EmojiPage extends ButtonHandler<[typeof EmojiPageId]> {
    public async execute(): Promise<void> {
        await this.deferUpdate();

        const { scope, page } = this.params;
        const emojis = await emojiStore(scope, this.api, this.event).list();
        await this.edit({ components: [new EmojiDeleteCard(scope, page, emojis).component] });
    }
}

@StringMenuRoute(EmojiDeleteId)
export class EmojiDelete extends StringMenuHandler<[typeof EmojiDeleteId]> {
    public async execute(): Promise<void> {
        await this.deferUpdate();

        const { scope, page } = this.params;
        const store = emojiStore(scope, this.api, this.event);
        await Promise.all(this.values.map((id) => store.delete(id)));

        await this.edit({ components: [new EmojiDeleteCard(scope, page, await store.list()).component] });
    }
}
