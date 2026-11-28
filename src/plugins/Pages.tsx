import { Plugin } from '@seedcord/http';

import { html } from '#src/pages/html';
import { Landing } from '#src/pages/Landing';

const LANDING = new URLPattern({ pathname: '/' });

export class Pages extends Plugin {
    public init(): void {}

    public override fetch(request: Request): Response | undefined {
        if (request.method !== 'GET' || !LANDING.test(request.url)) return undefined;
        return html(<Landing applicationId={this.core.applicationId} />);
    }
}
