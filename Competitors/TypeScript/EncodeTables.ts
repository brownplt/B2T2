export type ColNameTop = string
export type ValueTop = any
export type SchemaTop = Record<ColNameTop, ValueTop>

export type Concat<S1 extends SchemaTop, S2 extends SchemaTop> = S1 & S2
export type AddColumn<S extends SchemaTop, C extends ColNameTop, V extends ValueTop> = Concat<S, Singleton<C, V>>
export type DropColumn<S extends SchemaTop, C extends ColNameTop> = Omit<S, C>

type Singleton<C extends ColNameTop, V extends ValueTop> = Record<C, V>


export type Row<S extends SchemaTop> = S
export type Table<S extends SchemaTop> = {
	header: Array<keyof S>,
	rows: Array<Row<S>>
}

