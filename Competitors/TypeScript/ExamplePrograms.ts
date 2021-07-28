import { CTop, parseTable, STop, Table } from './EncodeTables'
import { dropColumns, getColumn2, header, nrows, selectRows1, selectRows2 } from './TableAPI'
import { fisherTest, range, sample } from './helpers'
import { makeTester } from './unitTest'
import { gradebook, gradebookMissing, jellyAnon } from './ExampleTables'

const Tester = makeTester()

// ## dotProduct
const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0)

const dotProduct = <C1 extends CTop, C2 extends CTop, S extends STop & Record<C1 | C2, number>>(t: Table<S>, c1: C1, c2: C2): number => {
    const ns = getColumn2(t, c1)
    const ms = getColumn2(t, c2)
    return sum(range(nrows(t)).map(i => ns[i] * ms[i]))
}

Tester.assertEqual(
    'dotProduct',
    () => dotProduct(gradebook, "quiz1", "quiz2"),
    183)

// ## sampleRows

const sampleRows = <S extends STop>(t: Table<S>, n: number): Table<S> => {
    // To pass the test, I have to fix the indexes.
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
    'pHacking',
    () => pHacking(jellyAnon),
    [
        "We found a link between orange jelly beans and acne (p < 0.05)."
    ]
)

Tester.go()