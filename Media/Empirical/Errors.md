Empirical can verify this Markdown file with:

```skip
./empirical --verify-markdown Errors.md
```

Initial tables:

```
>>> let students = load("students.csv")

>>> let students_missing = load("students_missing.csv")

>>> let employees = load("employees.csv")

>>> let departments = load("departments.csv")

>>> let jelly_anon = load("jelly_anon.csv")

>>> let jelly_named = load("jelly_named.csv")

>>> let gradebook = load("gradebook.csv")

>>> let gradebook_missing = load("gradebook_missing.csv")

```

## Malformed Tables

We'll define the schema ahead of time instead of relying on inferencing.

```
>>> data Student: name: String, age: Int64, favorite_color: String end

>>> csv_load{Student}("students.csv")
  name age favorite_color
   Bob  12           blue
 Alice  17          green
   Eve  13            red

```

### missingSchema

The first row is assumed to be the header, so the header's omission causes the first data row to be ignored.

```
>>> csv_load{Student}("students_schema.csv")
  name age favorite_color
 Alice  17          green
   Eve  13            red

```

### missingRow

The empty row is ignored and there are no issues.

```
>>> csv_load{Student}("students_row.csv")
  name age favorite_color
   Bob  12           blue
 Alice  17          green

```

### missingCell

The missing cell in the middle results in a `nil` for the `age` and an empty `favorite_color`.

```
>>> csv_load{Student}("students_cell.csv")
  name age favorite_color
   Bob                   
 Alice  17          green
   Eve  13            red

```

### swappedColumns

The inverted columns cause all `age` data to be `nil`.

```
>>> csv_load{Student}("students_swapped.csv")
 name age favorite_color
   12               blue
   17              green
   13                red

```

### schemaTooShort

Since the header row is ignored, there are no issues.

```
>>> csv_load{Student}("students_short.csv")
  name age favorite_color
   Bob  12           blue
 Alice  17          green
   Eve  13            red

```

### schemaTooLong

Since the header row is ignored, there are no issues.

```
>>> csv_load{Student}("students_long.csv")
  name age favorite_color
   Bob  12           blue
 Alice  17          green
   Eve  13            red

```



## Using Table

### midFinal

The non-existent field is identified at compile time.

```
>>> gradebook.mid
Error: mid is not a member

>>> gradebook.midterm
[77, 88, 84]

```

### blackAndWhite

The error version can't be represented in Empirical.

```
>>> from jelly_anon select eat = black and white
   eat
 false
 false
 false
 false
 false
 false
 false
 false
 false
 false

```

### pieCount

The non-existent field is identified at compile time.

```
>>> let chart = from jelly_anon select count=count(get_acne) by value=get_acne

>>> chart.get_acne
Error: get_acne is not a member

>>> chart.count
[5, 5]

```

### brownGetAcne

The non-existent field is identified at compile time.

```
>>> let bg = from jelly_named select brown_and_get_acne = brown and get_acne

>>> bg.brown and bg.get_acne
Error: brown is not a member
Error: get_acne is not a member

>>> bg.brown_and_get_acne
[false, false, false, false, false, false, false, true, false, false]

```

### getOnlyRow

Array boundaries are checked at runtime.

```
>>> let get_only = from students select where name == "Alice"

>>> get_only.name[1]
Error: Index out of bounds

>>> get_only.name[0]
"Alice"

```

### favoriteColor

The invalid `where` clause is caught at compile time.

```
>>> from students select where "green"
Error: 'where' must be a boolean array; got type String

>>> from students select where favorite_color == "green"
  name age favorite_color
 Alice  17          green

```

### brownJellybeans

The error version can't be represented in Empirical.

```
>>> len(from jelly_anon select where brown)
2

```

### employeeToDepartment

The incorrect table causes a compile-time error.

```
>>> let name = "Heisenberg"

>>> let matched_emp = from departments select where last_name == name
Error: symbol last_name was not found
Error: 'where' must be a boolean array; got type Bool

>>> let matched_emp = from employees select where last_name == name

>>> let dept_id = matched_emp.department_id[0]

>>> let matched_dept = from departments select where department_id == dept_id

>>> matched_dept.department_name[0]
"Engineering"

```
