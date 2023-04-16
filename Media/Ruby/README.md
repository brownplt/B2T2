# Ruby

**This code was written and tested with Ruby 3.2.0.**

## How to Execute Tests

If you haven't already, install gems.
```
bundle install
```

Execute tests.
```
bundle rspec .
```

***

## Table API Implementation Progress

#### Assumptions

**Functions:**

* [x] even
* [x] length
* [x] schema (lives on the table class)
* [x] range
* [x] concat
* [x] startsWith
* [x] average
* [x] filter
* [x] map
* [x] removeDuplicates
* [x] removeAll
* [x] colNameOfNumber


**Relations:**

* [ ] x has no duplicates
* [ ] x is equal to y
* [ ] x is (not) in y
* [ ] x is a subsequence of y
* [ ] x is of sort y
* [ ] x is y
* [ ] x is a categorical sort
* [ ] x is (non-)negative
* [ ] x is equal to the sort of y
* [ ] x is the sort of elements of y
* [ ] x is equal to y with all a_i replaced with b_i

#### Constructors
* [x] emptyTable
* [ ] addRows
* [ ] addColumn
* [ ] buildColumn
* [ ] vcat
* [ ] hcat
* [ ] values
* [ ] crossJoin
* [ ] leftJoin

#### Properties

* [x] nrows
* [x] ncols
* [x] header

#### Access Subcomponents

* [x] getRow
* [x] getValue
* [x] getColumn (overloading 1 & 2)

#### Subtable

* [ ] selectRows (overloading 1 & 2)
* [ ] selectColumns (overloading 1 & 2 & 3)
* [ ] head
* [ ] distinct
* [ ] dropColumn
* [ ] dropColumns
* [ ] tfilter

#### Ordering

* [ ] tsort
* [ ] sortByColumns
* [ ] orderBy

#### Aggregate

* [ ] count
* [ ] bin
* [ ] piviotTable
* [ ] groupBy

#### Missing Values

* [ ] completeCases
* [ ] dropna
* [ ] fillna

#### Data Cleaning

* [ ] pivotLonger
* [ ] pivotWider

#### Utilities

* [ ] flatten
* [ ] transformColumn
* [ ] renameColumns
* [ ] find
* [ ] groupByRetentive
* [ ] grouoBySubtractive
* [ ] update
* [ ] select
* [ ] selectMany
* [ ] groupJoin
* [ ] join
