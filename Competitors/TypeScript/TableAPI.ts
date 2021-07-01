import { AddColumn, CTop, Lookup, parseRow, parseTable, Row, SchemaOf, STop, Table, TTop, UpdateColumns, VTop } from "./EncodeTables";
import { students, gradebook, studentsMissing, jellyAnon, employees, departments } from "./ExampleTables";
import { makeTester } from './unitTest'
import { average, ge, le } from './helpers'

const Tester = makeTester()

let emptyTable: Table<{}> = { header: [] as Array<keyof {}>, content: [] };
// constraints
() => {
	// - [x] `schema(t)` is equal to `{}`
	// - [ ] `nrows(t)` is equal to `0`
}

let addColumn = <S extends STop, C extends CTop, V extends VTop>(t1: Table<S>, c: C, vs: Array<V>): Table<AddColumn<S, C, V>> => {
	return {
		header: [...t1.header, c],
		content: t1.content.map((r, i) => {
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
	Tester.assertEqual(
		'addColumn 1',
		() => addColumn(students, "hair-color", hairColor),
		{
			header: ['name', 'age', 'favorite color', 'hair-color'],
			content: [
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
	Tester.assertEqual(
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
			'content': [

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

let buildColumn = <S extends STop, C extends CTop, V extends VTop>(t1: Table<S>, c: C, f: (r: Row<S>) => V): Table<AddColumn<S, C, V>> => {
	return addColumn(t1, c, t1.content.map((r) => f({ header: t1.header, content: [r] })))
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
	Tester.assertEqual(
		'buildColumn 1',
		() => buildColumn(students, 'is-teenager', isTeenagerBuilder),
		{
			header: ['name', 'age', 'favorite color', 'is-teenager'],
			content: [
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
	Tester.assertEqual(
		'buildColumn 2',
		() => buildColumn(gradebook, 'did-well-in-final', didWellInFinal),
		{
			'header': ['name', 'age', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final', 'did-well-in-final'],
			'content': [

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
		content: [...t1.content, ...t2.content]
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
	Tester.assertEqual(
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
		parseTable([
			['name', 'age', 'favorite color'],
			["Bob", 12, "blue"],
			["Alice", 17, "green"],
			["Eve", 13, "red"],
			["Bob", 13, "blue"],
			["Alice", 18, "green"],
			["Eve", 14, "red"],
		])
	)
	const curveMidtermAndFinal = (r: Row<SchemaOf<typeof gradebook>>) => {
		const curve = (n: number) => n + 5
		return parseRow([
			['midterm', curve(getValue(r, 'midterm'))],
			['final', curve(getValue(r, 'final'))],
		])
	}
	Tester.assertEqual(
		'vcat 2',
		// The explicit type application is necessary
		() => vcat(gradebook, update(gradebook, curveMidtermAndFinal)),
		parseTable([
			['name', 'age', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final'],
			["Bob", 12, 8, 9, 77, 7, 9, 87],
			["Alice", 17, 6, 8, 88, 8, 7, 85],
			["Eve", 13, 7, 9, 84, 8, 8, 77],
			["Bob", 12, 8, 9, 82, 7, 9, 92],
			["Alice", 17, 6, 8, 93, 8, 7, 90],
			["Eve", 13, 7, 9, 89, 8, 8, 82],
		])
	)
}

let update = <S1 extends STop, S2 extends Partial<STop>>(t1: Table<S1>, f: (r1: Row<S1>) => Row<S2>): Table<UpdateColumns<S1, S2>> => {
	return {
		header: t1.header,
		content: t1.content.map((r) => {
			return Object.assign({}, r, f({ header: t1.header, content: [r] }).content[0]) as UpdateColumns<S1, S2>
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
	Tester.assertEqual(
		'update 1',
		() => update(students, abstractAge),
		{
			header: ['name', 'age', 'favorite color'],
			content: [
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
	Tester.assertEqual(
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
			'content': [
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
		content: t1.content.map((r1, i) => {
			return Object.assign({}, r1, t2.content[i]) as S1 & S2
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
	Tester.assertEqual(
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
			'content': [
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
	Tester.assertEqual(
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
			'content': [
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


let values = <S extends STop>(rs: Array<Row<S>>): Table<S> => {
	return {
		header: rs[0].header,
		content: rs.map(({ content: [r] }) => r)
	};
}
() => {
	// - [ ] `length(rs)` is positive
	// - [ ] for all `r` in `rs`, `schema(r)` is equal to `schema(rs[0])`
	// - [ ] `schema(t)` is equal to `schema(rs[0])`
	// - [ ] `nrows(t)` is equal to `length(rs)`
}
Tester.assertEqual(
	'values 0',
	() => values([
		parseRow([['name', 'Alice']]),
		parseRow([['name', 'Bob']])
	]),
	parseTable([
		['name'],
		['Alice'],
		['Bob']
	])
)
Tester.assertEqual(
	'values 0',
	() => values([
		parseRow([['name', 'Alice'], ['age', 12]]),
		parseRow([['name', 'Bob'], ['age', 13]])
	]),
	parseTable([
		['name', 'age'],
		['Alice', 12],
		['Bob', 13]
	])
)


let crossJoin = <S1 extends STop, S2 extends STop>(t1: Table<S1>, t2: Table<S2>): Table<S1 & S2> => {
	return {
		header: [...t1.header, ...t2.header],
		content: t1.content.flatMap((r1) => {
			return t2.content.map((r2) => {
				return Object.assign({}, r1, r2)
			})
		})
	}
}
() => {
	// - [ ] `concat(header(t1), header(t2))` has no duplicates
	// - [ ] `schema(t3)` is equal to `concat(schema(t1), schema(t2))`
	// - [ ] `nrows(t3)` is equal to `nrows(t1) * nrows(t2)`
}
{
	Tester.assertEqual(
		'crossJoin 1',
		() => {
			const petiteJelly = selectColumns2(selectRows1(jellyAnon, [0, 1]), [0, 1, 2])
			return crossJoin(students, petiteJelly)
		},
		parseTable([
			['name', 'age', 'favorite color', 'get acne', 'red', 'black'],
			["Bob", 12, "blue", true, false, false],
			["Bob", 12, "blue", true, false, true],
			["Alice", 17, "green", true, false, false],
			["Alice", 17, "green", true, false, true],
			["Eve", 13, "red", true, false, false],
			["Eve", 13, "red", true, false, true]
		])
	)
	Tester.assertEqual(
		'crossJoin 2',
		() => {
			const petiteJelly = selectColumns2(selectRows1(jellyAnon, [0, 1]), [0, 1, 2])
			return crossJoin(emptyTable, petiteJelly)
		},
		parseTable([
			['get acne', 'red', 'black']
		])
	)
}


let leftJoin = <S1 extends STop, S2 extends STop>(t1: Table<S1>, t2: Table<S2>, cs: Array<keyof S1 & keyof S2>): Table<S1 & Omit<S2, keyof S1>> => {
	const header = [...t1.header, ...t2.header.filter((c) => {
		return !cs.includes(c as (keyof S1 & keyof S2))
	})] as Array<keyof (S1 & Omit<S2, keyof S1>)>
	return {
		header,
		content: t1.content.flatMap((r1): Array<S1 & S2> => {
			const rs2 = t2.content.filter((r2) => {
				return cs.every((c) => {
					return r1[c] === r2[c]
				})
			})
			if (rs2.length === 0) {
				return [
					Object.assign(
						Object.fromEntries(header.map((c) => [c, null])) as S1 & S2,
						r1)
				]
			} else {
				return rs2.map((r2) => {
					return Object.assign({}, r1, r2)
				})
			}
		})
	}
}
() => {
	// - [ ] `header(t3)` is equal to `concat(header(t1), removeAll(header(t2), cs))`
	// - [x] for all `c` in `header(t1)`, `schema(t3)[c]` is equal to `schema(t1)[c]`
	// - [ ] for all `c` in `removeAll(header(t2), cs))`, `schema(t3)[c]` is equal to `schema(t2)[c]`
	// - [ ] `nrows(t3)` is equal to `nrows(t1)`

}
{
	Tester.assertEqual(
		'leftJoin 1',
		() => leftJoin(students, gradebook, ["name", "age"]),
		parseTable(
			[
				["name", 'age', 'favorite color', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final'],
				["Bob", 12, "blue", 8, 9, 77, 7, 9, 87],
				["Alice", 17, "green", 6, 8, 88, 8, 7, 85],
				["Eve", 13, "red", 7, 9, 84, 8, 8, 77]
			]
		)
	)
	Tester.assertEqual(
		'leftJoin 2',
		() => leftJoin(employees, departments, ["Department ID"]),
		parseTable([
			['Last Name', 'Department ID', 'Department Name'],
			["Rafferty", 31, "Sales"],
			["Jones", 32, null],
			["Heisenberg", 33, "Engineering"],
			["Robinson", 34, "Clerical"],
			["Smith", 34, "Clerical"],
			["Williams", null, null]
		])
	)
}


let nrows = <S extends STop>(t: Table<S>): number => {
	return t.content.length;
}
// constraints
() => {
	// - [ ] `n` is equal to `nrows(t)`
}
// examples
{
	Tester.assertEqual('nrows 1', () => nrows(emptyTable), 0)
	Tester.assertEqual('nrows 2', () => nrows(studentsMissing), 3)
}



let ncols = <S extends STop>(t: Table<S>): number => {
	return t.header.length;
}
// constraints
() => {
	// - [ ] `n` is equal to `ncols(t)`
}
// examples
{
	Tester.assertEqual('ncols 1', () => ncols(students), 3)
	Tester.assertEqual('ncols 2', () => ncols(studentsMissing), 3)
}




let header = <S extends STop>(t: Table<S>): Array<keyof S> => {
	return t.header;
}
// constraints
() => {
	// - [ ] `cs` is equal to `header(t)`
}
// examples
{
	Tester.assertEqual(
		'header 1',
		() => header(students),
		["name", "age", "favorite color"]);
	Tester.assertEqual(
		'header 2',
		() => header(gradebook),
		["name", "age", "quiz1", "quiz2", "midterm", "quiz3", "quiz4", "final"]);
}


let getRow = <S extends STop>(t: Table<S>, n: number): Row<S> => {
	return {
		header: t.header,
		content: [t.content[n]]
	}
}
// constraints
() => {
	// - [ ] `n` is in `range(nrows(t))`
}
{
	Tester.assertEqual(
		'getRow 1',
		() => getRow(students, 0),
		parseRow([["name", "Bob"], ["age", 12], ["favorite color", "blue"]])
	)
	Tester.assertEqual(
		'getRow 1',
		() => getRow(gradebook, 1),
		parseRow([
			["name", "Alice"], ["age", 17],
			["quiz1", 6], ["quiz2", 8], ["midterm", 88],
			["quiz3", 8], ["quiz4", 7], ["final", 85]
		]))
}

let getValue = <S extends STop, C extends CTop & keyof S>(r: Row<S>, c: C): Lookup<S, C> => {
	return r.content[0][c]
}
// constraints
() => {
	// - [x] `c` is in header(r)
	// - [x] `v` is of sort `schema(r)[c]`
}
// examples
{
	Tester.assertEqual(
		'getValue 1',
		() => getValue(
			parseRow([['name', 'Bob'], ['age', 12]]) as Row<{ 'name': string, 'age': 12 }>,
			'name'),
		'Bob')
	Tester.assertEqual(
		'getValue 2',
		() => getValue(
			parseRow([['name', 'Bob'], ['age', 12]]) as Row<{ 'name': string, 'age': 12 }>,
			'age'),
		12)
}

let getColumn1 = <S extends STop>(t: Table<S>, n: number): Array<VTop> => {
	return t.content.map((r) => r[t.header[n]])
}
() => {
	// - [ ] `n` is in `range(ncols(t))`
	// - [ ] `length(vs)` is equal to `nrows(t)`
	// - [ ] for all `v` in `vs`, `v` is of sort `schema(t)[header(t)[n]]`
}
{
	Tester.assertEqual(
		'getColumn1 1',
		() => getColumn1(students, 1),
		[12, 17, 13]
	)
	Tester.assertEqual(
		'getColumn1 2',
		() => getColumn1(gradebook, 0),
		["Bob", "Alice", "Eve"]
	)
}

let getColumn2 = <S extends STop, C extends keyof S>(t: Table<S>, c: C): Array<S[C]> => {
	return t.content.map((r) => r[c])
}
() => {
	// - [x] `c` is in `header(t)`
	// - [x] for all `v` in `vs`, `v` is of sort `schema(t)[c]`
	// - [ ] `length(vs)` is equal to `nrows(t)`
}
{
	Tester.assertEqual(
		'getColumn2 1',
		() => getColumn2(students, "age"),
		[12, 17, 13]
	)
	Tester.assertEqual(
		'getColumn2 2',
		() => getColumn2(gradebook, "name"),
		["Bob", "Alice", "Eve"]
	)
}


let selectRows1 = <S extends STop>(t1: Table<S>, ns: Array<number>): Table<S> => {
	return values(ns.map((n) => getRow(t1, n)))
}
() => {
	// - [ ] for all `n` in `ns`, `n` is in `range(nrows(t1))`
	// - [ ] `schema(t2)` is equal to `schema(t1)`
	// - [ ] `nrows(t2)` is equal to `length(ns)`
}
{
	Tester.assertEqual(
		'selectRows1 1',
		() => selectRows1(students, [2, 0, 2, 1]),
		parseTable([
			['name', 'age', 'favorite color'],
			["Eve", 13, "red"],
			["Bob", 12, "blue"],
			["Eve", 13, "red"],
			["Alice", 17, "green"]
		]))
	Tester.assertEqual(
		'selectRows1 2',
		() => selectRows1(gradebook, [2, 1]),
		parseTable([
			['name', 'age', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final'],
			["Eve", 13, 7, 9, 84, 8, 8, 77],
			["Alice", 17, 6, 8, 88, 8, 7, 85]
		])
	)
}


let selectRows2 = <S extends STop>(t1: Table<S>, bs: Array<Boolean>): Table<S> => {
	return {
		header: t1.header,
		content: t1.content.filter((_, i) => bs[i])
	}
}
() => {
	// - [ ] `length(bs)` is equal to `nrows(t1)`
	// - [ ] `schema(t2)` is equal to `schema(t1)`
	// - [ ] `nrows(t2)` is equal to `length(removeAll(bs, [false]))`
}
{
	Tester.assertEqual(
		'selectRow2 1',
		() => selectRows2(students, [true, false, true]),
		parseTable([
			['name', 'age', 'favorite color'],
			["Bob", 12, "blue"],
			["Eve", 13, "red"]
		])
	)
	Tester.assertEqual(
		'selectRow2 1',
		() => selectRows2(gradebook, [false, false, true]),
		parseTable([
			['name', 'age', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final'],
			["Eve", 13, 7, 9, 84, 8, 8, 77]
		])
	)
}


let selectColumns1 = <S extends STop>(t1: Table<S>, bs: Array<boolean>): TTop => {
	const header = t1.header.filter((_, i) => bs[i])
	return {
		header: header as string[],
		content: t1.content.map((r) => {
			return Object.fromEntries(header.map((c) => [c, r[c]]))
		})
	}
}
() => {
	// - [ ] `length(bs)` is equal to `ncols(t1)`
	// - [ ] `header(t2)` is a subsequence of `header(t1)`
	// - [ ] for all `i` in `range(ncols(t1))`, `header(t1)[i]` is in `header(t2)` if and only if `bs[i]` is equal to `true`
	// - [ ] `schema(t2)` is a subsequence of `schema(t1)`
	// - [ ] `nrows(t2)` is equal to `nrows(t1)`
}
{
	Tester.assertEqual(
		'selectColumns1 1',
		() => selectColumns1(students, [true, true, false]),
		parseTable([
			['name', 'age'],
			["Bob", 12],
			["Alice", 17],
			["Eve", 13]
		])
	)
	Tester.assertEqual(
		'selectColumns1 2',
		() => selectColumns1(gradebook, [true, false, false, false, true, false, false, true]),
		parseTable([
			['name', 'midterm', 'final'],
			["Bob", 77, 87],
			["Alice", 88, 85],
			["Eve", 84, 77]
		])
	)
}

let selectColumns2 = <S extends STop>(t1: Table<S>, ns: Array<number>): Table<Partial<S>> => {
	const header = ns.map((n) => t1.header[n])
	const content = t1.content.map(
		(r) => Object.fromEntries(header.map((c) => [c, r[c]])) as Partial<S>)
	return { header, content }
}
() => {
	// - [ ] `ns` has no duplicates
	// - [ ] for all `n` in `ns`, `n` is in `range(ncols(t1))`
	// - [ ] `ncols(t2)` is equal to `length(ns)`
	// - [ ] for all `i` in `range(length(ns))`, `header(t2)[i]` is equal to `header(t1)[ns[i]]`
	// - [ ] for all `c` in `header(t2)`, `schema(t2)[c]` is equal to `schema(t1)[c]`
	// - [ ] `nrows(t2)` is equal to `nrows(t1)`
}
{
	Tester.assertEqual(
		'selectColumn2 1',
		() => selectColumns2(students, [2, 1]),
		parseTable([
			['favorite color', 'age'],
			["blue", 12],
			["green", 17],
			["red", 13]
		])
	)
	Tester.assertEqual(
		'selectColumn2 2',
		() => selectColumns2(gradebook, [7, 0, 4]),
		parseTable([
			['final', 'name', 'midterm'],
			[87, "Bob", 77],
			[85, "Alice", 88],
			[77, "Eve", 84],
		])
	)
}


let selectColumns3 = <S extends STop, C extends keyof S>(t1: Table<S>, cs: Array<C>): Table<Pick<S, C>> => {
	return {
		header: cs,
		content: t1.content.map((r) => {
			return Object.fromEntries(cs.map((c) => [c, r[c]])) as Pick<S, C>
		})
	}
}
{
	// - [ ] `cs` has no duplicates
	// - [x] for all `c` in `cs`, `c` is in `header(t1)`
	// - [ ] `header(t2)` is equal to `cs` 
	// - [x] for all `c` in `header(t2)`, `schema(t2)[c]` is equal to `schema(t1)[c]`
	// - [ ] `nrows(t2)` is equal to `nrows(t1)`
}
{
	Tester.assertEqual(
		'selectColumns3 1',
		() => selectColumns3(students, ["favorite color", "age"]),
		parseTable([
			['favorite color', 'age'],
			["blue", 12],
			["green", 17],
			["red", 13]
		])
	)
	Tester.assertEqual(
		'selectColumns3 2',
		() => selectColumns3(gradebook, ["final", "name", "midterm"]),
		parseTable([
			['final', 'name', 'midterm'],
			[87, "Bob", 77],
			[85, "Alice", 88],
			[77, "Eve", 84]
		])
	)
}

let head = <S extends STop>(t1: Table<S>, n: number): Table<S> => {
	let end: number;
	if (n >= 0) {
		end = n
	} else {
		end = t1.content.length + n;
	}
	return {
		header: t1.header,
		content: t1.content.slice(0, end)
	}
}
() => {
	// - [ ] if `n` is non-negative then `n` is in `range(nrows(t1))`
	// - [ ] if `n` is negative then `- n` is in `range(nrows(t1))`
	// - [ ] `schema(t2)` is equal to `schema(t1)`
	// - [ ] if `n` is non-negative then `nrows(t2)` is equal to `n`
	// - [ ] if `n` is negative then `nrows(t2)` is equal to `nrows(t1) + n`
}
{
	Tester.assertEqual(
		'head 1',
		() => head(students, 1),
		parseTable([
			['name', 'age', 'favorite color'],
			["Bob", 12, "blue"],
		])
	)
	Tester.assertEqual(
		'head 2',
		() => head(students, -2),
		parseTable([
			['name', 'age', 'favorite color'],
			["Bob", 12, "blue"],
		])
	)
}

let distinct = <S extends STop>(t1: Table<S>): Table<S> => {
	const distinctRows = (rs: Array<S>): Array<S> => {
		if (rs.length === 0) {
			return []
		} else {
			return [
				rs[0],
				...distinctRows(rs.filter((r) => {
					return !t1.header.every((c) => {
						return r[c] === rs[0][c]
					})
				}))
			]
		}
	}
	return {
		header: t1.header,
		content: distinctRows(t1.content)
	}
}
() => {
	// - [ ] `schema(t2)` is equal to `schema(t1)`
}
{
	Tester.assertEqual(
		'distinct 1',
		() => distinct(students),
		parseTable([
			['name', 'age', 'favorite color'],
			["Bob", 12, "blue"],
			["Alice", 17, "green"],
			["Eve", 13, "red"],
		])
	)
	Tester.assertEqual(
		'distinct 2',
		() => distinct(selectColumns3(gradebook, ["quiz3"])),
		parseTable([
			['quiz3'],
			[7],
			[8],
		])
	)
}

let dropColumns = <S extends STop>(t1: Table<S>, cs: Array<keyof S>): Table<Omit<S, (typeof cs)[number]>> => {
	const header = t1.header.filter((c) => {
		return !cs.includes(c);
	}) as Array<keyof Omit<S, (typeof cs)[number]>>
	const rows = t1.content.map((r) => {
		return Object.fromEntries(header.map((c) => [c, r[c]])) as Omit<S, (typeof cs)[number]>
	})
	return { header, content: rows }
}
() => {
	// - [x] for all `c` in `cs`, `c` is in `header(t1)`
	// - [ ] `cs` has no duplicates
	// - [ ] `nrows(t2)` is equal to `nrows(t1)`
	// - [ ] `header(t2)` is equal to `removeAll(header(t1), cs)`
	// - [ ] `schema(t2)` is a subsequence of `schema(t1)`
}
{
	Tester.assertEqual(
		'dropColumns 1',
		() => dropColumns(students, ["age"]),
		parseTable([
			['name', 'favorite color'],
			["Bob", "blue"],
			["Alice", "green"],
			["Eve", "red"],
		])
	)
	Tester.assertEqual(
		'dropColumns 2',
		() => dropColumns(gradebook, ["final", "midterm"]),
		parseTable([
			['name', 'age', 'quiz1', 'quiz2', 'quiz3', 'quiz4'],
			["Bob", 12, 8, 9, 7, 9],
			["Alice", 17, 6, 8, 8, 7],
			["Eve", 13, 7, 9, 8, 8],
		])
	)
}

let tfilter = <S extends STop>(t1: Table<S>, f: (r: Row<S>) => boolean): Table<S> => {
	return {
		header: t1.header,
		content: t1.content.filter((r) => f({ header: t1.header, content: [r] }))
	}
}
() => {
	// - [ ] `schema(r)` is equal to `schema(t1)`
	// - [ ] `schema(t2)` is equal to `schema(t1)`
}
{
	const ageUnderFifteen = (r: Row<{ name: string; age: number; 'favorite color': string; }>) => {
		return getValue(r, "age") < 15
	}
	Tester.assertEqual(
		'tfilter 1',
		() => tfilter(students, ageUnderFifteen),
		parseTable([
			['name', 'age', 'favorite color'],
			["Bob", 12, "blue"],
			["Eve", 13, "red"],
		])
	)
	const nameLongerThan3Letters = (r: Row<SchemaOf<typeof gradebook>>) => {
		return getValue(r, "name").length > 3
	}
	Tester.assertEqual(
		'tfilter 2',
		() => tfilter(gradebook, nameLongerThan3Letters),
		parseTable([
			['name', 'age', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final'],
			["Alice", 17, 6, 8, 88, 8, 7, 85],
		])
	)
}

let tsort = <C extends CTop, S extends STop & Record<C, number>>(t1: Table<S>, c: C, b: boolean): Table<S> => {
	const content = t1.content.slice(0)
	const sign = b ? 1 : -1;
	content.sort((r1, r2) => {
		const n1 = r1[c]
		const n2 = r2[c]
		if (n1 < n2) {
			return sign * -1;
		} else if (n1 > n2) {
			return sign * 1;
		} else {
			return 0;
		}
	})
	return {
		header: t1.header,
		content
	}
}
() => {
	// - [ ] `c` is in `header(t1)`
	// - [x] `schema(t1)[c]` is `Number`
	// rejected as expected
	// tsort(gradebook, 'name', true)
	// accepted as expected
	tsort(gradebook, 'quiz1', true)
	// - [ ] `nrows(t2)` is equal to `nrows(t1)`
	// - [ ] `schema(t2)` is equal to `schema(t1)`
}
{
	Tester.assertEqual(
		'tsort 1',
		() => tsort(students, "age", true),
		parseTable([
			['name', 'age', 'favorite color'],
			["Bob", 12, "blue"],
			["Eve", 13, "red"],
			["Alice", 17, "green"],

		])
	)
	Tester.assertEqual(
		'tsort 2',
		() => tsort(gradebook, "final", false),
		parseTable([
			['name', 'age', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final'],
			["Bob", 12, 8, 9, 77, 7, 9, 87],
			["Alice", 17, 6, 8, 88, 8, 7, 85],
			["Eve", 13, 7, 9, 84, 8, 8, 77],
		])
	)
}

let sortByColumns = <C extends CTop, S extends STop & Record<C, number>>(t1: Table<S>, cs: Array<C>): Table<S> => {
	for (const c of [...cs].reverse()) {
		t1 = tsort(t1, c, true)
	}
	return t1
}
() => {
	// - [ ] `cs` has no duplicates
	// - [x] for all `c` in `cs`, `c` is in `header(t1)`
	// - [x] for all `c` in `cs`, `schema(t1)[c]` is `Number`
	// - [ ] `nrows(t2)` is equal to `nrows(t1)`
	// - [ ] `schema(t2)` is equal to `schema(t1)`
}
{
	Tester.assertEqual(
		'sortByColumns 1',
		() => sortByColumns(students, ["age"]),
		parseTable([
			['name', 'age', 'favorite color'],
			["Bob", 12, "blue"],
			["Eve", 13, "red"],
			["Alice", 17, "green"],
		])
	)
	Tester.assertEqual(
		'sortByColumns 2',
		() => sortByColumns(gradebook, ["quiz2", "quiz1"]),
		parseTable([
			['name', 'age', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final'],
			["Alice", 17, 6, 8, 88, 8, 7, 85],
			["Eve", 13, 7, 9, 84, 8, 8, 77],
			["Bob", 12, 8, 9, 77, 7, 9, 87],
		])
	)
}


let orderBy = <S extends STop>(t1: Table<S>, cmps: Array<[(r: Row<S>) => any, (k1: any, k2: any) => boolean]>): Table<S> => {
	const compare = (r1: S, r2: S) => {
		for (const [getKey, compare] of cmps) {
			const k1 = getKey({ header: t1.header, content: [r1] })
			const k2 = getKey({ header: t1.header, content: [r2] })
			const le = compare(k1, k2)
			if (le) {
				if (compare(k2, k1)) {
					continue
				} else {
					return -1
				}
			} else {
				return 1;
			}
		}
		return 0
	}
	return {
		header: t1.header,
		content: [...t1.content].sort(compare)
	}
}
() => {
	// - [ ] `schema(r)` is equal to `schema(t1)`
	// - [ ] `schema(t2)` is equal to `schema(t1)`
	// - [ ] `nrows(t2)` is equal to `nrows(t1)`
}
{
	const nameLength = <S extends STop & Record<'name', string>>(r: Row<S>) => {
		return getValue(r, "name").length
	}
	Tester.assertEqual(
		'orderBy 1',
		() => orderBy(students, [[nameLength, le]]),
		parseTable([
			['name', 'age', 'favorite color'],
			["Bob", 12, "blue"],
			["Eve", 13, "red"],
			["Alice", 17, "green"],
		])
	)
	const midtermAndFinal = (r: Row<SchemaOf<typeof gradebook>>) => {
		return [getValue(r, "midterm"), getValue(r, "final")]
	}
	const compareGrade = (g1: number[], g2: number[]) => {
		return le(average(g1), average(g2))
	}
	Tester.assertEqual(
		'orderBy 2',
		() => orderBy(gradebook, [[nameLength, ge], [midtermAndFinal, compareGrade]]),
		parseTable([
			['name', 'age', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final'],
			["Alice", 17, 6, 8, 88, 8, 7, 85],
			["Eve", 13, 7, 9, 84, 8, 8, 77],
			["Bob", 12, 8, 9, 77, 7, 9, 87],
		])
	)
}

let count = <S extends STop, C extends keyof S>(t1: Table<S>, c: keyof S): Table<{ value: S[C], count: number }> => {
	const vs = getColumn2(t1, c);
	const map = new Map()
	for (const v of vs) {
		if (map.has(v)) {
			map.set(v, map.get(v) + 1)
		} else {
			map.set(v, 1)
		}
	}
	return values([...map.entries()].map(([v, c]) => {
		return parseRow([
			['value', v],
			['count', c]
		])
	}))
}
() => {
	// - [ ] `c` is in `header(t1)`
	// - [ ] `schema(t1)[c]` is a categorical sort
	// - [ ] `header(t2)` is equal to `["value", "count"]`
	// - [x] `schema(t2)["value"]` is equal to `schema(t1)[c]`
	// - [x] `schema(t2)["count"]` is equal to `Number`
	// - [ ] `nrows(t2)` is equal to `length(removeDuplicates(getColumn(t1, c)))`
}
{
	Tester.assertEqual(
		'count 1',
		() => count(students, "favorite color"),
		parseTable([
			['value', 'count'],
			["blue", 1],
			["green", 1],
			["red", 1],
		])
	)
	Tester.assertEqual(
		'count 2',
		() => count(gradebook, "age"),
		parseTable([
			['value', 'count'],
			[12, 1],
			[17, 1],
			[13, 1],
		])
	)
}

let bin = <C extends CTop, S extends STop & Record<C, number>>(t1: Table<S>, c: C, n: number): Table<{ group: string, count: number }> => {
	const vs = getColumn2(t1, c)
	const min = Math.min(...vs)
	const max = Math.max(...vs)
	const lend = Math.floor(min / n) * n
	const numberOfGroups = Math.floor((max - lend) / n) + 1
	const map = new Map()
	for (let i = 0; i < numberOfGroups; i++) {
		map.set(i, 0)
	}
	for (const v of vs) {
		const i = Math.floor((v - lend) / n)
		map.set(i, map.get(i) + 1)
	}
	return values([...map.entries()].map(([gi, count]) => {
		return parseRow([
			['group', `${lend + gi * n} <= ${c} < ${lend + (gi + 1) * n}`],
			['count', count]
		])
	}))
}
{
	Tester.assertEqual(
		'bin 1',
		() => bin(students, "age", 5),
		parseTable([
			['group', 'count'],
			["10 <= age < 15", 2],
			["15 <= age < 20", 1],
		])
	)
	Tester.assertEqual(
		'bin 2',
		() => bin(gradebook, "final", 5),
		parseTable([
			['group', 'count'],
			["75 <= final < 80", 1],
			["80 <= final < 85", 0],
			["85 <= final < 90", 2],
		])
	)
}

Tester.go()
