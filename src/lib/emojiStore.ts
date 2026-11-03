import type { API } from '@seedcord/http';
import type { APIEmoji } from 'discord-api-types/v10';

export const EMOJI_SCOPES = ['guild', 'app'] as const;

export type EmojiScope = (typeof EMOJI_SCOPES)[number];

export interface StoredEmoji {
    id: string;
    name: string;
    animated: boolean;
}

export interface EmojiStore {
    list(): Promise<StoredEmoji[]>;
    create(name: string, image: string): Promise<StoredEmoji>;
    delete(id: string): Promise<void>;
}

function storedEmoji({ id, name, animated }: APIEmoji): StoredEmoji {
    // discord leaves these null on unicode emojis
    if (!id || !name) throw new Error('Discord returned an emoji without an id or a name.');
    return { id, name, animated: animated ?? false };
}

const newestFirst = (a: StoredEmoji, b: StoredEmoji): number => (BigInt(b.id) > BigInt(a.id) ? 1 : -1);

class AppEmojis implements EmojiStore {
    constructor(
        private readonly api: API,
        private readonly applicationId: string
    ) {}

    async list(): Promise<StoredEmoji[]> {
        const { items } = await this.api.applications.getEmojis(this.applicationId);
        return items.map(storedEmoji).sort(newestFirst);
    }

    async create(name: string, image: string): Promise<StoredEmoji> {
        return storedEmoji(await this.api.applications.createEmoji(this.applicationId, { name, image }));
    }

    async delete(id: string): Promise<void> {
        await this.api.applications.deleteEmoji(this.applicationId, id);
    }
}

class GuildEmojis implements EmojiStore {
    constructor(
        private readonly api: API,
        private readonly guildId: string
    ) {}

    async list(): Promise<StoredEmoji[]> {
        const emojis = await this.api.guilds.getEmojis(this.guildId);
        return emojis.map(storedEmoji).sort(newestFirst);
    }

    async create(name: string, image: string): Promise<StoredEmoji> {
        return storedEmoji(await this.api.guilds.createEmoji(this.guildId, { name, image }));
    }

    async delete(id: string): Promise<void> {
        await this.api.guilds.deleteEmoji(this.guildId, id);
    }
}

export function emojiStore(
    scope: EmojiScope,
    api: API,
    interaction: { application_id: string; guild_id?: string | undefined }
): EmojiStore {
    if (scope === 'app') return new AppEmojis(api, interaction.application_id);
    if (!interaction.guild_id) throw new Error('Guild emojis need a guild.');
    return new GuildEmojis(api, interaction.guild_id);
}
