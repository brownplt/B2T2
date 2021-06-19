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
	Test.assertEqual('getValue 1', () => getValue({ 'name': 'Bob', 'age': 12 }, 'name'), "Bob")
	Test.assertEqual('getValue 2', () => getValue({ 'name': 'Bob', 'age': 12 }, "age"), 12)
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
