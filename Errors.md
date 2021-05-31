# Errors

This file presents a diagnostic challenge. Each example includes a buggy program and one or more corrected programs. A good programming media should help programmers to avoid writing these buggy programs or to recover from the bug and finally reach a corrected program.

These examples are adapted from student code collected in CS111 at Brown University.

## missingSchema

### A Buggy Program

```lua
| "Bob"   | 12 | "blue"  |
| "Alice" | 17 | "green" |
| "Eve"   | 13 | "red"   |
```

### What is the Bug?

This malformed table misses the schema.

### A Corrected Program

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

## missingRow

### A Buggy Program

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
|                                   |
```

### What is the Bug?

This malformed table misses the content of the last row. (*Note:* this error is not representable in languages that pad short rows with empty cells)

### A Corrected Program

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

## missingCell

### A Buggy Program

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | "blue" |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

### What is the Bug?

The first row of this malformed table misses a cell.

### A Corrected Program

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

## swappedColumns

### A Buggy Program

```lua
| name   | age     | favorite color |
| String | Number  | String         |
| ------ | ------- | -------------- |
| 12     | "Bob"   | "blue"         |
| 17     | "Alice" | "green"        |
| 13     | "Eve"   | "red"          |
```

### What is the Bug?

The rows disagree with the schema on the ordering of the first two columns.

### A Corrected Program

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

## schemaTooShort

### A Buggy Program

```lua
| name    | age    |
| String  | Number |
| ------- | ------ |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

### What is the Bug?

The schema specifies that there are two columns. But the rows have three columns.

### A Corrected Program

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

## schemaTooLong
.
### A Buggy Program

```lua
| name    | age    | favorite number | favorite color |
| String  | Number | Number          | String         |
| ------- | ------ | --------------- |----------------|
| "Bob"   | 12     | "blue"          |
| "Alice" | 17     | "green"         |
| "Eve"   | 13     | "red"           |
```

### What is the Bug?

The schema specifies that there are four columns. But the rows specifices that there are three columns.

### A Corrected Program

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

## typo

### Context

`gradebook`

### Task

The programmer was asked to visualize as a scatter plot the connection between
midterm and final exam grades.

### A Buggy Program

```lua
> scatterPlot(gradebook, "mid", "final")
```

### What is the Bug?

The `"mid"` is not a valid column name of `gradebook`. However, the table
contains a `"midterm"` column.

### A Corrected Program

```lua
> scatterPlot(gradebook, "midterm", "final")
```

## distributiveLaws

### Context

`jellyAnon`

### Task

The programmer was asked to build a column that indicates whether "a
participant consumed black jelly beans and white ones".

### A Buggy Program

```lua
> eatBlackAndWhite =
    function(r):
      r["black and white"] == true
    end
> buildColumn(jellyAnon, "eat black and white", eatBlackAndWhite)?
```

### What is the Bug?

The logical `and` appears at a wrong place. The task is asking the programmer
to write `r["black"] and r["white"]`, but the buggy program accesses the
invalid column `"black and white"` instead.

### A Corrected Program

```lua
> eatBlackAndWhite =
    function(r):
      r["black"] and r["white"]
    end
> buildColumn(jellyAnon, "eat black and white", eatBlackAndWhite)
```

## scopeError

### Context

`jellyAnon`

### Task

The programmer was asked to count the number of participants that consumed
jelly bean of a given color.

### A Buggy Program

```lua
> countParticipants =
    function(t, color):
      nrows(tfilter(t, keep))
    end
> keep =
    function(r):
      r["color"]
    end
> countParticipants(jellyAnon, "brown")
```

### What is the Bug?

`"color"` is not a valid column name. Instead of a string literal, the color should be a variable refering to the color in `countParticipants`.

### A Corrected Program (1/2)

```lua
> countParticipants =
    function(t, color):
      nrows(tfilter(t, keep(color)))
    end
> keep =
    function(color):
      function(r):
        r[color]
      end
    end
> countParticipants(jellyAnon, "brown")
```

### A Corrected Program (2/2)

```lua
> countParticipants =
    function(t, color):
      keep =
        function(r):
          r["color"]
        end
      nrows(tfilter(t, keep))
    end
> countParticipants(jellyAnon, "brown")
```

## computedTable

### Context

`jellyAnon`

### Task

The programmer was asked to visualize the proportion of participants getting acne.

### A Buggy Program

```lua
> showAcneProportions =
    function(t):
      pieChart(count(t, "get acne"), "true", "get acne")
    end
> showAcneProportions(jellyAnon)
```

### What is the Bug?

The program supplies a table produced by `count` to `pieChart`, which also expects two column names of its input table. The table produced by `count` contains two column names, `"value"` and `"count"`. Neither of the supplied colum names, `"true"` and `"get acne"`, are valid.

### A Corrected Program

```lua
> showAcneProportions =
    function(t):
      pieChart(count(t, "get acne"), "value", "count")
    end
> showAcneProportions(jellyAnon)
```

## manyBugs

### Context

- `employees`
- `departments`

### Task

The programmer was given two tables, one maps employee names to department IDs, the other maps department IDs to department names. The programmer was asked to define a function, `employeeToDepartment` that consumes the two tables and looks up the a department name that an employee belongs to.

### A Buggy Program

```lua
> lastNameToDeptId =
    function(deptTab, name):
      matchName =
        function(r):
          getValue(r, "Last Name") == name
        end
      matchedTab = tfilter(deptTab, matchName)
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

There are several problems in this program. First, `employeeToDepartment` is expected to return a department name, but it returns a table. Another problem is that the helper function is named `lastNameToDeptId`. The name suggests that this function maps the employee names to department IDs. But in `employeeToDepartment`, `lastNameToDeptId` is expected to produce department names. Finally, `deptTab`, the first parameter of `lastNameToDeptId`, has a name suggesting that it is bound to a department table. `lastNameToDeptId` uses `deptTab` as an employee table.

### A Corrected Prgram

```lua
> deptIdToDeptName =
    function(deptTab, name):
      matchName =
        function(r):
          getValue(r, "Department ID") == name
        end
      matchedTab = tfilter(deptTab, matchName)
      matchedRow = getRow(matchedTab, 0)
      getValue(matchedRow, "Department Name")
    end
> employeeToDepartment =
    function(name, emplTab, deptTab):
      matchName =
        function(r):
          getValue(r, "Last Name") == name
        end
      matchedTab = tfilter(emplTab, matchName)
      matchedRow = getRow(matchedTab, 0)
      deptId = getValue(matchedRow, "Department ID")
      deptIdToDeptName(deptTab, deptId)
    end
```

## inconsistentNaming

### Context

`jellyNamed`

### Task

The programmer was asked to compute how many participants consumed brown jelly beans and got acne, and how many did not.

### A Buggy Program

```lua
> brownAndGetAcne =
    function(r):
      getValue(r, "brown") and getValue(r, "get acne")
    end
> brownAndGetAcneTable =
    buildColumn(jellyNamed, "part2", brownAndGetAcne)
> count(brownAndGetAcneTable, "brown and get acne")
```

### What is the Bug?

The built column was named inconsistently. In `buildColumn(...)`, the column was named `"part2"` but when `count`ed, the column was accessed with `"brown and get acne"`.

### A Corrected Program

```lua
> brownAndGetAcne =
    function(r):
      getValue(r, "brown") and getValue(r, "get acne")
    end
> brownAndGetAcneTable =
    buildColumn(jellyNamed, "brown and get acne", brownAndGetAcne)
> count(brownAndGetAcneTable, "brown and get acne")
```

## invalidRowIndex

### Context

`students`

### Task

The programmer was asked to find Alice's favorite color.

### A Buggy Program

```lua
> getValue(
    getRow(
      tfilter(students,
        function(r):
          getValue(r, "name") == "Alice"
        end),
      1),
    "favorite color")
```

### What is the Bug?

There is only one row that matches the filtering criteria. So the only valid index is `0`, not `1`.

### A Corrected Program

```lua
> getValue(
    getRow(
      tfilter(students,
        function(r):
          getValue(r, "name") == "Alice"
        end),
      0),
    "favorite color")
```

## accessValues

### Context

`students`

### Task

The programmer was asked to define a function that finds all participants who like `"green"`.

### A Buggy Program

```lua
> participantsLikeGreen =
    function(t):
      tfilter(t,
        function(r):
          getValue(r, "favorite color")
        end)
    end
```

### What is the Bug?

The programmer returns `getValue(r, "favorite color")` directly in the predicate but should return a boolean.

### A Corrected Program

```lua
> participantsLikeGreen =
    function(t):
      tfilter(t,
        function(r):
          getValue(r, "favorite color") == "green"
        end)
    end
```
