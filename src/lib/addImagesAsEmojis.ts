import type { EmojiStore, StoredEmoji } from '#lib/emojiStore';
import type { APIAttachment } from 'discord-api-types/v10';

// discord rejects an emoji image over 256 KiB
const MAX_IMAGE_BYTES = 262_144;
const NAME_LENGTH = { min: 2, max: 32 };

const emojiMention = ({ id, name, animated }: StoredEmoji): string => `<${animated ? 'a' : ''}:${name}:${id}>`;

function emojiName(fileName: string): string {
    const stem = fileName.replace(/\.[^.]+$/, '').replaceAll(/\W/g, '_');
    return stem.padEnd(NAME_LENGTH.min, '_').slice(0, NAME_LENGTH.max);
}

async function imageDataUri({ url, content_type: contentType }: APIAttachment): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Discord answered ${response.status} for the image.`);

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

export async function addImagesAsEmojis(store: EmojiStore, attachments: readonly APIAttachment[]): Promise<string> {
    const images = attachments.filter((file) => file.content_type?.startsWith('image/'));
    if (images.length === 0) return "That message doesn't have any images.";

    const lines: string[] = [];
    for (const image of images) lines.push(await addImage(store, image));
    return lines.join('\n');
}
