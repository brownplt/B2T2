[TODO] KC: what is a reasonable program for each of the following programming problem? I might be biased because I am designing the Core API. I can be unawarely affacted by the limitation of the APIs.

## Gradebook

For each student, compute their average quiz grade 

```ocaml
> let quizColNames = 
    filter(
      header(tableGF),
      lam(c):
        ColNames.startsWith("quiz")
      end)
> let quizCount = Lists.length(quizColNames)
buildColumn(
  tableGM,
  "average-quiz",
  lam(row):
    let sum = ref 0
    for c in quizColNames:
      sum := getValue(row) + !sum
    end
    sum / quizCount
  end)
```

## Jellybean A

```
> tableJellybeanA
```

