import type { NextApiRequest, NextApiResponse } from 'next';
import { notes, sessions } from '../../lib/store';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
	const sid = req.cookies.sid ?? '';

	const session = sessions.get(sid);

	const written = (session?.written ?? [ ]).map((id) => {
		const note = notes.get(id);
		return { id, cause: note?.cause ?? null, exists: !!note };
	});

	res.status(200).json({ session: sid, written });
};

export default handler;
