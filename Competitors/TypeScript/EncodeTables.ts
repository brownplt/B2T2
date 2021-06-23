import { Vec } from "./Vec"
export { Vec } from "./Vec"

export type CTop = string
export type NTop = number
export type HTop = Array<string>

export type ElementsOf<H extends HTop> = H[number]

export type STop<H extends HTop> = Record<ElementsOf<H>, unknown>

export type IsIn<H extends HTop> = ElementsOf<H>

export type Concat<
	H1 extends HTop,
	H2 extends HTop,
	S1 extends STop<H1>,
	S2 extends STop<H2>
	> = S1 & S2 & STop<[...H1, ...H2]>
export type AddColumn<
	H extends HTop,
	S extends STop<H>,
	C extends CTop,
	V
	> = S & Record<C, V> & STop<[...H, C]>
export type DropColumn<H extends HTop, S extends STop<H>, C extends IsIn<H>> = Omit<S, C>
export type UpdateColumns<S1, S2> = { [k in keyof S1]: k extends keyof S2 ? S2[k] : S1[k] }

export type Row<H extends HTop, S extends STop<H>> = S

export type Table<H extends HTop, S extends STop<H>, N extends NTop> = {
	header: H,
	rows: Vec<Row<H, S>, N>
}


export type Lookup<H extends HTop, S extends STop<H>, C extends IsIn<H>> = S[C]
export type HeaderOf<A extends { header: Array<string> }> = A['header']
export type SchemaOf<A extends { rows: Array<unknown> }> = A['rows'][number & keyof A['rows']]
export type NRows<A extends { rows: Array<unknown> }> = A['rows']['length']