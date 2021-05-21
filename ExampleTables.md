## `tableSF`: a simple table with no values missing.

```lua
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
| "Alice" | 17  | "green"        |
| "Eve"   | 13  | "red"          |
```

## `tableSM`: a simple table missing some values.

```lua
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Bob"   |     | "blue"         |
| "Alice" | 17  | "green"        |
| "Eve"   | 13  |                |
```

## `tableGF`: a gradebook table with no missing values.

```lua
```

## `tableGM`: a gradebook table missing some values.

```lua
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      |       | 7     | 85    |
| "Eve"   | 13  |       | 9     | 84      | 8     | 8     | 77    |
```

## `tableEmployee`: a table that contains employees and their departments (Adapted from [this table](https://en.wikipedia.org/wiki/Join_(SQL)))

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

## `tableDepartment`: a table that contains departments and their IDs ([source](https://en.wikipedia.org/wiki/Join_(SQL)))

```lua
| Department ID | Department Name |
| ------------- | --------------- |
| 31            | "Sales"         |
| 33            | "Engineering"   |
| 34            | "Clerical"      |
| 35            | "Marketing"     |
```

## `tableJellyAnon`: a jelly bean table that contains only boolean data

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

## `tableJellyNamed`: a jelly bean table that contains booleans and strings

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

