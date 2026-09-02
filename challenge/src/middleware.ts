import { NextResponse } from 'next/server';
import { buildCsp } from './lib/csp';

const globalCsp = buildCsp({
	'default-src': [ `'self'`],
	// allow inline styles
	'style-src': [ `'self'`, `'unsafe-inline'`],
	// allow scripts from self (next.js bundles)
	'script-src': [ `'self'`, `'unsafe-inline'`, `'unsafe-eval'`],
	// allow images from the same origin and data URIs, as well as blob URIs
	'img-src': [ `'self'`, 'data:', 'blob:' ],
	// allow fonts from the same origin and data URIs
	'font-src': [ `'self'`, 'data:' ],
	// allow APIs to connect to self
	'connect-src': [ `'self'` ],
	// prevent framing (clickjacking)
	'frame-ancestors': [ `'none'` ],
	// form actions should only be allowed to self
	'form-action': [ `'self'` ],
	// base URI restriction
	'base-uri': [ `'self'` ]
});

export const middleware = () => {
	const res = NextResponse.next();

	res.headers.set('X-Content-Type-Options', 'nosniff');
	res.headers.set('X-Frame-Options', 'DENY');
	res.headers.set('X-XSS-Protection', '1; mode=block');
	res.headers.set('Content-Security-Policy', globalCsp);
	res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	return res;
};

export const config = {
	matcher: [ '/((?!_next/static|_next/image|favicon.ico).*)' ]
};