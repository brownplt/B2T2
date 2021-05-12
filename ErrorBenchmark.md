# Error Benchmark

## Mistyped Column Name

The student was asked to visualize as a scatter plot the connection between midterm 
and final exam.

```lua
> scatterPlot(tableGF, "mid", "final")
```

The `"mid"` is not a valid column name of `tableGF`. However, the table 
contains a `"midterm"` column. The student eventually wrote

```lua
> scatterPlot(tableGF, "midterm", "final")
```

## Distrivutive Laws

[TODO: this example requires a table holding boolean values]

The student was asked to build a column that indicates whether a participant consumed
black jelly beans and white ones.

```
> eatBlackAndWhite =
    function(r):
      r["black and white"] == true
    end
> buildColumn(tableJN, "eat-black-and-white", eatBlackAndWhite)
```

`"black and white"` is not a valid column name of `r`, which is a row of `tableJN`.
The student eventually wrote

```
> eatBlackAndWhite =
    function(r):
      (r["black"] == true) and (r["white"] == true)
    end
> buildColumn(tableJN, "eat-black-and-white", eatBlackAndWhite)
```

