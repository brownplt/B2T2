
## `getValue :: Row * ColName -> Value`

`getValue(r, c) = v` accesses a row `r` at a particular column `c`, resulting in a particular value. e.g.

```
> getValue([row: ("name", "Bob"),  ("age", 12)], "age")
12
```

`getValue(r, c) = v` requires 

* `c` is in header(r)

and ensures

* `v` is of type `schema(r)[c]`

## `selectColumns :: Table * List<ColName> -> Table`

`selectColumns(t1, cs) = t2` produces a new table containing only those columns referred to by `cs`. The order of the columns is as given in `cs`. e.g.

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

`selectColumns(t1, cs) = t2` requires
* `cs` must be distinct
* `cs` constitute a sub-sequence of `header(t1)`

and ensures

* `schema(t1)` includes `schema(t2)`
* `cs == header(t2)`

