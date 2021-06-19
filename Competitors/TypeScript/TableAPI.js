"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExampleTables_1 = require("./ExampleTables");
const unitTest_1 = require("./unitTest");
const VecLib = __importStar(require("./Vec"));
const Test = unitTest_1.makeTester();
let emptyTable = { header: [], rows: [] };
// constraints
() => {
    // - [x] `schema(t)` is equal to `[]`
    // - [x] `nrows(t)` is equal to `0`
    const test1 = nrows(emptyTable);
};
let addColumn = (t1, c, vs) => {
    return {
        header: [...t1.header, c],
        rows: VecLib.map(t1.rows, (r, i) => {
            const newR = Object.assign({ [c]: vs[i] }, r);
            return newR;
        })
    };
};
// constraints
// - [ ] `c` is not in `header(t1)`
// - [x] `length(vs)` is equal to `nrows(t1)`
// - [x] `header(t2)` is equal to `concat(header(t1), [c])`
// - [x] for all `c'` in `header(t1)`, `schema(t2)[c']` is equal to `schema(t1)[c']`
// - [x] `schema(t2)[c]` is the sort of elements of `vs`
// - [x] `nrows(t2)` is equal to `nrows(t1)`
// examples
{
    const hairColor = ["brown", "red", "blonde"];
    Test.assertEqual('addColumn 1', () => addColumn(ExampleTables_1.students, "hair-color", hairColor), {
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
    });
    const presentation = [9, 9, 6];
    Test.assertEqual('addColumn 2', () => addColumn(ExampleTables_1.gradebook, "presentation", presentation), {
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
    });
}
let header;
header = (t) => {
    return t.header;
};
// constraints
() => {
    // - [x] `cs` is equal to `header(t)`
    // accepted as expected
    const test1 = header(ExampleTables_1.students);
    // rejected as expected
    // const test2: ['age', 'name', 'favorite color'] = header(students)
    // rejected as expected
    // const test3: ['Name', 'Age', 'Favorite Color'] = header(students)
};
// examples
Test.assertEqual('header 1', () => header(ExampleTables_1.students), ["name", "age", "favorite color"]);
Test.assertEqual('header 2', () => header(ExampleTables_1.gradebook), ["name", "age", "quiz1", "quiz2", "midterm", "quiz3", "quiz4", "final"]);
let nrows = (t) => {
    return t.rows.length;
};
// constraints
() => {
    // - [x] `n` is equal to `nrows(t)`
    const test1 = nrows(ExampleTables_1.students);
};
// examples
{
    Test.assertEqual('nrows 1', () => nrows(emptyTable), 0);
    Test.assertEqual('nrows 2', () => nrows(ExampleTables_1.studentsMissing), 3);
}
let getValue;
getValue = (r, c) => {
    return r[c];
};
// constraints
() => {
    // - [ ] `c` is in header(r)
    // accepted, but should be rejected. I am not sure why IsIn<H> didn't work.
    const test1 = getValue({ 'name': 'Bob', 'age': 12 }, 'Name');
    // rejected as expected
    // const test2 = getValue<['name', 'age'], { 'name': string, 'age': number }, 'Name'>({ 'name': 'Bob', 'age': 12 }, 'Name')  
    // - [x] `v` is of sort `schema(r)[c]`
    // accepted as expected
    const test3 = getValue({ 'name': 'Bob', 'age': 12 }, 'name').charAt;
    // rejected as expected
    // const test4 = getValue({ 'name': 'Bob', 'age': 12 }, 'age').charAt
};
// examples
{
    Test.assertEqual('getValue 1', () => getValue({ 'name': 'Bob', 'age': 12 }, 'name'), "Bob");
    Test.assertEqual('getValue 2', () => getValue({ 'name': 'Bob', 'age': 12 }, "age"), 12);
}
let buildColumn = (t1, c, f) => {
    return addColumn(t1, c, VecLib.map(t1.rows, f));
};
// constraints
() => {
    // - [ ] `c` is not in `header(t1)`
    // It is unclear to me how to specify that C is *not* in H.
    // Note: hopefully TS will integrate negation type in the near future. https://github.com/microsoft/TypeScript/pull/29317
    // - [x] `schema(r)` is equal to `schema(t1)`
    // accepted as expected
    const test2 = buildColumn(ExampleTables_1.students, 'full name', (r) => r['name'] + ' Smith');
    // rejected as expected
    // const test3 = buildColumn(students, 'full name', (r) => r['Name'] + ' Smith')
    // - [x] `header(t2)` is equal to `concat(header(t1), [c])`
    // accepted as expected
    const test4 = header(buildColumn(ExampleTables_1.students, 'full name', (r) => r['name'] + ' Smith'));
    // - [x] for all `c'` in `header(t1)`, `schema(t2)[c']` is equal to `schema(t1)[c']`
    // - [x] `schema(t2)[c]` is equal to the sort of `v`
    // accepted as expected
    const test5 = buildColumn(ExampleTables_1.students, 'full name', (r) => r['name'] + ' Smith');
    // - [x] `nrows(t2)` is equal to `nrows(t1)`
    // accepted as expected
    const test6 = nrows(buildColumn(ExampleTables_1.students, 'full name', (r) => r['name'] + ' Smith'));
};
// examples
{
    const isTeenagerBuilder = (r) => {
        return 12 < getValue(r, 'age') && getValue(r, 'age') < 20;
    };
    Test.assertEqual('buildColumn 1', () => buildColumn(ExampleTables_1.students, 'is-teenager', isTeenagerBuilder), {
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
    });
    const didWellInFinal = (r) => {
        return 85 <= getValue(r, 'final');
    };
    Test.assertEqual('buildColumn 2', () => buildColumn(ExampleTables_1.gradebook, 'did-well-in-final', didWellInFinal), {
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
    });
}
Test.go();
