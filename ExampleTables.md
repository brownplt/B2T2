We are going to use four tables throughout our benchmark.

`tableSF`: a simple table with no values missing.

```
> tableSF
```
|   name  | age | favorite-color  |
|---------|-----|-----------------|
| "Bob"   |  12 |         "blue"  |
| "Alice" |  17 |        "green"  |
| "Eve"   |  13 |          "red"  |

`tableSM`: a simple table missing some values.

```
> tableSM
```
|    name | age | favorite-color |
|---------|-----|----------------|
|   "Bob" |     |         "blue" |
| "Alice" |  17 |        "green" |
|   "Eve" |  13 |                |

`tableGF`: a gradebook table with no missing values.

```
> tableGF
```

|    name | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
|---------|-----|-------|-------|---------|-------|-------|-------|
|   "Bob" |  12 |     8 |     9 |      77 |     7 |     9 |    87 |
| "Alice" |  17 |     6 |     8 |      88 |     8 |     7 |    85 |
|   "Eve" |  13 |     7 |     9 |      84 |     8 |     8 |    77 |

`tableGM`: a gradebook table missing some values.

```
> tableGM
```

|    name | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
|---------|-----|-------|-------|---------|-------|-------|-------|
|   "Bob" |  12 |     8 |     9 |      77 |     7 |     9 |    87 |
| "Alice" |  17 |     6 |     8 |      88 |       |     7 |    85 |
|   "Eve" |  13 |       |     9 |      84 |     8 |     8 |    77 |


-----

Internal note: in the gradebook tables, quiz grades are generated with
the following R code (noted here in case we want to generate more):

```R
logistic = function(a) {
  1 / (1 + exp(- a))
}
logit = function(p) {
  log(p / (1 - p))
}

> round(logistic(rnorm(6, mean = logit(0.8), sd = 0.5)) * 10)
```

and midterm and final grades are generated with

```R
> round(logistic(rnorm(2, mean = logit(0.8), sd = 0.7)) * 100)
```
