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

- [Pyret taught in Brown CS111](https://hackmd.io/@cs111/table)
- [Pyret taught in the Data Science curriculumn of the Bootstrap project](https://bootstrapworld.org/materials/spring2021/en-us/courses/data-science/pathway-lessons.shtml)
  - [the definition of methods and some functions](https://www.pyret.org/docs/latest/tables.html)
  - [the definition of other functions](https://code.pyret.org/editor#share=1btFfKCcas4zkQ6-SYCYMkcDCqmduzQqB)
- [Python pandas cheatsheet](https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf)
- [Compare Python pandas with R](https://pandas.pydata.org/pandas-docs/stable/getting_started/comparison/comparison_with_r.html)
- [R tibbles](https://adv-r.hadley.nz/vectors-chap.html#tibble)
- [R TidyVerse](https://cran.r-project.org/web/packages/tidyr/vignettes/tidy-data.html)
- [LINQ](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/query-expression-syntax-for-standard-query-operators)
- [MySQL](https://dev.mysql.com/doc/refman/8.0/en/sql-data-manipulation-statements.html)
- [PostgreSQL](https://www.postgresql.org/docs/current/dml.html)

## Assumptions

### Relation-level Functions

- length
- ncols
- nrows
- header
- schema
- range
- rows
- concat
- insert
- distinct

### Other assumed functions

- `startsWith`: check if a string starts with another string
- `average`: compute the average of a sequence of numbers

### Relations

- `x` has no duplicates
- `x` is equal to `y`
- `x` is not greater than `y`
- `x` is (not) included in `y`
- `x` is (not) in `y`
- `x` is a subsequence of `y` (not changing order)
- `x` is of type `y`
- `x` is a subtype of `y`
- `x` is categorical
- `x` is non-negative
- `x` is negative

## (overload 1/2) `selectRows :: t1:Table * selector:Seq<Number> -> t2:Table`

### Constraints

__Requires:__

* for all `n` in `selector`, `n` is in `range(nrows(t1))`

__Ensures:__

* `header(t2)` is equal to `header(t1)`
* `schema(t2)` is equal to `schema(t1)`
* `nrows(t2)` is equal to `length(selector)`

### Description

Given a `Table` and a `Seq<Number>` containing row indices, and produces a new `Table` containing only those rows.

```lua
> selectRows(students, [2, 0, 2, 1])
| name    | age | favorite-color |
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

## (overload 2/2) `selectRows :: t1:Table * selector:Seq<Boolean> -> t2:Table`

### Constraints

__Requires:__

* `length(selector)` is equal to `nrows(t1)`

__Ensures:__

* `header(t2)` is equal to `header(t1)`
* `schema(t2)` is equal to `schema(t1)`
* `nrows(t2)` is not greater than `nrows(t1)`

### Description

Given a `Table` and a `Seq<Boolean>` that represents a predicate on rows, returns a `Table` with only the rows for which the predicate returns true.

```lua
> selectRows(students, [true, false, true])
| name  | age | favorite-color |
| ----- | --- | -------------- |
| "Bob" | 12  | "blue"         |
| "Eve" | 13  | "red"          |
> selectRows(gradebook, [false, false, true])
| name  | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ----- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Eve" | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

## (overload 1/3) `selectColumns :: t1:Table * selector:Seq<Boolean> -> t2:Table`

### Constraints

__Requires:__

* `length(selector)` is equal to `ncols(t1)`

__Ensures:__

* `header(t2)` is a subsequence of `header(t1)`
* for all `i` in `range(ncols(t1))`, `header(t1)[i]` in `header(t2)` if and only if `selector[i]` is equal to `true`
* `schema(t2)` is included in `schema(t1)`

### Description

Consumes a `Table` and a `Seq<Boolean>` deciding whether each column should be kept, and produces a new `Table` containing only those columns. The order of the columns is as given in the input `Seq`.

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

## (overload 2/3) `selectColumns :: t1:Table * selector:Seq<Number> -> t2:Table`
  
### Constraints

__Requires:__

* `selector` has no duplicates
* for all `n` in `selector`, `n` is in `range(ncols(t1))`

__Ensures:__

* `length(header(t2))` is equal to `length(selector)`
* for all `i` in `range(length(selector))`, `header(t2)[i]` is equal to `header(t1)[selector[i]]`
* `schema(t2)` is included in `schema(t2)`

### Description

Consumes a `Table` and a `Seq<ColName>` containing column indices, and produces a new `Table` containing only those columns. The order of the columns is as given in the input `Seq`.


```lua
> selectColumns(students, [2, 1])
| favorite-color | age |
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

## (overload 3/3) `selectColumns :: t1:Table * selector:Seq<ColName> -> t2:Table`

### Constraints

__Requires:__

* `selector` has no duplicates
* for all `c` in `selector`, `c` is in `header(t1)`

__Ensures:__

* `header(t2)` is equal to `cs` 
* `schema(t2)` is included in `schema(t2)`

### Description

Consumes a `Table` and a `Seq<ColName>` containing column names, and produces a new `Table` containing only those columns. The order of the columns is as given in the input `Seq`.

```lua
> selectColumns(students, ["favorite-color", "age"])
| favorite-color | age |
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

### Notes

- This function is similar to `select` in R
- This function is similar to `DataFrame.loc` in pandas.

## `subTable :: t1:Table * rowSelector:Seq * columnSelector:Seq -> t2:Table`

`subTable(t, x, y)` is defined as `selectColumns(selectRows(t, x), y)`. This function has 6 overloadings because `selectRows` has 2 overloadings and that `selectColumns` has 3. Each of the 6 overloadings has the constraints given by combining the constraints of the corresponding `selectRows` and `selectColumns` in the obvious way.

## `head :: t1:Table * n:Number -> t2:Table`

### Constraints

__Requires:__

- if `n` is non-negative then `n` is not greater than `nrows(t1)`
- if `n` is negative then `- n` is not greater than `nrows(t1)`

__Ensures:__

- `header(t2)` is equal to `header(t1)`
- `schema(t2)` is equal to `schema(t1)`
- if `n` is non-negative then `nrows(t2)` is equal to `n`
- if `n` is negative then `nrows(t2)` is equal to `nrows(t1) + n`
- `ncols(t2)` is equal to `ncols(t1)`
- for all `i` in `range(nrows(t2))`, `getRow(t2, i)` is equal to `getRow(t1, i)`

### Description

This function returns the first `n` rows of the table based on position. It is useful for quickly testing if your table has the right type of data in it. For negative values of `n`, this function returns all rows except the last `n` rows.

### Note

- This function is similar to `head(t1, n = n)` in R.

## `getRow :: t:Table * n:Number -> r:Row`

### Constraints

__Requires:__

* `n` is in `range(nrows(t))`

__Ensures:__

* `r` is equal to `getRow(t, n)`

### Description

Extract a row out of a table by a numeric index. 

```lua
> getRow(students, 0)
[row: ("name", "Bob"), ("age", 12), ("favorite-color", "blue")]
> getRow(gradebook, 1)
[row:
  ("name", "Alice"), ("age", 17),
  ("quiz1", 6), ("quiz2", 8), ("midterm", 88),
  ("quiz3", 8), ("quiz4", 7), ("final", 85)]
```

## (overloading 1/2) `getColumn :: t:Table * n:Number -> vs:Seq<Value>`

### Constraints

__Requires:__

* `n` is in `range(ncols(t))`

__Ensures:__

* for all `v` in `vs`, `v` is of type `schema(t)[header(t)[n]]`

### Description

Returns a `Seq` of the values in the indexed column in `t`.

```lua
> getColumn(students, 1)
[12, 17, 13]
> getColumn(gradebook, 0)
["Bob", "Alice", "Eve"]
```

## (overloading 2/2) `getColumn :: t:Table * c:ColName -> vs:Seq<Value>`

### Constraints

__Requires:__

* `c` is in `header(t)`

__Ensures:__

* for all `v` in `vs`, `v` is of type `schema(t)[c]`

### Description

Returns a `Seq` of the values in the named column in `t`.

```lua
> getColumn(students, "age")
[12, 17, 13]
> getColumn(gradebook, "name")
["Bob", "Alice", "Eve"]
```

### Notes

In R, `t[[c]]`.

In CS111 Pyret, `t.get-column(c)`.

## `getValue :: r:Row * c:ColName -> v:Value`

### Constraints

__Requires:__

* `c` is in header(r)

__Ensures:__

* `v` is of type `schema(r)[c]`

### Description

Retrieve the value for the column `c` in the row `r`.

```lua
> getValue([row: ("name", "Bob"),  ("age", 12)], "age")
12
```

## `nrows :: t:Table -> n:Number`

### Constraints

__Requires:__

__Ensures:__

* `n` is equal to `nrows(t)`

### Description

Returns a `Number` representing the number of rows in the `Table`.

```lua
> nrows(students)
3
> nrows(studentsMissing)
3
```


## `ncols :: t:Table -> n:Number`

### Constraints

__Requires:__

__Ensures:__

* `n` is equal to `ncols(t)`

### Description

Returns a `Number` representing the number of columns in the `Table`.

```lua
> ncols(students)
3
> ncols(studentsMissing)
8
```

## `shape :: t:Table -> ns:Seq<Number>`

### Constraints

__Requires:__

__Ensures:__

- `length(ns)` is equal to `2`
- `ns[0]` is equal to `nrows(t)`
- `ns[1]` is equal to `ncols(t)`

### Description

Return a tuple representing the dimensionality of the `Table`.

```lua
> shape(students)
[3, 3]
> shape(gradebook)
[3, 8]
```

## (overload 1/2) `header :: t:Table -> cs:Seq<ColName>`

### Constraints

__Requires:__

__Ensures:__

* `cs` is equal to `header(t)`

### Description

Returns a `Seq` representing the column names in the `Table`.

```lua
> header(students)
["name", "age", "favorite-color"]
> header(gradebook)
["name", "age", "quiz1", "quiz2", "midterm", "quiz3", "quiz4", "final"]
```

## (overload 2/2) `header :: r:Row -> cs:Seq<ColName>`

### Constraints

__Requires:__

__Ensures:__

* `cs` is equal to `header(r)`

### Description

Returns a `Seq` representing the column names in the `Row`.

```lua
> header(getRow(students, 0))
["name", "age", "favorite-color"]
> header(getRow(gradebook, 0))
["name", "age", "quiz1", "quiz2", "midterm", "quiz3", "quiz4", "final"]
```

## `buildColumn :: t1:Table * c:ColName * f:(r:Row -> v:Value) -> t2:Table`

### Constraints

__Requires:__

* `c` is not in `header(t1)`

__Ensures:__

* `header(r)` is equal to `header(t1)`
* `schema(r)` is equal to `schema(t1)`
* `header(t2)` is equal to `concat(header(t1), [c])`
* `v` is of type `schema(t2)[c]`
* for all `c` in `header(t1)`, `schema(t2)[c]` is equal to `schema(t1)[c]`

### Description

Consumes an existing `Table` and produces a new `Table` containing an additional column with the given `ColName`, using `f` to produce the values for that column, once for each row.

```lua
> isTeenagerBuilder =
    function(r):
      12 < getValue(r, "age") and getValue(r, "age") < 20
    end
> buildColumn(students, "is-teenager", isTeenagerBuilder)
| name    | age | favorite-color | is-teenager |
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

## `update :: t1:Table * f:(r1:Row -> r2:Value) -> t2:Table`

### Constraints

__Requires:__

* for all `c` in `header(r2)`, `c` is in `header(t1)`
* for all `c` in `header(r2)`, `schema(r2)[c]` is a subtype of `schema(t1)[c]`

__Ensures:__

* `schema(r1)` is equal to `schema(t1)`
* `schema(t2)` is equal to `schema(t1)`
* `nrows(t2)` is equal to `nrows(t1)`

### Description

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
| name    | age        | favorite-color |
| ------- | ---------- | -------------- |
| "Bob"   | "kid"      | "blue"         |
| "Alice" | "teenager" | "green"        |
| "Eve"   | "teenager" | "red"          |
> abstractFinal =
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

## `addRow :: t1:Table * r:Row -> t2:Table`

### Constraints

__Requires:__

* `header(r)` is equal to `header(t1)`
* `schema(r)` is equal to `schema(t1)`

__Ensures:__

* `header(t2)` is equal to `header(t1)`
* `schema(t2)` is equal to `schema(t1)`
* `nrows(t2)` is equal to `nrows(t1) + 1`

### Description

Consumes a `Table` and a `Row` to add, and produces a new `Table` with the rows from the original table followed by the given `Row`.

```lua
> addRow(
    students,
    [row: 
      ("name", "Colton"), ("age", 19),
      ("favorite-color", "blue")])
| name     | age | favorite-color |
| -------- | --- | -------------- |
| "Bob"    | 12  | "blue"         |
| "Alice"  | 17  | "green"        |
| "Eve"    | 13  | "red"          |
| "Colton" | 19  | "blue"         |
> addRow(
    gradebook,
    [row:
      ("name", "Colton"), ("age", 19),
      ("quiz1", 8), ("quiz2", 9), ("midterm", 73),
      ("quiz3", 7), ("quiz4", 9), ("final", 64)])
| name     | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| -------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"    | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice"  | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"    | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
| "Colton" | 19  | 8     | 9     | 73      | 7     | 9     | 64    |
```

## `addRows :: t1:Table * rs:Seq<Row> -> t2:Table`

### Constraints

__Requires:__

* for all `r` in `rs`, `header(r)` is equal to `header(t1)`
* for all `r` in `rs`, `schema(r)` is equal to `schema(t1)`

__Ensures:__

* `header(t2)` is equal to `header(t1)`
* `schema(t2)` is equal to `schema(t1)`
* `nrows(t2)` is equal to `nrows(t1) + length(rs)`

### Description

Consumes a `Table` and a sequence of `Row` to add, and produces a new `Table` with the rows from the original table followed by the given `Row`s.

```lua
> addRows(
    students,
    [
      [row: 
        ("name", "Colton"), ("age", 19),
        ("favorite-color", "blue")]
    ])
| name     | age | favorite-color |
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

## `tableOfColumn :: c:ColName * vs:Seq<Value> -> t:Table`

### Constraints

__Requires:__

__Ensures:__

- `header(t)` is equal to `[c]`
- `schema(t)[c]` is equal to the element sort of `vs`
- `nrows(t)` is equal to `length(vs)`

### Description

Construct a single-column table. The only column is equal to the input sequence of values.

```lua
> tableOfColumn("colors", ["red", "green", "blue"])
| colors  |
| ------- |
| "red"   |
| "green" |
| "blue"  |
> tableOfColumn("PLs", ["C", "Java", "Agda", "Scheme"])
| PLs      |
| -------- |
| "C"      |
| "Java"   |
| "Agda"   |
| "Scheme" |
```

## `addColumn :: t1:Table * c:ColName * vs:Seq<Value> -> t2:Table`

### Constraints

__Requires:__

* `c` is not in `header(t1)`
* `length(vs)` is equal to `nrows(t1)`

__Ensures:__

* `header(t2)` is equal to `concat(header(t1), [c])`
* `schema(t1)` is included in `schema(t2)`
* for all `v` in `vs`, `vs` is of type `schema(t2)[c]`
* `nrows(t2)` is equal to `nrows(t1)`

### Description

Consumes a column name and a `Seq` of values and produces a new `Table` with the columns of the input `Table` followed by a column with the given name and values. Note that the length of `vs` must equal the length of the `Table`. [cs111]

```lua
> hairColor = ["brown", "red", "blonde"]
> addColumn(students, "hair-color", hairColor)
| name    | age | favorite-color | hair-color |
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

## `completeCases :: t:Table * c:ColName -> bs:Seq<Boolean>`

### Constraints

__Requires:__

- `c` is in `header(t)`

__Ensures:__

- `length(bs)` is equal to `nrows(t)`

### Description

Return a `Seq<Boolean>` with `true` entries indicating rows without missing values (complete cases) in table `t`.

```lua
> completeCases(students, "age")
[true, true, true]
> completeCases(studentsMissing, "age")
[false, true, true]
```

## `flatten :: t1:Table * cs:Seq<ColName> -> t2:Table`

### Constraints

__Requires:__

[TODO: non-structural desc]

- `cs` has no duplicates
- for all `c` in `cs`, `c` is in `header(t1)`
- for all `c` in `cs`, for some type `T`, `schema(t1)[c]` is equal to `Seq<T>`
- for all `i` in `range(nrows(t1))`, for all `c1` and `c2` in `cs`, `length(getValue(getRow(t1, i), c1))` is equal to `length(getValue(getRow(t1, i), c1))`

__Ensures:__

[TODO: elementTypeOf]

- `header(t2)` is equal to `header(t1)`
- for all `c` in `header(t2)`, if `c` is in `cs` then `schema(t2)[c]` is equal to `elementTypeOf(schema(t1)[c])`
- for all `c` in `header(t2)`, if `c` is not in `cs` then `schema(t2)[c]` is equal to `schema(t1)[c]`

### Description

When columns `cs` of table `t` have sequences, return a `Table` where each element of each `c` in `cs` is flattened, meaning the column corresponding to `c` becomes a longer column where the original entries are concatenated. Elements of row `i` of `t` in columns other than `cs` will be repeated according to the length of `getValue(getRow(t1, i), c1)`. These lengths must therefore be the same for each `c` in `cs`.

```lua
> flatten(gradebookList, ["quizes"])
| name    | age | quizes | midterm | final |
| ------- | --- | ------ | ------- | ----- |
| "Bob"   | 12  | 8      | 77      | 87    |
| "Bob"   | 12  | 9      | 77      | 87    |
| "Bob"   | 12  | 7      | 77      | 87    |
| "Bob"   | 12  | 9      | 77      | 87    |
| "Alice" | 17  | 6      | 88      | 85    |
| "Alice" | 17  | 8      | 88      | 85    |
| "Alice" | 17  | 8      | 88      | 85    |
| "Alice" | 17  | 7      | 88      | 85    |
| "Eve"   | 13  | 7      | 84      | 77    |
| "Eve"   | 13  | 9      | 84      | 77    |
| "Eve"   | 13  | 8      | 84      | 77    |
| "Eve"   | 13  | 8      | 84      | 77    |
> t = buildColumn(gradebookList, "quiz-pass?"
    function(r):
      isPass =
        function(n):
          n >= 8
        end
      map(isPass, getValue(r, "quizes"))
    end)
> t
| name    | age | quizes       | midterm | final | quiz-pass?                 |
| ------- | --- | ------------ | ------- | ----- | -------------------------- |
| "Bob"   | 12  | [8, 9, 7, 9] | 77      | 87    | [true, true, false, true]  |
| "Alice" | 17  | [6, 8, 8, 7] | 88      | 85    | [false, true, true, false] |
| "Eve"   | 13  | [7, 9, 8, 8] | 84      | 77    | [false, true, true, true]  |
> flatten(gradebookList, ["quiz-pass?", "quizes"])
| name    | age | quizes | midterm | final | quiz-pass? |
| ------- | --- | ------ | ------- | ----- | ---------- |
| "Bob"   | 12  | 8      | 77      | 87    | true       |
| "Bob"   | 12  | 9      | 77      | 87    | true       |
| "Bob"   | 12  | 7      | 77      | 87    | false      |
| "Bob"   | 12  | 9      | 77      | 87    | true       |
| "Alice" | 17  | 6      | 88      | 85    | false      |
| "Alice" | 17  | 8      | 88      | 85    | true       |
| "Alice" | 17  | 8      | 88      | 85    | true       |
| "Alice" | 17  | 7      | 88      | 85    | false      |
| "Eve"   | 13  | 7      | 84      | 77    | false      |
| "Eve"   | 13  | 9      | 84      | 77    | true       |
| "Eve"   | 13  | 8      | 84      | 77    | true       |
| "Eve"   | 13  | 8      | 84      | 77    | true       |
```

## `transformColumn :: t1:Table * c:ColName * f:(v1:Value -> v2:Value) -> t2:Table`

### Constraints

__Requires:__

* `c` is in `header(t1)`

__Ensures:__

* `v1` is of type `schema(t1)[c]`
* `header(t2)` is equal to `header(t1)`
* for all `c'` in `header(t1)`, if `c'` is not equal to `c` then `schema(t2)[c]` is equal to `schema(t1)[c]`
* `v2` is of type `schema(t2)[c]`

### Description

Consumes a `Table`, a `ColName` representing a column name, and a transformation function and produces a new `Table` where the transformation function has been applied to all values in the named column.

```lua
> addLastName =
    lam(name):
      Strings.concat(name, “ Smith”)
    end
> transformColumn(students, “name”, addLastName)
| name          | age | favorite-color |
| ------------- | --- | -------------- |
| "Bob Smith"   | 12  | "blue"         |
| "Alice Smith" | 17  | "green"        |
| "Eve Smith"   | 13  | "red"          |
> quizScoreToPassFail =
    lam(score):
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
| "Eve"   | 13  | "fail" | 9     | 84      | 8     | 8     | 77    |
```

## `filter :: t1:Table * f:(r:Row -> b:Boolean) -> t2:Table`

### Constraints

__Requires:__

__Ensures:__

* `header(r)` is equal to `header(t1)`
* `schema(r)` is equal to `schema(t1)`
* `header(t2)` is equal to `header(t1)`
* `schema(t2)` is equal to `schema(t1)`
* `nrows(t2)` is not greater than `nrows(t1)`

### Description

Given a `Table` and a predicate on rows, returns a `Table` with only the rows for which the predicate returns `true`.

```lua
> ageUnderFifteen =
    lam(r):
      getValue(r, “age”) < 15
    end
> filter(students, ageUnderFifteen)
| name  | age | favorite-color |
| ----- | --- | -------------- |
| "Bob" | 12  | "blue"         |
| "Eve" | 13  | "red"          |
> nameLongerThan3Letters =
    lam(r):
      length(getValue(r, “name)) > 3
    end
> filter(gradebook, nameLongerThan3Letters)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

## `sort :: t1:Table * c:ColName * b:Boolean -> t2:Table`

### Constraints

__Requires:__

- `c` is in `header(t1)`
- `schema(t1)[c]` is a subtype of `Number`

__Ensures:__

- `nrows(t2)` is equal to `nrows(t1)`
- `ncols(t2)` is equal to `ncols(t1)`
- `header(t2)` is equal to `header(t1)`
- `schema(t2)` is equal to `schema(t1)`
- If `b` is equal to `true` then `getColumn(t2, c)` is in ascending order
- If `b` is equal to `false` then `getColumn(t2, c)` is in descending order

### Description

Given a `Table` and the name of a column in that `Table`, return a `Table` with the same rows ordered based on the named column. If `b` is `true`, the `Table` will be sorted in ascending order, otherwise it will be in descending order.

```lua
> sort(students, "age", true)
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
| "Eve"   | 13  | "red"          |
| "Alice" | 17  | "green"        |
> sort(gradebook)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

## `sortByColumns :: t1:Table * cs:Seq<ColName> -> t2:Table`

### Constraints

__Requires:__

- for all `c` in `cs`, `c` is in `header(t1)`
- `cs` contains no duplicates
- `schema(t1)[c]` is a subtype of `Number`

__Ensures:__

- `nrows(t2)` is equal to `nrows(t1)`
- `ncols(t2)` is equal to `ncols(t1)`
- `header(t2)` is equal to `header(t1)`
- `schema(t2)` is equal to `schema(t1)`

### Description

Given a `Table` and a sequence of column names in that `Table`, return a `Table` with the same rows ordered based on the named columns.

```lua
> sort(students, ["age"])
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
| "Eve"   | 13  | "red"          |
| "Alice" | 17  | "green"        |
> sort(gradebook, ["quiz2", "quiz1",])
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
```

## `dropColumn :: t1:Table * c:ColName -> t2:Table`

### Constraints

__Requires:__

- `c` in `header(t1)`

__Ensures:__

- `nrows(t2)` is equal to `nrows(t1)`
- `ncols(t2)` is equal to `ncols(t1) - 1`
- `header(t2)` is a subsequence of `header(t1)`
- `c` is not in `header(t2)`
- `schema(t2)` is included in `schema(t1)`
- for all `c` in `header(t2)`, `schema(t2)[c]` is equal to `schema(t1)[c]`

### Description

Returns a `Table` that is the same as `t`, except without the column whose name is `c`.

```lua
> dropColumn(students, "age")
| name    | favorite-color |
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

## `dropColumns :: t1:Table * cs:Seq<ColName> -> t2:Table`

### Constraints

__Requires:__

- for all `c` in `cs`, `c` is in `header(t1)`
- `cs` contains distinct elements

__Ensures:__

- `nrows(t2)` is equal to `nrows(t1)`
- `ncols(t2)` is equal to `ncols(t1) - length(cs)`
- `header(t2)` is a subsequence of `header(t1)`
- for all `c` in `cs`, `c` is not in `header(t2)`
- `schema(t2)` is included in `schema(t1)`
- for all `c` in `header(t2)`, `schema(t2)[c]` is equal to `schema(t1)[c]`

### Description

Returns a `Table` that is the same as `t`, except without the columns whose name is in `cs`.

```lua
> dropColumns(students, ["age"])
| name    | favorite-color |
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

## `empty :: t1:Table -> t2:Table`

### Constraints:

__Requires:__

__Ensures:__

- `schema(t2)` is equal to `schema(t1)`
- `nrows(t2)` is equal to `0`

### Description

Remove all rows but keep the schema.

```lua
> empty(students)
| name | age | favorite-color |
| ---- | --- | -------------- |
> empty(gradebook)
| name | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ---- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
```

## `distinct :: t1:Table -> t2:Table`

### Constraints

__Requires:__

__Ensures:__

- `header(t2)` is equal to `header(t1)`
- `schema(t2)` is equal to `schema(t1)`
- `ncols(t2)` is equal to `ncols(t1)`
- `nrows(t2)` is not greater than `nrowsr(t1)`
- for all `i` and `j` in `range(nrows(t2))` if `i` is not equal to `j` then `getRow(t2, i)` is not equal to `getRow(t2, j)`
- for all `i1` in `range(nrows(t2))`, there exists an `i2` such that `getRow(t2, i2)` is equal to `getRow(t1, i1)`

### Description

Retain only unique/distinct rows from an input `Table`.

```lua
> distinct(students)
| name    | age | favorite-color |
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

## `count :: t1:Table * c:ColName -> t2:Table`

### Constraints

__Requires:__

- `c` is in `header(t1)`
- Either 
  - `schema(t1)[c]` is categorical

__Ensures:__

- `header(t2)` is equal to `["value", "count"]`
- `schema(t2)["value"]` is equal to `schema(t1)[c]`
- `schema(t2)["count"]` is equal to `Number`

### Description

Takes a `Table` and a `ColName` representing the name of a column in that `Table`. Produces a `Table` that summarizes how many rows have each value in the given column.

```lua
> count(students, "favorite-color")
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

## `groupByOriginal :: t1:Table * c:ColName -> t2:Table`

### Constraints

requires:

- `c` is in `header(t1)`
- `schema(t1)[c]` is categorical

ensures:

- `header(t2)` is equal to `["key", "members"]`
- `schema(t2)["key"]` is equal to `schema(t1)[c]`
- `schema(t2)["members"]` is a subtype of `Table`
- `getColumn(t2, "key")` has no duplicates
- for all `t` in `getColumn(t2, "members")`, `schema(t)` is equal to `schema(t1)`

### Description

Catagorize rows of the input table into groups by the key of each row. The key is computed by accessing the named column. 

```lua
> groupByOriginal(students, "favorite-color")
| key     | members  |
| ------- | -------- |
| "blue"  | <table1> |
| "green" | <table2> |
| "red"   | <table3> |
<table1> =
| name  | age | favorite-color |
| ----- | --- | -------------- |
| "Bob" | 12  | "blue"         |
<table2> =
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Alice" | 17  | "green"        |
<table3> =
| name  | age | favorite-color |
| ----- | --- | -------------- |
| "Eve" | 13  | "red"          |
> groupByOriginal(jellyAnon, "brown")
| key   | members  |
| ----- | -------- |
| true  | <table1> |
| false | <table2> |
<table1> =
| get-acne | red   | black | white | green | yellow | brown | orange | pink  | purple |
| -------- | ----- | ----- | ----- | ----- | ------ | ----- | ------ | ----- | ------ |
| true     | false | false | false | true  | false  | false | true   | false | false  |
| true     | false | true  | false | true  | true   | false | false  | false | false  |
| false    | false | false | false | true  | false  | false | false  | true  | false  |
| false    | false | false | false | false | true   | false | false  | false | false  |
| false    | false | false | false | false | true   | false | false  | true  | false  |
| true     | false | true  | false | false | false  | false | true   | true  | false  |
| false    | false | true  | false | false | false  | false | false  | true  | false  |
| true     | false | false | false | false | false  | false | true   | false | false  |
<table2> =
| get-acne | red   | black | white | green | yellow | brown | orange | pink  | purple |
| -------- | ----- | ----- | ----- | ----- | ------ | ----- | ------ | ----- | ------ |
| true     | false | false | false | false | false  | true  | true   | false | false  |
| false    | true  | false | false | false | true   | true  | false  | true  | false  |
```
  
## `groupBySubtracted :: t1:Table * c:ColName -> t2:Table`

### Constraints

requires:

- `c` is in `header(t1)`
- `schema(t1)[c]` is categorical

ensures:

- `header(t2)` is equal to `["key", "members"]`
- `schema(t2)["key"]` is equal to `schema(t1)[c]`
- `schema(t2)["members"]` is a subtype of `Table`
- `getColumn(t2, "key")` has no duplicates
- for all `t` in `getColumn(t2, "members")`, `header(t)` is equal to `remove(header(t1), c)`
- for all `t` in `getColumn(t2, "members")`, `schema(t)` is included in `schema(t1)`

### Description

Similar to `groupByOriginal` but the named column is removed in the output.

```lua
> groupBySubtracted(students, "favorite-color")
| key     | members  |
| ------- | -------- |
| "blue"  | <table1> |
| "green" | <table2> |
| "red"   | <table3> |
<table1> =
| name  | age |
| ----- | --- |
| "Bob" | 12  |
<table2> =
| name    | age |
| ------- | --- |
| "Alice" | 17  |
<table3> =
| name  | age |
| ----- | --- |
| "Eve" | 13  |
> groupBySubtracted(jellyAnon, "brown")
| key   | members  |
| ----- | -------- |
| true  | <table1> |
| false | <table2> |
<table1> =
| get-acne | red   | black | white | green | yellow | orange | pink  | purple |
| -------- | ----- | ----- | ----- | ----- | ------ | ------ | ----- | ------ |
| true     | false | false | false | true  | false  | true   | false | false  |
| true     | false | true  | false | true  | true   | false  | false | false  |
| false    | false | false | false | true  | false  | false  | true  | false  |
| false    | false | false | false | false | true   | false  | false | false  |
| false    | false | false | false | false | true   | false  | true  | false  |
| true     | false | true  | false | false | false  | true   | true  | false  |
| false    | false | true  | false | false | false  | false  | true  | false  |
| true     | false | false | false | false | false  | true   | false | false  |
<table2> =
| get-acne | red   | black | white | green | yellow | orange | pink  | purple |
| -------- | ----- | ----- | ----- | ----- | ------ | ------ | ----- | ------ |
| true     | false | false | false | false | false  | true   | false | false  |
| false    | true  | false | false | false | true   | false  | true  | false  |
```

## `groupBy<K,V> :: t1:Table * key:(r1:Row -> k1:K) * project:(r2:Row -> v:V) * aggregate:(k2:K * vs:Seq<V> -> r3:Row) -> t2:Table`

### Constraints

__Requires:__

__Ensures:__

- `schema(r1)` is equal to `schema(t1)`
- `schema(r2)` is equal to `schema(t1)`
- `schema(t2)` is equal to `schema(r3)`
- `nrows(t2)` is equal to `length(distinct(map(key, t1))`

### Description

Groups the rows of a table according to a specified key selector function and creates a result value from each group and its key. The rows of each group are projected by using a specified function.

[TODO: this code only makes sense when `Row <: Table`]

```lua
> colorTemp =
    function(r):
      if getValue(r, "favorite-color") == "red":
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

## `groupJoin<K> :: t1:Table * t2:Table * getKey1:(r1:Row -> k1:K) * getKey2:(r2:Row -> k2:K) * aggregate:(r3:Row * t3:Table -> r4:Row) -> t4:Table`

### Constraints

__Requires:__

__Ensures:__

- `schema(r1)` == `schema(t1)`
- `schema(r2)` == `schema(t2)`
- `schema(r3)` == `schema(t1)`
- `schema(t3)` == `schema(t2)`
- `nrows(t3)` is not greater than `nrows(t2)`
- `schema(t4)` == `schema(r4)`
- `nrows(t4)` == `nrows(t1)`

### Description

Correlates the rows of two tables based on equality of keys and groups the results.

[TODO: need one more example]

[TODO: this code only makes sense when `Row <: Table` because of `addColumn`]

```lua
> getName =
    function(r):
      getValue(r, "name")
    end
> averageFinal =
    function(r, t):
      addColumn(r, average(getColumn(t, "final")))
    end
> groupJoin(students, gradebook, getName, getName, averageFinal)
| name    | age | favorite-color | final |
| ------- | --- | -------------- | ----- |
| "Bob"   | 12  | "blue"         | 87    |
| "Alice" | 17  | "green"        | 85    |
| "Eve"   | 13  | "red"          | 77    |
```

## `join<K> :: t1:Table * t2:Table * getKey1:(r1:Row -> k1:K) * getKey2:(r2:Row -> k2:K) * combine:(r3:Row * r4:Row -> r5:Row) -> t3:Table`

### Constraints

__Requires:__

__Ensures:__

- `schema(r1)` == `schema(t1)`
- `schema(r2)` == `schema(t2)`
- `schema(r3)` == `schema(t1)`
- `schema(r4)` == `schema(t2)`
- `schema(t3)` == `schema(r5)`

### Description

Correlates the rows of two tables based on matching keys.

[TODO: need one more example]

[TODO: this code only makes sense when `Row <: Table` because of `addColumn`]

```lua
> getName =
    function(r):
      getValue(r, "name")
    end
> addGradeColumn =
    function(r1, r2):
      addColumn(r1, "grade", getValue(r2, "final"))
    end
> join(students, gradebook, getName, getName, addGradeColumn)
| name    | age | favorite-color | final |
| ------- | --- | -------------- | ----- |
| "Bob"   | 12  | "blue"         | 87    |
| "Alice" | 17  | "green"        | 85    |
| "Eve"   | 13  | "red"          | 77    |
```

## `crossJoin :: t1:Table * t2:Table -> t3:Table`

### Constraints

__Requires:__

- `concat(header(t1), header(t2))` has no duplicate

__Ensures:__

- `schema(t3)` is equal to `concat(schema(t1), schema(t2))`
- `nrows(t3)` is equal to `nrows(t1) * nrows(t2)`

### Description

Compute the cartesian product of two tables.

[TODO: need one more example]

```lua
> petiteJelly = subTable(jellyAnon, [0, 1], [0, 1, 2])
> petiteJelly
| get-acne | red   | black |
| -------- | ----- | ----- |
| true     | false | false |
| true     | false | true  |
> crossJoin(students, petiteJelly)
| name    | age | favorite-color | get-acne | red   | black |
| ------- | --- | -------------- | -------- | ----- | ----- |
| "Bob"   | 12  | "blue"         | true     | false | false |
| "Bob"   | 12  | "blue"         | true     | false | true  |
| "Alice" | 17  | "green"        | true     | false | false |
| "Alice" | 17  | "green"        | true     | false | true  |
| "Eve"   | 13  | "red"          | true     | false | false |
| "Eve"   | 13  | "red"          | true     | false | true  |
```

## `leftJoin :: t1:Table * t2:Table * cs:Table -> t3:Table`

### Constraints

__Requires:__

- `cs` has no duplicates
- for all `c` in `cs`, `c` is in `header(t1)`
- for all `c` in `cs`, `c` is in `header(t2)`
- for all `c` in `cs`, `schema(t1)[c]` is equal to `schema(t2)[c]`

__Ensures:__

- `header(t3)` is equal to `concat(removeAll(header(t1), cs), removeAll(header(t2), cs))`

### Description

Look up more information on rows of the first table and add those information to create a new table. The named columns define the keys for looking up. If there is no corresponding row in `t2`, the extra column will be filled with empty cells.

```lua
> leftJoin(students, gradebook, ["name", "age"])
| name    | age | favorite-color | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | -------------- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | "blue"         | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | "green"        | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | "red"          | 7     | 9     | 84      | 8     | 8     | 77    |
> leftJoin(employee, department, ["Department ID"])
| Last Name    | Department ID | Department Name |
| ------------ | ------------- | --------------- |
| "Rafferty"   | 31            | "Sales"         |
| "Jones"      | 32            |                 |
| "Heisenberg" | 33            | "Engineering"   |
| "Robinson"   | 34            | "Clerical"      |
| "Smith"      | 34            | "Clerical"      |
| "Williams"   |               |                 |
```

## `union :: t1:Table * t2:Table -> t3:Table`

### Constraints

__Requires:__

- `schema(t1)` is equal to `schema(t2)`

__Ensures:__

- `schema(t3)` is equal to `schema(t1)`
- `nrows(t3)` is equal to `nrows(t1) + nrows(t2)`

### Description

Combining two tables vertically. The output table starts with rows from the first input table, followed by the rows from the second input table.

```lua
> increaseAge =
    function(r):
      [row: ("name", 1 + getValue(r, "age"))]
    end
> union(students, update(students, increaseAge))
| name    | age | favorite-color |
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
> union(gradebook, update(gradebook, curveFinal))
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
| "Bob"   | 12  | 8     | 9     | 82      | 7     | 9     | 92    |
| "Alice" | 17  | 6     | 8     | 93      | 8     | 7     | 90    |
| "Eve"   | 13  | 7     | 9     | 89      | 8     | 8     | 82    |
```

## `values :: rs:Seq<Row> -> t:Table`

### Constraints

__Requires:__

- for all `r1` and `r2` in `rs`, `schema(r1)` is equal to `schema(r2)`
- `length(rs)` is positive

__Ensures:__

- for some `r` in `rs`, `schema(t)` is equal to `schema(r)`
- `nrows(t)` is equal to `length(rs)`

### Description

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

## `orderBy<K> :: t1:Table * Seq<getKey:(r:Row -> k:K) * compare:(k1:K * k2:K -> Boolean)> -> t2:Table`

### Constraints

__Requires:__

__Ensures:__

- `schema(r)` is equal to `schema(t1)`
- `schema(t2)` is equal to `schema(t1)`
- `nrows(t2)` is equal to `nrows(t1)`

### Description

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
| name    | age | favorite-color |
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

## `select :: t1:Table * f:(r1:Row * n:Number -> r2:Row) -> t2:Table``

### Constraints

__Requires:__

__Ensures:__

- `schema(r1)` is equal to `schema(t1)`
- `n` is in `range(nrows(t1))`
- `schema(t2)` is equal to `schema(r2)`
- `nrows(t2)` is equal to `nrows(t1)`

### Description

Projects each `Row` of a `Table` into a new `Table`.

```lua
> select(
    students,
    function(r, n):
      [row: 
        ("id", n),
        ("COLOR", getValue(r, "favorite-color")),
        ("AGE", getValue(r, "age"))]
    end)
| id  | favorite-color | age |
| --- | -------------- | --- |
| 0   | "blue"         | 12  |
| 1   | "green"        | 17  |
| 2   | "red"          | 13  |
> select(
    gradebook,
    function(r, n):
      [row: 
        ("full name", concat(getValue(r, "name"), "Smith")),
        ("(midterm + final) / 2", (getValue(r, "midterm") + getValue(r, "final")) / 2]
    end)
| full name     | (miderm + final) / 2 |
| ------------- | -------------------- |
| "Bob Smith"   | 82                   |
| "Alice Smith" | 86.5                 |
| "Eve Smith"   | 80.5                 |
```

## `selectMany :: t1:Table * project:(r1:Row * n:Number -> t2:Table) * result:(r2:Row * r3:Row -> r4:Row) -> t2:Table`

### Constraints

__Requires:__

__Ensures:__

- `schema(r1)` is equal to `schema(t1)`
- `n` is in `range(nrows(t1))`
- `schema(r2)` is equal to `schema(t1)`
- `schema(r3)` is equal to `schema(t2)`
- `schema(t2)` is equal to `schema(r4)`

### Description

Projects each row of a table to a new table, flattens the resulting tables into one table, and invokes a result selector function on each row therein. The index of each source row is used in the intermediate projected form of that row.

[TODO: this code only makes sense when `Row <: Table` because I used a row as a table and because of selectColumn]

```lua
> selectMany(
    students,
    function(r, n):
      if even(n):
        r
      else:
        empty(r)
      end
    end,
    function(r1, r2):
      r2
    end)
| name  | age | favorite-color |
| ----- | --- | -------------- |
| "Bob" | 12  | "blue"         |
| "Eve" | 13  | "red"          |
> repeatRow =
    function(r, n):
      if n == 0:
        r
      else:
        addRow(repeatRow(r, n - 1), r)
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

## `pivotLonger : t1:Table * cs:Seq<ColName> * c1:ColName * c2:ColName -> t2:Table`

### Constraints

__Requires:__

- `length(cs)` is positive
- `cs` has no duplicates
- for all `c` in `cs`, `c` is in `header(t1)`
- `c1` is not in `header(t1)`
- `c2` is not in `header(t1)`
- for all `c`, `schema(t1)[c]` is equal to `schema(t1)[cs[0]]`

__Ensures:__

[TODO: the description is non-structural]

- `schema(t2)[c1]` is equal to `ColName`
- `schema(t2)[c2]` is equal to `schema(t1)[cs[0]]`
- `header(t2)` is equal to `header(t1)` with the column names in `cs` removed then concatenated with `[c1, c2]`
- for all `c` in `header(t2)`, if `c` is in `header(t1)` then `schema(t2)[c]` is equal to `schema(t1)[c]`

### Description

Reshape the input table and make it longer. The data kept in the named columns are moved to two new columns, one for the column names and the other for the cell values. 

[TODO: one more example]

```lua
> pivotLonger(gradebook, ["quiz1", "quiz2", "quiz3", "quiz4", "midterm", "final"], "test", "score")
| name    | age | test    | score |
| ------- | --- | ------- | ----- |
| "Bob"   | 12  | quiz1   | 8     |
| "Bob"   | 12  | quiz2   | 9     |
| "Bob"   | 12  | quiz3   | 7     |
| "Bob"   | 12  | quiz4   | 9     |
| "Bob"   | 12  | midterm | 77    |
| "Bob"   | 12  | final   | 87    |
| "Alice" | 17  | quiz1   | 6     |
| "Alice" | 17  | quiz2   | 8     |
| "Alice" | 17  | quiz3   | 8     |
| "Alice" | 17  | quiz4   | 7     |
| "Alice" | 17  | midterm | 88    |
| "Alice" | 17  | final   | 85    |
| "Eve"   | 13  | quiz1   | 7     |
| "Eve"   | 13  | quiz2   | 9     |
| "Eve"   | 13  | quiz3   | 8     |
| "Eve"   | 13  | quiz4   | 8     |
| "Eve"   | 13  | midterm | 84    |
| "Eve"   | 13  | final   | 77    |
```

## `pivotWider :: t1:Table * c1:ColName * c2:ColName -> t2:Table`

### Constraints

__Requires:__

- `c1` is in `header(t1)`
- `c2` is in `header(t1)`
- `schema(t1)[c1]` is a subtype of `ColName`
- for all `c` in `distinct(getColumn(t1, c1))`, `c` is not in `header(t1)`

__Ensures:__

[TODO: non-structural constraints]

- `header(t2)` is equal to `header(t1)` with `c1` and `c2` removed then concatenated with `distinct(getColumn(t1, c1))`
- for all `c` in `header(t2)`, if `c` in `header(t1)` then `schema(t2)[c]` is equal to `schema(t1)[c]`
- for all `c` in `distinct(getColumn(t1, c1))`, `schema(t2)[c]` is equal to `schema(t1)[c2]`

### Description

The inverse of `pivotLonger`.

[TODO: one more example]

```lua
> longerTable = 
    pivotLonger(
      gradebook,
      ["quiz1", "quiz2", "quiz3", "quiz4", "midterm", "final"],
      "test",
      "score")
> longerTable
| name    | age | test    | score |
| ------- | --- | ------- | ----- |
| "Bob"   | 12  | quiz1   | 8     |
| "Bob"   | 12  | quiz2   | 9     |
| "Bob"   | 12  | quiz3   | 7     |
| "Bob"   | 12  | quiz4   | 9     |
| "Bob"   | 12  | midterm | 77    |
| "Bob"   | 12  | final   | 87    |
| "Alice" | 17  | quiz1   | 6     |
| "Alice" | 17  | quiz2   | 8     |
| "Alice" | 17  | quiz3   | 8     |
| "Alice" | 17  | quiz4   | 7     |
| "Alice" | 17  | midterm | 88    |
| "Alice" | 17  | final   | 85    |
| "Eve"   | 13  | quiz1   | 7     |
| "Eve"   | 13  | quiz2   | 9     |
| "Eve"   | 13  | quiz3   | 8     |
| "Eve"   | 13  | quiz4   | 8     |
| "Eve"   | 13  | midterm | 84    |
| "Eve"   | 13  | final   | 77    |
> pivotWider(longerTable, "test", "score")
| name    | age | quiz1 | quiz2 | quiz3 | quiz4 | midterm | final |
| ------- | --- | ----- | ----- | ----- | ----- | ------- | ----- |
| "Bob"   | 12  | 8     | 9     | 7     | 9     | 77      | 87    |
| "Alice" | 17  | 6     | 8     | 8     | 7     | 88      | 85    |
| "Eve"   | 13  | 7     | 9     | 8     | 8     | 84      | 77    |
```

## `pivotTable :: t1:Table * cs:Seq<ColName> * agg:Seq<ColName * ColName * Function> -> t2:Table`

### Constraints

Let's name each component of each element of `aggs` as `c_i1` and `c_i2` and `f_i` respectively. Let `n` be `length(agg)`

__Requires:__

- for all `c` in `cs`, `c` is in `header(t1)`
- for all `c` in `cs`, `schema(t1)[c]` is categorical
- `c_i2` is in `header(t1)`
- `concat(cs, [c_11, ... , c_n1])` has no duplicates

__Ensures:__

- `f_i` will receive a `Seq<T_i>`, where `T_i` is equal to `schema(t1)[c_i2]`
- `header(t2)` is equal to `concat(cs, [c_11, ... , c_n1])`
- for all `c` in `cs`, `schema(t2)[c]` is equal to `schema(t1)[c]`
- `schema(t2)[c_i]` is equal to the output type of `f_i`

### Description

Partition rows into groups and summarize each group with the functions in `agg`. Each element of `agg` specifies the output column, the input column, and the function that compute the summarizing value (e.g. average, sum, and count).

```lua
> pivotTable(students, ["favorite-color"], [("age", "age-average", average)])
| favorite-color | age-average |
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
    ["brown", "get-acne"],
    [
      ("red", "red proportion", proportion),
      ("red", "red proportion", proportion)
    ])
| get-acne | brown | red | pink |
| -------- | ----- | --- | ---- |
| false    | false | 0   | 3/4  |
| false    | true  | 1   | 1    |
| true     | false | 0   | 1/4  |
| true     | true  | 0   | 0    |
```

## `histogram :: t:Table * c:ColName * n:Number -> i:Image`

### Constraints

__Requires:__

- `c` is in `header(t)`
- `schema(t)[c]` is a subtype of `Number`

__Ensures:__

### Description

Displays an `Image` of a histogram of values in the named column, which must contain numeric data. `n` indicates the width of bins in the histogram.

## `scatterPlot :: t:Table * c1:ColName * c2:ColName -> i:Image`

Displays an `Image` of a scatter plot from the given table. `c1` names the column in `t` to use for x-values, and `c2` names the column in `t` to use for y-values. Both columns must contain `Number` values.

### Constraints

__Requires:__

- `c1` is in `header(t)`
- `c2` is in `header(t)`
- `schema(t)[c1]` is a subtype of `Number`
- `schema(t)[c2]` is a subtype of `Number`

__Ensures:__

## `pieChart :: t:Table * c1:ColName * c2:ColName -> i:Image`

Display an `Image` of a pie-chart from the given `Table` (one slice per row). `c1` is the label to use for the chart, and `c2` names the column of the `Table` to use for values in the pie chart.

### Constraints

__Requires:__

- `c1` is in `header(t)`
- `c2` is in `header(t)`
- `schema(t)[c1]` can be used as `String`
- `schema(t)[c2]` can be used as non-negative `Number`
- `getColumn(t, c1)` has no duplicate

__Ensures:__
