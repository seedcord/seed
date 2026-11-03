import { StringSelectMenuBuilder } from '@discordjs/builders';
import { RowComponent } from '@seedcord/http';
import { ComponentType } from 'discord-api-types/v10';

import { EmojiPickId } from '#components/emojis/view';

import type { EmojiView } from '#components/emojis/view';
import type { StoredEmoji } from '#lib/emojiStore';
import type { APIMessage } from 'discord-api-types/v10';

export class EmojiPicker extends RowComponent<'menu_string'> {
    constructor(view: EmojiView, emojis: readonly StoredEmoji[], pickedIds: readonly string[]) {
        super('menu_string');

        this.instance.addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(EmojiPickId.encode(view))
                .setPlaceholder('Pick emojis to delete')
                .setMaxValues(emojis.length)
                .addOptions(
                    emojis.map(({ id, name, animated }) => ({
                        label: name,
                        value: id,
                        emoji: { id, name, animated },
                        default: pickedIds.includes(id)
                    }))
                )
        );
    }
}

// this is ugly and i don't like it but ig it's the best way to do this
export function pickedEmojiIds(message: APIMessage): string[] {
    return (message.components ?? [])
        .flatMap((top) => (top.type === ComponentType.Container ? top.components : []))
        .flatMap((child) => (child.type === ComponentType.ActionRow ? child.components : []))
        .flatMap((item) => (item.type === ComponentType.StringSelect ? item.options : []))
        .filter((option) => option.default)
        .map((option) => option.value);
}
