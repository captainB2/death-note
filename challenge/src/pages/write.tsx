import { useState } from 'react';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const Write = () => {
	const [ name, setName ] = useState('');
	const [ cause, setCause ] = useState('Heart Attack');
	const [ details, setDetails ] = useState('');
	const [ status, setStatus ] = useState('');

	const submit = async () => {
		setStatus('');

		if (!name.trim()) {
			setStatus('A full name is required');
			return;
		}

		const res = await fetch('/api/notes', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: name.trim(), cause: cause.trim() || 'Heart Attack', details })
		});

		if (res.ok) {
			const { id } = await res.json();
			window.location.href = `/view/${encodeURIComponent(id)}`;
		} else {
			const data = await res.json().catch(() => ({ error: 'Something went wrong' }));
			setStatus(data.error);
		}
	};

	return (
		<div className="notebook">
			<div className="nb-header">
				<h1>Death Note</h1>
				<a href="/">← back</a>
			</div>

			<div className="rules">
				<p>I. The human whose name is written here shall die.</p>
				<p>II. Without a specified cause, death will be by Heart Attack.</p>
				<p>III. Details must follow within 6 minutes and 40 seconds.</p>
				<p>IV. The cause and circumstances must be physically possible.</p>
			</div>

			<div className="field">
				<label>Name</label>
				<input type="text" value={name} onChange={(e) => setName(e.target.value)}
					placeholder="letters, digits, _ and - (max 64)" autoComplete="off" />
			</div>
			<div className="field">
				<label>Cause of death</label>
				<input type="text" value={cause} onChange={(e) => setCause(e.target.value)} />
			</div>
			<div className="field">
				<label>Details (Markdown)</label>
				<MDEditor value={details} onChange={(v) => setDetails(v ?? '')} height={200} />
			</div>

			<button onClick={submit}>Write</button>
			<p id="status">{status}</p>
		</div>
	);
};

export default Write;
