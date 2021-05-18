# B2T2

The Brown Benchmark for Tabular Tables.

## What is a Table?

- A table has three parts: a header, a schema, a number of rows (`n`), a number of columns (`m`), and a rectangular (`n*m`) collection of cells
- Cells either contain data or are missing data
- A header is an ordered sequence of column names
- A column name is a string-like first-class datatype
- Column names are first-class value.
- Elements of a header must be distinct
- A schema is a mapping from elements of the header to sorts
- A sort is a type-like specification that describe whether a cell contains datum and, if yes, the kinds of data that the cell may contain.
- A `n*m` table can be viewed as a sequence of `m` columns
- A `n*m` table can be viewed as a sequence of `n` rows
- In a table, the i-th column name correspond to the i-th column. The cells of the column are ascribed by the corresponding sort