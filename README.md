# B2T2

The Brown Benchmark for Table Types.

## What is a Table?

- A table has two parts: a schema, and a rectangular collection of cells. The rectangle has a fixed shape (`n*m`) and its width must equal to the length of schema.
- Cells either contain data or are missing data
- A schema is an ordered sequence of column names and sorts
- A header is an ordered sequence of column names. The order is the same as in the schema.
- Elements of a header must be distinct
- A column name is a string-like first-class datatype
- Column names are first-class value.
- A sort is a type-like specification that describe the kinds of data that the cell may contain.
- A `n*m` table can be viewed as an ordered sequence of `m` columns
- A `n*m` table can be viewed as an ordered sequence of `n` rows
- Each cell of the i-th column is ascribed by the i-th sort.
