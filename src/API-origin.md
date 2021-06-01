## (overload 1/2) `selectRows :: t1:Table * selector:Seq<Number> -> t2:Table`

### Origins

- In R, `t1[selector,]`
- R, `slice`
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

- pandas, `t1.iloc[:, selector]`
- julia, `t1[:, selector]`
- In R, `t1[,selector]`

## (overload 3/3) `selectColumns :: t1:Table * selector:Seq<ColName> -> t2:Table`

### Origins

- julia, `select`
- In R, `t1[,selector]`
- In CS111 Pyret, `select-columns(t, selector)`.
- This function is similar to `select` in R
- This function is similar to `DataFrame.loc` in pandas.

## `subTable :: t1:Table * rowSelector:Seq * columnSelector:Seq -> t2:Table`

`subTable(t, x, y)` is defined as `selectColumns(selectRows(t, x), y)`. This function has 6 overloadings because `selectRows` has 2 overloadings and that `selectColumns` has 3. Each of the 6 overloadings has the constraints given by combining the constraints of the corresponding `selectRows` and `selectColumns` in the obvious way.

## `head :: t1:Table * n:Number -> t2:Table`

- In pandas, `t1.head(n)`
- In pandas, `df.tail` is similar so not included.
- This function is similar to `head(t1, n = n)` in R.

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
- pandas, `len(t)`
- In CS111 Pyret, `t.length()`


## `ncols :: t:Table -> n:Number`

### Origins

In R, `ncol(t)`

## `shape :: t:Table -> ns:Seq<Number>

### Origins

- In pandas, `t.shape`
- In R, `dim(t)`

## (overload 1/2) `header :: t:Table -> cs:Seq<ColName>`

### Origins

In R, `colnames(t)`

## (overload 2/2) `header :: r:Row -> cs:Seq<ColName>`

### Origins

In R, `colnames(t)`

## `renameColumns : t1:Table * ccs:Seq<ColName * ColName> -> t2:Table`

- pandas, `DataFrame.rename`
- julia, `rename`
- R, `rename`

## `buildColumn :: t1:Table * c:ColName * f:(r:Row -> v:Value) -> t2:Table`

- In Julia, `transform`
- In Python, `t.assign(c=f)`, where `c` must be a literal column name. If `c` is already in `t`, the old column will be updated.
- In R, `mutate(t, c=f)`, where `c` must be a literal column name. If `c` is already in `t`, the old column will be updated.
- In CS111 Pyret, `build-column(t, c, f)`.
- In Bootstrap Pyret, `t.build-column(c, f)`

## `update :: t1:Table * c:ColName * f:(r1:Row -> r2:Row) -> t2:Table`

### Origin

- In Python, `DataFrame.assign`. The updated column names are given as argument names so they are taken literally. If a column name is not in `t1`, a new column will be added.
- In R, `mutate`. The updated column names are given as argument names so they are taken literally. If a column name is not in `t1`, a new column will be added.
- In SQL, `UPDATE`

## `addRows :: t1:Table * r:Row -> t2:Table`

### Origins

* In MySQL, `INSERT`

## `addColumn :: t1:Table * c:ColName * vs:Seq<Value> -> t2:Table`

### Origins

* In CS111 Pyret, `add-col(t, c, vs)`
* In Python pandas, `t[c] = vs`. If `c` is already in `t`, the old column is replaced with `vs` and `c` keeps its position in the header. 

## `transformColumn :: t1:Table * c:ColName * f:(v1:Value -> v2:Value) -> t2:Table`

### Origins

In CS111 Pyret, `transform-column(t, c, f)`

## `tfilter :: t1:Table * f:(r:Row -> b:Boolean) -> t2:Table`

### Origins

- In CS111 Pyret, `filter-with(t1, f)`
- In Bootstrap Pyret, `t1.filter(f)`
- In LINQ, `Where`
- Similar to MySQL `DELETE`, which drops rows satisfying the criteria and can take a number limit.

### Notes

- This function is similar to `DataFrame.query` in pandas.
- This function is similar to `filter` in R.

## `sort :: t1:Table * c:ColName * b:Boolean -> t2:Table`

### Origins

- In Python pandas, `t.sort_values(c, ascending=b)`
- In R, `arrange(t, c)` if `b` is `true`.
- In R, `arrange(t, desc(c))` if `b` is `false`.
- In cs111 Pyret, `sort-by(t, c, b)`
- In Bootstrap Pyret, `t.order-by(c, b)`

## `sortByColumns :: t1:Table * cs:Seq<ColName> -> t2:Table`

### Origins

- Julia DataFrame's `sort` is similar but less general
- pandas' `DataFrame.sort_value(by = [c ...], ascending = [b ...])`

## `orderBy :: t1:Table * Seq<Exists K . getKey:(r:Row -> k:K) * compare:(k1:K * k2:K -> Boolean)> -> t2:Table`

- This funtion is a combination of LINQ's `OrderBy` and `ThenBy`.

## `dropColumns :: t1:Table * cs:Seq<ColName> -> t2:Table`

### Origins

- In R, `select(df, -cs)`. The negation symbol makes the selection dropping.
- Python pandas: `del t1[c]` or `t1.drop(columns=cs)`
- CS111 Pyret, `t1.drop(c)`

## `distinct :: t1:Table -> t2:Table`

### Origins

- In R, `distinct(t1)`
- In pandas, `t1.drop_duplicates()`
- julia, `unique`

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
- This operator seems to be more general than any variant of SQL `JOIN`

## `hcat :: t1:Table * t2:Table -> t3:Table`

- julia, `hcat`
- pandas, `pd.concat`

## `crossJoin :: t1:Table * t2:Table -> t3:Table`

- SQL `CROSS JOIN`

## `vcat :: t1:Table * t2:Table -> t3:Table`

- R, `union`
- SQL `UNION ALL`
- pandas, `pd.concat`
- julia, `vcat`

## `values :: rs:Seq<Row> -> t:Table`

- SQL `VALUES`

## `dropna :: t1:Table -> t2:Table`

- pandas `dropna`
- Julia `dropmissing`

## `fillna :: t1:Table * c:ColName * v:Value -> t2:Table`

- Similar to pandas' `fillna`

## `flatten :: t1:Table * cs:Seq<ColName> -> t2:Table`

- Julia, `flatten`

## `select :: t1:Table * f:(r1:Row * n:Number -> r2:Row) -> t2:Table``

### Origins

- In LINQ, `select`
- In MySQL, `SELECT ... AS ...`

## `selectMany :: t1:Table * project:(r1:Row * n:Number -> t2:Table) * result:(r2:Row * r3:Row -> r4:Row) -> t2:Table`

### Origins

- In LINQ, `selectMany`

## `pivotLonger : t1:Table * cs:Seq<ColName> * c1:ColName * c2:ColName -> t2:Table`

- R TidyVerse, `pivot_longer`
- Python pandas, `pd.melt`
- Julia DataFrame, `stack`

## `pivotWider :: t1:Table * c1:ColName * c2:ColName -> t2:Table`

- Python pandas, `pd.melt`
- R TidyVerse, `df.pivot`
- Julia, `unstack`

## `pivotTable :: t1:Table * cs:Seq<ColName> * agg:Seq<ColName * ColName * Function> -> t2:Table`

- pandas, `pivotTable`

## `leftJoin :: t1:Table * t2:Table * cs:Table -> t3:Table`

- R, `left_join`
- Julia, `leftjoin`
- Similar to `pd.merge(_, _, how="left", on=_)` in pandas
- SQL, `LEFT JOIN`. But our `leftJoin` does not prefix column names and does not delete shared columns.
- `leftJoin` is chosen as a representative of various other join operators (e.g. right join, inner join, and outer join)

## `histogram :: t:Table * c:ColName * n:Number -> i:Image`

### Origins

- In CS111 Pyret, `histogram(t, c, n)`
- In Bootstrap Pyret, `histogram(t, c, n)`
- In pandas, `df.plot.hist()`

### Notes

- `pie-chart` in Bootstrap Pyret has similar constraints on its inputs and outputs, so that function is not presented here.
- `bar-chart` in Bootstrap Pyret has similar constraints on its inputs and outputs, so that function is not presented here.
- `freq-bar-chart` in CS111 Pyret has similar constraints on its inputs and outputs, so that function is not presented here.
- `box-chart` in CS111 Pyret has similar constraints on its inputs and outputs, so that function is not presented here.

## `scatterPlot :: t:Table * c1:ColName * c2:ColName -> i:Image`

### Origins

- In CS111 Pyret, `scatter-plot(t, c1, c2)`
- In pandas, `t.plot.scatter(x=c1, y=c2)`

### Notes

- `lr-plot` in CS111 Pyret has similar constraints on its inputs and outputs, so that function is not presented here.
- `scatter-plot` in Bootstrap Pyret has similar constraints on its inputs and outputs, so that function is not presented here.
- `lr-plot` in Bootstrap Pyret has similar constraints on its inputs and outputs, so that function is not presented here.

## `pieChart :: t:Table * c1:ColName * c2:ColName -> i:Image`

### Origins

- In CS111 Pyret, `pie-chart(t, c1, c2)`

### Notes

- `bar-chart` in CS111 Pyret has similar constraints on its inputs and outputs, so that function is not presented here.
