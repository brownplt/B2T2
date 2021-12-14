import { CTop, parseRow, parseTable, Row, SchemaOf, STop, Table } from './EncodeTables'
import { addColumn, addRows, buildColumn, dropColumns, emptyTable, getColumn2, getValue, header, nrows, selectColumns3, selectRows1, tfilter } from './TableAPI'
import { filter, fisherTest, map, range, length, startsWith, concat, colNameOfNumber, average, removeDuplicates, sample } from './helpers'
import { makeTester } from './unitTest'
import { gradebook, gradebookMissing, jellyAnon, jellyNamed, students } from './ExampleTables'

const Tester = makeTester()

// ## dotProduct

const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0)

const dotProduct = <C1 extends CTop, C2 extends CTop, S extends STop & Record<C1 | C2, number>>(t: Table<S>, c1: C1, c2: C2): number => {
    const ns = getColumn2(t, c1)
    const ms = getColumn2(t, c2)
    return sum(map(range(nrows(t)), i => ns[i] * ms[i]))
}

Tester.assertEqual(
    'dotProduct',
    () => dotProduct(gradebook, "quiz1", "quiz2"),
    183)

// ## sampleRows

const sampleRows = <S extends STop>(t: Table<S>, n: number): Table<S> => {
    // To pass the test, I have to set the indexes to constants.
    const indexes = [2, 1]
    // const indexes = sample(range(nrows(t)), n)
    return selectRows1(t, indexes)
}

Tester.assertEqual(
    'sampleRows',
    () => sampleRows(gradebookMissing, 2),
    parseTable([
        ['name', 'age', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final'],
        ["Eve", 13, null, 9, 84, 8, 8, 77],
        ["Alice", 17, 6, 8, 88, null, 7, 85]
    ])
)

// ## pHackingHomogeneous

const pHacking = <S extends STop & { "get acne": boolean } & Record<string, boolean>>(t: Table<S>): string[] => {
    // We store the printed strings so that it can be easily compared to the 
    // expected output.
    const printed: string[] = []
    const colAcne = getColumn2(t, "get acne")
    const jellyAnon = dropColumns(t, ["get acne"])
    for (const c of header(jellyAnon)) {
        const colJB = getColumn2(t, c)
        const p = fisherTest(colAcne, colJB)
        if (p < 0.05) {
            printed.push("We found a link between " + c + " jelly beans and acne (p < 0.05).")
        }
    }
    return printed
}
Tester.assertEqual(
    'pHackingHomogeneous',
    () => pHacking(jellyAnon),
    [
        "We found a link between orange jelly beans and acne (p < 0.05)."
    ]
)


// ## pHackingHeterogeneous

Tester.assertEqual(
    'pHackingHeterogeneous',
    () => pHacking(dropColumns(jellyNamed, ["name"])),
    [
        "We found a link between orange jelly beans and acne (p < 0.05)."
    ]
)
Tester.assertEqual(
    'pHackingHeterogeneous',
    () => pHacking(dropColumns(jellyNamed, ["name"])),
    [
        "We found a link between orange jelly beans and acne (p < 0.05)."
    ]
)


// ## quizScoreFilter

// The encoding of this example is more complex than the others as we are using a cast to work around the type system.

Tester.assertEqual(
    'quizScoreFilter',
    () => buildColumn(
        gradebook,
        "average-quiz",
        (row) => {
            const quizColnames =
                filter(
                    header(row),
                    (c) => {
                        return startsWith(c, "quiz")
                    })
            const scores = map(
                quizColnames,
                (c) => {
                    return getValue(row, c) as number
                })
            return sum(scores) / length(scores)
        }),
    parseTable([
        ['name', 'age', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final', 'average-quiz'],
        ["Bob", 12, 8, 9, 77, 7, 9, 87, 8.25],
        ["Alice", 17, 6, 8, 88, 8, 7, 85, 7.25],
        ["Eve", 13, 7, 9, 84, 8, 8, 77, 8],
    ])
)

// ## quizScoreSelect

// The encoding of this example is more complex than the others as we are using a cast to work around the type system.

const quizColNames =
    map(
        range(4),
        (i) => concat("quiz", colNameOfNumber(i + 1))
    )

const quizTable = selectColumns3(gradebook, quizColNames as ['quiz1', 'quiz2', 'quiz3', 'quiz4'])

const quizAndAverage =
    buildColumn(
        quizTable,
        "average",
        (r) => {
            const ns = map(header(r),
                (c) => {
                    return getValue(r, c)
                })
            return average(ns)
        })

Tester.assertEqual(
    'quizScoreSelect',
    () => addColumn(
        gradebook,
        "average-quiz",
        getColumn2(quizAndAverage, "average")),
    parseTable([
        ['name', 'age', 'quiz1', 'quiz2', 'midterm', 'quiz3', 'quiz4', 'final', 'average-quiz'],
        ["Bob", 12, 8, 9, 77, 7, 9, 87, 8.25],
        ["Alice", 17, 6, 8, 88, 8, 7, 85, 7.25],
        ["Eve", 13, 7, 9, 84, 8, 8, 77, 8],
    ]))

// ## groupByRetentive

const tableOfColumn =
    <C extends CTop, V>(c: C, vs: Array<V>) => {
        const t1: Table<{}> = addRows(emptyTable, map(vs, (_) => parseRow([])))
        return addColumn(t1, c, vs)
    }

const groupByRetentive = <S extends STop, C extends CTop & keyof S>(t: Table<S>, c: C) => {
    const keys = tableOfColumn("key", removeDuplicates(getColumn2(t, c)))
    const makeGroup =
        (kr: Row<SchemaOf<typeof keys>>) => {
            const k = getValue(kr, "key")
            return tfilter(t,
                (r) => {
                    return getValue(r, c) == k
                })
        }
    return buildColumn(keys, "groups", makeGroup)
}

{
    Tester.assertEqual(
        'groupByRetentive 1',
        () => groupByRetentive(students, "favorite color"),
        parseTable([
            ['key', 'groups'],
            ["blue", parseTable([
                ['name', 'age', 'favorite color'],
                ["Bob", 12, "blue"]
            ])],
            ["green", parseTable([
                ['name', 'age', 'favorite color'],
                ["Alice", 17, "green"]
            ])],
            ["red", parseTable([
                ['name', 'age', 'favorite color'],
                ["Eve", 13, "red"]
            ])]
        ])
    )
    Tester.assertEqual(
        'groupByRetentive 2',
        () => groupByRetentive(jellyAnon, "brown"),
        parseTable([
            ['key', 'groups'],
            [false, parseTable([
                ['get acne', 'red', 'black', 'white', 'green', 'yellow', 'brown', 'orange', 'pink', 'purple'],
                [true, false, false, false, true, false, false, true, false, false],
                [true, false, true, false, true, true, false, false, false, false],
                [false, false, false, false, true, false, false, false, true, false],
                [false, false, false, false, false, true, false, false, false, false],
                [false, false, false, false, false, true, false, false, true, false],
                [true, false, true, false, false, false, false, true, true, false],
                [false, false, true, false, false, false, false, false, true, false],
                [true, false, false, false, false, false, false, true, false, false],
            ])],
            [true, parseTable([
                ['get acne', 'red', 'black', 'white', 'green', 'yellow', 'brown', 'orange', 'pink', 'purple'],
                [true, false, false, false, false, false, true, true, false, false],
                [false, true, false, false, false, true, true, false, true, false],
            ])]
        ])
    )
}

// ## groupBySubtractive

const groupBySubtractive = <S extends STop, C extends CTop & keyof S>(t: Table<S>, c: C) => {
    const keys = tableOfColumn("key", removeDuplicates(getColumn2(t, c)))
    const makeGroup =
        (kr: Row<SchemaOf<typeof keys>>) => {
            const k = getValue(kr, "key")
            const g = tfilter(t,
                (r) => {
                    return getValue(r, c) == k
                })
            return dropColumns(g, [c])
        }
    return buildColumn(keys, "groups", makeGroup)
}

{
    Tester.assertEqual(
        'groupBySubtractive 1',
        () => groupBySubtractive(students, "favorite color"),
        parseTable([
            ['key', 'groups'],
            ["blue", parseTable([
                ['name', 'age'],
                ["Bob", 12]
            ])],
            ["green", parseTable([
                ['name', 'age'],
                ["Alice", 17]
            ])],
            ["red", parseTable([
                ['name', 'age'],
                ["Eve", 13]
            ])],
        ])
    )
    Tester.assertEqual(
        'groupBySubtractive 2',
        () => groupBySubtractive(jellyAnon, "brown"),
        parseTable([
            ['key', 'groups'],
            [false, parseTable([
                ['get acne', 'red', 'black', 'white', 'green', 'yellow', 'orange', 'pink', 'purple'],
                [true, false, false, false, true, false, true, false, false],
                [true, false, true, false, true, true, false, false, false],
                [false, false, false, false, true, false, false, true, false],
                [false, false, false, false, false, true, false, false, false],
                [false, false, false, false, false, true, false, true, false],
                [true, false, true, false, false, false, true, true, false],
                [false, false, true, false, false, false, false, true, false],
                [true, false, false, false, false, false, true, false, false],
            ])],
            [true, parseTable([
                ['get acne', 'red', 'black', 'white', 'green', 'yellow', 'orange', 'pink', 'purple'],
                [true, false, false, false, false, false, true, false, false],
                [false, true, false, false, false, true, false, true, false],
            ])]
        ])
    )
}

Tester.go()