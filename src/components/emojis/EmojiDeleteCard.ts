import { BuilderComponent, paginate } from '@seedcord/http';

import { ConfirmButtons } from '#components/emojis/ConfirmButtons';
import { EmojiPicker } from '#components/emojis/EmojiPicker';
import { PageButtons } from '#components/emojis/PageButtons';
import { countOf } from '#lib/text';

import type { EmojiView } from '#components/emojis/view';
import type { StoredEmoji } from '#lib/emojiStore';

// discord caps a select menu at 25 options
const PAGE_SIZE = 25;

export class EmojiDeleteCard extends BuilderComponent<'container'> {
    constructor({ scope, page }: EmojiView, emojis: readonly StoredEmoji[], pickedIds: readonly string[]) {
        super('container');

        const shown = paginate(emojis, page, PAGE_SIZE);
        const view = { scope, page: shown.page };

        this.instance.addTextDisplayComponents((text) =>
            text.setContent(
                `## Delete ${scope} emojis\n-# ${countOf(emojis.length, 'emoji', 'emojis')} · page ${shown.page + 1} of ${shown.totalPages ?? 1}`
            )
        );

        if (shown.items.length > 0) {
            this.instance.addActionRowComponents(new EmojiPicker(view, shown.items, pickedIds).component);
        }
        if (pickedIds.length > 0) {
            this.instance.addActionRowComponents(new ConfirmButtons(view, pickedIds.length).component);
        } else if (shown.hasPrev || shown.hasNext) {
            this.instance.addActionRowComponents(new PageButtons(scope, shown).component);
        }
    }
}
