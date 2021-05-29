# Example Tables

This file lists some tables that are either used in other files (e.g. TableAPI and ExampleProgram), or illustrating interesting structural properties (e.g. having some values missing, having lists in cells, and having tables in cells).

## `students`: a simple table with no values missing.

```lua
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
| "Alice" | 17  | "green"        |
| "Eve"   | 13  | "red"          |
```

## `studentsMissing`: a simple table with some values missing.

```lua
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Bob"   |     | "blue"         |
| "Alice" | 17  | "green"        |
| "Eve"   | 13  |                |
```

## `gradebook`: a gradebook table with no missing values.

```lua
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

## `gradebookMissing`: a gradebook table with some missing values.

```lua
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      |       | 7     | 85    |
| "Eve"   | 13  |       | 9     | 84      | 8     | 8     | 77    |
```

## `gradebookSeq`: a gradebook table with sequence cells

```lua
| name    | age | quizzes      | midterm | final |
| ------- | --- | ------------ | ------- | ----- |
| "Bob"   | 12  | [8, 9, 7, 9] | 77      | 87    |
| "Alice" | 17  | [6, 8, 8, 7] | 88      | 85    |
| "Eve"   | 13  | [7, 9, 8, 8] | 84      | 77    |
```

## `gradebookTable`: a gradebook table with table cells

```lua
| name    | age | quizzes           | midterm | final |
| ------- | --- | ----------------- | ------- | ----- |
| "Bob"   | 12  | | quiz# | grade | | 77      | 87    |
|         |     | | ----- | ----- | |         |       |
|         |     | | 1     | 8     | |         |       |
|         |     | | 2     | 9     | |         |       |
|         |     | | 3     | 7     | |         |       |
|         |     | | 4     | 9     | |         |       |
| "Alice" | 17  | | quiz# | grade | | 88      | 85    |
|         |     | | ----- | ----- | |         |       |
|         |     | | 1     | 6     | |         |       |
|         |     | | 2     | 8     | |         |       |
|         |     | | 3     | 8     | |         |       |
|         |     | | 4     | 7     | |         |       |
| "Eve"   | 13  | | quiz# | grade | | 84      | 77    |
|         |     | | ----- | ----- | |         |       |
|         |     | | 1     | 7     | |         |       |
|         |     | | 2     | 9     | |         |       |
|         |     | | 3     | 8     | |         |       |
|         |     | | 4     | 8     | |         |       |
```

## `employee`: a table that contains employees and their department IDs ([source](https://en.wikipedia.org/wiki/Join_(SQL)))

```lua
| Last Name    | Department ID |
| ------------ | ------------- |
| "Rafferty"   | 31            |
| "Jones"      | 32            |
| "Heisenberg" | 33            |
| "Robinson"   | 34            |
| "Smith"      | 34            |
| "Williams"   |               |
```

## `department`: a table that contains departments and their IDs ([source](https://en.wikipedia.org/wiki/Join_(SQL)))

```lua
| Department ID | Department Name |
| ------------- | --------------- |
| 31            | "Sales"         |
| 33            | "Engineering"   |
| 34            | "Clerical"      |
| 35            | "Marketing"     |
```

## `jellyAnon`: a jelly bean table that contains only boolean data

```lua
| get-acne | red   | black | white | green | yellow | brown | orange | pink  | purple |
| -------- | ----- | ----- | ----- | ----- | ------ | ----- | ------ | ----- | ------ |
| true     | false | false | false | true  | false  | false | true   | false | false  |
| true     | false | true  | false | true  | true   | false | false  | false | false  |
| false    | false | false | false | true  | false  | false | false  | true  | false  |
| false    | false | false | false | false | true   | false | false  | false | false  |
| false    | false | false | false | false | true   | false | false  | true  | false  |
| true     | false | true  | false | false | false  | false | true   | true  | false  |
| false    | false | true  | false | false | false  | false | false  | true  | false  |
| true     | false | false | false | false | false  | true  | true   | false | false  |
| true     | false | false | false | false | false  | false | true   | false | false  |
| false    | true  | false | false | false | true   | true  | false  | true  | false  |
```

## `jellyNamed`: a jelly bean table that contains booleans and strings

```lua
| name       | get-acne | red   | black | white | green | yellow | brown | orange | pink  | purple |
| ---------- | -------- | ----- | ----- | ----- | ----- | ------ | ----- | ------ | ----- | ------ |
| "Emily"    | true     | false | false | false | true  | false  | false | true   | false | false  |
| "Jacob"    | true     | false | true  | false | true  | true   | false | false  | false | false  |
| "Emma"     | false    | false | false | false | true  | false  | false | false  | true  | false  |
| "Aidan"    | false    | false | false | false | false | true   | false | false  | false | false  |
| "Madison"  | false    | false | false | false | false | true   | false | false  | true  | false  |
| "Ethan"    | true     | false | true  | false | false | false  | false | true   | true  | false  |
| "Hannah"   | false    | false | true  | false | false | false  | false | false  | true  | false  |
| "Matthew"  | true     | false | false | false | false | false  | true  | true   | false | false  |
| "Hailey"   | true     | false | false | false | false | false  | false | true   | false | false  |
| "Nicholas" | false    | true  | false | false | false | true   | true  | false  | true  | false  |
```

