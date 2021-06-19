// BEGIN FixedArray [cite https://stackoverflow.com/questions/41139763/how-to-declare-a-fixed-length-array-in-typescript]
type Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends ((...a: infer X) => void) ? X : never;
type GrowToSize<T, A extends Array<T>, N extends number> = { 0: A, 1: GrowToSize<T, Grow<T, A>, N> }[A['length'] extends N ? 0 : 1];
export type FixedArray<T, N extends number> = GrowToSize<T, [], N>;
// END FixedArray

export type CTop = string
export type NTop = number
export type HTop = Array<string>
export type STop<H extends HTop> = Record<string & H[keyof H], unknown>

export type IsIn<H extends HTop> = H[keyof H & number]

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

export type Row<H extends HTop, S extends STop<H>> = S
export type Table<H extends HTop, S extends STop<H>, N extends NTop> = {
	header: H,
	rows: FixedArray<Row<H, S>, N>
}


export type Lookup<H extends HTop, S extends STop<H>, C extends IsIn<H>> = S[C]
export type HeaderOf<A extends { header: Array<string> }> = A['header']
export type SchemaOf<A extends { rows: Array<unknown> }> = A['rows'][number & keyof A['rows']]
export type NRows<A extends { rows: Array<unknown> }> = A['rows']['length']