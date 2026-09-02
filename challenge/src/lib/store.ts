export interface Note {
	id: string;
	cause: string;
	details: string;
	createdBy: string;
}

export interface Session {
	written: string[];
}

// in-memory store for every API route (via globalThis)
//

declare global {
	var __notes: Map<string, Note> | undefined;
	var __sessions: Map<string, Session> | undefined;
}

export const notes = (globalThis.__notes ??= new Map<string, Note>());
export const sessions = (globalThis.__sessions ??= new Map<string, Session>());
