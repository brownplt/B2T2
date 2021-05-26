# Column Selector

Many programming medias (e.g. R dplyr and Julia) provide several ways to select a column, such as by a numeric index and by a column name. Similarly, there are many ways to select a sequence of columns. This file aims at clarifying the _semantics_ of column selectors and their operators.

Given a table `t`, every single-column selector (`CS`) means an integer `i` in `range(ncols(t))`, and every multi-column selector (`MCS`) means a sequence of `CS` that has no duplicate.

Every single column selectors is constructed by one of the following operators.

```haskell
begin :: Seq<ColName> -> ColumnSelector
begin hd = 0

end :: Seq<ColName> -> ColumnSelector
end hd = length hd - 1

byName :: ColName -> Seq<ColName> -> ColumnSelector
(byName c) hd = indexOf c hd

byIndex :: Int -> Seq<ColName> -> ColumnSelector
(byIndex i) hd = if i < 0 then (length hd - i) else i
```

The remaining file lists operators for multi-column selectors. It is assumed that `ncols(t)` is bound to `n`

## `difference :: MCS * MCS -> MCS`

## `complement :: MCS -> MCS`

`complement(x) = difference(range(n), x)`

## `union :: MCS * MCS -> MCS`

Concatenate two sequences then remove duplicates.

## `intersection :: MCS * MCS -> MCS`

`intersection(x, y) = difference(x, complement(y))`

## `between :: s1:CS * s2:CS -> MCS`

Produces a sequence of column indices starting from `s1` and end with `s2`.

## `everything :: MCS`

`everything = complement([])`

## `filter :: s1:MCS * p:(CS -> Boolean) -> MCS`

## `byNames :: Seq<ColName> -> MCS`

`byNames(cs) = map(cs, byName)`

## `byIndices :: Seq<Integer> -> MCS`

`byIndices(cs) = map(cs, byIndex)`

## `byBooleans :: bs:Seq<Boolean> -> MCS`

Requires:

- `length(bs)` is equal to `n`

Produces a sequence of `i` where `bs[i]` is true.