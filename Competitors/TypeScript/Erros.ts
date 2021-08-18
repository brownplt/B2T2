// # Errors

import { students } from "./ExampleTables"

// ## Malformed Tables

// The schema is expressed by the type annotation and the header of the table value.
const missingSchema: {
    header: ["name", "age", "favorite color"],
    content: {
        name: string;
        age: number;
        'favorite color': string;
    }[];
} = {
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

const missingRow: Students = {
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

const missingCell: Students = {
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


const swappedColumns: Students = {
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


const schemaTooShort: Students = {
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

scatterPlot