import type { NextApiRequest, NextApiResponse } from 'next';
import { notes, sessions } from '../../../lib/store';
import { randomBytes } from 'crypto';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { id, cause, details } = req.body ?? { };
	if (typeof details !== 'string' || details.length < 1 || details.length > 8192) {
		return res.status(400).json({ error: 'Bad details' });
	}

	if (id && (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(id))) {
		return res.status(400).json({ error: 'Bad name' });
	}

	// re-generate session (if needed)
	//

	let sid = req.cookies.sid;
	if (!sid || !sessions.has(sid)) {
		sid = randomBytes(16).toString('hex');
		sessions.set(sid, { written: [ ] });
	}

	const session = sessions.get(sid)!;

	// add note
	//

	const noteId = id ?? randomBytes(8).toString('hex');
	const causeText = typeof cause === 'string' && cause.trim() ? cause : 'Heart Attack';
	notes.set(noteId, { id: noteId, cause: causeText, details, createdBy: sid });

	if (!session.written.includes(noteId)) {
		session.written.push(noteId);
	}

	res.setHeader('Set-Cookie', `sid=${sid}; Path=/; HttpOnly; SameSite=Lax`);
	res.status(200).json({ id: noteId });
};

export default handler;
