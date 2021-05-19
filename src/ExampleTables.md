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

Jelly bean tables and analysis are produced with

```R
library(tibble)
tableJellyAnon = 
  as.tibble(
    matrix(
      rbinom(100, 1, 0.3) == 1,
      ncol=10))
colnames(tableJellyAnon) = 
  c("get-acne",
    "red", "black", "white",
    "green", "yellow", "brown",
    "orange", "pink", "purple")

show(tableJellyAnon)

pHacking = function(t) {
  colAcne = factor(t[["get-acne"]], levels = 0:1)
  tableJB = t[,2:ncol(t)]
  show(tableJB)
  for (c in colnames(tableJB)) {
    colJB = factor(tableJB[[c]], levels = 0:1)
    show(colJB)
    result = fisher.test(colAcne, colJB)
    show(c)
    show(result)
  }
}
```

