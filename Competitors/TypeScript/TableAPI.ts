import { AddColumn, ColNameTop, Row, SchemaTop, Table, ValueTop } from "./EncodeTables";
import { students, gradebook } from "./ExampleTables";

type IsInHeader<S extends SchemaTop> = keyof S;
type Lookup<S extends SchemaTop, C extends IsInHeader<S>> = S[C]
type SchemaOf<A extends { 'rows': Array<any> }> = A['rows'][0]

let getValue: <S extends SchemaTop, C extends IsInHeader<S>>(r: Row<S>, c: C) => Lookup<S, C>
// use getValue
{
	const o1 = getValue({ 'name': 'Bob', 'age': 12 }, 'name')
	const o2 = getValue({ 'name': 'Bob', 'age': 12 }, 'age')
}

let buildColumn: <S extends SchemaTop, V extends ValueTop, C extends ColNameTop>(
	t1: Table<S>,
	c: C,
	f: (r: Row<S>) => V
) =>
	Table<AddColumn<S, C, V>>
// use buildColumn
{
	const isTeenagerBuilder = (r: Row<SchemaOf<typeof students>>) => {
		return 12 < getValue(r, 'age') && getValue(r, 'age') < 20
	}
	const o1 = buildColumn(students, 'is-teenager', isTeenagerBuilder)
	const didWellInFinal = (r: Row<SchemaOf<typeof gradebook>>) => {
		return 85 <= getValue(r, 'final')
	}
	const o2 = buildColumn(gradebook, 'did-well-in-final', didWellInFinal)
}

