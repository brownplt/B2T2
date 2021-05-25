# What is a Table?

## Fundamentals

- A _table_ has two parts: a schema, and a rectangular collection of cells.
- A _schema_ is an ordered sequence of column names and sorts.
  + Column names must be distinct (no duplicates)
- A _column name_ is a string-like first-class value
- A _sort_ is a specification of the data that a column contains.
  + Each cell in the i-th column must match the i-th sort.
- Cells may be organized into rows or columns. Either way:
  + All rows must have the same length
  + All columns must have the same length
- Cells may contain data or may be missing data


## Auxiliaries

- A _header_ is an ordered sequence of column names (a schema without sorts)


