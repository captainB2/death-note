import type { NextApiRequest, NextApiResponse } from 'next';

const BOT_URL = process.env.BOT_URL || 'http://bot:8080';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const url = typeof req.query.url === 'string' ? req.query.url : '';

	if (!/^https?:\/\//.test(url)) {
		return res.status(400).json({ error: 'Invalid url' });
	}

	try {
		const botRes = await fetch(`${BOT_URL}/visit?url=${encodeURIComponent(url)}`);
		const data = await botRes.json().catch(() => ({ }));
		return res.status(botRes.status).json(data);
	} catch {
		return res.status(502).json({ error: 'Bot unavailable' });
	}
};

export default handler;
