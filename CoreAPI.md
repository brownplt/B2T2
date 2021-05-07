## `getValue :: r:Row * c:ColName -> v:Value`

[TODO: maybe we should remove getValue because it is not about table. It is perfectly fine to program tables without the concept "row"]

__Require:__

* `c` is in header(r)

__Ensure:__

* `v` is of type `schema(r)[c]`

__Description:__ access a row `r` at a particular column `c`, resulting in a particular value. e.g.

```
> getValue([row: ("name", "Bob"),  ("age", 12)], "age")
12
```

In CS111, `get-value(r, c)`

## `subsetBB :: t1:Table * bs1:List<Boolean> * bs2:List<Boolean> -> t2:Table`

require:

* `length(bs1)` is equal to `nrows(t1)`
* `length(bs2)` is equal to `ncols(t1)`

ensure:

* `nrows(t2)` is equal to the number of `true`s in `bs1`
* `schema(t2)` is a subsequence of `schema(t1)` such that it only includes column names whose corresponding Boolean value in `bs2` is `true`

desc:

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
|   "Bob" |      77 |    87 |
| "Alice" |      88 |    85 |
|   "Eve" |      84 |    77 |
```

## `subsetBN :: t1:Table * bs1:List<Boolean> * ns2:List<Number> -> t2:Table`

require:

* `length(bs1)` is equal to `nrows(t1)`
* every `n` in `ns2` is a valid column index of `t1`
* there is no duplicated element in `ns2`

ensure:

* `nrows(t2)` is equal to the number of `true`s in `bs1`
* `schema(t2)` is a permutation of a subsequence of `header(t1)` such that it only includes columns indicated by `ns2`

desc:

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
|      77 |    87 |   "Bob" |
|      88 |    85 | "Alice" |
|      84 |    77 |   "Eve" |
```

## `subsetBC :: t1:Table * bs1:List<Boolean> * cs2:List<ColName> -> t2:Table`

require:

* `length(bs1)` is equal to `nrows(t1)`
* every `c` in `cs2` is a valid column name of `t1`
* there is no duplicated element in `cs2`

ensure:

* `nrows(t2)` is equal to the number of `true`s in `bs1`
* `header(t2)` is equal to `cs2` 
* for all `c` in `cs2` we have `schema(t2)[c] == schema(t1)[c]`

desc:

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
|      77 |    87 |   "Bob" |
|      88 |    85 | "Alice" |
|      84 |    77 |   "Eve" |
```

## `selectColumns :: t1:Table * cs:List<ColName> -> t2:Table`

require:
* `cs` must be distinct
* `cs` constitute a sub-sequence of `header(t1)`

ensure:

* `schema(t1)` includes `schema(t2)`
* `cs == header(t2)`

produce a new table containing only those columns referred to by `cs`. The order of the columns is as given in `cs`. e.g.

```
> selectColumns(tableSF, ["name", "age"])
|   name  | age |
|---------|-----|
| "Bob"   |  12 |
| "Alice" |  17 |
| "Eve"   |  13 |
> selectColumns(tableGF, ["final", "midterm", "name"])
| final | midterm |   name   |
|-------|---------|----------|
|    87 |      77 |    "Bob" | 
|    85 |      88 |  "Alice" |
|    77 |      84 |    "Eve" |
```


