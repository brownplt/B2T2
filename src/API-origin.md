## (overload 1/2) `selectRows :: t1:Table * selector:Seq<Number> -> t2:Table`

### Origins

- In R, `t1[selector,]`
- In pandas, `t1.iloc[selector]`

## (overload 2/2) `selectRows :: t1:Table * selector:Seq<Boolean> -> t2:Table`

### Origins

- In R, `t1[selector,]`
- In pandas, `t1.iloc[selector]`

## (overload 1/3) `selectColumns :: t1:Table * selector:Seq<Boolean> -> t2:Table`

### Origins

In R, `t1[,selector]`

## (overload 2/3) `selectColumns :: t1:Table * selector:Seq<Number> -> t2:Table`

### Origins

In R, `t1[,selector]`

## (overload 3/3) `selectColumns :: t1:Table * selector:Seq<ColName> -> t2:Table`

### Origins

- In R, `t1[,selector]`
- In CS111 Pyret, `select-columns(t, selector)`.

## `subTable :: t1:Table * rowSelector:Seq * columnSelector:Seq -> t2:Table`

`subTable(t, x, y)` is defined as `selectColumns(selectRows(t, x), y)`. This function has 6 overloadings because `selectRows` has 2 overloadings and that `selectColumns` has 3. Each of the 6 overloadings has the constraints given by combining the constraints of the corresponding `selectRows` and `selectColumns` in the obvious way.

## `head :: t1:Table * n:Number -> t2:Table`

### Origins

- In pandas, `t1.head(n)`

## `getRow :: t:Table * n:Number -> r:Row`

### Origins

* In R, `t[n,]`. The output is a data frame.
* In CS111 Pyret, `get-row(t, n)`
* In Bootstrap Pyret, `t.row-n(n)`

## (overloading 1/2) `getColumn :: t:Table * n:Number -> vs:Seq<Value>`

### Origins

- In R, `t[[n]]`

## (overloading 2/2) `getColumn :: t:Table * c:ColName -> vs:Seq<Value>`

### Origins

In Python pandas, `t[c]`.

In R, `t[[c]]`.

In CS111 Pyret, `t.get-column(c)`.

## `getValue :: r:Row * c:ColName -> v:Value`

### Origins

- In CS111 Pyret, `r[c]`
- In Bootstrap Pyret, `r[c]`

## `nrows :: t:Table -> n:Number`

### Origins

- In R, `nrow(t)`
- In CS111 Pyret, `t.length()`


## `ncols :: t:Table -> n:Number`

### Origins

In R, `ncol(t)`

## `shape :: t:Table -> (n1:Number * n2:Number)

### Origins

- In pandas, `t.shape`
- In R, `dim(t)`

## (overload 1/2) `header :: t:Table -> cs:Seq<ColName>`

### Origins

In R, `colnames(t)`

## (overload 2/2) `header :: r:Row -> cs:Seq<ColName>`

### Origins

In R, `colnames(t)`

## `buildColumn :: t1:Table * c:ColName * f:(r:Row -> v:Value) -> t2:Table`

### Origin

- In Python, `t.assign(c=f)`, where `c` must be a literal column name. If `c` is already in `t`, the old column will be updated.
- In R, `mutate(t, c=f)`, where `c` must be a literal column name. If `c` is already in `t`, the old column will be updated.
- In CS111 Pyret, `build-column(t, c, f)`.
- In Bootstrap Pyret, `t.build-column(c, f)`

## `updateColumn :: t1:Table * c:ColName * f:(r:Row -> v:Value) -> t2:Table`

### Origin

- In Python, `t.assign(c=f)`, where `c` must be a literal column name. If `c` is not in `t`, a new column will be added.
- In R, `mutate(t, c=f)`, where `c` must be a literal column name. If `c` is not in `t`, a new column will be added.

## `addRow :: t1:Table * r:Row -> t2:Table`

### Origins

* In CS111 Pyret, `add-row(t1,r)`

## `addColumn :: t1:Table * c:ColName * vs:Seq<Value> -> t2:Table`

### Origins

* In CS111 Pyret, `add-col(t, c, vs)`
* In Python pandas, `t[c] = vs`. If `c` is already in `t`, the old column is replaced with `vs` and `c` keeps its position in the header. 

## `transformColumn :: t1:Table * c:ColName * f:(v1:Value -> v2:Value) -> t2:Table`

### Origins

In CS111 Pyret, `transform-column(t, c, f)`

## `filter :: t1:Table * f:(r:Row -> b:Boolean) -> t2:Table`

### Origins

- In CS111 Pyret, `filter-with(t1, f)`
- In Bootstrap Pyret, `t1.filter(f)`
- In LINQ, `Where`


## `sort :: t1:Table * c:ColName * b:Boolean -> t2:Table`

### Origins

- In Python pandas, `t.sort_values(c, ascending=b)`
- In R, `arrange(t, c)` if `b` is `true`.
- In R, `arrange(t, desc(c))` if `b` is `false`.
- In cs111 Pyret, `sort-by(t, c, b)`
- In Bootstrap Pyret, `t.order-by(c, b)`

## `sortByColumns :: t1:Table * cs:Seq<ColName> -> t2:Table`

### Origins

- In pandas, `del t[c]`
- In cs111 Pyret, `t.drop(c)`

## `dropColumns :: t1:Table * cs:Seq<ColName> -> t2:Table`

### Origins

- In R, `select(df, -cs)`. The negation symbol makes the selection dropping.
- In Python pandas, `t1.drop(cs, axis=1)`

## `distinct :: t1:Table -> t2:Table`

### Origins

- In R, `distinct(t1)`
- In pandas, `t1.drop_duplicates()`

## `count :: t1:Table * c:ColName -> t2:Table`

### Origins

- In CS111 Pyret, `count(t, c)`
- In Bootstrap Pyret, `count(t, c)`

## `groupByO :: t1:Table * c:ColName -> t2:Table`

### Origins

- In LINQ, `GroupBy`

## `groupJoin :: t1:Table * t2:Table * getKey1:(r1:Row -> k1:Value) * getKey2:(r2:Row -> k2:Value) * sum:(r3:Row * t3:Table -> r4:Row) -> t4:Table`

### Origins

- In LINQ, `GroupJoin`

## `join :: t1:Table * t2:Table * getKey1:(r1:Row -> k1:Value) * getKey2:(r2:Row -> k2:Value) * combine:(r3:Row * r4:Row -> r5:Row) -> t3:Table`

### Origins

- In LINQ, `Join`

## `orderBy :: t1:Table * Seq<getKey:(r:Row -> k:Value) * compare:(k1:Value * k2:Value -> Boolean)> -> t2:Table`

### Origins

- This funtion is a combination of LINQ's `OrderBy` and `ThenBy`.

## `select :: t1:Table * f:(r1:Row * n:Number -> r2:Row) -> t2:Table``

### Origins

- In LINQ, `select`

## `selectMany :: t1:Table * project:(r1:Row * n:Number -> t2:Table) * result:(r2:Row * r3:Row -> r4:Row) -> t2:Table`

### Origins

- In LINQ, `selectMany`

## `histogram :: t:Table * c:ColName * n:Number -> i:Image`

### Origins

- In CS111 Pyret, `histogram(t, c, n)`
- In Bootstrap Pyret, `histogram(t, c, n)`

## `scatterPlot :: t:Table * c1:ColName * c2:ColName -> i:Image`

### Origins

- In CS111 Pyret, `scatter-plot(t, c1, c2)`

## `pieChart :: t:Table * c1:ColName * c2:ColName -> i:Image`

### Origins

- In CS111 Pyret, `pie-chart(t, c1, c2)`

