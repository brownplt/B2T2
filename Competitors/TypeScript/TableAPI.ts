import { AddColumn, CTop, Lookup, parseRow, Row, SchemaOf, STop, Table, UpdateColumns, VTop } from "./EncodeTables";
import { students, gradebook, studentsMissing } from "./ExampleTables";
import { makeTester } from './unitTest'

const T = makeTester()

let emptyTable: Table<{}> = { header: [], rows: [] };
// constraints
() => {
	// - [x] `schema(t)` is equal to `{}`
	// - [ ] `nrows(t)` is equal to `0`
}

let addColumn = <S extends STop, C extends CTop, V extends VTop>(t1: Table<S>, c: C, vs: Array<V>): Table<AddColumn<S, C, V>> => {
	return {
		header: [...t1.header, c],
		rows: t1.rows.map((r, i) => {
			return Object.assign({ [c as C]: vs[i] }, r) as AddColumn<S, C, V>;
		})
	}
}
// constraints
() => {
	// - [ ] `c` is not in `header(t1)`
	// - [ ] `length(vs)` is equal to `nrows(t1)`
	// - [x] `header(t2)` is equal to `concat(header(t1), [c])`
	// - [x] for all `c'` in `header(t1)`, `schema(t2)[c']` is equal to `schema(t1)[c']`
	// - [x] `schema(t2)[c]` is the sort of elements of `vs`
	// - [ ] `nrows(t2)` is equal to `nrows(t1)`
}
// examples
{
	const hairColor = ["brown", "red", "blonde"]
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
	const presentation: Array<number> = [9, 9, 6]
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

let header = <S extends STop>(t: Table<S>): Array<keyof S> => {
	return t.header;
}
// constraints
() => {
	// - [ ] `cs` is equal to `header(t)`
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

let nrows = <S extends STop>(t: Table<S>): number => {
	return t.rows.length;
}
// constraints
() => {
	// - [ ] `n` is equal to `nrows(t)`
}
// examples
{
	T.assertEqual('nrows 1', () => nrows(emptyTable), 0)
	T.assertEqual('nrows 2', () => nrows(studentsMissing), 3)
}

let getValue = <S extends STop, C extends CTop & keyof S>(r: Row<S>, c: C): Lookup<S, C> => {
	return r.content[c]
}
// constraints
() => {
	// - [x] `c` is in header(r)
	// - [x] `v` is of sort `schema(r)[c]`
}
// examples
{
	T.assertEqual(
		'getValue 1',
		() => getValue(
			parseRow([['name', 'Bob'], ['age', 12]]) as Row<{ 'name': string, 'age': 12 }>,
			'name'),
		'Bob')
	T.assertEqual(
		'getValue 2',
		() => getValue(
			parseRow([['name', 'Bob'], ['age', 12]]) as Row<{ 'name': string, 'age': 12 }>,
			'age'),
		12)
}

let buildColumn = <S extends STop, C extends CTop, V extends VTop>(t1: Table<S>, c: C, f: (r: Row<S>) => V): Table<AddColumn<S, C, V>> => {
	return addColumn(t1, c, t1.rows.map((r) => f({ header: t1.header, content: r })))
}
// constraints
() => {
	// - [ ] `c` is not in `header(t1)`
	// - [x] `schema(r)` is equal to `schema(t1)`
	// - [ ] `header(t2)` is equal to `concat(header(t1), [c])`
	// - [x] for all `c'` in `header(t1)`, `schema(t2)[c']` is equal to `schema(t1)[c']`
	// - [x] `schema(t2)[c]` is equal to the sort of `v`
	// - [x] `nrows(t2)` is equal to `nrows(t1)`
}
// examples
{
	const isTeenagerBuilder = (r: Row<SchemaOf<typeof students>>) => {
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
	const didWellInFinal = (r: Row<SchemaOf<typeof gradebook>>) => {
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


const vcat = <S extends STop>(t1: Table<S>, t2: Table<S>): Table<S> => {
	return {
		header: t1.header,
		rows: t1.rows.concat(t2.rows.map((r) => {
			return Object.fromEntries(t1.header.map((c) => {
				return [c, r[c]]
			})) as S
		}))
	}
}
// constraints
() => {
	// - [ ] `schema(t1)` is equal to `schema(t2)`
	// - [x] `schema(t3)` is equal to `schema(t1)`
	// - [ ] `nrows(t3)` is equal to `nrows(t1) + nrows(t2)`
}
// examples
{
	const increaseAge = (r: Row<SchemaOf<typeof students>>) => {
		return parseRow([['age', getValue(r, 'age') + 1]])
	}
	T.assertEqual(
		'vcat 1',
		() => {
			const o: Table<
				{
					name: string,
					age: number,
					'favorite color': string,
				}
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
	const curveMidtermAndFinal = (r: Row<SchemaOf<typeof gradebook>>) => {
		const curve = (n: number) => n + 5
		return parseRow([
			['midterm', curve(getValue(r, 'midterm'))],
			['final', curve(getValue(r, 'final'))],
		])
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

let update = <S1 extends STop, S2 extends Partial<STop>>(t1: Table<S1>, f: (r1: Row<S1>) => Row<S2>): Table<UpdateColumns<S1, S2>> => {
	return {
		header: t1.header,
		rows: t1.rows.map((r) => {
			return Object.assign({}, r, f({ header: t1.header, content: r }).content) as UpdateColumns<S1, S2>
		})
	}
}
// constraints
() => {
	// - [x] for all `c` in `header(r2)`, `c` is in `header(t1)`
	// - [x] `schema(r1)` is equal to `schema(t1)`
	// - [x] `header(t2)` is equal to `header(t1)`
	// - [x] for all `c` in `header(t2)`
	//   - if `c` in `header(r2)` then `schema(t2)[c]` is equal to `schema(r2)[c]`
	//   - otherwise, `schema(t2)[c]` is equal to `schema(t1)[c]`
	// - [x] `nrows(t2)` is equal to `nrows(t1)`
}
// examples
{
	const abstractAge = (r: Row<SchemaOf<typeof students>>) => {
		if (getValue(r, 'age') <= 12) {
			return parseRow([['age', 'kid']])
		} else if (getValue(r, 'age') <= 19) {
			return parseRow([['age', 'teenager']])
		} else {
			return parseRow([['age', 'adult']])
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
	const abstractFinal = (r: Row<SchemaOf<typeof gradebook>>) => {
		return parseRow([
			['midterm', 85 <= getValue(r, 'midterm')],
			['final', 85 <= getValue(r, 'final')]
		])
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


let hcat = <S1 extends STop, S2 extends STop>(t1: Table<S1>, t2: Table<S2>): Table<S1 & S2> => {
	return {
		header: [...t1.header, ...t2.header],
		rows: t1.rows.map((r1, i) => {
			return Object.assign({}, r1, t2.rows[i]) as S1 & S2
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
				'favorite color',
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
					'favorite color': 'blue',
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
					'favorite color': 'green',
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
					'favorite color': 'red',
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
		() => hcat(dropColumns(students, ['name', 'age']), gradebook),
		{
			'header': [
				'favorite color',
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
					'favorite color': 'blue',
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
					'favorite color': 'green',
					'name': "Alice",
					'age': 17, 'quiz1': 6,
					'quiz2': 8,
					'midterm': 88,
					'quiz3': 8,
					'quiz4': 7,
					'final': 85
				},
				{
					'favorite color': 'red',
					'name': "Eve",
					'age': 13, 'quiz1': 7,
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


let dropColumns = <S extends STop>(t1: Table<S>, cs: Array<keyof S>): Table<Omit<S, (typeof cs)[number]>> => {
	const header = t1.header.filter((c) => {
		return cs.indexOf(c) === -1;
	}) as Array<keyof Omit<S, (typeof cs)[number]>>
	const rows = t1.rows.map((r) => {
		return Object.fromEntries(header.map((c) => [c, r[c]])) as Omit<S, (typeof cs)[number]>
	})
	return { header, rows }
}


T.go()
