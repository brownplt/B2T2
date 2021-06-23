import { AddColumn, CTop, Vec, HeaderOf, HTop, IsIn, Lookup, NTop, Row, SchemaOf, STop, Table, UpdateColumns, ElementsOf } from "./EncodeTables";
import { students, gradebook, studentsMissing } from "./ExampleTables";
import { makeTester } from './unitTest'
import * as VecLib from './Vec'

const T = makeTester()

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
	T.assertEqual(
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
	T.assertEqual(
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
T.assertEqual(
	'header 1',
	() => header(students),
	["name", "age", "favorite color"]);
T.assertEqual(
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
	T.assertEqual('nrows 1', () => nrows(emptyTable), 0)
	T.assertEqual('nrows 2', () => nrows(studentsMissing), 3)
}

let getValue: <H extends HTop, S extends STop<H>, C extends CTop & IsIn<H>>(r: Row<H, S>, c: C & keyof typeof r) => Lookup<H, S, C>
getValue = (r, c) => {
	return r[c]
}
// constraints
() => {
	// - [x] `c` is in header(r)
	// rejected as expected
	// const test1 = getValue({ 'name': 'Bob', 'age': 12 }, 'Name')

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
	T.assertEqual('getValue 1', () => getValue({ 'name': 'Bob', 'age': 12 }, 'name'), "Bob")
	T.assertEqual('getValue 2', () => getValue({ 'name': 'Bob', 'age': 12 }, "age"), 12)
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
	T.assertEqual(
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
	T.assertEqual(
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
		rows: VecLib.concat(t1.rows, t2.rows) as Vec<S, number>
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
	const increaseAge = (r: Row<HeaderOf<typeof students>, SchemaOf<typeof students>>) => {
		return { 'age': getValue(r, 'age') + 1 }
	}
	T.assertEqual(
		'vcat 1',
		() => {
			const o: Table<
				["name", "age", "favorite color"],
				{
					name: string,
					age: number,
					'favorite color': string,
				},
				number
			> = vcat(students, update(students, increaseAge))
			return o;
		},
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
	T.assertEqual(
		'vcat 2',
		// The explicit type application is necessary
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
					'midterm': 82,
					'quiz3': 7,
					'quiz4': 9,
					'final': 92
				},
				{
					'name': "Alice",
					'age': 17,
					'quiz1': 6,
					'quiz2': 8,
					'midterm': 93,
					'quiz3': 8,
					'quiz4': 7,
					'final': 90
				},
				{
					'name': "Eve",
					'age': 13,
					'quiz1': 7,
					'quiz2': 9,
					'midterm': 89,
					'quiz3': 8,
					'quiz4': 8,
					'final': 82
				}
			]
		}
	)
}

let update = <H1 extends HTop, S1 extends STop<H1>, S2 extends Partial<STop<H1>>, N extends NTop>(t1: Table<H1, S1, N>, f: (r1: Row<H1, S1>) => Row<Array<keyof S2 & string>, S2>): Table<H1, UpdateColumns<S1, S2>, N> => {
	return {
		header: t1.header,
		rows: VecLib.map(t1.rows, (r) => {
			return Object.assign({}, r, f(r)) as Row<H1, UpdateColumns<S1, S2>>
		})
	}
}
// constraints
() => {
	// - [x] for all `c` in `header(r2)`, `c` is in `header(t1)`
	// rejected as expected
	// const test1 = update(students, (r) => {
	// 	return { 'Name': getValue(r, 'name') }
	// });

	// - [x] `schema(r1)` is equal to `schema(t1)`
	// See the types in the examples to confirm.

	// - [x] `header(t2)` is equal to `header(t1)`
	// See the types in the examples to confirm.

	// - [x] for all `c` in `header(t2)`
	//   - if `c` in `header(r2)` then `schema(t2)[c]` is equal to `schema(r2)[c]`
	//   - otherwise, `schema(t2)[c]` is equal to `schema(t1)[c]`
	// See the types in the examples to confirm.

	// - [x] `nrows(t2)` is equal to `nrows(t1)`
	// See the types in the examples to confirm.
}
// examples
{
	const abstractAge = (r: Row<HeaderOf<typeof students>, SchemaOf<typeof students>>) => {
		if (getValue(r, 'age') <= 12) {
			return { 'age': 'kid' }
		} else if (getValue(r, 'age') <= 19) {
			return { 'age': 'teenager' }
		} else {
			return { 'age': 'adult' }
		}
	}
	T.assertEqual(
		'update 1',
		() => update(students, abstractAge),
		{
			header: ['name', 'age', 'favorite color'],
			rows: [
				{
					'name': 'Bob',
					'age': 'kid',
					'favorite color': 'blue'
				},
				{
					'name': 'Alice',
					'age': 'teenager',
					'favorite color': 'green'
				},
				{
					'name': 'Eve',
					'age': 'teenager',
					'favorite color': 'red'
				}
			]
		}
	)
	const abstractFinal = (r: Row<HeaderOf<typeof gradebook>, SchemaOf<typeof gradebook>>) => {
		return {
			'midterm': 85 <= getValue(r, 'midterm'),
			'final': 85 <= getValue(r, 'final')
		}
	}
	T.assertEqual(
		'update 2',
		() => update(gradebook, abstractFinal),
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
					'midterm': false,
					'quiz3': 7,
					'quiz4': 9,
					'final': true
				},
				{
					'name': "Alice",
					'age': 17,
					'quiz1': 6,
					'quiz2': 8,
					'midterm': true,
					'quiz3': 8,
					'quiz4': 7,
					'final': true
				},
				{
					'name': "Eve",
					'age': 13,
					'quiz1': 7,
					'quiz2': 9,
					'midterm': false,
					'quiz3': 8,
					'quiz4': 8,
					'final': false
				}
			]
		}
	)
}


let hcat = <H1 extends HTop, H2 extends HTop, S1 extends STop<H1>, S2 extends STop<H2>, N extends NTop>(t1: Table<H1, S1, N>, t2: Table<H2, S2, N>): Table<[...H1, ...H2], S1 & S2, N> => {
	return {
		header: [...t1.header, ...t2.header],
		rows: VecLib.map(t1.rows, (r1, i) => {
			return Object.assign({}, r1, t2.rows[i]) as Row<[...H1, ...H2], S1 & S2>
		})
	}
}
// constraints
() => {
	// - [ ] `concat(header(t1), header(t2))` has no duplicates

	// - [x] `nrows(t1)` is equal to `nrows(t2)`
	// - [x] `schema(t3)` is equal to `concat(schema(t1), schema(t2))`
	// - [x] `nrows(t3)` is equal to `nrows(t1)`
	// See the examples to confirm
}
// examples
{
	T.assertEqual(
		'hcat 1',
		() => hcat(students, dropColumns(gradebook, ['name', 'age'])),
		{
			'header': [
				'name',
				'age',
				'favorite-color',
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
					'favorite-color': 'blue',
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
					'favorite-color': 'green',
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
					'favorite-color': 'red',
					'quiz1': 7,
					'quiz2': 9,
					'midterm': 84,
					'quiz3': 8,
					'quiz4': 8,
					'final': 77
				}
			]
		}
	)
	T.assertEqual(
		'hcat 1',
		() => hcat(students, dropColumns(gradebook, ['name', 'age'])),
		{
			'header': [
				'favorite-color',
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
					'favorite-color': 'blue',
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
					'favorite-color': 'green',
					'name': "Alice",
					'age': 17,	'quiz1': 6,
					'quiz2': 8,
					'midterm': 88,
					'quiz3': 8,
					'quiz4': 7,
					'final': 85
				},
				{
					'favorite-color': 'red',
					'name': "Eve",
					'age': 13,	'quiz1': 7,
					'quiz2': 9,
					'midterm': 84,
					'quiz3': 8,
					'quiz4': 8,
					'final': 77
				}
			]
		}
	)
}

// TODO For all "see the examples", make sure the examples are readable.

// TODO fix this. The type is broken
let dropColumns = <H extends HTop, S extends STop<H>, N extends NTop>(t1: Table<H, S, N>, cs: Array<ElementsOf<H>>): Table<H, S, N> => {
	throw 'TODO'
}




T.go()