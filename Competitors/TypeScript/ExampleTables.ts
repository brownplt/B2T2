import { Table } from "./EncodeTables"

export const students: Table<
	['name', 'age', 'favorite color'],
	{ 'name': string, 'age': number, 'favorite color': string },
	3> = {
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
}

// Missing values can be represented with a special value, `undefined`

export const studentsMissing: Table<
	['name', 'age', 'favorite color'],
	{ 'name': string, 'age': number, 'favorite color': string },
	3> = {
	header: ['name', 'age', 'favorite color'],
	rows: [
		{
			'name': 'Bob',
			'age': undefined,
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
			'favorite color': undefined
		}
	]
}

export const employees: Table<
	['Last Name', 'Department ID'],
	{ 'Last Name': string, 'Department ID': number },
	6> = {
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
			'Department ID': undefined
		}
	]
}

export const departments: Table<
	['Department ID', 'Department Name'],
	{ 'Department ID': number, 'Department Name' },
	4
> = {
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
}

export const jellyAnon: Table<
	[
		'get acne',
		'red', 'black', 'white', 'green', 'yellow', 'brown', 'orange', 'pink', 'purple'
	],
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
	},
	10> = {
	'header':
		[
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
}


export const jellyNamed: Table<
	[
		'name',
		'get acne',
		'red', 'black', 'white', 'green', 'yellow', 'brown', 'orange', 'pink', 'purple'
	],
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
	},
	10> = {
	'header':
		[
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
}


export const gradebook: Table<
	[
		'name',
		'age',
		'quiz1',
		'quiz2',
		'midterm',
		'quiz3',
		'quiz4',
		'final'
	],
	{
		'name': string,
		'age': number,
		'quiz1': number,
		'quiz2': number,
		'midterm': number,
		'quiz3': number,
		'quiz4': number,
		'final': number,
	},
	3> = {
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
}



export const gradebookMissing: Table<
	[
		'name',
		'age',
		'quiz1',
		'quiz2',
		'midterm',
		'quiz3',
		'quiz4',
		'final'
	],
	{
		'name': string,
		'age': number,
		'quiz1': number,
		'quiz2': number,
		'midterm': number,
		'quiz3': number,
		'quiz4': number,
		'final': number,
	},
	3
> = {
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
			'quiz3': undefined,
			'quiz4': 7,
			'final': 85
		},
		{
			'name': "Eve",
			'age': 13,
			'quiz1': undefined,
			'quiz2': 9,
			'midterm': 84,
			'quiz3': 8,
			'quiz4': 8,
			'final': 77
		}
	]
}



export const gradebookSeq: Table<
	[
		'name',
		'age',
		'quizzes',
		'midterm',
		'final'
	],
	{
		'name': string,
		'age': number,
		'quizzes': [number, number, number, number],
		'midterm': number,
		'final': number,
	},
	3> = {
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
}



export const gradebookTable: Table<
	[
		'name',
		'age',
		'quizzes',
		'midterm',
		'final'
	],
	{
		'name': string,
		'age': number,
		'quizzes': Table<
			['quiz#', 'grade'],
			{ 'quiz#': 1 | 2 | 3 | 4, 'grade': number },
			4
		>,
		'midterm': number,
		'final': number,
	},
	3> = {
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
					}],
			},
			'midterm': 84,
			'final': 77
		}
	]
}
