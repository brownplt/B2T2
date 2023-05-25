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

#### Constructors
* [x] emptyTable
* [x] addRows
* [x] addColumn
* [x] buildColumn
* [x] vcat
* [x] hcat
* [x] values
* [x] crossJoin
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

* [x] selectRows (overloading 1 & 2)
* [ ] selectColumns (overloading 1 & 2 & 3)
* [ ] head
* [ ] distinct
* [ ] dropColumn
* [ ] dropColumns
* [x] tfilter

#### Ordering

* [ ] tsort
* [ ] sortByColumns
* [ ] orderBy

#### Aggregate

* [x] count
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
