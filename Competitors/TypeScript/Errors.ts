// # Errors

// To see all static type errors in console, execute in this directory
//
//   tsc -b
//
// This command builds all .ts files in the current directory and prints
// all type errors.

import { CTop, Row, SchemaOf, STop, Table } from "./EncodeTables"
import { departments, employees, gradebook, jellyAnon, jellyNamed, students } from "./ExampleTables"
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


const schemaTooShort: Table<{ 'name': string, 'age': number }> = {
    header: ['name', 'age'],
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

// ## Using Tables

// ### midFinal

type ScatterPlot = <C1 extends CTop, C2 extends CTop, S extends STop & Record<C1 | C2, number>>(t: Table<S>, c1: C1, c2: C2) => void

(scatterPlot: ScatterPlot) => {

    const buggy = () => {
        scatterPlot(gradebook, "mid", "final")
    }
    const corrected = () => {
        scatterPlot(gradebook, "midterm", "final")
    }
}

// ### blackAndWhite

() => {
    const buggy = () => {
        const eatBlackAndWhite = (r: Row<SchemaOf<typeof jellyAnon>>) => {
            return getValue(r, "black and white") == true
        }
        buildColumn(jellyAnon, "eat black and white", eatBlackAndWhite)
    }
    const corrected = () => {
        const eatBlackAndWhite = (r: Row<SchemaOf<typeof jellyAnon>>) => {
            return getValue(r, "black") && getValue(r, "white")
        }
        buildColumn(jellyAnon, "eat black and white", eatBlackAndWhite)

    }
}

// ### pieCount

type PieChart = <C1 extends CTop, C2 extends CTop, S extends STop & Record<C1, string | boolean> & Record<C2, number>>(t: Table<S>, c1: C1, c2: C2) => void

(pieChart: PieChart) => {
    const buggy = () => {
        const showAcneProportions =
            <S extends { "get acne": boolean } & STop>(t: Table<S>) =>
                pieChart(count(t, "get acne"), "true", "get acne")
        showAcneProportions(jellyAnon)
    }
    const corrected = () => {
        const showAcneProportions =
            <S extends STop & { "get acne": boolean }>(t: Table<S>) =>
                pieChart(count(t, "get acne"), "value", "count")
        showAcneProportions(jellyAnon)
    }
}

// ### brownGetAcne

() => {
    const buggy = () => {
        const brownAndGetAcne = <S extends STop & { "brown": boolean, "get acne": boolean }>(r: Row<S>) => {
            return getValue(r, "brown") && getValue(r, "get acne")
        }
        const brownAndGetAcneTable = buildColumn(jellyNamed, "part2", brownAndGetAcne)

        count(brownAndGetAcneTable, "brown and get acne")
    }
    const corrected = () => {
        const brownAndGetAcne = <S extends STop & { "brown": boolean, "get acne": boolean }>(r: Row<S>) => {
            return getValue(r, "brown") && getValue(r, "get acne")
        }
        const brownAndGetAcneTable = buildColumn(jellyNamed, "brown and get acne", brownAndGetAcne)

        count(brownAndGetAcneTable, "brown and get acne")
    }
}

// ### getOnlyRow

() => {
    const buggy = () => {
        getValue(
            getRow(
                tfilter(students,
                    (r) =>
                        getValue(r, "name") == "Alice"
                ),
                1),
            "favorite color")
    }
    const corrected = () => {
        getValue(
            getRow(
                tfilter(students,
                    (r) =>
                        getValue(r, "name") == "Alice"
                ),
                0),
            "favorite color")
    }
}

// ### favoriteColor

() => {
    const buggy = () => {
        const participantsLikeGreen =
            <S extends { 'favorite color': string }>(t: Table<S>) =>
                tfilter(t,
                    (r) =>
                        getValue(r, "favorite color")
                )
    }
    const corrected = () => {
        const participantsLikeGreen =
            <S extends { 'favorite color': string }>(t: Table<S>) =>
                tfilter(t,
                    (r) =>
                        getValue(r, "favorite color") == 'green'
                )
    }
}

// ### brownJellybeans

() => {
    const buggy = () => {
        const countParticipants =
            <C extends CTop, S extends STop & Record<C, boolean>>(t: Table<S>, color: C) =>
                nrows(tfilter(t, keep))
        const keep =
            <S extends STop & { 'color': any }>(r: Row<S>) =>
                getValue(r, "color")
        countParticipants(jellyAnon, "brown")
    }
    const corrected1 = () => {
        const countParticipants =
            <C extends CTop, S extends STop & Record<C, boolean>>(t: Table<S>, color: C) =>
                nrows(tfilter(t, keep(color)))
        const keep =
            <C extends CTop>(color: C) =>
                <S extends STop & Record<C, boolean>>(r: Row<S>) =>
                    getValue(r, color)
        countParticipants(jellyAnon, "brown")
    }
    const corrected2 = () => {
        const countParticipants =
            <C extends CTop, S extends STop & Record<C, boolean>>(t: Table<S>, color: C) => {
                const keep =
                    <S extends STop & Record<C, boolean>>(r: Row<S>) =>
                        getValue(r, color)
                return nrows(tfilter(t, keep))
            }
        countParticipants(jellyAnon, "brown")
    }
}

// ### employeeToDepartment

() => {
    const buggy = () => {
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
    }
    const corrected = () => {
        const deptIdToDeptName =
            (deptTab: typeof departments, deptId: number) => {
                const matchName =
                    (r: Row<SchemaOf<typeof departments>>) => {
                        return getValue(r, "Department ID") == deptId
                    }
                const matchedTab = tfilter(deptTab, matchName)
                const matchedRow = getRow(matchedTab, 0)
                return getValue(matchedRow, "Department Name")
            }
        const employeeToDepartment =
            (name: string, emplTab: typeof employees, deptTab: typeof departments) => {
                const matchName =
                    (r: Row<SchemaOf<typeof employees>>) => {
                        return getValue(r, "Last Name") == name
                    }
                const matchedTab = tfilter(emplTab, matchName)
                const matchedRow = getRow(matchedTab, 0)
                const deptId = getValue(matchedRow, "Department ID")
                return deptIdToDeptName(deptTab, deptId)
            }
    }
}
