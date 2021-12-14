# Table API

This file serves for two purposes:

- Challenge type system designers
- Set up a reference for comparing programming medias on their
  - __expressiveness:__ is an operators provided in one media but not the other?
  - __enforcement of constraints:__ how many of the required constraints are enforced? How many of the ensured constraints are communicated to the type system?

Real-world programming medias contain lots of operations. Collecting all of them won't be practical or necessary for the purposes of this file. Instead, we strive to gather at least all operators that are necessary for real-world data analysis. (Please let us know if you think a necessary operator is missing.) Furthermore, some operators impose interesting constraints that might be challenging to type systems. We selectively include some of these operators and hopefully they will illustrate all constraints that a type systems need to handle. In short, an operator is included if it meets one of the following criteria:

- necessary for realistic table programming
- illustrating interesting constraints not illustrated by other operators in this file

Operators are collected from the following resources:

- [Python pandas](https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf)
- [R dplyr cheatsheets](https://github.com/rstudio/cheatsheets/blob/master/data-transformation.pdf)
- [R tibbles](https://adv-r.hadley.nz/vectors-chap.html#tibble)
- [R Tidy data](https://cran.r-project.org/web/packages/tidyr/vignettes/tidy-data.html)
- [Julia DataFrames](https://dataframes.juliadata.org/stable/lib/functions/)
- [LINQ](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/query-expression-syntax-for-standard-query-operators)
- [MySQL](https://dev.mysql.com/doc/refman/8.0/en/sql-data-manipulation-statements.html)
- [PostgreSQL](https://www.postgresql.org/docs/current/dml.html)
- [Pyret taught in Brown CS111](https://hackmd.io/@cs111/table)
- [Pyret taught in the Bootstrap DS](https://bootstrapworld.org/materials/spring2021/en-us/courses/data-science/pathway-lessons.shtml)
  - [the definition of methods and some functions](https://www.pyret.org/docs/latest/tables.html)
  - [the definition of other functions](https://code.pyret.org/editor#share=1btFfKCcas4zkQ6-SYCYMkcDCqmduzQqB)
- [Compare Python pandas with R TidyVerse](https://pandas.pydata.org/pandas-docs/stable/getting_started/comparison/comparison_with_r.html)
- [Compare Python pandas with SQL](https://pandas.pydata.org/pandas-docs/stable/getting_started/comparison/comparison_with_sql.html)
- [Compare Julia DataFrame with Python pandas and R TidyVerse](https://dataframes.juliadata.org/stable/man/comparisons/)

For our convenience, we sometimes apply table operators to rows (e.g. `selectColumns(r, ["foo", "bar"])`). A implementation of Table API can either view rows as a subtype of tables, overload those operators, or give different names to row variants of the operators.

### Assumptions

#### Functions

- `even`: consumes an integer and returns a boolean
- `length`: consumes a sequence and measures its length
- `schema`: extracts the schema of a table
- `range`: consumes a number and produces a sequence of valid indices
- `concat`: concatenates two sequences or two strings
- `startsWith`: checks whether a string starts with another string
- `average`: computes the average of a sequence of numbers
- `filter`: the conventional sequence (e.g. lists) filter
- `map`: the conventional sequence (e.g. lists) map
- `removeDuplicates`: consumes a sequence and produces a subsequence with all duplicated elements removed
- `removeAll`: consumes two sequences and produces a subsequence of the first input, removing all elements that also appear in the second input.
- `colNameOfNumber`: converts a `Number` to a `ColName`

#### Relations

- `x` has no duplicates
- `x` is equal to `y`
- `x` is (not) in `y`
- `x` is a subsequence of `y`
- `x` is of sort `y`
- `x` is `y`
- `x` is a categorical sort
- `x` is (non-)negative
- `x` is equal to the sort of `y`
- `x` is the sort of elements of `y`
- `x` is equal to `y` with all `a_i` replaced with `b_i`

## Constructors

### `emptyTable :: t:Table`

#### Constraints

##### Requires:

##### Ensures:

- `schema(t)` is equal to `[]`
- `nrows(t)` is equal to `0`

#### Description

Create an empty table.

### `addRows :: t1:Table * rs:Seq<Row> -> t2:Table`

#### Constraints

##### Requires:

- for all `r` in `rs`, `schema(r)` is equal to `schema(t1)`

##### Ensures:

- `schema(t2)` is equal to `schema(t1)`
- `nrows(t2)` is equal to `nrows(t1) + length(rs)`

#### Description

Consumes a `Table` and a sequence of `Row` to add, and produces a new `Table` with the rows from the original table followed by the given `Row`s.

```lua
> addRows(
    students,
    [
      [row: 
        ("name", "Colton"), ("age", 19),
        ("favorite color", "blue")]
    ])
| name     | age | favorite color |
| -------- | --- | -------------- |
| "Bob"    | 12  | "blue"         |
| "Alice"  | 17  | "green"        |
| "Eve"    | 13  | "red"          |
| "Colton" | 19  | "blue"         |
> addRows(gradebook, [])
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

### `addColumn :: t1:Table * c:ColName * vs:Seq<Value> -> t2:Table`

#### Constraints

##### Requires:

- `c` is not in `header(t1)`
- `length(vs)` is equal to `nrows(t1)`

##### Ensures:

- `header(t2)` is equal to `concat(header(t1), [c])`
- for all `c'` in `header(t1)`, `schema(t2)[c']` is equal to `schema(t1)[c']`
- `schema(t2)[c]` is the sort of elements of `vs`
- `nrows(t2)` is equal to `nrows(t1)`

#### Description

Consumes a column name and a `Seq` of values and produces a new `Table` with the columns of the input `Table` followed by a column with the given name and values. Note that the length of `vs` must equal the length of the `Table`.

```lua
> hairColor = ["brown", "red", "blonde"]
> addColumn(students, "hair-color", hairColor)
| name    | age | favorite color | hair-color |
| ------- | --- | -------------- | ---------- |
| "Bob"   | 12  | "blue"         | "brown"    |
| "Alice" | 17  | "green"        | "red"      |
| "Eve"   | 13  | "red"          | "blonde"   |
> presentation = [9, 9, 6]
> addColumn(gradebook, "presentation", presentation)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final | presentation |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- | ------------ |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    | 9            |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    | 9            |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    | 6            |
```

### `buildColumn :: t1:Table * c:ColName * f:(r:Row -> v:Value) -> t2:Table`

#### Constraints

##### Requires:

- `c` is not in `header(t1)`

##### Ensures:

- `schema(r)` is equal to `schema(t1)`
- `header(t2)` is equal to `concat(header(t1), [c])`
- for all `c'` in `header(t1)`, `schema(t2)[c']` is equal to `schema(t1)[c']`
- `schema(t2)[c]` is equal to the sort of `v`
- `nrows(t2)` is equal to `nrows(t1)`

#### Description

Consumes an existing `Table` and produces a new `Table` containing an additional column with the given `ColName`, using `f` to compute the values for that column, once for each row.

```lua
> isTeenagerBuilder =
    function(r):
      12 < getValue(r, "age") and getValue(r, "age") < 20
    end
> buildColumn(students, "is-teenager", isTeenagerBuilder)
| name    | age | favorite color | is-teenager |
| ------- | --- | -------------- | ----------- |
| "Bob"   | 12  | "blue"         | false       |
| "Alice" | 17  | "green"        | true        |
| "Eve"   | 13  | "red"          | true        |
> didWellInFinal =
    function(r):
      85 <= getValue(r, "final")
    end
> buildColumn(gradebook, "did-well-in-final", didWellInFinal)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final | did-well-in-final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- | ----------------- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    | true              |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    | true              |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    | false             |
```

### `vcat :: t1:Table * t2:Table -> t3:Table`

#### Constraints

##### Requires:

- `schema(t1)` is equal to `schema(t2)`

##### Ensures:

- `schema(t3)` is equal to `schema(t1)`
- `nrows(t3)` is equal to `nrows(t1) + nrows(t2)`

#### Description

Combines two tables vertically. The output table starts with rows from the first input table, followed by the rows from the second input table.

```lua
> increaseAge =
    function(r):
      [row: ("age", 1 + getValue(r, "age"))]
    end
> vcat(students, update(students, increaseAge))
| name    | age | favorite color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
| "Alice" | 17  | "green"        |
| "Eve"   | 13  | "red"          |
| "Bob"   | 13  | "blue"         |
| "Alice" | 18  | "green"        |
| "Eve"   | 14  | "red"          |
> curveMidtermAndFinal =
    function(r):
      curve =
        function(n):
          n + 5
        end
      [row:
        ("midterm", curve(getValue("midterm"))),
        ("final", curve(getValue("final")))]
    end
> vcat(gradebook, update(gradebook, curveMidtermAndFinal))
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
| "Bob"   | 12  | 8     | 9     | 82      | 7     | 9     | 92    |
| "Alice" | 17  | 6     | 8     | 93      | 8     | 7     | 90    |
| "Eve"   | 13  | 7     | 9     | 89      | 8     | 8     | 82    |
```

### `hcat :: t1:Table * t2:Table -> t3:Table`

#### Constraints

##### Requires:

- `concat(header(t1), header(t2))` has no duplicates
- `nrows(t1)` is equal to `nrows(t2)`

##### Ensures:

- `schema(t3)` is equal to `concat(schema(t1), schema(t2))`
- `nrows(t3)` is equal to `nrows(t1)`

#### Description

Combines two tables horizontally. The output table starts with columns from the first input, followed by the columns from the second input.

```lua
> hcat(students, dropColumns(gradebook, ["name", "age"]))
| name    | age | favorite color | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | -------------- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | "blue"         | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | "green"        | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | "red"          | 7     | 9     | 84      | 8     | 8     | 77    |
> hcat(dropColumns(students, ["name", "age"]), gradebook)
| favorite color | name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| -------------- | ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "blue"         | "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "green"        | "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "red"          | "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

### `values :: rs:Seq<Row> -> t:Table`

#### Constraints

##### Requires:

- `length(rs)` is positive
- for all `r` in `rs`, `schema(r)` is equal to `schema(rs[0])`

##### Ensures:

- `schema(t)` is equal to `schema(rs[0])`
- `nrows(t)` is equal to `length(rs)`

#### Description

Returns a sequence of one or more rows as a table.

```lua
> values([
    [row: ("name", "Alice")],
    [row: ("name", "Bob")]])
| name    |
| ------- |
| "Alice" |
| "Bob"   |
> values([
    [row: ("name", "Alice"), ("age", 12)],
    [row: ("name", "Bob"), ("age", 13)]])
| name    | age |
| ------- | --- |
| "Alice" | 12  |
| "Bob"   | 13  |
```

### `crossJoin :: t1:Table * t2:Table -> t3:Table`

#### Constraints

##### Requires:

- `concat(header(t1), header(t2))` has no duplicates

##### Ensures:

- `schema(t3)` is equal to `concat(schema(t1), schema(t2))`
- `nrows(t3)` is equal to `nrows(t1) * nrows(t2)`

#### Description

Computes the cartesian product of two tables.

```lua
> petiteJelly = subTable(jellyAnon, [0, 1], [0, 1, 2])
> petiteJelly
| get acne | red   | black |
| -------- | ----- | ----- |
| true     | false | false |
| true     | false | true  |
> crossJoin(students, petiteJelly)
| name    | age | favorite color | get acne | red   | black |
| ------- | --- | -------------- | -------- | ----- | ----- |
| "Bob"   | 12  | "blue"         | true     | false | false |
| "Bob"   | 12  | "blue"         | true     | false | true  |
| "Alice" | 17  | "green"        | true     | false | false |
| "Alice" | 17  | "green"        | true     | false | true  |
| "Eve"   | 13  | "red"          | true     | false | false |
| "Eve"   | 13  | "red"          | true     | false | true  |
> crossJoin(emptyTable, petiteJelly)
| get acne | red   | black |
| -------- | ----- | ----- |
```

### `leftJoin :: t1:Table * t2:Table * cs:Seq<ColName> -> t3:Table`

#### Constraints

##### Requires:

- `cs` has no duplicates
- for all `c` in `cs`, `c` is in `header(t1)`
- for all `c` in `cs`, `c` is in `header(t2)`
- for all `c` in `cs`, `schema(t1)[c]` is equal to `schema(t2)[c]`
- `concat(header(t1), removeAll(header(t2), cs))` has no duplicates

##### Ensures:

- `header(t3)` is equal to `concat(header(t1), removeAll(header(t2), cs))`
- for all `c` in `header(t1)`, `schema(t3)[c]` is equal to `schema(t1)[c]`
- for all `c` in `removeAll(header(t2), cs))`, `schema(t3)[c]` is equal to `schema(t2)[c]`
- `nrows(t3)` is equal to `nrows(t1)`

#### Description

Looks up more information on rows of the first table and add those information to create a new table. The named columns define the keys for looking up. If there is no corresponding row in `t2`, the extra column will be filled with empty cells.

```lua
> leftJoin(students, gradebook, ["name", "age"])
| name    | age | favorite color | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | -------------- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | "blue"         | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | "green"        | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | "red"          | 7     | 9     | 84      | 8     | 8     | 77    |
> leftJoin(employees, departments, ["Department ID"])
| Last Name    | Department ID | Department Name |
| ------------ | ------------- | --------------- |
| "Rafferty"   | 31            | "Sales"         |
| "Jones"      | 32            |                 |
| "Heisenberg" | 33            | "Engineering"   |
| "Robinson"   | 34            | "Clerical"      |
| "Smith"      | 34            | "Clerical"      |
| "Williams"   |               |                 |
```

## Properties

### `nrows :: t:Table -> n:Number`

#### Constraints

##### Requires:

##### Ensures:

- `n` is equal to `nrows(t)`

#### Description

Returns a `Number` representing the number of rows in the `Table`.

```lua
> nrows(emptyTable)
0
> nrows(studentsMissing)
3
```

### `ncols :: t:Table -> n:Number`

#### Constraints

##### Requires:

##### Ensures:

- `n` is equal to `ncols(t)`

#### Description

Returns a `Number` representing the number of columns in the `Table`.

```lua
> ncols(students)
3
> ncols(studentsMissing)
3
```

### `header :: t:Table -> cs:Seq<ColName>`

#### Constraints

##### Requires:

##### Ensures:

- `cs` is equal to `header(t)`

#### Description

Returns a `Seq` representing the column names in the `Table`.

```lua
> header(students)
["name", "age", "favorite color"]
> header(gradebook)
["name", "age", "quiz1", "quiz2", "midterm", "quiz3", "quiz4", "final"]
```

## Access Subcomponents

### `getRow :: t:Table * n:Number -> r:Row`

#### Constraints

##### Requires:

- `n` is in `range(nrows(t))`

##### Ensures:

#### Description

Extracts a row out of a table by a numeric index.

```lua
> getRow(students, 0)
[row: ("name", "Bob"), ("age", 12), ("favorite color", "blue")]
> getRow(gradebook, 1)
[row:
  ("name", "Alice"), ("age", 17),
  ("quiz1", 6), ("quiz2", 8), ("midterm", 88),
  ("quiz3", 8), ("quiz4", 7), ("final", 85)]
```

### `getValue :: r:Row * c:ColName -> v:Value`

#### Constraints

##### Requires:

- `c` is in header(r)

##### Ensures:

- `v` is of sort `schema(r)[c]`

#### Description

Retrieves the value for the column `c` in the row `r`.

```lua
> getValue([row: ("name", "Bob"),  ("age", 12)], "name")
"Bob"
> getValue([row: ("name", "Bob"),  ("age", 12)], "age")
12
```

### (overloading 1/2) `getColumn :: t:Table * n:Number -> vs:Seq<Value>`

#### Constraints

##### Requires:

- `n` is in `range(ncols(t))`

##### Ensures:

- `length(vs)` is equal to `nrows(t)`
- for all `v` in `vs`, `v` is of sort `schema(t)[header(t)[n]]`

#### Description

Returns a `Seq` of the values in the indexed column in `t`.

```lua
> getColumn(students, 1)
[12, 17, 13]
> getColumn(gradebook, 0)
["Bob", "Alice", "Eve"]
```

### (overloading 2/2) `getColumn :: t:Table * c:ColName -> vs:Seq<Value>`

#### Constraints

##### Requires:

- `c` is in `header(t)`

##### Ensures:

- for all `v` in `vs`, `v` is of sort `schema(t)[c]`
- `length(vs)` is equal to `nrows(t)`

#### Description

Returns a `Seq` of the values in the named column in `t`.

```lua
> getColumn(students, "age")
[12, 17, 13]
> getColumn(gradebook, "name")
["Bob", "Alice", "Eve"]
```

## Subtable

### (overload 1/2) `selectRows :: t1:Table * ns:Seq<Number> -> t2:Table`

#### Constraints

##### Requires:

- for all `n` in `ns`, `n` is in `range(nrows(t1))`

##### Ensures:

- `schema(t2)` is equal to `schema(t1)`
- `nrows(t2)` is equal to `length(ns)`

#### Description

Given a `Table` and a `Seq<Number>` containing row indices, produces a new `Table` containing only those rows.

```lua
> selectRows(students, [2, 0, 2, 1])
| name    | age | favorite color |
| ------- | --- | -------------- |
| "Eve"   | 13  | "red"          |
| "Bob"   | 12  | "blue"         |
| "Eve"   | 13  | "red"          |
| "Alice" | 17  | "green"        |
> selectRows(gradebooks, [2, 1])
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
```

### (overload 2/2) `selectRows :: t1:Table * bs:Seq<Boolean> -> t2:Table`

#### Constraints

##### Requires:

- `length(bs)` is equal to `nrows(t1)`

##### Ensures:

- `schema(t2)` is equal to `schema(t1)`
- `nrows(t2)` is equal to `length(removeAll(bs, [false]))`

#### Description

Given a `Table` and a `Seq<Boolean>` that represents a predicate on rows, returns a `Table` with only the rows for which the predicate returns true.

```lua
> selectRows(students, [true, false, true])
| name  | age | favorite color |
| ----- | --- | -------------- |
| "Bob" | 12  | "blue"         |
| "Eve" | 13  | "red"          |
> selectRows(gradebook, [false, false, true])
| name  | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ----- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Eve" | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

### (overload 1/3) `selectColumns :: t1:Table * bs:Seq<Boolean> -> t2:Table`

#### Constraints

##### Requires:

- `length(bs)` is equal to `ncols(t1)`

##### Ensures:

- `header(t2)` is a subsequence of `header(t1)`
- for all `i` in `range(ncols(t1))`, `header(t1)[i]` is in `header(t2)` if and only if `bs[i]` is equal to `true`
- `schema(t2)` is a subsequence of `schema(t1)`
- `nrows(t2)` is equal to `nrows(t1)`

#### Description

Consumes a `Table` and a `Seq<Boolean>` deciding whether each column should be kept, and produces a new `Table` containing only those columns. The order of the columns is as in the input table.

```lua
> selectColumns(students, [true, true, false])
| name    | age |
| ------- | --- |
| "Bob"   | 12  |
| "Alice" | 17  |
| "Eve"   | 13  |
> selectColumns(gradebook, [true, false, false, false, true, false, false, true])
| name    | midterm | final |
| ------- | ------- | ----- |
| "Bob"   | 77      | 87    |
| "Alice" | 88      | 85    |
| "Eve"   | 84      | 77    |
```

### (overload 2/3) `selectColumns :: t1:Table * ns:Seq<Number> -> t2:Table`
  
#### Constraints

##### Requires:

- `ns` has no duplicates
- for all `n` in `ns`, `n` is in `range(ncols(t1))`

##### Ensures:

- `ncols(t2)` is equal to `length(ns)`
- for all `i` in `range(length(ns))`, `header(t2)[i]` is equal to `header(t1)[ns[i]]`
- for all `c` in `header(t2)`, `schema(t2)[c]` is equal to `schema(t1)[c]`
- `nrows(t2)` is equal to `nrows(t1)`

#### Description

Consumes a `Table` and a `Seq<Number>` containing column indices, and produces a new `Table` containing only those columns. The order of the columns is as given in the input `Seq`.


```lua
> selectColumns(students, [2, 1])
| favorite color | age |
| -------------- | --- |
| "blue"         | 12  |
| "green"        | 17  |
| "red"          | 13  |
> selectColumns(gradebook, [7, 0, 4])
| final | name    | midterm |
| ----- | ------- | ------- |
| 87    | "Bob"   | 77      |
| 85    | "Alice" | 88      |
| 77    | "Eve"   | 84      |
```

### (overload 3/3) `selectColumns :: t1:Table * cs:Seq<ColName> -> t2:Table`

#### Constraints

##### Requires:

- `cs` has no duplicates
- for all `c` in `cs`, `c` is in `header(t1)`

##### Ensures:

- `header(t2)` is equal to `cs` 
- for all `c` in `header(t2)`, `schema(t2)[c]` is equal to `schema(t1)[c]`
- `nrows(t2)` is equal to `nrows(t1)`

#### Description

Consumes a `Table` and a `Seq<ColName>` containing column names, and produces a new `Table` containing only those columns. The order of the columns is as given in the input `Seq`.

```lua
> selectColumns(students, ["favorite color", "age"])
| favorite color | age |
| -------------- | --- |
| "blue"         | 12  |
| "green"        | 17  |
| "red"          | 13  |
> selectColumns(gradebook, ["final", "name", "midterm"])
| final | name    | midterm |
| ----- | ------- | ------- |
| 87    | "Bob"   | 77      |
| 85    | "Alice" | 88      |
| 77    | "Eve"   | 84      |
```

### `head :: t1:Table * n:Number -> t2:Table`

#### Constraints

##### Requires:

- if `n` is non-negative then `n` is in `range(nrows(t1))`
- if `n` is negative then `- n` is in `range(nrows(t1))`

##### Ensures:

- `schema(t2)` is equal to `schema(t1)`
- if `n` is non-negative then `nrows(t2)` is equal to `n`
- if `n` is negative then `nrows(t2)` is equal to `nrows(t1) + n`

#### Description

Returns the first `n` rows of the table based on position. For negative values of `n`, this function returns all rows except the last `n` rows.

```lua
> head(students, 1)
| name    | age | favorite color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
> head(students, -2)
| name    | age | favorite color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
```

### `distinct :: t1:Table -> t2:Table`

#### Constraints

##### Requires:

##### Ensures:

- `schema(t2)` is equal to `schema(t1)`

#### Description

Retains only unique/distinct rows from an input `Table`.

```lua
> distinct(students)
| name    | age | favorite color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
| "Alice" | 17  | "green"        |
| "Eve"   | 13  | "red"          |
> distinct(selectColumns(gradebook, ["quiz3"]))
| quiz3 |
| ----- |
| 7     |
| 8     |
```

### `dropColumn :: t1:Table * c:ColName -> t2:Table`

#### Constraints

##### Requires:

- `c` is in `header(t1)`

##### Ensures:

- `nrows(t2)` is equal to `nrows(t1)`
- `header(t2)` is equal to `removeAll(header(t1), [c])`
- `schema(t2)` is a subsequence of `schema(t1)`

#### Description

Returns a `Table` that is the same as `t`, except without the named column.

```lua
> dropColumn(students, "age")
| name    | favorite color |
| ------- | -------------- |
| "Bob"   | "blue"         |
| "Alice" | "green"        |
| "Eve"   | "red"          |
> dropColumn(gradebook, "final")
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 |
| ------- | --- | ----- | ----- | ------- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     |
```

### `dropColumns :: t1:Table * cs:Seq<ColName> -> t2:Table`

#### Constraints

##### Requires:

- for all `c` in `cs`, `c` is in `header(t1)`
- `cs` has no duplicates

##### Ensures:

- `nrows(t2)` is equal to `nrows(t1)`
- `header(t2)` is equal to `removeAll(header(t1), cs)`
- `schema(t2)` is a subsequence of `schema(t1)`

#### Description

Returns a `Table` that is the same as `t`, except without the named columns.

```lua
> dropColumns(students, ["age"])
| name    | favorite color |
| ------- | -------------- |
| "Bob"   | "blue"         |
| "Alice" | "green"        |
| "Eve"   | "red"          |
> dropColumns(gradebook, ["final", "midterm"])
| name    | age | quiz1 | quiz2 | quiz3 | quiz4 |
| ------- | --- | ----- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 7     | 9     |
| "Alice" | 17  | 6     | 8     | 8     | 7     |
| "Eve"   | 13  | 7     | 9     | 8     | 8     |
```

### `tfilter :: t1:Table * f:(r:Row -> b:Boolean) -> t2:Table`

#### Constraints

##### Requires:

##### Ensures:

- `schema(r)` is equal to `schema(t1)`
- `schema(t2)` is equal to `schema(t1)`

#### Description

Given a `Table` and a predicate on rows, returns a `Table` with only the rows for which the predicate returns `true`.

```lua
> ageUnderFifteen =
    function(r):
      getValue(r, "age") < 15
    end
> tfilter(students, ageUnderFifteen)
| name  | age | favorite color |
| ----- | --- | -------------- |
| "Bob" | 12  | "blue"         |
| "Eve" | 13  | "red"          |
> nameLongerThan3Letters =
    function(r):
      length(getValue(r, "name")) > 3
    end
> tfilter(gradebook, nameLongerThan3Letters)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
```

## Ordering

### `tsort :: t1:Table * c:ColName * b:Boolean -> t2:Table`

#### Constraints

##### Requires:

- `c` is in `header(t1)`
- `schema(t1)[c]` is `Number`

##### Ensures:

- `nrows(t2)` is equal to `nrows(t1)`
- `schema(t2)` is equal to `schema(t1)`

#### Description

Given a `Table` and one of its column names, returns a `Table` with the same rows ordered based on the named column. If `b` is `true`, the `Table` will be sorted in ascending order, otherwise it will be in descending order.

```lua
> tsort(students, "age", true)
| name    | age | favorite color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
| "Eve"   | 13  | "red"          |
| "Alice" | 17  | "green"        |
> tsort(gradebook, "final", false)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

### `sortByColumns :: t1:Table * cs:Seq<ColName> -> t2:Table`

#### Constraints

##### Requires:

- `cs` has no duplicates
- for all `c` in `cs`, `c` is in `header(t1)`
- for all `c` in `cs`, `schema(t1)[c]` is `Number`

##### Ensures:

- `nrows(t2)` is equal to `nrows(t1)`
- `schema(t2)` is equal to `schema(t1)`

#### Description

Given a `Table` and a sequence of column names in that `Table`, return a `Table` with the same rows ordered ascendingly based on the named columns.

```lua
> sortByColumns(students, ["age"])
| name    | age | favorite color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
| "Eve"   | 13  | "red"          |
| "Alice" | 17  | "green"        |
> sortByColumns(gradebook, ["quiz2", "quiz1"])
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
```

### `orderBy :: t1:Table * Seq<Exists K . getKey:(r:Row -> k:K) * compare:(k1:K * k2:K -> Boolean)> -> t2:Table`

#### Constraints

##### Requires:

##### Ensures:

- `schema(r)` is equal to `schema(t1)`
- `schema(t2)` is equal to `schema(t1)`
- `nrows(t2)` is equal to `nrows(t1)`

#### Description

Sorts the rows of a `Table` in ascending order by using a sequence of specified comparers.

```lua
> nameLength =
    function(r):
      length(getValue(r, "name"))
    end
> le =
    function(n1, n2):
      n1 <= n2
    end
> orderBy(students, [(nameLength, le)])
| name    | age | favorite color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
| "Eve"   | 13  | "red"          |
| "Alice" | 17  | "green"        |
> midtermAndFinal =
    function(r):
      [getValue(r, "midterm"), getValue(r, "final")]
    end
> compareGrade =
    function(g1, g2):
      le(average(g1), average(g2))
    end
> orderBy(gradebook, [(nameLength, ge), (midtermAndFinal, compareGrade)])
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
```

## Aggregate

### `count :: t1:Table * c:ColName -> t2:Table`

#### Constraints

##### Requires:

- `c` is in `header(t1)`
- `schema(t1)[c]` is a categorical sort

##### Ensures:

- `header(t2)` is equal to `["value", "count"]`
- `schema(t2)["value"]` is equal to `schema(t1)[c]`
- `schema(t2)["count"]` is equal to `Number`
- `nrows(t2)` is equal to `length(removeDuplicates(getColumn(t1, c)))`

#### Description

Takes a `Table` and a `ColName` representing the name of a column in that `Table`. Produces a `Table` that summarizes how many rows have each value in the given column.

```lua
> count(students, "favorite color")
| value   | count |
| ------- | ----- |
| "blue"  | 1     |
| "green" | 1     |
| "red"   | 1     |
> count(gradebook, "age")
| value | count |
| ----- | ----- |
| 12    | 1     |
| 17    | 1     |
| 13    | 1     |
```

### `bin :: t1:Table * c:ColName * n:Number -> t2:Table`

#### Constraints

##### Requires:

- `c` is in `header(t1)`
- `schema(t1)[c]` is `Number`

##### Ensures:

- `header(t2)` is equal to `["group", "count"]`
- `schema(t2)["group"]` is `String`
- `schema(t2)["count"]` is `Number`

#### Description

Groups the values of a numeric column into bins. The parameter `n` specifies the bin width. This function is useful in creating histograms and converting continuous random variables to categorical ones.

```lua
> bin(students, "age", 5)
| group            | count |
| ---------------- | ----- |
| "10 <= age < 15" | 2     |
| "15 <= age < 20" | 1     |
> bin(gradebook, "final", 5)
| group            | count |
| ---------------- | ----- |
| "75 <= age < 80" | 1     |
| "80 <= age < 85" | 0     |
| "85 <= age < 90" | 2     |
```

### `pivotTable :: t1:Table * cs:Seq<ColName> * aggs:Seq<ColName * ColName * Function> -> t2:Table`

#### Constraints

Let `ci1` and `ci2` and `fi` be the components of `aggs[i]` for all `i` in `range(length(aggs))`

##### Requires:

- for all `c` in `cs`, `c` is in `header(t1)`
- for all `c` in `cs`, `schema(t1)[c]` is a categorical sort
- `ci2` is in `header(t1)`
- `concat(cs, [c11, ... , cn1])` has no duplicates

##### Ensures:

- `fi` consumes `Seq<schema(t1)[ci2]>`
- `header(t2)` is equal to `concat(cs, [c11, ... , cn1])`
- for all `c` in `cs`, `schema(t2)[c]` is equal to `schema(t1)[c]`
- `schema(t2)[ci1]` is equal to the sort of outputs of `fi` for all `i`

#### Description

Partitions rows into groups and summarize each group with the functions in `agg`. Each element of `agg` specifies the output column, the input column, and the function that compute the summarizing value (e.g. average, sum, and count).

```lua
> pivotTable(students, ["favorite color"], [("age-average", "age", average)])
| favorite color | age-average |
| -------------- | ----------- |
| "blue"         | 12          |
| "green"        | 17          |
| "red"          | 13          |
> proportion =
    function(bs):
      n = length(filter(bs, function(b): b end))
      n / length(bs)
    end
> pivotTable(
    jellyNamed,
    ["get acne", "brown"],
    [
      ("red proportion", "red", proportion),
      ("pink proportion", "pink", proportion)
    ])
| get acne | brown | red proportion | pink proportion |
| -------- | ----- | -------------- | --------------- |
| false    | false | 0              | 3/4             |
| false    | true  | 1              | 1               |
| true     | false | 0              | 1/4             |
| true     | true  | 0              | 0               |
```

### `groupBy<K,V> :: t1:Table * key:(r1:Row -> k1:K) * project:(r2:Row -> v:V) * aggregate:(k2:K * vs:Seq<V> -> r3:Row) -> t2:Table`

#### Constraints

##### Requires:

##### Ensures:

- `schema(r1)` is equal to `schema(t1)`
- `schema(r2)` is equal to `schema(t1)`
- `schema(t2)` is equal to `schema(r3)`
- `nrows(t2)` is equal to `length(removeDuplicates(ks))`, where `ks` is the results of applying `key` to each row of `t1`. `ks` can be defined with `select` and `getColumn`.

#### Description

Groups the rows of a table according to a specified key selector function and creates a result value from each group and its key. The rows of each group are projected by using a specified function.

```lua
> colorTemp =
    function(r):
      if getValue(r, "favorite color") == "red":
        "warm"
      else:
        "cool"
      end
    end
> nameLength =
    function(r):
      length(getValue(r, "name"))
    end
> aggregate =
    function(k, vs):
      [row: ("key", k), ("average", average(vs))]
    end
> groupBy(students, colorTemp, nameLength, aggregate)
| key    | average |
| ------ | ------- |
| "warm" | 3       |
| "cool" | 4       |
> abstractAge =
    function(r):
      if (getValue(r, "age") <= 12):
        "kid"
      else if (getValue(r, "age") <= 19):
        "teenager"
      else:
        "adult"
      end
    end
> finalGrade =
    function(r):
      getValue(r, "final")
    end
> groupBy(gradebook, abstractAge, finalGrade, aggregate)
| key        | average |
| ---------- | ------- |
| "kid"      | 87      |
| "teenager" | 81      |
```

## Missing values

### `completeCases :: t:Table * c:ColName -> bs:Seq<Boolean>`

#### Constraints

##### Requires:

- `c` is in `header(t)`

##### Ensures:

- `length(bs)` is equal to `nrows(t)`

#### Description

Return a `Seq<Boolean>` with `true` entries indicating rows without missing values (complete cases) in table `t`.

```lua
> completeCases(students, "age")
[true, true, true]
> completeCases(studentsMissing, "age")
[false, true, true]
```

### `dropna :: t1:Table -> t2:Table`

#### Constraints

##### Requires:

##### Ensures:

- `schema(t2)` is equal to `schema(t1)`

#### Description

Removes rows that have some values missing

```lua
> dropna(studentsMissing)
| name    | age | favorite color |
| ------- | --- | -------------- |
| "Alice" | 17  | "green"        |
> dropna(gradebookMissing)
| name  | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ----- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob" | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
```

### `fillna :: t1:Table * c:ColName * v:Value -> t2:Table`

#### Constraints

##### Requires:

- `c` is in `header(t1)`
- `v` is of sort `schema(t1)[c]`

##### Ensures:

- `schema(t2)` is equal to `schema(t1)`
- `nrows(t2)` is equal to `nrows(t1)`

#### Description

Scans the named column and fills in `v` when a cell is missing value.

```lua
> fillna(studentsMissing, "favorite color", "white")
| name    | age | favorite color |
| ------- | --- | -------------- |
| "Bob"   |     | "blue"         |
| "Alice" | 17  | "green"        |
| "Eve"   | 13  | "white"        |
> fillna(gradebookMissing, "quiz1", 0)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      |       | 7     | 85    |
| "Eve"   | 13  | 0     | 9     | 84      | 8     | 8     | 77    |
```

## Data Cleaning

### `pivotLonger :: t1:Table * cs:Seq<ColName> * c1:ColName * c2:ColName -> t2:Table`

#### Constraints

##### Requires:

- `length(cs)` is positive
- `cs` has no duplicates
- for all `c` in `cs`, `c` is in `header(t1)`
- for all `c` in `cs`, `schema(t1)[c]` is equal to `schema(t1)[cs[0]]`
- `concat(removeAll(header(t1), cs), [c1, c2])` has no duplicates

##### Ensures:

- `header(t2)` is equal to `concat(removeAll(header(t1), cs), [c1, c2])`
- for all `c` in `removeAll(header(t1), cs)`, `schema(t2)[c]` is equal to `schema(t1)[c]`
- `schema(t2)[c1]` is equal to `ColName`
- `schema(t2)[c2]` is equal to `schema(t1)[cs[0]]`

#### Description

Reshapes the input table and make it longer. The data kept in the named columns are moved to two new columns, one for the column names and the other for the cell values.

```lua
> pivotLonger(gradebook, ["midterm", "final"], "exam", "score")
| name    | age | quiz1 | quiz2 | quiz3 | quiz4 | exam      | score |
| ------- | --- | ----- | ----- | ----- | ----- | --------- | ----- |
| "Bob"   | 12  | 8     | 9     | 7     | 9     | "midterm" | 77    |
| "Bob"   | 12  | 8     | 9     | 7     | 9     | "final"   | 87    |
| "Alice" | 17  | 6     | 8     | 8     | 7     | "midterm" | 88    |
| "Alice" | 17  | 6     | 8     | 8     | 7     | "final"   | 85    |
| "Eve"   | 13  | 7     | 9     | 8     | 8     | "midterm" | 84    |
| "Eve"   | 13  | 7     | 9     | 8     | 8     | "final"   | 77    |
> pivotLonger(gradebook, ["quiz1", "quiz2", "quiz3", "quiz4", "midterm", "final"], "test", "score")
| name    | age | test      | score |
| ------- | --- | --------- | ----- |
| "Bob"   | 12  | "quiz1"   | 8     |
| "Bob"   | 12  | "quiz2"   | 9     |
| "Bob"   | 12  | "quiz3"   | 7     |
| "Bob"   | 12  | "quiz4"   | 9     |
| "Bob"   | 12  | "midterm" | 77    |
| "Bob"   | 12  | "final"   | 87    |
| "Alice" | 17  | "quiz1"   | 6     |
| "Alice" | 17  | "quiz2"   | 8     |
| "Alice" | 17  | "quiz3"   | 8     |
| "Alice" | 17  | "quiz4"   | 7     |
| "Alice" | 17  | "midterm" | 88    |
| "Alice" | 17  | "final"   | 85    |
| "Eve"   | 13  | "quiz1"   | 7     |
| "Eve"   | 13  | "quiz2"   | 9     |
| "Eve"   | 13  | "quiz3"   | 8     |
| "Eve"   | 13  | "quiz4"   | 8     |
| "Eve"   | 13  | "midterm" | 84    |
| "Eve"   | 13  | "final"   | 77    |
```

### `pivotWider :: t1:Table * c1:ColName * c2:ColName -> t2:Table`

#### Constraints

##### Requires:

- `c1` is in `header(t1)`
- `c2` is in `header(t1)`
- `schema(t1)[c1]` is `ColName`
- `concat(removeAll(header(t1), [c1, c2]), removeDuplicates(getColumn(t1, c1)))` has no duplicates

##### Ensures:

- `header(t2)` is equal to `concat(removeAll(header(t1), [c1, c2]), removeDuplicates(getColumn(t1, c1)))`
- for all `c` in `removeAll(header(t1), [c1, c2])`, `schema(t2)[c]` is equal to `schema(t1)[c]`
- for all `c` in `removeDuplicates(getColumn(t1, c1))`, `schema(t2)[c]` is equal to `schema(t1)[c2]`

#### Description

The inverse of `pivotLonger`.

```lua
> pivotWider(students, "name", "age")
| favorite color | Bob | Alice | Eve |
| -------------- | --- | ----- | --- |
| "blue"         | 12  |       |     |
| "green"        |     | 17    |     |
| "red"          |     |       | 13  |
> longerTable = 
    pivotLonger(
      gradebook,
      ["quiz1", "quiz2", "quiz3", "quiz4", "midterm", "final"],
      "test",
      "score")
> pivotWider(longerTable, "test", "score")
| name    | age | quiz1 | quiz2 | quiz3 | quiz4 | midterm | final |
| ------- | --- | ----- | ----- | ----- | ----- | ------- | ----- |
| "Bob"   | 12  | 8     | 9     | 7     | 9     | 77      | 87    |
| "Alice" | 17  | 6     | 8     | 8     | 7     | 88      | 85    |
| "Eve"   | 13  | 7     | 9     | 8     | 8     | 84      | 77    |
```

## Utilities

### `flatten :: t1:Table * cs:Seq<ColName> -> t2:Table`

#### Constraints

##### Requires:

- `cs` has no duplicates
- for all `c` in `cs`, `c` is in `header(t1)`
- for all `c` in `cs`, `schema(t1)[c]` is `Seq<X>` for some sort `X`
- for all `i` in `range(nrows(t1))`, for all `c1` and `c2` in `cs`, `length(getValue(getRow(t1, i), c1))` is equal to `length(getValue(getRow(t1, i), c2))`

##### Ensures:

- `header(t2)` is equal to `header(t1)`
- for all `c` in `header(t2)`
  - if `c` is in `cs` then `schema(t2)[c]` is equal to the element sort of `schema(t1)[c]`
  - otherwise, `schema(t2)[c]` is equal to `schema(t1)[c]`

#### Description

When columns `cs` of table `t` have sequences, returns a `Table` where each element of each `c` in `cs` is flattened, meaning the column corresponding to `c` becomes a longer column where the original entries are concatenated. Elements of row `i` of `t` in columns other than `cs` will be repeated according to the length of `getValue(getRow(t1, i), c1)`. These lengths must therefore be the same for each `c` in `cs`.

```lua
> flatten(gradebookSeq, ["quizzes"])
| name    | age | quizzes | midterm | final |
| ------- | --- | ------- | ------- | ----- |
| "Bob"   | 12  | 8       | 77      | 87    |
| "Bob"   | 12  | 9       | 77      | 87    |
| "Bob"   | 12  | 7       | 77      | 87    |
| "Bob"   | 12  | 9       | 77      | 87    |
| "Alice" | 17  | 6       | 88      | 85    |
| "Alice" | 17  | 8       | 88      | 85    |
| "Alice" | 17  | 8       | 88      | 85    |
| "Alice" | 17  | 7       | 88      | 85    |
| "Eve"   | 13  | 7       | 84      | 77    |
| "Eve"   | 13  | 9       | 84      | 77    |
| "Eve"   | 13  | 8       | 84      | 77    |
| "Eve"   | 13  | 8       | 84      | 77    |
> t = buildColumn(gradebookSeq, "quiz-pass?",
    function(r):
      isPass =
        function(n):
          n >= 8
        end
      map(getValue(r, "quizzes"), isPass)
    end)
> t
| name    | age | quizzes      | midterm | final | quiz-pass?                 |
| ------- | --- | ------------ | ------- | ----- | -------------------------- |
| "Bob"   | 12  | [8, 9, 7, 9] | 77      | 87    | [true, true, false, true]  |
| "Alice" | 17  | [6, 8, 8, 7] | 88      | 85    | [false, true, true, false] |
| "Eve"   | 13  | [7, 9, 8, 8] | 84      | 77    | [false, true, true, true]  |
> flatten(t, ["quiz-pass?", "quizzes"])
| name    | age | quizzes | midterm | final | quiz-pass? |
| ------- | --- | ------- | ------- | ----- | ---------- |
| "Bob"   | 12  | 8       | 77      | 87    | true       |
| "Bob"   | 12  | 9       | 77      | 87    | true       |
| "Bob"   | 12  | 7       | 77      | 87    | false      |
| "Bob"   | 12  | 9       | 77      | 87    | true       |
| "Alice" | 17  | 6       | 88      | 85    | false      |
| "Alice" | 17  | 8       | 88      | 85    | true       |
| "Alice" | 17  | 8       | 88      | 85    | true       |
| "Alice" | 17  | 7       | 88      | 85    | false      |
| "Eve"   | 13  | 7       | 84      | 77    | false      |
| "Eve"   | 13  | 9       | 84      | 77    | true       |
| "Eve"   | 13  | 8       | 84      | 77    | true       |
| "Eve"   | 13  | 8       | 84      | 77    | true       |
```

### `transformColumn :: t1:Table * c:ColName * f:(v1:Value -> v2:Value) -> t2:Table`

#### Constraints

##### Requires:

- `c` is in `header(t1)`

##### Ensures:

- `v1` is of sort `schema(t1)[c]`
- `header(t2)` is equal to `header(t1)`
- for all `c'` in `header(t2)`,
  - if `c'` is equal to `c` then `schema(t2)[c']` is equal to the sort of `v2`
  - otherwise, then `schema(t2)[c']` is equal to `schema(t1)[c']`
- `nrows(t2)` is equal to `nrows(t1)`

#### Description

Consumes a `Table`, a `ColName` representing a column name, and a transformation function and produces a new `Table` where the transformation function has been applied to all values in the named column.

```lua
> addLastName =
    function(name):
      concat(name, " Smith")
    end
> transformColumn(students, "name", addLastName)
| name          | age | favorite color |
| ------------- | --- | -------------- |
| "Bob Smith"   | 12  | "blue"         |
| "Alice Smith" | 17  | "green"        |
| "Eve Smith"   | 13  | "red"          |
> quizScoreToPassFail =
    function(score):
      if score <= 6:
        "fail"
      else:
        "pass"
      end
    end
> transformColumn(gradebook, "quiz1", quizScoreToPassFail)
| name    | age | quiz1  | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ------ | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | "pass" | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | "fail" | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | "pass" | 9     | 84      | 8     | 8     | 77    |
```

### `renameColumns :: t1:Table * ccs:Seq<ColName * ColName> -> t2:Table`

#### Constraints

Let `n` be the length of `ccs` Let `c11 ... c1n` be the first components of the elements of `ccs` and `c21 ... c2n` be the second components.

##### Requires:

- `c1i` is in `header(t1)` for all `i`
- `[c11 ... c1n]` has no duplicates
- `concat(removeAll(header(t1), [c11 ... c1n]), [c21 ... c2n])` has no duplicates

##### Ensures:

- `header(t2)` is equal to `header(t1)` with all `c1i` replaced with `c2i`
- for all `c` in `header(t2)`,
  - if `c` is equal to `c2i` for some `i` then `schema(t2)[c2i]` is equal to `schema(t1)[c1i]`
  - otherwise, `schema(t2)[c]` is equal to `schema(t2)[c]`
- `nrows(t2)` is equal to `nrows(t1)`

#### Description

Updates column names. Each element of `ccs` specifies the old name and the new name.

```lua
> renameColumns(students, [("favorite color", "preferred color"), ("name", "first name")])
| first name | age | preferred color |
| ---------- | --- | --------------- |
| "Bob"      | 12  | "blue"          |
| "Alice"    | 17  | "green"         |
| "Eve"      | 13  | "red"           |
> renameColumns(gradebook, [("midterm", "final"), ("final", "midterm")])
| name    | age | quiz1 | quiz2 | final | quiz3 | quiz4 | midterm |
| ------- | --- | ----- | ----- | ----- | ----- | ----- | ------- |
| "Bob"   | 12  | 8     | 9     | 77    | 7     | 9     | 87      |
| "Alice" | 17  | 6     | 8     | 88    | 8     | 7     | 85      |
| "Eve"   | 13  | 7     | 9     | 84    | 8     | 8     | 77      |
```

### `find :: t:Table * r:Row -> n:Error<Number>`

#### Constraints

##### Requires:

- for all `c` in `header(r)`, `c` is in `header(t)`
- for all `c` in `header(r)`, `schema(r)[c]` is equal to `schema(t)[c]`

##### Ensures:

- either `n` is equal to `error("not found")` or `n` is in `range(nrows(t))`

#### Description

Find the index of the first row that matches `r`.

```lua
> find(students, [row: ("age", 13)])
2
> find(students, [row: ("age", 14)])
error("not found")
```

### `groupByRetentive :: t1:Table * c:ColName -> t2:Table`

#### Constraints

##### Requires:

- `c` is in `header(t1)`
- `schema(t1)[c]` is a categorical sort

##### Ensures:

- `header(t2)` is equal to `["key", "groups"]`
- `schema(t2)["key"]` is equal to `schema(t1)[c]`
- `schema(t2)["groups"]` is `Table`
- `getColumn(t2, "key")` has no duplicates
- for all `t` in `getColumn(t2, "groups")`, `schema(t)` is equal to `schema(t1)`
- `nrows(t2)` is equal to `length(removeDuplicates(getColumn(t1, c)))`

#### Description

Categorizes rows of the input table into groups by the key of each row. The key is computed by accessing the named column. 

```lua
> groupByRetentive(students, "favorite color")
| key     | groups                             |
| ------- | ---------------------------------- |
| "blue"  | | name    | age | favorite color | |
|         | | ------- | --- | -------------- | |
|         | | "Bob"   | 12  | "blue"         | |
| "green" | | name    | age | favorite color | |
|         | | ------- | --- | -------------- | |
|         | | "Alice" | 17  | "green"        | |
| "red"   | | name    | age | favorite color | |
|         | | ------- | --- | -------------- | |
|         | | "Eve"   | 13  | "red"          | |
> groupByRetentive(jellyAnon, "brown")
| key   | groups                                                                                  |
| ----- | --------------------------------------------------------------------------------------- |
| false | | get acne | red   | black | white | green | yellow | brown | orange | pink  | purple | |
|       | | -------- | ----- | ----- | ----- | ----- | ------ | ----- | ------ | ----- | ------ | |
|       | | true     | false | false | false | true  | false  | false | true   | false | false  | |
|       | | true     | false | true  | false | true  | true   | false | false  | false | false  | |
|       | | false    | false | false | false | true  | false  | false | false  | true  | false  | |
|       | | false    | false | false | false | false | true   | false | false  | false | false  | |
|       | | false    | false | false | false | false | true   | false | false  | true  | false  | |
|       | | true     | false | true  | false | false | false  | false | true   | true  | false  | |
|       | | false    | false | true  | false | false | false  | false | false  | true  | false  | |
|       | | true     | false | false | false | false | false  | false | true   | false | false  | |
| true  | | get acne | red   | black | white | green | yellow | brown | orange | pink  | purple | |
|       | | -------- | ----- | ----- | ----- | ----- | ------ | ----- | ------ | ----- | ------ | |
|       | | true     | false | false | false | false | false  | true  | true   | false | false  | |
|       | | false    | true  | false | false | false | true   | true  | false  | true  | false  | |
```
  
### `groupBySubtractive :: t1:Table * c:ColName -> t2:Table`

#### Constraints

##### Requires:

- `c` is in `header(t1)`
- `schema(t1)[c]` is a categorical sort

##### Ensures:

- `header(t2)` is equal to `["key", "groups"]`
- `schema(t2)["key"]` is equal to `schema(t1)[c]`
- `schema(t2)["groups"]` is `Table`
- `getColumn(t2, "key")` has no duplicates
- for all `t` in `getColumn(t2, "groups")`, `header(t)` is equal to `removeAll(header(t1), [c])`
- for all `t` in `getColumn(t2, "groups")`, `schema(t)` is a subsequence of `schema(t1)`
- `nrows(t2)` is equal to `length(removeDuplicates(getColumn(t1, c)))`

#### Description

Similar to `groupByRetentive` but the named column is removed in the output.

```lua
> groupBySubtractive(students, "favorite color")
| key     | groups            |
| ------- | ----------------- |
| "blue"  | | name    | age | |
|         | | ------- | --- | |
|         | | "Bob"   | 12  | |
| "green" | | name    | age | |
|         | | ------- | --- | |
|         | | "Alice" | 17  | |
| "red"   | | name    | age | |
|         | | ------- | --- | |
|         | | "Eve"   | 13  | |
> groupBySubtractive(jellyAnon, "brown")
| key   | groups                                                                          |
| ----- | ------------------------------------------------------------------------------- |
| false | | get acne | red   | black | white | green | yellow | orange | pink  | purple | |
|       | | -------- | ----- | ----- | ----- | ----- | ------ | ------ | ----- | ------ | |
|       | | true     | false | false | false | true  | false  | true   | false | false  | |
|       | | true     | false | true  | false | true  | true   | false  | false | false  | |
|       | | false    | false | false | false | true  | false  | false  | true  | false  | |
|       | | false    | false | false | false | false | true   | false  | false | false  | |
|       | | false    | false | false | false | false | true   | false  | true  | false  | |
|       | | true     | false | true  | false | false | false  | true   | true  | false  | |
|       | | false    | false | true  | false | false | false  | false  | true  | false  | |
|       | | true     | false | false | false | false | false  | true   | false | false  | |
| true  | | get acne | red   | black | white | green | yellow | orange | pink  | purple | |
|       | | -------- | ----- | ----- | ----- | ----- | ------ | ------ | ----- | ------ | |
|       | | true     | false | false | false | false | false  | true   | false | false  | |
|       | | false    | true  | false | false | false | true   | false  | true  | false  | |
```

### `update :: t1:Table * f:(r1:Row -> r2:Row) -> t2:Table`

#### Constraints

##### Requires:

- for all `c` in `header(r2)`, `c` is in `header(t1)`

##### Ensures:

- `schema(r1)` is equal to `schema(t1)`
- `header(t2)` is equal to `header(t1)`
- for all `c` in `header(t2)`
  - if `c` in `header(r2)` then `schema(t2)[c]` is equal to `schema(r2)[c]`
  - otherwise, `schema(t2)[c]` is equal to `schema(t1)[c]`
- `nrows(t2)` is equal to `nrows(t1)`

#### Description

Consumes an existing `Table` and produces a new `Table` with the named columns updated, using `f` to produce the values for those columns, once for each row.

```lua
> abstractAge =
    function(r):
      if (getValue(r, "age") <= 12):
        [row: ("age", "kid")]
      else if (getValue(r, "age") <= 19):
        [row: ("age", "teenager")]
      else:
        [row: ("age", "adult")]
      end
    end
> update(students, abstractAge)
| name    | age        | favorite color |
| ------- | ---------- | -------------- |
| "Bob"   | "kid"      | "blue"         |
| "Alice" | "teenager" | "green"        |
| "Eve"   | "teenager" | "red"          |
> didWellInFinal =
    function(r):
      [row:
        ("midterm", 85 <= getValue(r, "midterm"))
        ("final", 85 <= getValue(r, "final"))]
    end
> update(gradebook, didWellInFinal)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | false   | 7     | 9     | true  |
| "Alice" | 17  | 6     | 8     | true    | 8     | 7     | true  |
| "Eve"   | 13  | 7     | 9     | false   | 8     | 8     | false |
```

### `select :: t1:Table * f:(r1:Row * n:Number -> r2:Row) -> t2:Table`

#### Constraints

##### Requires:

##### Ensures:

- `schema(r1)` is equal to `schema(t1)`
- `n` is in `range(nrows(t1))`
- `schema(t2)` is equal to `schema(r2)`
- `nrows(t2)` is equal to `nrows(t1)`

#### Description

Projects each `Row` of a `Table` into a new `Table`.

```lua
> select(
    students,
    function(r, n):
      [row: 
        ("ID", n),
        ("COLOR", getValue(r, "favorite color")),
        ("AGE", getValue(r, "age"))]
    end)
| ID | COLOR   | AGE |
| -- | ------- | --- |
| 0  | "blue"  | 12  |
| 1  | "green" | 17  |
| 2  | "red"   | 13  |
> select(
    gradebook,
    function(r, n):
      [row: 
        ("full name", concat(getValue(r, "name"), " Smith")),
        ("(midterm + final) / 2", (getValue(r, "midterm") + getValue(r, "final")) / 2)]
    end)
| full name     | (midterm + final) / 2 |
| ------------- | --------------------- |
| "Bob Smith"   | 82                    |
| "Alice Smith" | 86.5                  |
| "Eve Smith"   | 80.5                  |
```

### `selectMany :: t1:Table * project:(r1:Row * n:Number -> t2:Table) * result:(r2:Row * r3:Row -> r4:Row) -> t2:Table`

#### Constraints

##### Requires:

##### Ensures:

- `schema(r1)` is equal to `schema(t1)`
- `n` is in `range(nrows(t1))`
- `schema(r2)` is equal to `schema(t1)`
- `schema(r3)` is equal to `schema(t2)`
- `schema(t2)` is equal to `schema(r4)`

#### Description

Projects each row of a table to a new table, flattens the resulting tables into one table, and invokes a result selector function on each row therein. The index of each source row is used in the intermediate projected form of that row.

```lua
> selectMany(
    students,
    function(r, n):
      if even(n):
        r
      else:
        head(r, 0)
      end
    end,
    function(r1, r2):
      r2
    end)
| name  | age | favorite color |
| ----- | --- | -------------- |
| "Bob" | 12  | "blue"         |
| "Eve" | 13  | "red"          |
> repeatRow =
    function(r, n):
      if n == 0:
        r
      else:
        addRows(repeatRow(r, n - 1), [r])
      end
    end
> selectMany(
    gradebook,
    repeatRow,
    function(r1, r2):
      selectColumns(r2, ["midterm"])
    end)
| midterm |
| ------- |
| 77      |
| 88      |
| 88      |
| 84      |
| 84      |
| 84      |
```

### `groupJoin<K> :: t1:Table * t2:Table * getKey1:(r1:Row -> k1:K) * getKey2:(r2:Row -> k2:K) * aggregate:(r3:Row * t3:Table -> r4:Row) -> t4:Table`

#### Constraints

##### Requires:

##### Ensures:

- `schema(r1)` is equal to `schema(t1)`
- `schema(r2)` is equal to `schema(t2)`
- `schema(r3)` is equal to `schema(t1)`
- `schema(t3)` is equal to `schema(t2)`
- `schema(t4)` is equal to `schema(r4)`
- `nrows(t4)` is equal to `nrows(t1)`

#### Description

Correlates the rows of two tables based on equality of keys and groups the results.

```lua
> getName =
    function(r):
      getValue(r, "name")
    end
> averageFinal =
    function(r, t):
      addColumn(r, "final", [average(getColumn(t, "final"))])
    end
> groupJoin(students, gradebook, getName, getName, averageFinal)
| name    | age | favorite color | final |
| ------- | --- | -------------- | ----- |
| "Bob"   | 12  | "blue"         | 87    |
| "Alice" | 17  | "green"        | 85    |
| "Eve"   | 13  | "red"          | 77    |
> nameLength =
    function(r):
      length(getValue(r, "name"))
    end
> tableNRows =
    function(r, t):
      addColumn(r, "nrows", [nrows(t)])
    end
> groupJoin(students, gradebook, nameLength, nameLength, tableNRows)
| name    | age | favorite color | nrows |
| ------- | --- | -------------- | ----- |
| "Bob"   | 12  | "blue"         | 2     |
| "Alice" | 17  | "green"        | 1     |
| "Eve"   | 13  | "red"          | 2     |
```

### `join<K> :: t1:Table * t2:Table * getKey1:(r1:Row -> k1:K) * getKey2:(r2:Row -> k2:K) * combine:(r3:Row * r4:Row -> r5:Row) -> t3:Table`

#### Constraints

##### Requires:

##### Ensures:

- `schema(r1)` is equal to `schema(t1)`
- `schema(r2)` is equal to `schema(t2)`
- `schema(r3)` is equal to `schema(t1)`
- `schema(r4)` is equal to `schema(t2)`
- `schema(t3)` is equal to `schema(r5)`

#### Description

Correlates the rows of two tables based on matching keys.

```lua
> getName =
    function(r):
      getValue(r, "name")
    end
> addGradeColumn =
    function(r1, r2):
      addColumn(r1, "grade", [getValue(r2, "final")])
    end
> join(students, gradebook, getName, getName, addGradeColumn)
| name    | age | favorite color | grade |
| ------- | --- | -------------- | ----- |
| "Bob"   | 12  | "blue"         | 87    |
| "Alice" | 17  | "green"        | 85    |
| "Eve"   | 13  | "red"          | 77    |
> nameLength =
    function(r):
      length(getValue(r, "name"))
    end
> join(students, gradebook, nameLength, nameLength, addGradeColumn)
| name    | age | favorite color | grade |
| ------- | --- | -------------- | ----- |
| "Bob"   | 12  | "blue"         | 87    |
| "Bob"   | 12  | "blue"         | 77    |
| "Alice" | 17  | "green"        | 85    |
| "Eve"   | 13  | "red"          | 87    |
| "Eve"   | 13  | "red"          | 77    |
```
