# Error Benchmark

## Mistyped Column Name

### context

`tableGF`

### task

The programmer was asked to visualize as a scatter plot the connection between midterm 
and final exam.

### buggy program

```lua
> scatterPlot(tableGF, "mid", "final")
```

### what's the bug

The `"mid"` is not a valid column name of `tableGF`. However, the table 
contains a `"midterm"` column.

### corrected program

```lua
> scatterPlot(tableGF, "midterm", "final")
```

## Distributive Laws

### context

`tableJB`

### task

The programmer was asked to build a column that indicates whether a participant consumed
black jelly beans and white ones.

### buggy program

```
> eatBlackAndWhite =
    function(r):
      r["black and white"] == true
    end
> buildColumn(tableJB, "eat-black-and-white", eatBlackAndWhite)
```

### what's the bug

`"black and white"` is not a valid column name of `r`, which is a row of `tableJB`.

### corrected program

```
> eatBlackAndWhite =
    function(r):
      r["black"] and r["white"]
    end
> buildColumn(tableJB, "eat-black-and-white", eatBlackAndWhite)
```

## Scope error

### context

`tableJB`

### task

The programmer was asked to count the number of participants that consumed jelly bean of a given color.

### buggy program

```lua
> countParticipants =
    function(t, color):
      nrows(filter(t, keep))
    end
> keep =
    function(r):
      r["color"]
    end
> countParticipants(tableJB, "brown")
```

### what's the bug

`"color"` is not a valid column name. Instead of a string literal, the color should be a variable refering to the color in `countParticipants`.

### corrected program (1/2)

```lua
> countParticipants =
    function(t, color):
      nrows(filter(t, keep(color)))
    end
> keep =
    function(color):
      function(r):
        r[color]
      end
    end
> countParticipants(tableJB, "brown")
```

### corrected program (2/2)

```lua
> countParticipants =
    function(t, color):
      keep =
        function(r):
          r["color"]
        end
      nrows(filter(t, keep))
    end
> countParticipants(tableJB, "brown")
```

## `count` Table

[TODO: in progress]

The programmer was asked to visualize the proportion of participants getting acne.


### buggy program
```lua
> showAcneProportions =
    function(t):
      pieChart(count(t, "get-acne"), "true", "get-acne")
### what's the bug

    end
> showAcneProportions(tableJM)
```


### corrected program
[TODO: `count` is not in CoreAPI.md yet. And this function should be overloaded.]

Tables constructed by `count` containt two columns, `"value"` and `"count"`. The p
