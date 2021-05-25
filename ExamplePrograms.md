## sampleRows

This example defines a function that randomly samples rows of a table. This function might be interesting when working with tidy tables, where each row is one observation. "Pure" languages (e.g. Haskell) might find typing this example challenging because generating random number is stateful. Ideally, the `sampleRows` function should have the same constraints as in Table API.

```lua
> sampleRows =
    function(t, n):
      indexes = sample(range(nrows(t)), n)
      selectRowsByNumbers(t, indexes)
    end
> sampleRows(tableGM, 2)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Eve"   | 13  |       | 9     | 84      | 8     | 8     | 77    |
| "Alice" | 17  | 6     | 8     | 88      |       | 7     | 85    |
```

## groupBy

This example defines two groupBy functions. `groupByOriginal` catagorizes rows of the input table into groups by the key of each row. The key is computed by accessing the named column. `groupBySubtracted` is similar to `groupByOriginal` but the named column is removed in the output. Ideally, the two user-defined functions should have the same constraints as in Table API.

```lua
> groupByOriginal =
    function(t, c):
      keys = tableOfColumn("key", distinct(getColumn(t, c)))
      makeGroup =
        function(kr):
          k = getValue(kr, "key")
          filter(t,
            function(r):
              getValue(r, c) == k
            end)
        end
      buildColumn(keys, makeGroup)
    end
> groupBySubtracted =
    function(t, c):
      keys = tableOfColumn("key", distinct(getColumn(t, c)))
      makeGroup =
        function(kr):
          k = getValue(kr, "key")
          g =
            filter(t,
              function(r):
                getValue(r, c) == k
              end)
          dropColumn(g, c)
        end
      buildColumn(keys, makeGroup)
    end
```

## Gradebook 1

This example computes the average quiz score for each student in `tableGF`. This example is interesting because the type system needs to understand the connection between the pattern of quiz column names (i.e. `startsWith(..., "quiz")`) and the type of those columns (i.e. numeric).

```lua
> buildColumn(
    tableGM,
    "average-quiz",
    function(row):
      quizColnames = 
        filter(
          header(),
          function(c):
            startsWith(c, "quiz")
          end)
      scores = map(
        quizColnames,
        function(c):
          getValue(row, c)
        end)
      sum(scores) / length(scores)
    end)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final | average-quiz |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- | ------------ |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    | 8.25         |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    | 7.25         |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    | 8            |
```

## Gradebook 2

This example also computes the average quiz score for each student in `tableGF`. It computes quiz column names by concatenating `"quiz"` with numbers. This example is interesting because the type system needs to understand the connection between the computed column names and the type of those columns (i.e. numeric).

```lua
> quizColNames = 
    map(
      range(4),
      function(i):
        concat("quiz", colNameOfNumber(i))
      end)
> quizTable = selectColumns(tableGF, quizColNames)
> quizAndAverage =
    buildColumn(
      quizTable,
      "average",
      function(r):
        average(listOfRow(r))
      end)
> addColumn(
    tableGM,
    "average-quiz",
    getColumn(quizAndAverage, "average")
    end)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final | average-quiz |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- | ------------ |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    | 8.25         |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    | 7.25         |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    | 8            |
```


## Jelly Bean Homogeneous

Inspired by [XKCD](https://xkcd.com/882/), this example program investigates the association between getting acne and consuming jelly beans of a particular color. The processed table, `tableJellyAnon`, is homogeneous because all of its columns contain boolean values. It is interesting to compare this program with the next example, Jelly Bean Heterogeneous, which processes `tableJellyNamed`, a table that contains an additional string-typed column. Some type systems might understand this program but not the next one.

```lua
> pHacking =
    function(t):
      colAcne = getColumn(t, "get-acne")
      tableJellyAnon = drop(t, "get-acne")
      for c in header(tableJellyAnon):
        colJB = getColumn(t, c)
        p = fisherTest(colAcne, colJB)
        if p < 0.05:
          println(
            "We found a link between " ++ 
            c ++ " jelly beans and acne (p < 0.05).")
        end
      end
> pHacking(tableJellyAnon)
We found a link between orange jelly beans and acne (p < 0.05).
```

## Jelly Bean Heterogeneous

This example program is similar to Jelly Bean Homogeneous but processes a table with an extra column, `"name"`. This column is dropped before calling the `pHacking` function. This example is interesting because the type system needs to understand that after dropping the column, the table contains only boolean values.

```lua
> pHacking(drop(tableJellyNamed, "name"))
We found a link between orange jelly beans and acne (p < 0.05).
```
