We are going to use four tables throughout our benchmark.

`tableSF`: a simple table with no values missing.

```
> tableSF
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Bob"   | 12  | "blue"         |
| "Alice" | 17  | "green"        |
| "Eve"   | 13  | "red"          |
```

`tableSM`: a simple table missing some values.

```
> tableSM
| name    | age | favorite-color |
| ------- | --- | -------------- |
| "Bob"   |     | "blue"         |
| "Alice" | 17  | "green"        |
| "Eve"   | 13  |                |
```

`tableGF`: a gradebook table with no missing values.

```
> tableGF
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
| "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
```

`tableGM`: a gradebook table missing some values.

```
> tableGM
| name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
| ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
| "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
| "Alice" | 17  | 6     | 8     | 88      |       | 7     | 85    |
| "Eve"   | 13  |       | 9     | 84      | 8     | 8     | 77    |
```

`tableJN`: a jelly bean table that contains only numeric data

```
> tableJN
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
```

`tableJM`: a jelly bean table that contains mix-typed data

```
> tableJN
| name       | get-acne | red | black | white | green | yellow | brown | orange | pink | purple |
| ---------- | -------- | --- | ----- | ----- | ----- | ------ | ----- | ------ | ---- | ------ |
| "Emily"    | 0        | 1   | 1     | 1     | 1     | 1      | 0     | 0      | 0    | 1      |
| "Jacob"    | 0        | 0   | 0     | 1     | 0     | 1      | 1     | 1      | 1    | 0      |
| "Emma"     | 1        | 0   | 1     | 1     | 0     | 1      | 1     | 0      | 1    | 0      |
| "Aidan"    | 1        | 0   | 0     | 1     | 1     | 0      | 0     | 0      | 0    | 0      |
| "Madison"  | 0        | 0   | 1     | 1     | 0     | 0      | 0     | 0      | 0    | 0      |
| "Ethan"    | 0        | 1   | 1     | 1     | 1     | 0      | 0     | 0      | 1    | 1      |
| "Hannah"   | 0        | 1   | 1     | 0     | 0     | 1      | 1     | 1      | 1    | 1      |
| "Matthew"  | 0        | 0   | 1     | 1     | 1     | 1      | 1     | 1      | 0    | 0      |
| "Hailey"   | 1        | 0   | 0     | 1     | 1     | 0      | 0     | 0      | 0    | 0      |
| "Nicholas" | 1        | 0   | 0     | 1     | 1     | 1      | 1     | 0      | 0    | 1      |
| "Sarah"    | 0        | 1   | 1     | 1     | 1     | 1      | 1     | 0      | 0    | 1      |
| "Joshua"   | 0        | 0   | 0     | 0     | 0     | 0      | 0     | 1      | 1    | 0      |
| "Kaitlyn"  | 0        | 1   | 1     | 0     | 1     | 1      | 1     | 0      | 0    | 0      |
| "Ryan"     | 0        | 0   | 1     | 1     | 0     | 1      | 0     | 1      | 0    | 0      |
| "Isabella" | 0        | 0   | 0     | 0     | 0     | 0      | 0     | 0      | 1    | 1      |
| "Michael"  | 0        | 0   | 0     | 0     | 0     | 0      | 0     | 1      | 1    | 0      |
| "Olivia"   | 0        | 1   | 1     | 1     | 1     | 1      | 1     | 1      | 1    | 0      |
| "Zachary"  | 1        | 1   | 1     | 0     | 0     | 1      | 1     | 0      | 0    | 1      |
| "Abigail"  | 1        | 1   | 0     | 1     | 0     | 1      | 0     | 1      | 0    | 0      |
| "Tyler"    | 1        | 1   | 1     | 0     | 1     | 0      | 0     | 0      | 1    | 1      |
```

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

> round(logistic(rnorm(4, mean = logit(0.8), sd = 0.5)) * 10)
```

and midterm and final grades are generated with

```R
> round(logistic(rnorm(2, mean = logit(0.8), sd = 0.7)) * 100)
```
