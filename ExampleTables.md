## `tableSF`: a simple table with no values missing.

```
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
| "Alice" | 17  | "green"        |
| "Eve"   | 13  | "red"          |
```

## `tableSM`: a simple table missing some values.

```
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Bob"   |     | "blue"         |
| "Alice" | 17  | "green"        |
| "Eve"   | 13  |                |
```

## `tableGF`: a gradebook table with no missing values.

```
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

## `tableGM`: a gradebook table missing some values.

```
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      |       | 7     | 85    |
| "Eve"   | 13  |       | 9     | 84      | 8     | 8     | 77    |
```

## `tableJellyAnon`: a jelly bean table that contains only boolean data

```
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

```
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

