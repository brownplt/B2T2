import { AddColumn, CTop, HeaderOf, HTop, IsIn, Lookup, NTop, Row, SchemaOf, STop, Table } from "./EncodeTables";
import { students, gradebook, studentsMissing } from "./ExampleTables";

let emptyTable: Table<[], {}, 0> = { header: [], rows: [] };
// constraints
() => {
	// - [x] `schema(t)` is equal to `[]`
	// - [x] `nrows(t)` is equal to `0`
	const test1: 0 = nrows(emptyTable)
	return
}

let header: <H extends HTop, S extends STop<H>, N extends NTop>(t: Table<H, S, N>) => H
// constraints
() => {
	// - [x] `cs` is equal to `header(t)`
	const test1: ['name', 'age', 'favorite color'] = header(students)  // accepted as expected
	const test2: ['age', 'name', 'favorite color'] = header(students)  // rejected as expected
	const test3: ['Name', 'Age', 'Favorite Color'] = header(students)  // rejected as expected
}
// examples
{
	const o1 = header(students)
	const o2 = header(gradebook)
}

let nrows: <H extends HTop, S extends STop<H>, N extends NTop>(t: Table<H, S, N>) => N
// constraints
() => {
	// - [x] `n` is equal to `nrows(t)`
	const test1: 3 = nrows(students)
}
// examples
{
	const o1: 0 = nrows(emptyTable)
	const o2: 3 = nrows(studentsMissing)
}

let getValue: <H extends HTop, S extends STop<H>, C extends IsIn<H>>(r: Row<H, S>, c: C) => Lookup<H, S, C>
// constraints
() => {
	// - [ ] `c` is in header(r)
	const test1 = getValue({ 'name': 'Bob', 'age': 12 }, 'Name')  // accepted, but should be rejected. I am not sure why IsIn<H> didn't work.
	const test2 = getValue<['name', 'age'], { 'name': string, 'age': number }, 'Name'>({ 'name': 'Bob', 'age': 12 }, 'Name')  // rejected as expected
	// - [x] `v` is of sort `schema(r)[c]`
	const test3 = getValue({ 'name': 'Bob', 'age': 12 }, 'name').charAt  // accepted as expected
	const test4 = getValue({ 'name': 'Bob', 'age': 12 }, 'age').charAt   // rejected as expected
}
// examples
{
	const o1 = getValue({ 'name': 'Bob', 'age': 12 }, 'name')
	const o2 = getValue({ 'name': 'Bob', 'age': 12 }, 'age')
}

let buildColumn: <H extends HTop, S extends STop<H>, N extends NTop, C extends CTop, V>
	(t1: Table<H, S, N>, c: C, f: (r: Row<H, S>) => V)
	=> Table<[...H, C], AddColumn<H, S, C, V>, N>
// constraints
() => {
	// - [ ] `c` is not in `header(t1)`
	// It is unclear to me how to specify that C is *not* in H.
	// Note: hopefully TS will integrate negation type in the near future. https://github.com/microsoft/TypeScript/pull/29317
	// - [ ] `schema(r)` is equal to `schema(t1)`
	const test2 = buildColumn(students, 'full name', (r) => r['name'] + ' Smith')  // accepted as expected
	const test3 = buildColumn(students, 'full name', (r) => r['Name'] + ' Smith')  // accepted but should be rejected.
	// - [x] `header(t2)` is equal to `concat(header(t1), [c])`
	const test4 = header(buildColumn(students, 'full name', (r) => r['name'] + ' Smith'))  // accepted as expected
	// - [x] for all `c'` in `header(t1)`, `schema(t2)[c']` is equal to `schema(t1)[c']`
	const test5 = buildColumn(students, 'full name', (r) => r['name'] + ' Smith')  // accepted as expected. Read the inferred type of test5 to confirm.
	// - [x] `schema(t2)[c]` is equal to the sort of `v`
	const test6 = buildColumn(students, 'name length', (r) => r['name'].length)  // accepted as expected. Read the inferred type of test5 to confirm.
	// - [x] `nrows(t2)` is equal to `nrows(t1)`
	const test7 = nrows(buildColumn(students, 'full name', (r) => r['name'] + ' Smith'))  // accepted as expected
}
// examples
{
	const isTeenagerBuilder = (r: Row<HeaderOf<typeof students>, SchemaOf<typeof students>>) => {
		return 12 < getValue(r, 'age') && getValue(r, 'age') < 20
	}
	const o1 = buildColumn(students, 'is-teenager', isTeenagerBuilder)
	const didWellInFinal = (r: Row<HeaderOf<typeof gradebook>, SchemaOf<typeof gradebook>>) => {
		return 85 <= getValue(r, 'final')
	}
	const o2 = buildColumn(gradebook, 'did-well-in-final', didWellInFinal)
}

