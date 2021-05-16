## Introduction

This file lists table operators that we gather from Python, R, LINQ, and Pyret communities.

Pandas cheatsheet: https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf

Python pandas and R: https://pandas.pydata.org/pandas-docs/stable/getting_started/comparison/comparison_with_r.html

R tibbles: https://adv-r.hadley.nz/vectors-chap.html#tibble

R tidying: https://cran.r-project.org/web/packages/tidyr/vignettes/tidy-data.html

(Everthing included) Pyret as taught in Brown CS111: https://hackmd.io/@cs111/table

(Everything included) Pyret as taught in Bootstrap project: https://bootstrapworld.org/materials/spring2021/en-us/courses/data-science/pathway-lessons.shtml (See also [their tables library](https://code.pyret.org/editor#share=1btFfKCcas4zkQ6-SYCYMkcDCqmduzQqB))

## Terminologies

### Functions

- length
- ncols
- nrows
- header
- schema
- range
- rows
- concat
- insert

### Relations

- `x` has no duplicates
- `x` is equal to `y`
- `x` is not greater than `y`
- `x` is (not) included by `y`
- `x` is (not) in `y`
- `x` is a subsequence of `y` (not changing order)
- `x` is of type `y`
- `x` is a subtype of `y`
- `x` is categorical
- `x` is distinct

## (overload 1/2) `selectRows :: t1:Table * selector:Seq<Bool> -> t2:Table`

### Constraints

__Requires:__

* `length(selector)` is equal to `nrows(t1)`

__Ensures:__

* `rows(t2)` is a subsequence of `rows(t1)`
* for all `i` in `range(nrows(t1))`, `rows(t1)[i]` is in `rows(t2)` if and only if `selector[i]` is equal to `true`
* `header(t2)` is equal to `header(t1)`
* `schema(t2)` is equal to `schema(t2)`

### Description

Given a `Table` and a `Seq<Bool>` that represents a predicate on rows, returns a Table with only the rows for which the predicate returns true. [cite cs111]

```lua
> selectRows(tableSF, [2, 0, 2, 1])
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Eve"   | 13  | "red"          |
| "Bob"   | 12  | "blue"         |
| "Eve"   | 13  | "red"          |
| "Alice" | 17  | "green"        |
> selectRows(tableGM, [2, 1])
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

### Origins

In R, `t1[selector,]`

## (overload 2/2) `selectRows :: t1:Table * selector:Seq<Number> -> t2:Table`

### Constraints

__Requires:__

* for all `n` in `selector`, `n` is in `range(nrows(t1))`

__Ensures:__

* `nrows(t2)` is equal to `length(selector)`
* for all `i` in `range(length(selector))`, `rows(t2)[i]` is equal to `rows(t1)[selector[i]]`
* `header(t2)` is equal to `header(t1)`
* `schema(t2)` is equal to `schema(t2)`

### Description

Given a `Table` and a `Seq<Number>` containing row indexes, and produces a new `Table` containing only those rows. [cite cs111]

```lua
> selectRows(tableSF, [true, false, true])
| name  | age | favorite-color |
| ----- | --- | -------------- |
| "Bob" | 12  | "blue"         |
| "Eve" | 13  | "red"          |
> selectRows(tableGM, [false, false, true])
| name  | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ----- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Eve" | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
> selectRows(tableSF, [2, 0, 2, 1])
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Eve"   | 13  | "red"          |
| "Bob"   | 12  | "blue"         |
| "Eve"   | 13  | "red"          |
| "Alice" | 17  | "green"        |
> selectRows(tableGM, [2, 1])
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

### Origins

In R, `t1[selector,]`

## (overload 1/3) `selectColumns :: t1:Table * selector:Seq<Bool> -> t2:Table`

### Constraints

__Requires:__

* `length(selector)` is equal to `ncols(t1)`

__Ensures:__

* `header(t2)` is a subsequence of `header(t1)`
* for all `i` in `range(ncols(t1))`, `header(t1)[i]` in `header(t2)` if and only if `selector[i]` is equal to `true`
* `schema(t2)` is included by `schema(t1)`

### Description

Consumes a `Table` and a `Seq<Boolean>` deciding whether each column should be kept, and produces a new `Table` containing only those columns. The order of the columns is as given in the input `Seq`. [cite cs111]

```lua
> selectColumns(tableSF, [true, true, false])
| name    | age |
| ------- | --- |
| "Bob"   | 12  |
| "Alice" | 17  |
| "Eve"   | 13  |
> selectColumns(tableGF, [true, false, false, false, true, false, false, true])
| name    | midterm | final |
| ------- | ------- | ----- |
| "Bob"   | 77      | 87    |
| "Alice" | 88      | 85    |
| "Eve"   | 84      | 77    |
```

### Origins

In R, `t1[,selector]`

## (overload 2/3) `selectColumns :: t1:Table * selector:Seq<Number> -> t2:Table`
  
### Constraints

__Requires:__

* `selector` has no duplicates
* for all `n` in `selector`, `n` is in `range(ncols(t1))`

__Ensures:__

* `length(header(t2))` is equal to `length(selector)`
* for all `i` in `range(length(selector))`, `header(t2)[i]` is equal to `header(t1)[selector[i]]`
* `schema(t2)` is included by `schema(t2)`

### Description

Consumes a `Table` and a `Seq<ColName>` containing column indexes, and produces a new `Table` containing only those columns. The order of the columns is as given in the input `Seq`.


```lua
> selectColumns(tableSF, [2, 1])
| favorite-color | age |
| -------------- | --- |
| "blue"         | 12  |
| "green"        | 17  |
| "red"          | 13  |
> selectColumns(tableGF, [7, 0, 4])
| final | name    | midterm |
| ----- | ------- | ------- |
| 87    | "Bob"   | 77      |
| 85    | "Alice" | 88      |
| 77    | "Eve"   | 84      |
```

### Origins

In R, `t1[,selector]`

## (overload 3/3) `selectColumns :: t1:Table * selector:Seq<ColName> -> t2:Table`

### Constraints

__Requires:__

* `selector` has no duplicates
* for all `c` in `selector`, `c` is in `header(t1)`

__Ensures:__

* `header(t2)` is equal to `cs` 
* `schema(t2)` is included by `schema(t2)`

### Description

Consumes a `Table` and a `Seq<ColName>` containing column names, and produces a new `Table` containing only those columns. The order of the columns is as given in the input `Seq`. [cite cs111]

```lua
> selectColumns(tableSF, ["favorite-color", "age"])
| favorite-color | age |
| -------------- | --- |
| "blue"         | 12  |
| "green"        | 17  |
| "red"          | 13  |
> selectColumns(tableGF, ["final", "name", "midterm"])
| final | name    | midterm |
| ----- | ------- | ------- |
| 87    | "Bob"   | 77      |
| 85    | "Alice" | 88      |
| 77    | "Eve"   | 84      |
```

### Origins

In R, `t1[,selector]`

In CS111 Pyret, `select-columns(t, selector)`.

## `subTable :: t1:Table * rowSelector:Seq * columnSelector:Seq -> t2:Table`

`subTable(t, x, y)` is defined as `selectColumns(selectRows(t, x), y)`. Given that `selectRows` has 2 overloadings and that `selectColumns` has 3, the `subTable` function has 6 overloadings. Each of the 6 overloadings has the constraints given by combining the constraints of the corresponding `selectRows` and `selectColumns` in the obvious way.

## `randomRows :: t1:Table * n:Number -> t2:Table`

### Constraints

__Requires:__

- `n` is not greater than `nrows(t1)`

__Ensures:__

- `header(t2)` is equal to `header(t1)`
- `schema(t2)` is equal to `schema(t1)`
- `nrows(t2)` is equal to `n`
- `ncols(t2)` is equal to `ncols(t1)`

### Description

Sample `n` observations (rows) from table `t1` without replacement.

```lua
> randomRows(tableSF, 0)
| name    | age | favorite-color |
| ------- | --- | -------------- |
> randomRows(tableGM, 2)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Eve"   | 13  |       | 9     | 84      | 8     | 8     | 77    |
| "Alice" | 17  | 6     | 8     | 88      |       | 7     | 85    |
```

### Origins

- In Bootstrap Pyret, `random-rows(t, n)`

## `getRow :: t:Table * n:Number -> r:Row`

### Constraints

__Requires:__

* `n` is in `range(nrows(t))`
  
__Ensures:__

* `r` is equal to `rows(t)[n]`

### Description

Extract a row out of a table by a numeric index. E.g.

```
> getRow(tableSF, 0)
[row: ("name", "Bob"), ("age", 12), ("favorite-color", "blue")]
> getRow(tableGF, 1)
[row:
  ("name", "Alice"), ("age", 17),
  ("quiz1", 6), ("quiz2", 8), ("midterm", 88),
  ("quiz3", 8), ("quiz4", 7), ("final", 85)]
```

### Origins

* In R, `t[n,]`. The output is a data frame.
* In CS111 Pyret, `get-row(t, n)`
* In Bootstrap Pyret, `t.row-n(n)`

## (overloading 1/2) `getColumn :: t:Table * n:Number -> vs:Seq<Value>`

### Constraints

__Requires:__

* `n` is in `range(ncols(t))`

__Ensures:__

* for all `v` in `vs`, `v` is of type `schema(t)[header(t)[n]]`

### Description

Returns a `Seq` of the values in the indexed column in `t`. [cite cs111]

```
> getColumn(tableSF, 1)
[12, 17, 13]
> getColumn(tableGF, 0)
["Bob", "Alice", "Eve"]
```

### Origins

- In R, `t[[n]]`

## (overloading 2/2) `getColumn :: t:Table * c:ColName -> vs:Seq<Value>`

### Constraints

__Requires:__

* `c` is in `header(t)`

__Ensures:__

* for all `v` in `vs`, `v` is of type `schema(t)[c]`

### Description

Returns a `Seq` of the values in the named column in `t`. [cite cs111]

```
> getColumn(tableSF, "age")
[12, 17, 13]
> getColumn(tableGF, "name")
["Bob", "Alice", "Eve"]
```

### Origins

In Python pandas, `t[c]`.

In R, `t[[c]]`.

In CS111 Pyret, `t.get-column(c)`.

## `getValue :: r:Row * c:ColName -> v:Value`

### Constraints

__Requires:__

* `c` is in header(r)

__Ensures:__

* `v` is of type `schema(r)[c]`

### Description

Retrieve the value for the column `c` in the row `r`. [cite cs111]

```
> getValue([row: ("name", "Bob"),  ("age", 12)], "age")
12
```

### Origins

- In CS111 Pyret, `r[c]`
- In Bootstrap Pyret, `r[c]`

## `nrows :: t:Table -> n:Number`

### Constraints

__Requires:__

__Ensures:__

* `n` is equal to `nrows(t)`

### Description

Returns a `Number` representing the number of rows in the `Table`. [cite cs111]

```
> nrows(tableSF)
3
> nrows(tableSM)
3
```

### Origins

- In R, `nrow(t)`
- In CS111 Pyret, `t.length()`


## `ncols :: t:Table -> n:Number`

### Constraints

__Requires:__

__Ensures:__

* `n` is equal to `ncols(t)`

### Description

Returns a `Number` representing the number of columns in the `Table`. [cite cs111]
```
> ncols(tableSF)
3
> ncols(tableSM)
8
```

### Origins

In R, `ncol(t)`

## `header :: t:Table -> cs:Seq<ColName>`

### Constraints

__Requires:__

__Ensures:__

* `cs` is equal to `header(t)`

### Description

Returns a `Seq` representing the column names in the `Table`.

```
> header(tableSF)
["name", "age", "favorite-color"]
> header(tableGF)
["name", "age", "quiz1", "quiz2", "midterm", "quiz3", "quiz4", "final"]
```

### Origins

In R, `colnames(t)`

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

Consumes an existing `Table` and produces a new `Table` containing an additional column with the given `ColName`, using `f` to produce the values for that column, once for each row. [cite cs111]

```lua
> isTeenagerBuilder =
    function(r):
      12 < getValue(r, "age") and getValue(r, "age") < 20
    end
> buildColumn(tableSF, "is-teenager", isTeenagerBuilder)
| name    | age | favorite-color | is-teenager |
| ------- | --- | -------------- | ----------- |
| "Bob"   | 12  | "blue"         | false       |
| "Alice" | 17  | "green"        | true        |
| "Eve"   | 13  | "red"          | true        |
> didWellInFinal =
    function(r):
      85 <= getValue(r, "final")
    end
> buildColumn(tableGF, "did-well-in-final", didWellInFinal)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final | did-well-in-final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- | ----------------- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    | true              |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    | true              |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    | false             |
```

### Origin

* In CS111 Pyret, `build-column(t, c, f)`.
* In Bootstrap Pyret, `t.build-column(c, f)`

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

Consumes a `Table` and a `Row` to add, and produces a new `Table` with the rows from the original table followed by the given `Row`. [cite cs111]

```
> addRow(
    tableSF,
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
    tableGF,
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

### Origins

* In CS111 Pyret, `add-row(t1,r)`

## `addColumn :: t1:Table * c:ColName * vs:Seq<Value> -> t2:Table`

### Constraints

__Requires:__

* `c` is not in `header(t1)`
* `length(vs)` is equal to `ncols(t1)`

__Ensures:__

* `header(t2)` is equal to `concat(header(t1), [c])`
* `schema(t1)` is included by `schema(t2)`
* for all `v` in `vs`, `vs` is of type `schema(t2)[c]`
* `nrows(t2)` is equal to `nrows(t1)`

### Description

Consumes a `ColName` representing a column name and a `Seq` of values and produces a new `Table` with the columns of the input `Table` followed by a column with the given name and values. Note that the length of `vs` must equal the length of the `Table`. [cs111]

```
> hairColor = ["brown", "red", "blonde"]
> addColumn(tableSF, "hair-color", hairColor)
| name    | age | favorite-color | hair-color |
| ------- | --- | -------------- | ---------- |
| "Bob"   | 12  | "blue"         | "brown"    |
| "Alice" | 17  | "green"        | "red"      |
| "Eve"   | 13  | "red"          | "blonde"   |
> presentation = [9, 9, 6]
> addColumn(tableGF, "presentation", presentation)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final | presentation |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- | ------------ |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    | 9            |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    | 9            |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    | 6            |
```

### Origins

* In CS111 Pyret, `add-col(t, c, vs)`
* In Python pandas, `t[c] = vs`. If `c` is already in `t`, the old column is replaced with `vs` and `c` keeps its position in the header. 

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

Consumes a `Table`, a `ColName` representing a column name, and a transformation function and produces a new `Table` where the transformation function has been applied to all values in the named column. [cite cs111]

```
> addLastName =
    lam(name):
      Strings.concat(name, “ Smith”)
    end
> transformColumn(tableSF, “name”, addLastName)
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
> transformColumn(tableGF, "quiz1", quizScoreToPassFail)
| name    | age | quiz1  | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ------ | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | "pass" | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | "fail" | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | "fail" | 9     | 84      | 8     | 8     | 77    |
```

### Origins

In CS111 Pyret, `transform-column(t, c, f)`

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

Given a `Table` and a predicate on rows, returns a `Table` with only the rows for which the predicate returns `true`. [cite cs111]

```
> ageUnderFifteen =
    lam(r):
      getValue(r, “age”) < 15
    end
> filter(tableSF, ageUnderFifteen)
| name  | age | favorite-color |
| ----- | --- | -------------- |
| "Bob" | 12  | "blue"         |
| "Eve" | 13  | "red"          |
> nameLongerThan3Letters =
    lam(r):
      length(getValue(r, “name)) > 3
    end
> filter(tableGF, nameLongerThan3Letters)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

### Origins

* In CS111 Pyret, `filter-with(t1, f)`
* In Bootstrap Pyret, `t1.filter(f)`


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

Given a `Table` and the name of a column in that `Table`, return a `Table` with the same rows ordered based on the named column. If `b` is `true`, the `Table` will be sorted in ascending order, otherwise it will be in descending order. [cite cs111]

```lua
> sort(tableSF, "age", true)
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
| "Eve"   | 13  | "red"          |
| "Alice" | 17  | "green"        |
> sort(tableGF)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

### Origins

- In cs111 Pyret, `sort-by(t, c, b)`
- In Bootstrap Pyret, `t.order-by(c, b)`

## `deleteColumn :: t1:Table * c:ColName -> t2:Table`

### Constraints

__Requires:__

- `c` in `header(t1)`

__Ensures:__

- `nrows(t2)` is equal to `nrows(t1)`
- `ncols(t2)` is equal to `ncols(t1) - 1`
- `header(t2)` is a subsequence of `header(t1)`
- `c` is not in `header(t2)`
- `schema(t2)` is included by `schema(t1)`
- for all `c` in `header(t2)`, `schema(t2)[c]` is equal to `schema(t1)[c]`

### Description

Returns a `Table` that is the same as `t`, except without the column whose name is `c`. [cite cs111]

```lua
> deleteColumn(tableSF, "age")
| name    | favorite-color |
| ------- | -------------- |
| "Bob"   | "blue"         |
| "Alice" | "green"        |
| "Eve"   | "red"          |
> deleteColumn(tableGF, "final")
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 |
| ------- | --- | ----- | ----- | ------- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     |
```

### Origins

- In pandas, `del t[c]`
- In cs111 Pyret, `t.drop(c)`

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

Takes a `Table` and a `ColName` representing the name of a column in that `Table`. Produces a `Table` that summarizes how many rows have each value in the given column. [cite cs111]

```lua
> count(tableSF, "favorite-color")
| value   | count |
| ------- | ----- |
| "blue"  | 1     |
| "green" | 1     |
| "red"   | 1     |
> count(tableGF, "age")
| value | count |
| ----- | ----- |
| 12    | 1     |
| 17    | 1     |
| 13    | 1     |
```

### Origins

- In CS111 Pyret, `count(t, c)`
- In Bootstrap Pyret, `count(t, c)`

## `histogram :: t:Table * c:ColName * n:Number -> i:Image`

Displays an `Image` of a histogram of values in the named column, which must contain numeric data. `n` indicates the width of bins in the histogram. [cite cs111]

### Constraints

__Requires:__

- `c` is in `header(t)`
- `schema(t)[c]` is a subtype of `Number`

__Ensures:__

### Origins

- In CS111 Pyret, `histogram(t, c, n)`
- In Bootstrap Pyret, `histogram(t, c, n)`

## `scatterPlot :: t:Table * c1:ColName * c2:ColName -> i:Image`

Displays an `Image` of a scatter plot from the given table. `c1` names the column in `t` to use for x-values, and `c2` names the column in `t` to use for y-values. Both columns must contain `Number` values. [cite cs111]

### Constraints

__Requires:__

- `c1` is in `header(t)`
- `c2` is in `header(t)`
- `schema(t)[c1]` is a subtype of `Number`
- `schema(t)[c2]` is a subtype of `Number`

__Ensures:__

### Origins

- In CS111 Pyret, `scatter-plot(t, c1, c2)`

### Notes

- `lr-plot` in CS111 Pyret has similar constraints on its inputs and outputs, so that function is not presented here.
- `scatter-plot` in Bootstrap Pyret has similar constraints on its inputs and outputs, so that function is not presented here.
- `lr-plot` in Bootstrap Pyret has similar constraints on its inputs and outputs, so that function is not presented here.

## `pieChart :: t:Table * c1:ColName * c2:ColName -> i:Image`

Display an `Image` of a pie-chart from the given `Table` (one slice per row). `c1` is the label to use for the chart, and `c2` names the column of the `Table` to use for values in the pie chart. [cite cs111]

### Constraints

__Requires:__

- `c1` is in `header(t)`
- `c2` is in `header(t)`
- `schema(t)[c1]` is a subtype of `String`
- `schema(t)[c2]` is a subtype of non-negative `Number`
- `getColumn(t, c1)` containts no duplicate

__Ensures:__

### Origins

- In CS111 Pyret, `pie-chart(t, c1, c2)`

### Notes

- `bar-chart` in CS111 Pyret has similar constraints on its inputs and outputs, so that function is not presented here.

## `freqBarChart :: t:Table * c:ColName -> Image`

### Constraints

__Requires:__

- `c` is in `header(t)`
- `schema(t)[c]` is categorical

### Description

Display an `Image` of a frequency bar-chart from the given `Table`. There is one bar for each unique value of the column with name `c` (showing the number of occurrences of that value). [cite cs111]

### Origins

- In cs111 Pyret, `freq-bar-chart(t, c)`
  
### Notes

- `pie-chart` in Bootstrap Pyret has similar constraints on its inputs and outputs, so that function is not presented here.
- `bar-chart` in Bootstrap Pyret has similar constraints on its inputs and outputs, so that function is not presented here.

## `boxPlot :: t:Table * c:ColName -> Image`

### Constraints

__Requires:__

- `c` is in `header(t)`
- `schema(t)[c]` is categorical

__Ensures:__

### Description

Produces an `Image` of a box plot of the values in the column named `c` in the `Table`. A box plot shows the minimum, maximum, and median values of a column, as well as the first (lowest) and third quartiles of the dataset; this is helpful for seeing the variation in a dataset. [cite cs111]

### Origins

- In cs111 Pyret, `box-plot(t, c)`

