import { useEffect, useState } from 'react';

type Row = { id: string; cause: string | null; exists: boolean };

const Home = () => {
	const [ written, setWritten ] = useState<Row[] | null>(null);

	const load = () =>
		fetch('/api/mine').then((r) => r.json()).then((d) => setWritten(d.written));

	useEffect(() => { load(); }, [ ]);

	const tearOut = async (id: string) => {
		const r = await fetch(`/api/notes/${encodeURIComponent(id)}`, { method: 'DELETE' });
		if (r.ok) load();
	};

	return (
		<div className="notebook">
			<div className="nb-header">
				<h1>Death Note</h1>
				<a href="/write">+ write a name</a>
			</div>

			{written === null ? (
				<p className="empty">…</p>
			) : written.length === 0 ? (
				<p className="empty">No names have been written yet.</p>
			) : (
				<ul className="entries">
					{written.map(({ id, cause, exists }) => (
						<li className="entry-row" key={id}>
							<span className="entry-name">{id}</span>
							{exists ? (
								<>
									<span className="entry-cause">{cause}</span>
									<a href={`/view/${encodeURIComponent(id)}`}>» view</a>
									<button className="tear" onClick={() => tearOut(id)}>tear out</button>
								</>
							) : (
								<em className="perished">perished</em>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Home;
