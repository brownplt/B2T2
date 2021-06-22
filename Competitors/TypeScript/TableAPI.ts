import { AddColumn, CTop, Vec, HeaderOf, HTop, IsIn, Lookup, NTop, Row, SchemaOf, STop, Table } from "./EncodeTables";
import { students, gradebook, studentsMissing } from "./ExampleTables";
import { makeTester } from './unitTest'
import * as VecLib from './Vec'

const Test = makeTester()

let emptyTable: Table<[], {}, 0> = { header: [], rows: [] as Vec<{}, 0> };
// constraints
() => {
	// - [x] `schema(t)` is equal to `[]`
	// - [x] `nrows(t)` is equal to `0`
	const test1: 0 = nrows(emptyTable)
}

let addColumn = <H extends HTop, S extends STop<H>, N extends NTop, C extends CTop, V>(t1: Table<H, S, N>, c: C, vs: Vec<V, N>): Table<[...H, C], AddColumn<H, S, C, V>, N> => {
	return {
		header: [...t1.header, c],
		rows: VecLib.map(t1.rows, (r, i) => {
			const newR: Row<[...H, C], AddColumn<H, S, C, V>> = Object.assign({ [c as C]: vs[i] }, r) as Row<[...H, C], AddColumn<H, S, C, V>>
			return newR
		})
	}
}
// constraints
() => {
	// - [ ] `c` is not in `header(t1)`
	// It is unclear to me how to achieve this.

	// - [x] `length(vs)` is equal to `nrows(t1)`
	// rejected as expected
	// const test1 = addColumn(students, 'new', [])

	// - [x] `header(t2)` is equal to `concat(header(t1), [c])`
	// accepted as expected
	const h: ["name", "age", "favorite color", "id"] = header(addColumn(students, 'id', [1, 2, 3] as Vec<number, 3>))

	// - [x] for all `c'` in `header(t1)`, `schema(t2)[c']` is equal to `schema(t1)[c']`
	// See the examples to verify.

	// - [x] `schema(t2)[c]` is the sort of elements of `vs`
	// See the examples to verify.

	// - [x] `nrows(t2)` is equal to `nrows(t1)`
	const n: 3 = nrows(addColumn(students, 'id', [1, 2, 3] as Vec<number, 3>))
}
// examples
{
	const hairColor: Vec<string, 3> = ["brown", "red", "blonde"]
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
	const presentation: Vec<number, 3> = [9, 9, 6]
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

let nrows = <H extends HTop, S extends STop<H>, N extends NTop>(t: Table<H, S, N>): N => {
	return t.rows.length;
}

// constraints
() => {
	// - [x] `n` is equal to `nrows(t)`
	const test1: 3 = nrows(students)
}
// examples
{
	Test.assertEqual('nrows 1', () => nrows(emptyTable), 0)
	Test.assertEqual('nrows 2', () => nrows(studentsMissing), 3)
}

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
{
	Test.assertEqual('getValue 1', () => getValue({ 'name': 'Bob', 'age': 12 }, 'name'), "Bob")
	Test.assertEqual('getValue 2', () => getValue({ 'name': 'Bob', 'age': 12 }, "age"), 12)
}

let buildColumn = <H extends HTop, S extends STop<H>, N extends NTop, C extends CTop, V>(t1: Table<H, S, N>, c: C, f: (r: Row<H, S>) => V): Table<[...H, C], AddColumn<H, S, C, V>, N> => {
	return addColumn(t1, c, VecLib.map(t1.rows, f))
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
			'header': ['name', 'age', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final', 'did-well-in-final'],
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


const vcat = <H extends HTop, S extends STop<H>, N1 extends NTop, N2 extends NTop>(t1: Table<H, S, N1>, t2: Table<H, S, N2>): Table<H, S, number> => {
	return {
		header: t1.header,
		rows: VecLib.concat(t1.rows, t2.rows)
	}
}
// constraints
() => {
	// - [x] `schema(t1)` is equal to `schema(t2)`
	// - [x] `schema(t3)` is equal to `schema(t1)`
	// See the examples to confirm

	// - [ ] `nrows(t3)` is equal to `nrows(t1) + nrows(t2)`
	// It is difficult to specify the sum of two numbers at type-level. See Vec.ts concat for a failed attempt.
}
// examples
{
	// TODO Fixed the type of update, otherwise these examples won't typecheck.
	const increaseAge = (r: Row<HeaderOf<typeof students>, SchemaOf<typeof students>>) => {
		return { 'age': getValue(r, 'age') + 1 }
	}
	Test.assertEqual(
		'vcat 1',
		() => vcat(students, update(students, increaseAge)),
		{
			header: ['name', 'age', 'favorite color'],
			rows: [
				{
					'name': 'Bob',
					'age': 12,
					'favorite color': 'blue'
				},
				{
					'name': 'Alice',
					'age': 17,
					'favorite color': 'green'
				},
				{
					'name': 'Eve',
					'age': 13,
					'favorite color': 'red'
				},
				{
					'name': 'Bob',
					'age': 13,
					'favorite color': 'blue'
				},
				{
					'name': 'Alice',
					'age': 18,
					'favorite color': 'green'
				},
				{
					'name': 'Eve',
					'age': 14,
					'favorite color': 'red'
				}
			]
		}
	)
	const curveMidtermAndFinal = (r: Row<HeaderOf<typeof gradebook>, SchemaOf<typeof gradebook>>) => {
		const curve = (n: number) => n + 5
		return {
			'midterm': curve(getValue(r, 'midterm')),
			'final': curve(getValue(r, 'final'))
		}
	}
	Test.assertEqual(
		'vcat 2',
		() => vcat(gradebook, update(gradebook, curveMidtermAndFinal)),
		{
			'header': [
				'name',
				'age',
				'quiz1',
				'quiz2',
				'midterm',
				'quiz3',
				'quiz4',
				'final'
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
					'final': 87
				},
				{
					'name': "Alice",
					'age': 17,
					'quiz1': 6,
					'quiz2': 8,
					'midterm': 88,
					'quiz3': 8,
					'quiz4': 7,
					'final': 85
				},
				{
					'name': "Eve",
					'age': 13,
					'quiz1': 7,
					'quiz2': 9,
					'midterm': 84,
					'quiz3': 8,
					'quiz4': 8,
					'final': 77
				},
				{
					'name': "Bob",
					'age': 12,
					'quiz1': 8,
					'quiz2': 9,
					'midterm': 77,
					'quiz3': 7,
					'quiz4': 9,
					'final': 92
				},
				{
					'name': "Alice",
					'age': 17,
					'quiz1': 6,
					'quiz2': 8,
					'midterm': 88,
					'quiz3': 8,
					'quiz4': 7,
					'final': 90
				},
				{
					'name': "Eve",
					'age': 13,
					'quiz1': 7,
					'quiz2': 9,
					'midterm': 84,
					'quiz3': 8,
					'quiz4': 8,
					'final': 82
				}
			]
		}
	)
}

let update = <H1 extends HTop, H2 extends HTop, S1 extends STop<H1>, S2 extends STop<H2>, N extends NTop>(t1: Table<H1, S1, N>, f: (r: Row<H1, S1>) => Row<H2, S2>): Table<H2, S2, number> => {
	throw '[TODO: update is not implemented yet]'
}
// constraints
// TODO
// examples
// TODO

Test.go()
