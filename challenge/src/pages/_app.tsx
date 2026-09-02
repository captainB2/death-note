import '@/styles/globals.css';
import '@uiw/react-md-editor/markdown-editor.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { UnifrakturMaguntia, IM_Fell_English } from 'next/font/google';

const gothic = UnifrakturMaguntia({
	weight: '400',
	subsets: ['latin'],
	variable: '--font-gothic'
});

const serif	 = IM_Fell_English({
	weight: '400',
	style: [ 'normal', 'italic'],
	subsets: [ 'latin' ],
	variable: '--font-serif'
});

const App = ({ Component, pageProps }: AppProps) => (
	<div className={`font-root ${gothic.variable} ${serif.variable}`}>
		<Head>
			<title>Death Note</title>
		</Head>
		<Component {...pageProps} />
	</div>
);

export default App;
