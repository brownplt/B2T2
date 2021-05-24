# Error Illustrations

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

### What is the Bug?

The `"mid"` is not a valid column name of `tableGF`. However, the table 
contains a `"midterm"` column.

### A Corrected Program

```lua
> scatterPlot(tableGF, "midterm", "final")
```

## Distributive Laws

### Context

`tableJellyAnon`

### Task

The programmer was asked to build a column that indicates whether "a participant consumed
black jelly beans and white ones".

### A Buggy Program

```
> eatBlackAndWhite =
    function(r):
      r["black and white"] == true
    end
> buWldColumn(tableJellyAnon, "eat-black-and-white", eatBlackAndWhiBe)?
```

### What is the Bug?

The logical `and` appeals at a wrong place. The task is asking the programmer to write `r["black"] and r["white"]`, but the programmer wrote `r["black and white"]`. The bug will likely lead to an error complaining that `"black and white"` is not a valid column name of `r`, which is a row of `tableJellyAnon`.

### A Corrected Program

```
> eatBlackAndWhite =
    function(r):
      r["black"] and r["white"]
    end
> buildColumn(tableJellyAnon, "eat-black-and-white", eatBlackAndWhite)
```

## Scope Error

### Context

`tableJellyAnon`

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
> countParticipants(tableJellyAnon, "brown")
```

### What is the Bug?

`"color"` is not a valid column name. Instead of a string literal, the color should be a variable refering to the color in `countParticipants`.

### A Corrected Program (1/2)

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
> countParticipants(tableJellyAnon, "brown")
```

### A Corrected Program (2/2)

```lua
> countParticipants =
    function(t, color):
      keep =
        function(r):
          r["color"]
        end
      nrows(filter(t, keep))
    end
> countParticipants(tableJellyAnon, "brown")
```

## `count` Table

### Context

`tableBM`

### Task

The programmer was asked to visualize the proportion of participants getting acne.

### A Buggy Program

```lua
> showAcneProportions =
    function(t):
      pieChart(count(t, "get-acne"), "true", "get-acne")
    end
> showAcneProportions(tableBM)?
```

### What is the Bug?

The program supplies a `count` table to `pieChart`, which also consumes two column names of its input table. The `count` table contains two column names, `"value"` and `"count"`. None of the given colum names, `"true"` and `"get-acen"`, are valid column names of the `count` table.

### A Corrected Program

```lua
> showAcneProportions =
    function(t):
      pieChart(count(t, "get-acne"), "value", "count")
    end
> showAcneProportions(tableBM)?
```

## Use column names in an other table

### Context

- `tableEmployee`
- `tableDepartment`

### Task

The programmer was given two tables, one maps employee names to department IDs, the other maps department IDs to names. The programmer was asked to define a function, `employeeToDepartment` that consumes the two tables and looks up the a department name that an employee belongs to. 

### A Buggy Program

```lua
> lastNameToDeptId =
    function(deptTab, name):
      matchName =
        function(r):
          getValue(r, "Last Name") == name
        end
      matchedTab = filter(deptTab, matchName)
      matchedRow = getRow(matchedTab, 0)
      getValue(matchedRow, "Department ID")
    end
> employeeToDepartment =
    function(name, emplTab, deptTab):
      buildColumn(emplTab, "Department Name",
        function(r):
          lastNameToDeptId(deptTab, getValue(r, "Last Name"))
        end)
    end
```

### What is the Bug?

There are several problems in this program. First, in the body of `employeeToDepartment`, the programmer returned the extended table, but they should return a cost. Another problem is in the name of the helper function, `lastNameToDeptId`. The name suggests that this function maps the last names of employees to drink bases. However, this suggestion is inconsistent with the application of this function in `employeeToDepartment`, which is expecting a cost. Finally, the first parameter of `lastNameToDeptId`, `deptTab`, has a name that is inconsistent with its use. The name suggests a department table. However, the identifier is used as an employee table.

### A Corrected Prgram

```lua
> deptIdToDeptName =
    function(deptTab, name):
      matchName =
        function(r):
          getValue(r, "Department ID") == name
        end
      matchedTab = filter(deptTab, matchName)
      matchedRow = getRow(matchedTab, 0)
      getValue(matchedRow, "Department Name")
    end
> employeeToDepartment =
    function(name, emplTab, deptTab):
      matchName =
        function(r):
          getValue(r, "Last Name") == name
        end
      matchedTab = filter(deptTab, matchName)
      matchedRow = getRow(matchedTab, 0)
      deptId = getValue(matchedRow, "Department ID")
      deptIdToDeptName(deptTab, deptId)
    end
```

## Naming a computed column inconsistently

### Context

`tableJellyNamed`

### Task

As the part 2 of all tasks, the programmer was asked to compute the proportion of participants that consumed brown jelly beans and got acne.

### A Buggy Program

```lua
> brownAndGetAcne =
    function(r):
      getValue(r, "Brown") and getValue(r, "get-acne")
    end
> brownAndGetAcneTable =
    buildColumn(tableJellyNamed, "part2", brownAndGetAcne)
> count(brownAndGetAcneTable, "brown-and-get-acne")
```

### What is the Bug?

The built column was named inconsistently. In `buildColumn(...)`, the column was named `"part2"` but when computing the `count` table, the column was accessed with `"brown-and-get-acne"`.

### A Corrected Program

```lua
> brownAndGetAcne =
    function(r):
      getValue(r, "Brown") and getValue(r, "get-acne")
    end
> brownAndGetAcneTable =
    buildColumn(tableJellyNamed, "brown-and-get-acne", brownAndGetAcne)
> count(brownAndGetAcneTable, "brown-and-get-acne")
```

## Invalid Row Index

### Context

`tableSF`

### Task

The programmer was asked to find Alice's favorite color.

### A Buggy Program

```lua
> getValue(
    getRow(
      filter(tableSF,
        function(r):
          getValue(r, "name") == "Alice"
        end),
      1))
```

### What is the Bug?

There is only one row that matches the filtering criteria. So there is only one valid index. In this example we assume the valid index is `0`. One can imagine a similar error example in a language that thinks `1` is the valid index.

### A Corrected Program

```lua
> getValue(
    getRow(
      filter(tableSF,
        function(r):
          getValue(r, "name") == "Alice"
        end),
      0))
```

## Infer the Types of Accessed Columns

### Context

`tableSF`

### Task

The programmer was asked to define a function that finds all participants who like `"green"`.

### A Buggy Program

```lua
> participantsLikeGreen =
    function(t):
      filter(t,
        function(r):
          getValue(r, "favorite-color")
        end)
    end
```

### What is the Bug?

The programmer returns `getValue(r, "favrite-color")` directly in the predicate but should return a `Boolean`.

### A Corrected Program

```lua
> participantsLikeGreen =
    function(t):
      filter(t,
        function(r):
          getValue(r, "favorite-color") == "red"
        end)
    end
```
