# Column Selector

Many programming medias (e.g. R dplyr and Julia) provide several ways to select a column, such as by a numeric index and by a column name. Similarly, there are many ways to select a sequence of columns. This file aims at clarifying the _semantics_ of column selectors and their operators.

Given a table `t`, every single-column selector (`CS`) means an integer `i` in `range(ncols(t))`, and every multi-column selector (`MCS`) means a sequence of `CS` that has no duplicate.

## important ways to use column selectors

Construct a selector for one column:

- `begin :: CS`: select the first column
- `end :: CS`: select the last column
- `byName :: ColName -> CS`: select the named column
- `byIndex :: Int -> CS`: select the indexed column. The index counts from the beginning if it is non-negative, otherwise it counts from the end.

Use a single-column selector:

- various plotting functions, e.g. `scatterPlot`
- extract, update or delete one column, e.g.`getColumn`, `transformColumn`, and`dropColumn`
- access one column for other purpose, e.g. `sort`, `count`, `renameColumns`, `groupBy`, and `pivotWider`

Construct a selector for many columns:

- `everything :: MCS`
- `difference :: MCS * MCS -> MCS`
- `complement :: MCS -> MCS`
- `union :: MCS * MCS -> MCS`
- `intersection :: MCS * MCS -> MCS`
- `between :: CS * CS -> MCS`
- `byNames :: Seq<ColName> -> MCS`
- `byIndices :: Seq<Integer> -> MCS`
- `byBooleans :: Seq<Boolean> -> MCS`
- `where :: (ColName -> Boolean) -> MCS`.  Common predicates used with `where`. We abbreviate `(ColName -> Boolean)` with `Pred`
  - `startsWith :: ColName -> Pred`: keeps column names starting with a prefix
  - `endsWith :: ColName -> Pred`: keeps column names end with a surfix
  - `match :: RegExp -> Pred`: keeps column names that matches the input regular expression.

Use a many-column selector:

- extract or delete many column, including `selectColumns` and `dropColumns`
- access many columns for other purpose, including `sortByColumns`, `pivotLonger`, `pivotTable`

## important ways to use column names

Column names are often used in selecting columns.

- `byName("midterm")`
- `byNames(["midterm", "final"])`
- `between(byName("quiz1"), byName("final"))`
- `where(startsWith("quiz"))`
- `where(endsWith("foobar"))`
- `where(match(re"quiz[0-9]+"))`

Of couse, column selectors can be combined, for example, `union(where(startsWith("quiz")), byNames(["midterm", "final"]))`

Besides, column names involved when creating new columns, e.g. `buildColumn` and `pivotLonger`