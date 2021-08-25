export type CTop = string
export type VTop = unknown
// UNORDERRED schema
export type STop = Record<string, unknown>
export type TTop = {
	'header': string[],
	'content': STop[]
}

export type Concat<S1 extends STop, S2 extends STop> = STop & S1 & S2
export type AddColumn<S extends STop, C extends CTop, V extends VTop> = S & Record<C, V>
export type DropColumn<S extends STop, C extends CTop & keyof S> = STop & Omit<S, C>
export type UpdateColumns<S1, S2> = STop & { [k in keyof S1]: k extends keyof S2 ? S2[k] : S1[k] }
export type Lookup<S extends STop, C extends CTop & keyof S> = VTop & S[C]

export type SchemaOf<A extends { content: Array<unknown> }> = A['content'][0]

export type Row<S extends STop> = { header: Array<CTop & keyof S>, content: [S] }
export type Table<S extends STop> = { header: Array<CTop & keyof S>, content: Array<S> }

export const parseTable = (xss: Array<Array<any>>): Table<any> => {
	const header = xss[0];
	const rows = xss.slice(1).map((r) => {
		return Object.fromEntries(header.map((c, j) => {
			return [c, r[j]]
		}))
	});
	return { header, content: rows }
}
export const parseRow = (kvs: Array<[CTop, VTop]>): Row<any> => {
	return {
		header: kvs.map(([k, _]) => k),
		content: [Object.fromEntries(kvs)]
	} as Row<any>
}
