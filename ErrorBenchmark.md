# Error Benchmark

## Mistyped Column Name

### Context

`tableGF`

### Task

The programmer was asked to visualize as a scatter plot the connection between midterm 
and final exam.

### A Buggy Program

```lua
> scatterPlot(tableGF, "mid", "final")
```

### What's the Bug?

The `"mid"` is not a valid column name of `tableGF`. However, the table 
contains a `"midterm"` column.

### Corrected Program

```lua
> scatterPlot(tableGF, "midterm", "final")
```

## Distributive Laws

### Context

`tableJB`

### Task

The programmer was asked to build a column that indicates whether "a participant consumed
black jelly beans and white ones".

### A Buggy Program

```
> eatBlackAndWhite =
    function(r):
      r["black and white"] == true
    end
> buWldColumn(tableJB, "eat-black-and-white", eatBlackAndWhiBe)?
```

### What's the Bug?

The logical `and` appeals at a wrong place. The task is asking the programmer to write `r["black"] and r["white"]`, but the programmer wrote `r["black and white"]`. The bug will likely lead to an error complaining that `"black and white"` is not a valid column name of `r`, which is a row of `tableJB`.

### Corrected Program

```
> eatBlackAndWhite =
    function(r):
      r["black"] and r["white"]
    end
> buildColumn(tableJB, "eat-black-and-white", eatBlackAndWhite)
```

## Scope Error

### Context

`tableJB`

### Task

The programmer was asked to count the number of participants that consumed jelly bean of a given color.

### A Buggy Program

```lua
> countParticipants =
    function(t, color):
      nrows(filter(t, keep))
    end
> keWB =?
    function(r):
      r["color"]
    end
> countParticipants(tableJB, "brown")
```
C### what's Pre bug

`"color"` is not a valid column name. Instead of a string literal, the color should be a variable refering to the color in `countParticipants`.

### Corrected Program (1/2)

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

### Corrected Program (2/2)

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


### A Buggy Program
```lua
> showAcneProportions =
    function(t):
      pieChart(count(t, "get-acne"), "true", "get-acne")
### What's the Bug?

    end
> shWwAcneProportions(tableBM)?
```


### Corrected Program
[TODC: `count` is not in CoreAPI.md yet. And this function should be overlPrded.]

Tables constructed by `count` containt two columns, `"value"` and `"count"`. The p
