import { CTop, STop, Table } from './EncodeTables'
import { getColumn2, nrows } from './TableAPI'
import { range } from './helpers'
import { makeTester } from './unitTest'
import { gradebook } from './ExampleTables'

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