[TODO: KC: what is a reasonable program for each of the following programming problem? I might be biased because I am designing the Core API. I can be unawarely affacted by the limitation of the APIs.]

## randomRows

In a tidy table, each row is one observation. Thus it is interesting to sample rows randomly.

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

For each student, compute their average quiz grade 

```lua
> quizColNames = 
    filter(
      header(tableGF),
      function(c):
        ColNames.startsWith("quiz")
      end)
> quizCount = Lists.length(quizColNames)
> buildColumn(
    tableGM,
    "average-quiz",
    function(row):
      let sum = ref 0
      for c in quizColNames:
        sum := getValue(row) + !sum
      end
      sum / quizCount
    end)
```
[TODO: Should I put in a result?]


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

