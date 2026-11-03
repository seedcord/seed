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

import { EmojiDeleteCard } from '#components/emojis/EmojiDeleteCard';
import { pickedEmojiIds } from '#components/emojis/EmojiPicker';
import { EmojiDeleteId, EmojiPageId, EmojiPickId } from '#components/emojis/view';
import { emojiStore } from '#lib/emojiStore';

import type { EmojiView } from '#components/emojis/view';
import type { EmojiStore } from '#lib/emojiStore';
import type { ReplyResponse } from '@seedcord/http';

async function deleteCard(
    store: EmojiStore,
    view: EmojiView,
    pickedIds: readonly string[] = []
): Promise<ReplyResponse> {
    return { components: [new EmojiDeleteCard(view, await store.list(), pickedIds).component] };
}

@Gated(
    GuildOnly(),
    RequirePermissions([PermissionFlagsBits.ManageGuildExpressions]),
    RequireBotPermissions([PermissionFlagsBits.ManageGuildExpressions])
)
@SlashRoute('emojis/delete/guild')
export class DeleteGuildEmojis extends SlashHandler<'emojis/delete/guild'> {
    public async execute(): Promise<void> {
        await this.defer();
        await this.edit(await deleteCard(emojiStore('guild', this.api, this.event), { scope: 'guild', page: 0 }));
    }
}

@Gated(OwnerOnly())
@SlashRoute('emojis/delete/app')
export class DeleteAppEmojis extends SlashHandler<'emojis/delete/app'> {
    public async execute(): Promise<void> {
        await this.defer();
        await this.edit(await deleteCard(emojiStore('app', this.api, this.event), { scope: 'app', page: 0 }));
    }
}

@ButtonRoute(EmojiPageId)
export class EmojiPage extends ButtonHandler<[typeof EmojiPageId]> {
    public async execute(): Promise<void> {
        await this.deferUpdate();
        await this.edit(await deleteCard(emojiStore(this.params.scope, this.api, this.event), this.params));
    }
}

@StringMenuRoute(EmojiPickId)
export class EmojiPick extends StringMenuHandler<[typeof EmojiPickId]> {
    public async execute(): Promise<void> {
        await this.deferUpdate();
        await this.edit(
            await deleteCard(emojiStore(this.params.scope, this.api, this.event), this.params, this.values)
        );
    }
}

@ButtonRoute(EmojiDeleteId)
export class EmojiDelete extends ButtonHandler<[typeof EmojiDeleteId]> {
    public async execute(): Promise<void> {
        await this.deferUpdate();

        const store = emojiStore(this.params.scope, this.api, this.event);
        await Promise.all(pickedEmojiIds(this.event.message).map((id) => store.delete(id)));
        await this.edit(await deleteCard(store, this.params));
    }
}
