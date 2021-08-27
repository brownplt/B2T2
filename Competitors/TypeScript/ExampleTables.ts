import { Table } from "./EncodeTables"

export const students: Table<
	{
		'name': string,
		'age': number,
		'favorite color': string
	}> = {
	header: ['name', 'age', 'favorite color'],
	content: [
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
}

// Missing values can be represented with a special value, `null`

export const studentsMissing: Table<
	{
		'name': string,
		'age': number,
		'favorite color': String
	}> = {
	header: ['name', 'age', 'favorite color'],
	content: [
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
}

export const employees: Table<
	{ 'Last Name': string, 'Department ID': number }
> = {
	header: ['Last Name', 'Department ID'],
	content: [
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
}

export const departments: Table<
	{ 'Department ID': number, 'Department Name': string }
> = {
	header: ['Department ID', 'Department Name'],
	content: [
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
}

export const jellyAnon: Table<
	{
		'get acne': boolean,
		'red': boolean,
		'black': boolean,
		'white': boolean,
		'green': boolean,
		'yellow': boolean,
		'brown': boolean,
		'orange': boolean,
		'pink': boolean,
		'purple': boolean
	}> = {
	'header':
		[
			'get acne',
			'red', 'black', 'white', 'green', 'yellow', 'brown', 'orange', 'pink', 'purple'
		],
	'content': [

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
}


export const jellyNamed: Table<
	{
		'name': string,
		'get acne': boolean,
		'red': boolean,
		'black': boolean,
		'white': boolean,
		'green': boolean,
		'yellow': boolean,
		'brown': boolean,
		'orange': boolean,
		'pink': boolean,
		'purple': boolean
	}> = {
	'header':
		[
			'name',
			'get acne',
			'red', 'black', 'white', 'green', 'yellow', 'brown', 'orange', 'pink', 'purple'
		],
	'content': [
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
}


export const gradebook: Table<
	{
		'name': string,
		'age': number,
		'quiz1': number,
		'quiz2': number,
		'midterm': number,
		'quiz3': number,
		'quiz4': number,
		'final': number,
	}> = {
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
}



export const gradebookMissing: Table<
	{
		'name': string,
		'age': number,
		'quiz1': number,
		'quiz2': number,
		'midterm': number,
		'quiz3': number,
		'quiz4': number,
		'final': number,
	}> = {
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
}



export const gradebookSeq: Table<
	{
		'name': string,
		'age': number,
		'quizzes': [number, number, number, number],
		'midterm': number,
		'final': number,
	}> = {
	'header': [
		'name',
		'age',
		'quizzes',
		'midterm',
		'final'
	],
	'content': [

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
}



export const gradebookTable: Table<
	{
		'name': string,
		'age': number,
		'quizzes': Table<
			{
				'quiz#': 1 | 2 | 3 | 4, 
				'grade': number
			}>,
		'midterm': number,
		'final': number,
	}> = {
	'header': [
		'name',
		'age',
		'quizzes',
		'midterm',
		'final'
	],
	'content': [

		{
			'name': "Bob",
			'age': 12,
			'quizzes': {
				'header': ['quiz#', 'grade'],
				content: [
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
					}],
			},
			'midterm': 77,
			'final': 87
		},
		{
			'name': "Alice",
			'age': 17,
			'quizzes': {
				'header': ['quiz#', 'grade'],
				content: [
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
					}],
			},
			'midterm': 88,
			'final': 85
		},
		{
			'name': "Eve",
			'age': 13,
			'quizzes': {
				'header': ['quiz#', 'grade'],
				content: [
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
					}],
			},
			'midterm': 84,
			'final': 77
		}
	]
}
