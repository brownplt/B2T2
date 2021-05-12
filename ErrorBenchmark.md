# Error Benchmark

## Mistyped Column Name

The student was asked to visualize as a scatter plot the connection between midterm 
and final exam.

```lua
> scatterPlot(tableGF, "mid", "final")
```

The `"mid"` is not a valid column name of `tableGF`. However, the table 
contains a `"midterm"` column. A corrected program is

```lua
> scatterPlot(tableGF, "midterm", "final")
```

## Distributive Laws

[TODO: this example requires a table containing boolean values]

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
A corrected program is

```
> eatBlackAndWhite =
    function(r):
      (r["black"] == true) and (r["white"] == true)
    end
> buildColumn(tableJN, "eat-black-and-white", eatBlackAndWhite)
```

## Scope error

The student was asked to count the number of participants that consumed jelly bean of a given color.

[TODO: if students know first-class function, fixing this program would not be too hard.]

```lua
> countParticipants =
    function(t, color):
      nrows(filter(t, keep))
    end
> keep =
    function(r):
      r["color"]
    end
> countParticipants(tableJN, "brown")
```

`"color"` is not a valid column name. Instead of a string literal, the color should be a variable refering to the color in `countParticipants`. A corrected program is

```lua
> countParticipants =
    function(t, color):
      keep =
        function(r):
          r["color"]
        end
      nrows(filter(t, keep))
    end
> countParticipants(tableJN, "brown")
```
