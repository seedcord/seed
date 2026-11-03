import { CustomId } from '@seedcord/http';

import { CHANNELS, GROUP_NAMES } from '#lib/packages';

import type { Channel, PackageGroup } from '#lib/packages';

export interface VersionsView {
    tab: PackageGroup;
    channel: Channel;
}

export const VersionsNavId = new CustomId('versions-nav').oneOf('tab', GROUP_NAMES).oneOf('channel', CHANNELS);
