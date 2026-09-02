import http from 'node:http';
import puppeteer from 'puppeteer';
import { readFileSync } from 'node:fs';

const WEB_URL = process.env.WEB_URL || 'http://web:3000';
const FIREFOX_BIN = process.env.FIREFOX_BIN || '/usr/bin/firefox-esr';
const FLAG = readFileSync(new URL('./flag.txt', import.meta.url), 'utf8').trim();
const PORT = Number(process.env.PORT || 8080);

const visit = async (url) => {
	const browser = await puppeteer.launch({
		headless: true,
		browser: 'firefox',
		executablePath: FIREFOX_BIN,
		args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
		dumpio: true,
	});
	
	try {
		const ctx = await browser.createBrowserContext();

		const page = await ctx.newPage();
	
		await page.evaluateOnNewDocument(() => {
			document.addEventListener('securitypolicyviolation', (e) => {
				console.error(
					`[CSP VIOLATION] 
					Blocked URI: ${e.blockedURI}
					Violated Directive: ${e.violatedDirective}
					Effective Directive: ${e.effectiveDirective}
					Disposition: ${e.disposition}
					Line Number: ${e.lineNumber}`
				);
			});
		});
		
		// Catch console.log, console.error, etc., from inside the browser
		page.on('console', (msg) => {
			console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
		});

		// Catch unhandled exceptions inside the page
		page.on('pageerror', (err) => {
			console.error('[BROWSER ERROR] Uncaught exception:', err.message);
		});

		// Catch failed network requests (e.g., if a CSP blocks a script or fetch)
		page.on('requestfailed', (request) => {
			console.error(`[NETWORK FAILED] ${request.url()} - ${request.failure()?.errorText}`);
		});
	
		page.on('framenavigated', frame => {
			console.log(`[NAVIGATED] Frame routed to: ${frame.url()}`);
		});

		page.on('request', request => {
			if (request.isNavigationRequest()) {
				console.log(`[NAVIGATION REQUEST] Attempting to go to: ${request.url()}`);
			}
		});
		
		await page.goto(WEB_URL, { waitUntil: 'domcontentloaded', timeout: 3000 });
		await page.evaluate((flag) => {
			localStorage.setItem('flag', flag);
		}, FLAG);

		console.log('visiting', url);
		await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 6000 });
		await new Promise((resolve) => setTimeout(resolve, 6000));
		console.log('done', url);
	} finally {
		await browser.close().catch(() => { });
	}
};

const server = http.createServer(async (req, res) => {
	const url = new URL(req.url, 'http://bot');
	const json = (code, body) => {
		res.writeHead(code, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(body));
	};

	if (req.method !== 'GET' || url.pathname !== '/visit') {
		return json(404, { error: 'Not found' });
	}

	const toVisit = url.searchParams.get('url');

	if (!/^https?:\/\//.test(toVisit)) {
		return json(400, { error: 'Invalid url' });
	}

	try {
		await visit(toVisit);
		return json(200, { ok: true });
	} catch {
		return json(500, { error: 'Internal server error' });
	}
});

server.listen(PORT, () => {
	console.log(`bot on :${PORT} (internal)`);
});
