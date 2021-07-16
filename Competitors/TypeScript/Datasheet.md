## Reference

### What is the URL of the version of the benchmark being used?

https://github.com/brownplt/B2T2/tree/8636f6328cb01d5a17f959ade56c6d929e21d2bd

### On what date was this version of the datasheet last updated?

2021-05-28

### If you are not using the latest benchmark available on that date, please explain why not.

## Example Tables

### Do tables express heterogeneous data, or must data be homogenized?

Data can be heterogeneous.

### Do tables capture missing data and, if so, how?

A special value, `null`, is used to indicate missing data.

### Are mutable tables supported? Are there any limitations?

We don't support mutable tables.

### You may reference, instead of duplicating, the responses to the above questions in answering those below:

### Which tables are inexpressible? Why?

All tables are expressible.

### Which tables are only partially expressible? Why, and what’s missing?

All tables are fully expressible.

### Which tables’ expressibility is unknown? Why?

All tables are fully expressible.

### Which tables can be expressed more precisely than in the benchmark? How?

All tables can be expressed precisely.

### How direct is the mapping from the tables in the benchmark to representations in your system? How complex is the encoding?

The encoding is straightforward. Given a table, its representation includes two components. One is a finite sequence of column names, representing the table header. The other component is a finite sequence of finite maps. Each of those finite map corresponds to one table row. The finite maps associate column names to table cells. When a table cell is missing datum, the representation fills the spot with the `null` value.

## TableAPI

### Are there consistent changes made to the way the operations are represented?

### Which operations are entirely inexpressible? Why?

### Which operations are only partially expressible? Why, and what’s missing?

### Which operations’ expressibility is unknown? Why?

### Which operations can be expressed more precisely than in the benchmark? How?

## Example Programs

### Which examples are inexpressible? Why?

### Which examples’ expressibility is unknown? Why?

### Which examples can be expressed more precisely than in the benchmark? How?

### How direct is the mapping from the pseudocode in the benchmark to representations in your system? How complex is the encoding?

## Errors

There are (at least) two parts to errors: representing the source program that causes the error, and generating output that explains it. The term “error situation” refers to a representation of the cause of the error in the program source.

For each error situation it may be that the language:

- isn’t expressive enough to capture it
- can at least partially express the situation
- prevents the program from being constructed

Expressiveness, in turn, can be for multiple artifacts:

* the buggy versions of the programs
* the correct variants of the programs
* the type system’s representation of the constraints
* the type system’s reporting of the violation

### Which error situations are known to be inexpressible? Why?

### Which error situations are only partially expressible? Why, and what’s missing?

### Which error situations’ expressibility is unknown? Why?

### Which error situations can be expressed more precisely than in the benchmark? How?

### Which error situations are prevented from being constructed? How?

### For each error situation that is at least partially expressible, what is the quality of feedback to the programmer?

### For each error situation that is prevented from being constructed, what is the quality of feedback to the programmer?
