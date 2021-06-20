import { AddColumn, CTop, FixedArray, HeaderOf, HTop, IsIn, Lookup, NTop, Row, SchemaOf, STop, Table } from "./EncodeTables";
import { students, gradebook, studentsMissing } from "./ExampleTables";
import { makeTester } from './unitTest'

const Test = makeTester()

let emptyTable: Table<[], {}, 0> = { header: [], rows: [] };
// constraints
() => {
	// - [x] `schema(t)` is equal to `[]`
	// - [x] `nrows(t)` is equal to `0`
	const test1: 0 = nrows(emptyTable)
}

// Inexpressible because integer addition is not availabe at type level.
// let addRows: <H extends HTop, S extends STop<H>, N extends NTop>(t: Table<H, S, N>) => Table<H, S, N + 1>

let addColumn: <H extends HTop, S extends STop<H>, N extends NTop, C extends CTop, V>
	(t1: Table<H, S, N>, c: C, vs: FixedArray<V, N>)
	=> Table<[...H, C], AddColumn<H, S, C, V>, N>
addColumn = (t1, c, vs) => {
	// TypeScript doesn't understand that t1.rows is an array.

	// return {
	// 	header: [...t1.header, c],
	// 	rows: t1.rows.map((r, i) => Object.assign({ [c]: vs[i] }, r))
	// }
	throw 'addColumn cannot be defined.'
}
// constraints
// - [x] `c` is not in `header(t1)`
// - [x] `length(vs)` is equal to `nrows(t1)`
// - [x] `header(t2)` is equal to `concat(header(t1), [c])`
// - [x] for all `c'` in `header(t1)`, `schema(t2)[c']` is equal to `schema(t1)[c']`
// - [x] `schema(t2)[c]` is the sort of elements of `vs`
// - [x] `nrows(t2)` is equal to `nrows(t1)`
// examples
{
	const hairColor: FixedArray<string, 3> = ["brown", "red", "blonde"]
	Test.assertEqual(
		'addColumn 1',
		() => addColumn(students, "hair-color", hairColor),
		{
			header: ['name', 'age', 'favorite color', 'hair-color'],
			rows: [
				{
					'name': 'Bob',
					'age': 12,
					'favorite color': 'blue',
					'hair-color': 'brown'
				},
				{
					'name': 'Alice',
					'age': 17,
					'favorite color': 'green',
					'hair-color': 'red'
				},
				{
					'name': 'Eve',
					'age': 13,
					'favorite color': 'red',
					'hair-color': 'blonde'
				}
			]
		}
	)
	const presentation: FixedArray<number, 3> = [9, 9, 6]
	Test.assertEqual(
		'addColumn 2',
		() => addColumn(gradebook, "presentation", presentation),
		{
			'header': [
				'name',
				'age',
				'quiz1',
				'quiz2',
				'midterm',
				'quiz3',
				'quiz4',
				'final',
				'presentation'
			],
			'rows': [

				{
					'name': "Bob",
					'age': 12,
					'quiz1': 8,
					'quiz2': 9,
					'midterm': 77,
					'quiz3': 7,
					'quiz4': 9,
					'final': 87,
					'presentation': 9
				},
				{
					'name': "Alice",
					'age': 17,
					'quiz1': 6,
					'quiz2': 8,
					'midterm': 88,
					'quiz3': 8,
					'quiz4': 7,
					'final': 85,
					'presentation': 9
				},
				{
					'name': "Eve",
					'age': 13,
					'quiz1': 7,
					'quiz2': 9,
					'midterm': 84,
					'quiz3': 8,
					'quiz4': 8,
					'final': 77,
					'presentation': 6
				}
			]
		}
	)
}

let header: <H extends HTop, S extends STop<H>, N extends NTop>(t: Table<H, S, N>) => H
header = (t) => {
	return t.header;
}
// constraints
() => {
	// - [x] `cs` is equal to `header(t)`

	// accepted as expected
	const test1: ['name', 'age', 'favorite color'] = header(students)

	// rejected as expected
	// const test2: ['age', 'name', 'favorite color'] = header(students)

	// rejected as expected
	// const test3: ['Name', 'Age', 'Favorite Color'] = header(students)
}
// examples
Test.assertEqual(
	'header 1',
	() => header(students),
	["name", "age", "favorite color"]);
Test.assertEqual(
	'header 2',
	() => header(gradebook),
	["name", "age", "quiz1", "quiz2", "midterm", "quiz3", "quiz4", "final"]);

let nrows: <H extends HTop, S extends STop<H>, N extends NTop>(t: Table<H, S, N>) => N
nrows = (t) => {
	// rejected unexpectedly. 
	// return t.rows.length;

	throw 'nrows cannot be defined.'
}

// constraints
() => {
	// - [x] `n` is equal to `nrows(t)`
	const test1: 3 = nrows(students)
}
// examples
Test.assertEqual('nrows 1', () => nrows(emptyTable), 0)
Test.assertEqual('nrows 2', () => nrows(studentsMissing), 3)





let getValue: <H extends HTop, S extends STop<H>, C extends IsIn<H>>(r: Row<H, S>, c: C) => Lookup<H, S, C>
getValue = (r, c) => {
	return r[c]
}
// constraints
() => {
	// - [ ] `c` is in header(r)

	// accepted, but should be rejected. I am not sure why IsIn<H> didn't work.
	const test1 = getValue({ 'name': 'Bob', 'age': 12 }, 'Name')

	// rejected as expected
	// const test2 = getValue<['name', 'age'], { 'name': string, 'age': number }, 'Name'>({ 'name': 'Bob', 'age': 12 }, 'Name')  



	// - [x] `v` is of sort `schema(r)[c]`

	// accepted as expected
	const test3 = getValue({ 'name': 'Bob', 'age': 12 }, 'name').charAt

	// rejected as expected
	// const test4 = getValue({ 'name': 'Bob', 'age': 12 }, 'age').charAt
}
// examples
Test.assertEqual('getValue 1', () => getValue({ 'name': 'Bob', 'age': 12 }, 'name'), "Bob")
Test.assertEqual('getValue 2', () => getValue({ 'name': 'Bob', 'age': 12 }, "age"), 12)

let buildColumn: <H extends HTop, S extends STop<H>, N extends NTop, C extends CTop, V>
	(t1: Table<H, S, N>, c: C, f: (r: Row<H, S>) => V)
	=> Table<[...H, C], AddColumn<H, S, C, V>, N>
buildColumn = (t1, c, f) => {
	// TypeScript doesn't understand that t1.rows is an array.

	// return {
	// 	header: [...header(t1), c],
	// 	rows: t1.rows.map((r) => f(r))
	// }
	throw 'buildColumn cannot be defined.'
}

// constraints
() => {
	// - [ ] `c` is not in `header(t1)`

	// It is unclear to me how to specify that C is *not* in H.
	// Note: hopefully TS will integrate negation type in the near future. https://github.com/microsoft/TypeScript/pull/29317



	// - [x] `schema(r)` is equal to `schema(t1)`
	// accepted as expected
	const test2 = buildColumn(students, 'full name', (r) => r['name'] + ' Smith')

	// rejected as expected
	// const test3 = buildColumn(students, 'full name', (r) => r['Name'] + ' Smith')



	// - [x] `header(t2)` is equal to `concat(header(t1), [c])`

	// accepted as expected
	const test4 = header(buildColumn(students, 'full name', (r) => r['name'] + ' Smith'))



	// - [x] for all `c'` in `header(t1)`, `schema(t2)[c']` is equal to `schema(t1)[c']`
	// - [x] `schema(t2)[c]` is equal to the sort of `v`
	// accepted as expected
	const test5
		: Table<
			["name", "age", "favorite color", "full name"],
			{
				name: string;
				age: number;
				'favorite color': string;
				'full name': string
			},
			3>
		= buildColumn(students, 'full name', (r) => r['name'] + ' Smith')



	// - [x] `nrows(t2)` is equal to `nrows(t1)`

	// accepted as expected
	const test6 = nrows(buildColumn(students, 'full name', (r) => r['name'] + ' Smith'))
}
// examples
{
	const isTeenagerBuilder = (r: Row<HeaderOf<typeof students>, SchemaOf<typeof students>>) => {
		return 12 < getValue(r, 'age') && getValue(r, 'age') < 20
	}
	Test.assertEqual(
		'buildColumn 1',
		() => buildColumn(students, 'is-teenager', isTeenagerBuilder),
		{
			header: ['name', 'age', 'favorite color', 'is-teenager'],
			rows: [
				{
					'name': 'Bob',
					'age': 12,
					'favorite color': 'blue',
					'is-teenager': false
				},
				{
					'name': 'Alice',
					'age': 17,
					'favorite color': 'green',
					'is-teenager': true
				},
				{
					'name': 'Eve',
					'age': 13,
					'favorite color': 'red',
					'is-teenager': true
				}
			]
		})
	const didWellInFinal = (r: Row<HeaderOf<typeof gradebook>, SchemaOf<typeof gradebook>>) => {
		return 85 <= getValue(r, 'final')
	}
	Test.assertEqual(
		'buildColumn 2',
		() => buildColumn(gradebook, 'did-well-in-final', didWellInFinal),
		{
			'header': ['name', 'age', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final'],
			'rows': [

				{
					'name': "Bob",
					'age': 12,
					'quiz1': 8,
					'quiz2': 9,
					'midterm': 77,
					'quiz3': 7,
					'quiz4': 9,
					'final': 87,
					'did-well-in-final': true
				},
				{
					'name': "Alice",
					'age': 17,
					'quiz1': 6,
					'quiz2': 8,
					'midterm': 88,
					'quiz3': 8,
					'quiz4': 7,
					'final': 85,
					'did-well-in-final': true
				},
				{
					'name': "Eve",
					'age': 13,
					'quiz1': 7,
					'quiz2': 9,
					'midterm': 84,
					'quiz3': 8,
					'quiz4': 8,
					'final': 77,
					'did-well-in-final': false
				}
			]
		}
	)
}

Test.go()