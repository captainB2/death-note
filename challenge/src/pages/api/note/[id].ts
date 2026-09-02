import type { NextApiRequest, NextApiResponse } from 'next';
import { marked } from 'marked';
import { notes } from '../../../lib/store';
import { buildCsp } from '../../../lib/csp';

// strict policy for untrusted rendering
//

const sandboxCsp = buildCsp({
	'default-src': [ `'none'` ],
	'style-src': [ `'unsafe-inline'` ],
	'img-src': [ `'self'`, 'data:' ],
	'font-src': [ `'self'`, 'data:' ],
});

const handler = (req: NextApiRequest, res: NextApiResponse) => {
	const id = String(req.query.id);
	const note = notes.get(id);

	if (!note) {
		return res.status(404).json({ error: 'Note could not be found' });
	}

	res.setHeader('Content-Security-Policy', sandboxCsp);
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('X-Frame-Options', 'SAMEORIGIN');

	res.status(200).send(marked.parse(note.details) as string);
};

export default handler;
