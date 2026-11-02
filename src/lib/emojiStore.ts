import type { API } from '@discordjs/core/http-only';
import type { APIAttachment, APIEmoji } from 'discord-api-types/v10';

export const EMOJI_SCOPES = ['server', 'app'] as const;

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

// discord rejects an emoji image over 256 KiB
const MAX_IMAGE_BYTES = 262_144;
const NAME_LENGTH = { min: 2, max: 32 };

function storedEmoji({ id, name, animated }: APIEmoji): StoredEmoji {
    // discord leaves these null on unicode emojis
    if (!id || !name) throw new Error('Discord returned an emoji without an id or a name.');
    return { id, name, animated: animated ?? false };
}

class AppEmojis implements EmojiStore {
    constructor(
        private readonly api: API,
        private readonly applicationId: string
    ) {}

    async list(): Promise<StoredEmoji[]> {
        const { items } = await this.api.applications.getEmojis(this.applicationId);
        return items.map(storedEmoji);
    }

    async create(name: string, image: string): Promise<StoredEmoji> {
        return storedEmoji(await this.api.applications.createEmoji(this.applicationId, { name, image }));
    }

    async delete(id: string): Promise<void> {
        await this.api.applications.deleteEmoji(this.applicationId, id);
    }
}

class ServerEmojis implements EmojiStore {
    constructor(
        private readonly api: API,
        private readonly guildId: string
    ) {}

    async list(): Promise<StoredEmoji[]> {
        const emojis = await this.api.guilds.getEmojis(this.guildId);
        return emojis.map(storedEmoji);
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
    if (!interaction.guild_id) throw new Error('Server emojis need a server.');
    return new ServerEmojis(api, interaction.guild_id);
}

const emojiMention = ({ id, name, animated }: StoredEmoji): string => `<${animated ? 'a' : ''}:${name}:${id}>`;

function emojiName(fileName: string): string {
    const stem = fileName.replace(/\.[^.]+$/, '').replaceAll(/\W/g, '_');
    return stem.padEnd(NAME_LENGTH.min, '_').slice(0, NAME_LENGTH.max);
}

async function imageDataUri({ url, content_type: contentType }: APIAttachment): Promise<string> {
    const response = await fetch(url);
    let binary = '';
    for (const byte of new Uint8Array(await response.arrayBuffer())) binary += String.fromCodePoint(byte);
    return `data:${contentType};base64,${btoa(binary)}`;
}

async function addImage(store: EmojiStore, image: APIAttachment): Promise<string> {
    const name = emojiName(image.filename);
    if (image.size > MAX_IMAGE_BYTES) return `\`${name}\` failed: the image is over 256 KB.`;

    try {
        const emoji = emojiMention(await store.create(name, await imageDataUri(image)));
        return `${emoji} \`${emoji}\``;
    } catch (error) {
        return `\`${name}\` failed: ${Error.isError(error) ? error.message : String(error)}`;
    }
}

export async function addImages(store: EmojiStore, attachments: readonly APIAttachment[]): Promise<string> {
    const images = attachments.filter((file) => file.content_type?.startsWith('image/'));
    if (images.length === 0) return "That message doesn't have any images.";

    const lines: string[] = [];
    for (const image of images) lines.push(await addImage(store, image));
    return lines.join('\n');
}
