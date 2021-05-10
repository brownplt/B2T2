## Introduction

This file listed table operators that we gather from Python, R, LINQ, and Pyret communities.

Python pandas: https://pandas.pydata.org/

Python pandas and R: https://pandas.pydata.org/pandas-docs/stable/getting_started/comparison/comparison_with_r.html

R tibbles: https://adv-r.hadley.nz/vectors-chap.html#tibble

R tidying: https://cran.r-project.org/web/packages/tidyr/vignettes/tidy-data.html

Pyret as taught in Brown CS111: https://hackmd.io/@cs111/table

Pyret as taught in Bootstrap project: https://bootstrapworld.org/materials/spring2021/en-us/courses/data-science/pathway-lessons.shtml

## Terminologies

### Functions

length
ncols
nrows
header
schema
range
rows
concat
insert

### Relations

`x` has no duplicates
`x` is equal to `y`
`x` is not greater than `y`
`x` is (not) included by `y`
`x` is (not) in `y`
`x` is a subsequence of `y` (not changing order)
`x` is of type `y`

## `getValue :: r:Row * c:ColName -> v:Value`

### Constraints

__Require:__

* `c` is in header(r)

__Ensure:__

* `v` is of type `schema(r)[c]`

### Description

access a row `r` at a particular column `c`, resulting in a particular value. e.g.

```
> getValue([row: ("name", "Bob"),  ("age", 12)], "age")
12
```

### Origins

In CS111, `get-value(r, c)`

## `subsetBB :: t1:Table * bs1:Seq<Boolean> * bs2:Seq<Boolean> -> t2:Table`

### Constraints

require:

* `length(bs1)` is equal to `nrows(t1)`
* `length(bs2)` is equal to `ncols(t1)`

ensure:

* `rows(t2)` is a subsequence of `rows(t1)`
* for all `i` in `range(nrows(t1))`, `rows(t1)[i]` is in `rows(t2)` if and only if `bs1[i]` is equal to `true`
* for all `i` in `range(ncols(t1))`, `header(t1)[i]` is in `header(t2)` if and only if `bs2[i]` is equal to `true`
* `schema(t2)` is included by `schema(t1)`

### Description

Select a sub-table. e.g.

```
> subsetBB(tableSF, [true, false, true], [true, true, false])
|    name | age |
|---------|-----|
|   "Bob" |     |
|   "Eve" |  13 |
> subsetBB(
    tableGM,
    [false, false, true],
    [true, false, false, false, true, false, false, true])
|    name | midterm | final |
|---------|---------|-------|
|   "Eve" |      84 |    77 |
```

### Origins

In R, `t1[bs1, bs2]`

## `subsetBN :: t1:Table * bs1:Seq<Boolean> * ns2:Seq<Number> -> t2:Table`

### Constraints

require:

* `length(bs1)` is equal to `nrows(t1)`
* `ns2` has no duplicates
* for all `n` in `ns2`, `n` is in `range(ncols(t1))`

ensure:

* `rows(t2)` is a subsequence of `rows(t1)`
* for all `i` in `range(nrows(t1))`, `rows(t1)[i]` is in `rows(t2)` if and only if `bs1[i]` is equal to `true`
* `length(header(t2))` is equal to `length(selector)`for all `i` in `range(length(ns2))`, `header(t2)[i]` is equal to `header(t1)[ns2[i]]`
* `schema(t2)` is included by `schema(t2)`

### Description

Select a sub-table.

```
> subsetBN(tableSF, [true, false, true], [0, 1])
|    name | age |
|---------|-----|
|   "Bob" |     |
|   "Eve" |  13 |
> subsetBN(tableGM, [false, false, true], [4, 7, 0])
| midterm | final |    name |
|---------|-------|---------|
|      84 |    77 |   "Eve" |
```

### Origins

In R, `t1[bs1, ns2]`

## `subsetBC :: t1:Table * bs1:Seq<Boolean> * cs2:Seq<ColName> -> t2:Table`

### Constraints

require:

* `length(bs1)` is equal to `nrows(t1)`
* `cs2` has no duplicates
* for all `c` in `cs2`, `c` is in `header(t1)`

ensure:

* `rows(t2)` is a subsequence of `rows(t1)`
* for all `i` in `range(nrows(t1))`, `rows(t1)[i]` is in `rows(t2)` if and only if `bs1[i]` is equal to `true`
* `header(t2)` is equal to `cs` 
* `schema(t2)` is included by `schema(t2)`

### Description

Select a sub-table.

```
> subsetBC(tableSF, [true, false, true], ["name", "age"])
|    name | age |
|---------|-----|
|   "Bob" |     |
|   "Eve" |  13 |
> subsetBC(tableGM, [false, false, true], ["midterm", "final", "name"])
| midterm | final |    name |
|---------|-------|---------|
|      84 |    77 |   "Eve" |
```

### Origins

In R, `t1[bs1, cs2]`

## `subsetNB :: t1:Table * ns1:Seq<Boolean> * bs2:Seq<Boolean> -> t2:Table`

### Constraints

require:

* for all `n` in `ns1`, `n` is in `range(nrows(t1))`
* `length(bs2)` is equal to `ncols(t1)`

ensure:

* `nrows(t2)` is equal to `length(ns1)`
* for all `i` in `range(length(ns1))`, `rows(t2)[i]` is equal to `rows(t1)[ns1[i]]`
* for all `i` in `range(ncols(t1))`, `header(t1)[i]` is in `header(t2)` if and only if `bs2[i]` is equal to `true`
* `schema(t2)` is included by `schema(t1)`

### Description

Select a sub-table. e.g.

```
> subsetNB(tableSF, [2, 0, 2, 1], [false, true, true])
| age | favorite-color  |
|-----|-----------------|
|  13 |          "red"  |
|  12 |         "blue"  |
|  13 |          "red"  |
|  17 |        "green"  |
> subsetNB(
    tableGM,
    [2, 1],
    [true, false, false, false, true, false, false, true])
|    name | midterm | final |
|---------|---------|-------|
|   "Eve" |      84 |    77 |
| "Alice" |      88 |    85 |
```

### Origins

In R, `t1[ns1, bs2]`


## `subsetNN :: t1:Table * ns1:Seq<Boolean> * ns2:Seq<Number> -> t2:Table`

require:

* for all `n` in `ns1`, `n` is in `range(nrows(t1))`
* `ns2` has no duplicates
* for all `n` in `ns2`, `n` is in `range(ncols(t1))`

ensure:

* `nrows(t2)` is equal to `length(ns1)`
* for all `i` in `range(length(ns1))`, `rows(t2)[i]` is equal to `rows(t1)[ns1[i]]`
* `length(header(t2))` is equal to `length(selector)`
* for all `i` in `range(length(ns2))`, `header(t2)[i]` is equal to `header(t1)[ns2[i]]`
* `schema(t2)` is included by `schema(t2)`

### Description

Select a sub-table.

```
> subsetNN(tableSF, [2, 0, 2, 1], [2, 1])
| favorite-color  | age |
|-----------------|-----|
|          "red"  |  13 |
|         "blue"  |  12 |
|          "red"  |  13 |
|        "green"  |  17 |
> subsetNN(
    tableGM,
    [2, 1],
    [4, 0, 7])
| midterm |    name | final |
|---------|---------|-------|
|      84 |   "Eve" |    77 |
|      88 | "Alice" |    85 |
```

### Origins

In R, `t1[ns1, ns2]`


## `subsetNC :: t1:Table * ns1:Seq<Boolean> * cs2:Seq<ColName> -> t2:Table`

require:

* for all `n` in `ns1`, `n` is in `range(nrows(t1))`
* `cs2` has no duplicates
* for all `c` in `cs2`, `c` is in `header(t1)`

ensure:

* `nrows(t2)` is equal to `length(ns1)`
* for all `i` in `range(length(ns1))`, `rows(t2)[i]` is equal to `rows(t1)[ns1[i]]`
* `header(t2)` is equal to `cs` 
* `schema(t2)` is included by `schema(t2)`

### Description

Select a sub-table.

```
> subsetNC(tableSF, [2, 0, 2, 1], ["favorite-color", "age"])
| favorite-color  | age |
|-----------------|-----|
|          "red"  |  13 |
|         "blue"  |  12 |
|          "red"  |  13 |
|        "green"  |  17 |
> subsetNC(
    tableGM,
    [2, 1],
    ["midterm", "name", "final"])
| midterm |    name | final |
|---------|---------|-------|
|      84 |   "Eve" |    77 |
|      88 | "Alice" |    85 |
```

### Origins

In R, `t1[ns1, cs2]`

## `selectRows :: t1:Table * selector:RowSelector -> t2:Table`

`selectRows` is an family of operators. A row selector can be either a `Seq<Bool>` or a `Seq<Number>`. A programming language may provde `selectRows` as two distinct operators, as one operator with `RowSelector` as a tag or untag union, or as an overloaded operator.

### Constraints (when `selector` is a `Seq<Bool>`)

require:

* `length(selector)` is equal to `nrows(t1)`

ensure:

* `rows(t2)` is a subsequence of `rows(t1)`
* for all `i` in `range(nrows(t1))`, `rows(t1)[i]` is in `rows(t2)` if and only if `selector[i]` is equal to `true`
* `header(t2)` is equal to `header(t1)`
* `schema(t2)` is equal to `schema(t2)`

### Constraints (when `selector` is a `Seq<Number>`)

require:

* for all `n` in `selector`, `n` is in `range(nrows(t1))`

ensure:

* `nrows(t2)` is equal to `length(selector)`
* for all `i` in `range(length(selector))`, `rows(t2)[i]` is equal to `rows(t1)[selector[i]]`
* `header(t2)` is equal to `header(t1)`
* `schema(t2)` is equal to `schema(t2)`

### Description

Select some rows of `t1`

```
> selectRows(tableSF, [true, false, true])
|   name  | age | favorite-color  |
|---------|-----|-----------------|
| "Bob"   |  12 |         "blue"  |
| "Eve"   |  13 |          "red"  |
> selectRows(tableGM, [false, false, true])
|    name | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
|---------|-----|-------|-------|---------|-------|-------|-------|
|   "Eve" |  13 |     7 |     9 |      84 |     8 |     8 |    77 |
> selectRows(tableSF, [2, 0, 2, 1])
|   name  | age | favorite-color  |
|---------|-----|-----------------|
| "Eve"   |  13 |          "red"  |
| "Bob"   |  12 |         "blue"  |
| "Eve"   |  13 |          "red"  |
| "Alice" |  17 |        "green"  |
> selectRows(tableGM, [2, 1])
|    name | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
|---------|-----|-------|-------|---------|-------|-------|-------|
| "Alice" |  17 |     6 |     8 |      88 |     8 |     7 |    85 |
|   "Eve" |  13 |     7 |     9 |      84 |     8 |     8 |    77 |
```

### Origins

In R, `t1[selector,]`

## `selectColumns :: t1:Table * selector:ColumnSelector -> t2:Table`

`selectColumns` is an family of operators. A column selector can be either a `Seq<Bool>`, a `Seq<Number>`, or a `Seq<ColName>`. A programming language may provde `selectColumns` as three distinct operators, as one operator with `ColumnSelector` as a tag or untag union, or as an overloaded operator.

### Constraints (when `selector` is a `Seq<Bool>`)

require:

* `length(selector)` is equal to `ncols(t1)`

ensure:

* `header(t2)` is a subsequence of `header(t1)`
* for all `i` in `range(ncols(t1))`, `header(t1)[i]` in `header(t2)` if and only if `selector[i]` is equal to `true`
* `schema(t2)` is included by `schema(t1)`
  
### Constraints (when `selector` is a `Seq<Number>`)

require:

* `selector` has no duplicates
* for all `n` in `selector`, `n` is in `range(ncols(t1))`

ensure:

* `length(header(t2))` is equal to `length(selector)`
* for all `i` in `range(length(selector))`, `header(t2)[i]` is equal to `header(t1)[selector[i]]`
* `schema(t2)` is included by `schema(t2)`

### Constraints (when `selector` is a `Seq<ColName>`)

require:

* `selector` has no duplicates
* for all `c` in `selector`, `c` is in `header(t1)`

ensure:

* `header(t2)` is equal to `cs` 
* `schema(t2)` is included by `schema(t2)`

### Description

produce a new table containing only those columns referred to by `cs`. The order of the columns is as given in `cs`. e.g.

```
> selectColumns(tableSF, [true, true, false])
|   name  | age |
|---------|-----|
| "Bob"   |  12 |
| "Alice" |  17 |
| "Eve"   |  13 |
> selectColumns(tableGF, [true, false, false, false, true, false, false, true])
|   name   | midterm | final |
|----------|---------|-------|
|    "Bob" |      77 |    87 |
|  "Alice" |      88 |    85 |
|    "Eve" |      84 |    77 |
> selectColumns(tableSF, [2, 1])
| favorite-color  | age |
|-----------------|-----|
|         "blue"  |  12 |
|        "green"  |  17 |
|          "red"  |  13 |
> selectColumns(tableGF, [7, 0, 4])
| final |   name   | midterm |
|-------|----------|---------|
|    87 |    "Bob" |      77 |
|    85 |  "Alice" |      88 |
|    77 |    "Eve" |      84 |
> selectColumns(tableSF, ["favorite-color", "age"])
| favorite-color  | age |
|-----------------|-----|
|         "blue"  |  12 |
|        "green"  |  17 |
|          "red"  |  13 |
> selectColumns(tableGF, ["final", "name", "midterm"])
| final |   name   | midterm |
|-------|----------|---------|
|    87 |    "Bob" |      77 |
|    85 |  "Alice" |      88 |
|    77 |    "Eve" |      84 |
```

### Origins

In R, `t1[,selector]`
In CS111 Pyret, `select-columns(t, selector)`. The `selector` must be a list of column names.

## `getColumnN :: t:Table * n:Number -> vs:List<Value>`

### Constraints

require:

* `n` is in `range(ncols(t))`

ensure:

* for all `v` in `vs`, `v` is of type `schema(t)[header(t)[n]]`

### Description

Extract a column out of a table t by a column index. e.g.

```
> getColumnN(tableSF, 1)
[12, 17, 13]
> getColumnN(tableGF, 0)
["Bob", "Alice", "Eve"]
```

### Origins

In R, `t[[n]]`

## `getColumnC :: t:Table * c:ColName -> vs:List<Value>`

### Constraints

require:

* `c` is in `header(t)`

ensure:

* for all `v` in `vs`, `v` is of type `schema(t)[c]`

### Description

Extract a column out of a table t by a column name. e.g.

```
> getColumnC(tableSF, "age")
[12, 17, 13]
> getColumnC(tableGF, "name")
["Bob", "Alice", "Eve"]
```

### Origins

In Python pandas, `t[c]`.

In R, `t[[c]]`.

In CS111 Pyret, `t.get-column(c)`.

## `getRow :: t:Table * n:Number -> r:Row`

### Constraints

require:

* `n` is in `range(nrows(t))`
  
ensure:

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

### origins

* In R, `t[n,]`. The output is a data frame.
* In CS111 Pyret, `get-row(t, n)`

## `nrows :: t:Table -> n:Number`

### Constraints

require nothing

ensure:

* `n` is equal to `nrows(t)`

### Description

Compute the number of rows in table t. e.g.

```
> nrows(tableSF)
3
> nrows(tableSM)
3
```

### Origins

In R, `nrow(t)`

## `ncols :: t:Table -> n:Number`

### Constraints

require nothing

ensure:

* `n` is equal to `ncols(t)`

### Description

Compute the number of columns in table t. e.g.

```
> ncols(tableSF)
3
> ncols(tableSM)
8
```

### Origins

In R, `ncol(t)`

## `header :: t:Table -> cs:List<ColName>`

### Constraints

require:

ensure:

* `cs` is equal to `header(t)`

### Description

Compute the header. e.g.

```
> header(tableSF)
["name", "age", "favorite-color"]
> header(tableGF)
["name", "age", "quiz1", "quiz2", "midterm", "quiz3", "quiz4", "final"]
```

### origins

In R, `colnames(t)`

## `buildColumn :: t1:Table * c:ColName * f:(r:Row -> v:Value) -> t2:Table`

### Constraints

require:

* `c` is not in `header(t1)`

ensure:

* `header(r)` is equal to `header(t1)`
* `schema(r)` is equal to `schema(t1)`
* `header(t2)` is equal to `concat(header(t1), [c])`
* `v` is of type `schema(t2)[c]`
* for all `c` in `header(t1)`, `schema(t2)[c]` is equal to `schema(t1)[c]`

### Description

Compute a new table by adding a new column to t1. The new column will be named after c. And its values are computed by f from each row of t1. E.g.

```lua
> isTeenagerBuilder =
    function(r):
      12 < getValue(r, "age") and getValue(r, "age") < 20
    end
> buildColumn(tableSF, "is-teenager", isTeenagerBuilder)
|   name  | age | favorite-color  | is-teenager |
|---------|-----|-----------------|-------------|
| "Bob"   |  12 |         "blue"  |       false |
| "Alice" |  17 |        "green"  |        true |
| "Eve"   |  13 |          "red"  |        true |
> didWellInFinal =
    function(r):
      85 <= getValue(r, "final")
    end
> buildColumn(tableGF, "did-well-in-final", didWellInFinal)
|    name | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final | did-well-in-final |
|---------|-----|-------|-------|---------|-------|-------|-------|-------------------|
|   "Bob" |  12 |     8 |     9 |      77 |     7 |     9 |    87 |              true |
| "Alice" |  17 |     6 |     8 |      88 |     8 |     7 |    85 |              true |
|   "Eve" |  13 |     7 |     9 |      84 |     8 |     8 |    77 |             false |
```

### Origin

* In CS111 Pyret, `build-column(t, c, f)`.
* In Bootstrap Pyret, `t.build-column(c, f)`

## `addRow :: t1:Table * r:Row -> t2:Table`

### Constraints

require:

* `header(r)` is equal to `header(t1)`
* `schema(r)` is equal to `schema(t1)`

ensure:

* `header(t2)` is equal to `header(t1)`
* `schema(t2)` is equal to `schema(t1)`
* `nrows(t2)` is equal to `nrows(t1) + 1`

### Description

Compute a new table by adding a new row to `t1`. e.g.

```
> addRow(
    tableSF,
    [row: 
      ("name", "Colton"), ("age", 19),
      ("favorite-color", "blue")])
|   name   | age | favorite-color  |
|----------|-----|-----------------|
|    "Bob" |  12 |         "blue"  |
|  "Alice" |  17 |        "green"  |
|    "Eve" |  13 |          "red"  |
| "Colton" |  19 |         "blue"  |
> addRow(
    tableGF,
    [row:
      ("name", "Colton"), ("age", 19),
      ("quiz1", 8), ("quiz2", 9), ("midterm", 73),
      ("quiz3", 7), ("quiz4", 9), ("final", 64)])
|     name | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
|----------|-----|-------|-------|---------|-------|-------|-------|
|    "Bob" |  12 |     8 |     9 |      77 |     7 |     9 |    87 |
|  "Alice" |  17 |     6 |     8 |      88 |     8 |     7 |    85 |
|    "Eve" |  13 |     7 |     9 |      84 |     8 |     8 |    77 |
| "Colton" |  19 |     8 |     9 |      73 |     7 |     9 |    64 |
```

### origins

* In CS111 Pyret, `add-row(t1,r)`

## `addColumn :: t1:Table * c:ColName * vs:List<Value> -> t2:Table`

### Constraints

require:

* `c` is not in `header(t1)`
* `length(vs)` is equal to `ncols(t1)`

ensure:

* `header(t2)` is equal to `concat(header(t1), [c])`
* `schema(t1)` is included by `schema(t2)`
* for all `v` in `vs`, `vs` is of type `schema(t2)[c]`
* `nrows(t2)` is equal to `nrows(t1)`

### Description

Compute a new table by adding a new column to t1. e.g.

```
> hairColor = ["brown", "red", "blonde"]
> addColumn(tableSF, "hair-color", hairColor)
|   name  | age | favorite-color  | hair-color |
|---------|-----|-----------------|------------|
| "Bob"   |  12 |         "blue"  |    "brown" |
| "Alice" |  17 |        "green"  |      "red" |
| "Eve"   |  13 |          "red"  |   "blonde" |
> presentation = [9, 9, 6]
> addColumn(tableGF, "presentation", presentation)
|    name | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final | presentation |
|---------|-----|-------|-------|---------|-------|-------|-------|--------------|
|   "Bob" |  12 |     8 |     9 |      77 |     7 |     9 |    87 |            9 |
| "Alice" |  17 |     6 |     8 |      88 |     8 |     7 |    85 |            9 |
|   "Eve" |  13 |     7 |     9 |      84 |     8 |     8 |    77 |            6 |
```

### origins

* In CS111 Pyret, `add-col(t, c, vs)`
* In Python pandas, `t[c] = vs`. If `c` is already in `t`, the old column is replaced with `vs` and `c` keeps its position in the header. 

## `transformColumn :: t1:Table * c:ColName * f:(v1:Value -> v2:Value) -> t2:Table`

### Constraints

require:

* `c` is in `header(t1)`

ensure:

* `v1` is of type `schema(t1)[c]`
* `header(t2)` is equal to `header(t1)`
* for all `c'` in `header(t1)`, if `c'` is not equal to `c` then `schema(t2)[c]` is equal to `schema(t1)[c]`
* `v2` is of type `schema(t2)[c]`

### Description

Update a column in `t1`. For each row, `f` maps from the old value to the new one. E.g.

```
> addLastName =
    lam(name):
      Strings.concat(name, “ Smith”)
    end
> transformColumn(tableSF, “name”, addLastName)
|          name | age |  favorite-color |
|---------------|-----|-----------------|
|   "Bob Smith" |  12 |         "blue"  |
| "Alice Smith" |  17 |        "green"  |
|   "Eve Smith" |  13 |          "red"  |
> quizScoreToPassFail =
    lam(score):
      if score <= 6:
        "fail"
      else:
        "pass"
      end
    end
> transformColumn(tableGF, "quiz1", quizScoreToPassFail)
|    name | age |  quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
|---------|-----|--------|-------|---------|-------|-------|-------|
|   "Bob" |  12 | "pass" |     9 |      77 |     7 |     9 |    87 |
| "Alice" |  17 | "fail" |     8 |      88 |     8 |     7 |    85 |
|   "Eve" |  13 | "fail" |     9 |      84 |     8 |     8 |    77 |
```

### origins

In CS111 Pyret, `transform-column(t, c, f)`

## `filter :: t1:Table * f:(r:Row -> b:Boolean) -> t2:Table`

### Constraints

require:

ensure:

* `header(r)` is equal to `header(t1)`
* `schema(r)` is equal to `schema(t1)`
* `header(t2)` is equal to `header(t1)`
* `schema(t2)` is equal to `schema(t1)`
* `nrows(t2)` is not greater than `nrows(t1)`

### Description

For each row of t1, keep those satisfy f and delete the others. E.g.

```
> ageUnderFifteen =
    lam(r):
      getValue(r, “age”) < 15
    end
> filter(tableSF, ageUnderFifteen)
|  name | age | favorite-color |
|-------|-----|----------------|
| "Bob" |  12 |         "blue" |
| "Eve" |  13 |          "red" |
> nameLongerThan3Letters =
    lam(r):
      length(getValue(r, “name)) > 3
    end
> filter(tableGF, nameLongerThan3Letters)
|    name | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
|---------|-----|-------|-------|---------|-------|-------|-------|
|   "Bob" |  12 |     8 |     9 |      77 |     7 |     9 |    87 |
| "Alice" |  17 |     6 |     8 |      88 |     8 |     7 |    85 |
|   "Eve" |  13 |     7 |     9 |      84 |     8 |     8 |    77 |
```

### origins

* In CS111 Pyret, `filter-with(t1, f)`
* In Bootstrap Pyret, `t1.filter(f)`

