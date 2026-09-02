// builds a Content-Security-Policy header value from a directive table
// e.g. { 'default-src': ["'none'"], 'img-src': ['*', 'data:'] }  ->  "default-src 'none'; img-src * data:"
// a directive whose source list is empty emits just its name (e.g. `upgrade-insecure-requests`).
//

export type CspDirectives = Record<string, string[]>;

export const buildCsp = (directives: CspDirectives): string =>
	Object.entries(directives)
		.map(([ directive, sources ]) => (sources.length ? `${directive} ${sources.join(' ')}` : directive))
		.join('; ');
