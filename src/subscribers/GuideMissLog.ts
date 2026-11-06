import { Subscribe, WebhookLog, WebhookUrl } from '@seedcord/http';

import { GuideMissCard } from '#components/GuideMissCard';

import type { GuideMissReport } from '#components/GuideMissCard';
import type { WebhookReport } from '@seedcord/http';

declare module '@seedcord/http' {
    interface Subscriptions {
        guideMiss: GuideMissReport;
    }
}

@Subscribe(['guideMiss'])
@WebhookUrl('HANDLED_EXCEPTION_WEBHOOK_URL')
export class GuideMissLog extends WebhookLog<'guideMiss'> {
    public report(): WebhookReport {
        return { username: 'Guide miss', components: [new GuideMissCard(this.data).component] };
    }
}
