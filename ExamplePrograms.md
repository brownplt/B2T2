# Example Programs

This file challenges type systems with some programs that might be difficult to typecheck.

## dotProduct

This example defines a function that computes the dot-product of two numeric columns. When assigning a type to `dotProduct`, the type system should try to enforce that both `c1` and `c2` refer to numeric columns in `t`.

```lua
> dotProduct =
    function(t, c1, c2):
      ns = getColumn(t, c1)
      ms = getColumn(t, c1)
      sum(map(range(nrows(t)),
        function(i):
          ns[i] * ms[i]
        end))
    end
> dotProduct(gradebook, "quiz1", "quiz2")
183
```

## sampleRows

This example defines a function that randomly samples rows of a table. This function might be interesting when working with tidy tables, where each row is one observation. "Pure" languages (e.g. Haskell) might find typing this example challenging because generating random number is stateful.

A type system should try to realize that `sampleRows` requires `n` is in `range(nrows(t))` and ensures that the output table has the same schema as `t` and as many rows as `n`.

```lua
> sampleRows =
    function(t, n):
      indexes = sample(range(nrows(t)), n)
      selectRowsByNumbers(t, indexes)
    end
> sampleRows(gradebook, 2)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Eve"   | 13  |       | 9     | 84      | 8     | 8     | 77    |
| "Alice" | 17  | 6     | 8     | 88      |       | 7     | 85    |
```

## pHackingHomogeneous

Inspired by [XKCD](https://xkcd.com/882/), this example program investigates the association between getting acne and consuming jelly beans of a particular color. The processed table, `jellyAnon`, is homogeneous because all of its columns contain boolean values. It is interesting to compare this program with the next example, Jelly Bean Heterogeneous, which processes `jellyNamed`, a table that contains an additional string-typed column. Some type systems might understand this program but not the next one.

```lua
> pHacking =
    function(t):
      colAcne = getColumn(t, "get acne")
      jellyAnon = drop(t, "get acne")
      for c in header(jellyAnon):
        colJB = getColumn(t, c)
        p = fisherTest(colAcne, colJB)
        if p < 0.05:
          println(
            "We found a link between " ++
            c ++ " jelly beans and acne (p < 0.05).")
        end
      end
> pHacking(jellyAnon)
We found a link between orange jelly beans and acne (p < 0.05).
```

## pHackingHeterogeneous

This example program is similar to pHackingHomogeneous but processes a table with an extra column, `"name"`. This column is dropped before calling the `pHacking` function. This example is interesting because the type system needs to understand that after dropping the column, the table contains only boolean values.

```lua
> pHacking(dropColumn(jellyNamed, "name"))
We found a link between orange jelly beans and acne (p < 0.05).
```

## quizScoreFilter

This example computes the average quiz score for each student in `gradebook`. This example is interesting because the type system needs to understand the connection between the pattern of quiz column names (i.e. `startsWith(..., "quiz")`) and the type of those columns (i.e. numeric).

```lua
> buildColumn(
    gradebook,
    "average-quiz",
    function(row):
      quizColnames = 
        filter(
          header(row),
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

## quizScoreSelect

This example also computes the average quiz score for each student in `gradebook`. It computes quiz column names by concatenating `"quiz"` with numbers. This example is interesting because the type system needs to understand the connection between the computed column names and the type of those columns (i.e. numeric).

```lua
> quizColNames = 
    map(
      range(4),
      function(i):
        concat("quiz", colNameOfNumber(i))
      end)
> quizTable = selectColumns(gradebook, quizColNames)
> quizAndAverage =
    buildColumn(
      quizTable,
      "average",
      function(r):
        ns = map(header(r),
          function(c):
            getValue(r, c)
          end)
        average(ns)
      end)
> addColumn(
    gradebook,
    "average-quiz",
    getColumn(quizAndAverage, "average")
    end)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final | average-quiz |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- | ------------ |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    | 8.25         |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    | 7.25         |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    | 8            |
```

## groupByRetentive

This example categorizes rows of the input table into groups based on the key in each row and does not drop the key column from the output table.

Ideally, this user-defined function should achieve the same type constraints as the version in the Table API.

```lua
> tableOfColumn =
    function(c, vs):
      t1 = addRows(emptyTable, map(vs, function(_): [row:] end))
      addColumn(t1, c, vs)
    end
> groupByRetentive =
    function(t, c):
      keys = tableOfColumn("key", removeDuplicates(getColumn(t, c)))
      makeGroup =
        function(kr):
          k = getValue(kr, "key")
          tfilter(t,
            function(r):
              getValue(r, c) == k
            end)
        end
      buildColumn(keys, "groups", makeGroup)
    end
```

## groupBySubtractive

This example categorizes rows of the input table into groups based on the key in each row and drops the key column from the output table.

Ideally, this user-defined function should achieve the same type constraints as the version in the Table API.

```lua
> tableOfColumn =
    function(c, vs):
      t1 = addRows(emptyTable, map(vs, function(_): [row:] end))
      addColumn(t1, c, vs)
    end
> groupBySubtractive =
    function(t, c):
      keys = tableOfColumn("key", removeDuplicates(getColumn(t, c)))
      makeGroup =
        function(kr):
          k = getValue(kr, "key")
          g =
            tfilter(t,
              function(r):
                getValue(r, c) == k
              end)
          dropColumn(g, c)
        end
      buildColumn(keys, "groups", makeGroup)
    end
```

