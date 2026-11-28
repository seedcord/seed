import { renderToStaticMarkup } from 'react-dom/server';

import type { ReactElement } from 'react';

export function html(page: ReactElement, status = 200): Response {
    return new Response(`<!doctype html>${renderToStaticMarkup(page)}`, {
        status,
        headers: { 'content-type': 'text/html; charset=utf-8' }
    });
}
