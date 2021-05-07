## `getValue :: r:Row * c:ColName -> v:Value`

__Require:__

* `c` is in header(r)

__Ensure:__

* `v` is of type `schema(r)[c]`

__Description:__ access a row `r` at a particular column `c`, resulting in a particular value. e.g.

```
> getValue([row: ("name", "Bob"),  ("age", 12)], "age")
12
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


