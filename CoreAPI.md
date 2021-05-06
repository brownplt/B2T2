
## `getValue :: Row * ColName -> Value`

`getValue(r, c) = v` accesses a row `r` at a particular column `c`, resulting in a particular value. e.g.

```
> getValue([row: ("name", "Bob"),  ("age", 12)], "age")
12
```

`getValue(r, c) = v` requires that 

* c is in header(r)

and ensures that

* v is of type `schema(r)[c]`
