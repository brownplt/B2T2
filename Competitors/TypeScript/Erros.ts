// # Errors

import { Row, STop, Table } from "./EncodeTables"
import { jellyAnon, jellyNamed, students } from "./ExampleTables"
import { buildColumn, count, getValue } from "./TableAPI"

// ## Malformed Tables

// The schema is expressed by the type annotation and the header of the table value.
const missingSchema: Table<> = {
    content: [
        {
            "name": "Bob",
            "age": 12,
            "favorite color": "blue"
        },
        {
            "name": "Alice",
            "age": 17,
            "favorite color": "green"
        },
        {
            "name": "Eve",
            "age": 13,
            "favorite color": "red"
        }
    ]
}

const missingRow: Table<{ 'name': string, 'age': number, 'favorite color': string }> = {
    header: ['name', 'age', 'favorite color'],
    content: [
        {
            "name": "Bob",
            "age": 12,
            "favorite color": "blue"
        },
        {
            "name": "Alice",
            "age": 17,
            "favorite color": "green"
        },
        {
        }
    ]
}

const missingCell: Table<{ 'name': string, 'age': number, 'favorite color': string }> = {
    header: ['name', 'age', 'favorite color'],
    content: [
        {
            "name": "Bob",
            "age": 12
        },
        {
            "name": "Alice",
            "age": 17,
            "favorite color": "green"
        },
        {
            "name": "Eve",
            "age": 13,
            "favorite color": "red"
        }
    ]
}


const swappedColumns: Table<{ 'name': string, 'age': number, 'favorite color': string }> = {
    header: ['name', 'age', 'favorite color'],
    content: [
        {
            "age": "Bob",
            "name": 12,
            "favorite color": "blue"
        },
        {
            "age": "Alice",
            "name": 17,
            "favorite color": "green"
        },
        {
            "age": "Eve",
            "name": 13,
            "favorite color": "red"
        }
    ]
}


const schemaTooShort: Table<{ 'name': string, 'age': number, 'favorite color': string }> = {
    header: ['name', 'age'],
    content: [
        {
            "age": "Bob",
            "name": 12,
            "favorite color": "blue"
        },
        {
            "age": "Alice",
            "name": 17,
            "favorite color": "green"
        },
        {
            "age": "Eve",
            "name": 13,
            "favorite color": "red"
        }
    ]
}

// ## Using Tables

// ### midFinal

// TODO

// ### blackAndWhite

const eatBlackAndWhite = <S extends STop & { "black": boolean, "white": boolean }>(r: Row<S>) => {
    return getValue(r, "black and white") == true
}
buildColumn(jellyAnon, "eat black and white", eatBlackAndWhite)

// ### pieCount

// TODO

// ### brownGetAcne

const brownAndGetAcne = <S extends STop & { "brown": boolean, "get acne": boolean }>(r: Row<S>) => {
    return getValue(r, "brown") && getValue(r, "get acne")
}
const brownAndGetAcneTable = buildColumn(jellyNamed, "part2", brownAndGetAcne)

count(brownAndGetAcneTable, "brown and get acne")

// ### getOnlyRow

// TODO

// TODO: rest