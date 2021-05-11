[TODO: KC: what is a reasonable program for each of the following programming problem? I might be biased because I am designing the Core API. I can be unawarely affacted by the limitation of the APIs.]

## randomRows

This example defines a function that randomly sample rows of a table. This function might be interesting when working with tidy tables, where each row is one observation.

```lua
> randomRows =
    function(t, n):
      indexes = sample(range(nrows(t)), n)
      selectRowsByNumbers(t, indexes)
    end
> randomRows(tableGM, 2)
|    name | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
|---------|-----|-------|-------|---------|-------|-------|-------|
|   "Eve" |  13 |       |     9 |      84 |     8 |     8 |    77 |
| "Alice" |  17 |     6 |     8 |      88 |       |     7 |    85 |
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
|    name | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final | average-quiz |
|---------|-----|-------|-------|---------|-------|-------|-------|--------------|
|   "Bob" |  12 |     8 |     9 |      77 |     7 |     9 |    87 |         8.25 |
| "Alice" |  17 |     6 |     8 |      88 |     8 |     7 |    85 |         7.25 |
|   "Eve" |  13 |     7 |     9 |      84 |     8 |     8 |    77 |            8 |
```


## Jellybean A

Do jelly beans of a certain color cause acne?

[Fisher's exact test in R](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/fisher.test.html)

```
> tableAcneJB
```

| get-acne | red | black | white | green | yellow | brown | orange | pink | purple |
| -------- | --- | ----- | ----- | ----- | ------ | ----- | ------ | ---- | ------ |
| 0        | 1   | 1     | 1     | 1     | 1      | 0     | 0      | 0    | 1      |
| 0        | 0   | 0     | 1     | 0     | 1      | 1     | 1      | 1    | 0      |
| 1        | 0   | 1     | 1     | 0     | 1      | 1     | 0      | 1    | 0      |
| 1        | 0   | 0     | 1     | 1     | 0      | 0     | 0      | 0    | 0      |
| 0        | 0   | 1     | 1     | 0     | 0      | 0     | 0      | 0    | 0      |
| 0        | 1   | 1     | 1     | 1     | 0      | 0     | 0      | 1    | 1      |
| 0        | 1   | 1     | 0     | 0     | 1      | 1     | 1      | 1    | 1      |
| 0        | 0   | 1     | 1     | 1     | 1      | 1     | 1      | 0    | 0      |
| 1        | 0   | 0     | 1     | 1     | 0      | 0     | 0      | 0    | 0      |
| 1        | 0   | 0     | 1     | 1     | 1      | 1     | 0      | 0    | 1      |
| 0        | 1   | 1     | 1     | 1     | 1      | 1     | 0      | 0    | 1      |
| 0        | 0   | 0     | 0     | 0     | 0      | 0     | 1      | 1    | 0      |
| 0        | 1   | 1     | 0     | 1     | 1      | 1     | 0      | 0    | 0      |
| 0        | 0   | 1     | 1     | 0     | 1      | 0     | 1      | 0    | 0      |
| 0        | 0   | 0     | 0     | 0     | 0      | 0     | 0      | 1    | 1      |
| 0        | 0   | 0     | 0     | 0     | 0      | 0     | 1      | 1    | 0      |
| 0        | 1   | 1     | 1     | 1     | 1      | 1     | 1      | 1    | 0      |
| 1        | 1   | 1     | 0     | 0     | 1      | 1     | 0      | 0    | 1      |
| 1        | 1   | 0     | 1     | 0     | 1      | 0     | 1      | 0    | 0      |
| 1        | 1   | 1     | 0     | 1     | 0      | 0     | 0      | 1    | 1      |

```lua
> colAcne = getColumn(tableAcneJB, "get-acne")
> for c in header(tableAcneJB):
    if c != "get-acne":
      colJB = getColumn(tableAcneJB, c)
      p = fisherTest(colAcne, colJB)
      if p < 0.05:
        println(
          "We found a link between " ++ 
          c ++ " beans and acne (p < 0.05).")
      end
    end
  end
```

[TODO: Should I put in a result?]

## Jellybean B

```lua
> tableJB
    = selectColumns(
        tableAcneJB,
        delete(header(tableAcneJB), "get-acne"))
> for c1 in header(tableJB):
    for c2 in header(tableJB):
      if c1 != c2:
        p = fisherTest(getColumn(tableJB, c1), getColumn(tableJB, c2))
        if p < 0.05:
          println(
            "We found a link between consuming " ++ 
            c1 ++ " beans and consuming " ++ 
            c2 ++ " beans (p < 0.05).")
        end
      end
    end
  end
```

[TODO: Should I put in a result?]

