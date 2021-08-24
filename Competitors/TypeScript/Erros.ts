// # Errors

import { CTop, Row, STop, Table } from "./EncodeTables"
import { departments, employees, jellyAnon, jellyNamed, students } from "./ExampleTables"
import { buildColumn, count, getRow, getValue, nrows, tfilter } from "./TableAPI"

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

getValue(
    getRow(
        tfilter(students,
            (r) =>
                getValue(r, "name") == "Alice"
        ),
        1),
    "favorite color")

// ### favoriteColor

const participantsLikeGreen =
    <S extends { 'favorite color': string }>(t: Table<S>) =>
        tfilter(t,
            (r) =>
                getValue(r, "favorite color")
        )

// ### brownJellybeans

const countParticipants =
    <C extends CTop, S extends STop & Record<C, boolean>>(t: Table<S>, color: C) =>
        nrows(tfilter(t, keep))
const keep =
    <S extends STop & { 'color': any }>(r: Row<S>) =>
        getValue(r, "color")
countParticipants(jellyAnon, "brown")

// ### employeeToDepartment

const lastNameToDeptId =
    (deptTab: typeof departments, name: string) => {
        const matchName =
            <S extends STop & { "Last Name": string }>(r: Row<S>) =>
                getValue(r, "Last Name") == name
        const matchedTab = tfilter(deptTab, matchName)
        const matchedRow = getRow(matchedTab, 0)
        return getValue(matchedRow, "Department ID")
    }
const employeeToDepartment =
    (name: string, emplTab: typeof employees, deptTab: typeof departments) =>
        buildColumn(emplTab, "Department Name",
            (r) =>
                lastNameToDeptId(deptTab, getValue(r, "Last Name"))
        )
