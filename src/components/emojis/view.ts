import { CustomId } from '@seedcord/http';

import { EMOJI_SCOPES } from '#lib/emojiStore';

import type { EmojiScope } from '#lib/emojiStore';

// discord allows an app 2000 emojis, at 25 a page
export const LAST_PAGE = 79;

export interface EmojiView {
    scope: EmojiScope;
    page: number;
}

export const EmojiPickId = new CustomId('emoji-pick').oneOf('scope', EMOJI_SCOPES).int('page', 0, LAST_PAGE);
export const EmojiPageId = new CustomId('emoji-page').oneOf('scope', EMOJI_SCOPES).int('page', 0, LAST_PAGE);
export const EmojiDeleteId = new CustomId('emoji-delete').oneOf('scope', EMOJI_SCOPES).int('page', 0, LAST_PAGE);
