import type { NextApiRequest, NextApiResponse } from 'next';
import { notes, sessions } from '../../../lib/store';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'DELETE') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const id = String(req.query.id);
	const sid = req.cookies.sid;
	const session = sid ? sessions.get(sid) : null;

	if (!session?.written.includes(id)) {
		return res.status(403).json({ error: 'Not your note' });
	}

	notes.delete(id);
	res.status(200).json({ ok: true });
};

export default handler;
