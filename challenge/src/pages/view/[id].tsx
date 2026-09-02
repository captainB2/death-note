import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const View = () => {
	const router = useRouter();
	const id = router.query.id ? decodeURIComponent(String(router.query.id)) : '';
	const [ cause, setCause ] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;

		fetch('/api/mine')
			.then((r) => r.json())
			.then((d) => {
				const row = (d.written || [ ]).find((w: { id: string }) => w.id === id);
				if (row) setCause(row.cause);
			})
			.catch(() => {});
	}, [id]);

	return (
		<div className="notebook">
			<div className="nb-header">
				<h1>Death Note</h1>
				<a href="/">← back</a>
			</div>

			<p className="victim-name">{id}</p>
			{cause && <p className="victim-cause">{cause}</p>}

			<hr />

			<label>Details</label>
			{id && <iframe className="note-frame" src={`/note/${encodeURIComponent(id)}`} />}
		</div>
	);
};

export default View;
