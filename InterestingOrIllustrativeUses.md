## randomRows

This example defines a function that randomly sample rows of a table. This function might be interesting when working with tidy tables, where each row is one observation.

```lua
> randomRows =
    function(t, n):
      indexes = sample(range(nrows(t)), n)
      selectRowsByNumbers(t, indexes)
    end
> randomRows(tableGM, 2)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Eve"   | 13  |       | 9     | 84      | 8     | 8     | 77    |
| "Alice" | 17  | 6     | 8     | 88      |       | 7     | 85    |
```

## Gradebook

This example computes the average quiz score for each student in `tableGF`. This example is interesting because the type system needs to understand the connection between the pattern of quiz column names (i.e. `startsWith(..., "quiz")`) and the type of those columns (i.e. numeric).

```lua
> buildColumn(
    tableGM,
    "average-quiz",
    function(row):
      fields =
        filter(
          listOfRow(row),
          function(fld):
            startsWith(first(fld), "quiz")
          end)
      scores = map(fields, second)
      sum(scores) / length(scores)
    end)
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final | average-quiz |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- | ------------ |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    | 8.25         |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    | 7.25         |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    | 8            |
```


## Jelly Bean Homologous

This example program investigates the association between getting acne and consuming jelly beans of a particular color. The processed table, `tableJN`, is homologous because all of its columns contain numbers. It is interesting to compare this program with the next example, Jelly Bean Hetero, which processes `tableJM`, a table that contains an additional string-typed column. Some type systems might understand this program but not the next one.

```lua
> pHacking =
    function(t):
      colAcne = getColumn(t, "get-acne")
      tableJB = drop(t, "get-acne")
      for c in header(tableJB):
        colJB = getColumn(t, c)
        p = fisherTest(colAcne, colJB)
        if p < 0.05:
          println(
            "We found a link between " ++ 
            c ++ " beans and acne (p < 0.05).")
        end
      end
> pHacking(tableJN)
We found a link between orange beans and acne (p < 0.05).
```

## Jelly Bean Heterologous

This example program is similar to Jelly Bean Homologous but processes a table with an extra column, `"name"`. This column is dropped before calling the `pHacking` function. This example is interesting because the type system needs to understand that after dropping the column, the table will be a table of numbers.

```lua
> pHacking(drop(tableJM, "name"))
We found a link between orange beans and acne (p < 0.05).
```