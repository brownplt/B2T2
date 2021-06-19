"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradebookTable = exports.gradebookSeq = exports.gradebookMissing = exports.gradebook = exports.jellyNamed = exports.jellyAnon = exports.departments = exports.employees = exports.studentsMissing = exports.students = void 0;
exports.students = {
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
        }
    ]
};
// Missing values can be represented with a special value, `null`
exports.studentsMissing = {
    header: ['name', 'age', 'favorite color'],
    rows: [
        {
            'name': 'Bob',
            'age': null,
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
            'favorite color': null
        }
    ]
};
exports.employees = {
    header: ['Last Name', 'Department ID'],
    rows: [
        {
            'Last Name': 'Rafferty',
            'Department ID': 31
        },
        {
            'Last Name': 'Jones',
            'Department ID': 32
        },
        {
            'Last Name': 'Heisenberg',
            'Department ID': 33
        },
        {
            'Last Name': 'Robinson',
            'Department ID': 34
        },
        {
            'Last Name': 'Smith',
            'Department ID': 34
        },
        {
            'Last Name': 'Williams',
            'Department ID': null
        }
    ]
};
exports.departments = {
    header: ['Department ID', 'Department Name'],
    rows: [
        {
            'Department ID': 31,
            'Department Name': 'Sales'
        },
        {
            'Department ID': 33,
            'Department Name': 'Engineering'
        },
        {
            'Department ID': 34,
            'Department Name': 'Clerical'
        },
        {
            'Department ID': 35,
            'Department Name': 'Marketing'
        }
    ]
};
exports.jellyAnon = {
    'header': [
        'get acne',
        'red', 'black', 'white', 'green', 'yellow', 'brown', 'orange', 'pink', 'purple'
    ],
    'rows': [
        {
            'get acne': true,
            'red': false,
            'black': false,
            'white': false,
            'green': true,
            'yellow': false,
            'brown': false,
            'orange': true,
            'pink': false,
            'purple': false
        },
        {
            'get acne': true,
            'red': false,
            'black': true,
            'white': false,
            'green': true,
            'yellow': true,
            'brown': false,
            'orange': false,
            'pink': false,
            'purple': false
        },
        {
            'get acne': false,
            'red': false,
            'black': false,
            'white': false,
            'green': true,
            'yellow': false,
            'brown': false,
            'orange': false,
            'pink': true,
            'purple': false
        },
        {
            'get acne': false,
            'red': false,
            'black': false,
            'white': false,
            'green': false,
            'yellow': true,
            'brown': false,
            'orange': false,
            'pink': false,
            'purple': false
        },
        {
            'get acne': false,
            'red': false,
            'black': false,
            'white': false,
            'green': false,
            'yellow': true,
            'brown': false,
            'orange': false,
            'pink': true,
            'purple': false
        },
        {
            'get acne': true,
            'red': false,
            'black': true,
            'white': false,
            'green': false,
            'yellow': false,
            'brown': false,
            'orange': true,
            'pink': true,
            'purple': false
        },
        {
            'get acne': false,
            'red': false,
            'black': true,
            'white': false,
            'green': false,
            'yellow': false,
            'brown': false,
            'orange': false,
            'pink': true,
            'purple': false
        },
        {
            'get acne': true,
            'red': false,
            'black': false,
            'white': false,
            'green': false,
            'yellow': false,
            'brown': true,
            'orange': true,
            'pink': false,
            'purple': false
        },
        {
            'get acne': true,
            'red': false,
            'black': false,
            'white': false,
            'green': false,
            'yellow': false,
            'brown': false,
            'orange': true,
            'pink': false,
            'purple': false
        },
        {
            'get acne': false,
            'red': true,
            'black': false,
            'white': false,
            'green': false,
            'yellow': true,
            'brown': true,
            'orange': false,
            'pink': true,
            'purple': false
        }
    ]
};
exports.jellyNamed = {
    'header': [
        'name',
        'get acne',
        'red', 'black', 'white', 'green', 'yellow', 'brown', 'orange', 'pink', 'purple'
    ],
    'rows': [
        {
            'name': 'Emily',
            'get acne': true,
            'red': false,
            'black': false,
            'white': false,
            'green': true,
            'yellow': false,
            'brown': false,
            'orange': true,
            'pink': false,
            'purple': false
        },
        {
            'name': 'Jacob',
            'get acne': true,
            'red': false,
            'black': true,
            'white': false,
            'green': true,
            'yellow': true,
            'brown': false,
            'orange': false,
            'pink': false,
            'purple': false
        },
        {
            'name': 'Emma',
            'get acne': false,
            'red': false,
            'black': false,
            'white': false,
            'green': true,
            'yellow': false,
            'brown': false,
            'orange': false,
            'pink': true,
            'purple': false
        },
        {
            'name': 'Aidan',
            'get acne': false,
            'red': false,
            'black': false,
            'white': false,
            'green': false,
            'yellow': true,
            'brown': false,
            'orange': false,
            'pink': false,
            'purple': false
        },
        {
            'name': 'Madison',
            'get acne': false,
            'red': false,
            'black': false,
            'white': false,
            'green': false,
            'yellow': true,
            'brown': false,
            'orange': false,
            'pink': true,
            'purple': false
        },
        {
            'name': 'Ethan',
            'get acne': true,
            'red': false,
            'black': true,
            'white': false,
            'green': false,
            'yellow': false,
            'brown': false,
            'orange': true,
            'pink': true,
            'purple': false
        },
        {
            'name': 'Hannah',
            'get acne': false,
            'red': false,
            'black': true,
            'white': false,
            'green': false,
            'yellow': false,
            'brown': false,
            'orange': false,
            'pink': true,
            'purple': false
        },
        {
            'name': 'Matthew',
            'get acne': true,
            'red': false,
            'black': false,
            'white': false,
            'green': false,
            'yellow': false,
            'brown': true,
            'orange': true,
            'pink': false,
            'purple': false
        },
        {
            'name': 'Hailey',
            'get acne': true,
            'red': false,
            'black': false,
            'white': false,
            'green': false,
            'yellow': false,
            'brown': false,
            'orange': true,
            'pink': false,
            'purple': false
        },
        {
            'name': 'Nicholas',
            'get acne': false,
            'red': true,
            'black': false,
            'white': false,
            'green': false,
            'yellow': true,
            'brown': true,
            'orange': false,
            'pink': true,
            'purple': false
        }
    ]
};
exports.gradebook = {
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
        }
    ]
};
exports.gradebookMissing = {
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
            'quiz3': null,
            'quiz4': 7,
            'final': 85
        },
        {
            'name': "Eve",
            'age': 13,
            'quiz1': null,
            'quiz2': 9,
            'midterm': 84,
            'quiz3': 8,
            'quiz4': 8,
            'final': 77
        }
    ]
};
exports.gradebookSeq = {
    'header': [
        'name',
        'age',
        'quizzes',
        'midterm',
        'final'
    ],
    'rows': [
        {
            'name': "Bob",
            'age': 12,
            'quizzes': [8, 9, 7, 9],
            'midterm': 77,
            'final': 87
        },
        {
            'name': "Alice",
            'age': 17,
            'quizzes': [6, 8, 8, 7],
            'midterm': 88,
            'final': 85
        },
        {
            'name': "Eve",
            'age': 13,
            'quizzes': [7, 9, 8, 8],
            'midterm': 84,
            'final': 77
        }
    ]
};
exports.gradebookTable = {
    'header': [
        'name',
        'age',
        'quizzes',
        'midterm',
        'final'
    ],
    'rows': [
        {
            'name': "Bob",
            'age': 12,
            'quizzes': {
                'header': ['quiz#', 'grade'],
                rows: [
                    {
                        'quiz#': 1,
                        'grade': 8
                    },
                    {
                        'quiz#': 2,
                        'grade': 9
                    },
                    {
                        'quiz#': 3,
                        'grade': 7
                    },
                    {
                        'quiz#': 4,
                        'grade': 9
                    }
                ],
            },
            'midterm': 77,
            'final': 87
        },
        {
            'name': "Alice",
            'age': 17,
            'quizzes': {
                'header': ['quiz#', 'grade'],
                rows: [
                    {
                        'quiz#': 1,
                        'grade': 6
                    },
                    {
                        'quiz#': 2,
                        'grade': 8
                    },
                    {
                        'quiz#': 3,
                        'grade': 8
                    },
                    {
                        'quiz#': 4,
                        'grade': 7
                    }
                ],
            },
            'midterm': 88,
            'final': 85
        },
        {
            'name': "Eve",
            'age': 13,
            'quizzes': {
                'header': ['quiz#', 'grade'],
                rows: [
                    {
                        'quiz#': 1,
                        'grade': 7
                    },
                    {
                        'quiz#': 2,
                        'grade': 9
                    },
                    {
                        'quiz#': 3,
                        'grade': 8
                    },
                    {
                        'quiz#': 4,
                        'grade': 8
                    }
                ],
            },
            'midterm': 84,
            'final': 77
        }
    ]
};
