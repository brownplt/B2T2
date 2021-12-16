## Reference

> Q. Where can we learn about the programming medium covered by this datasheet?
> (Feel free to link to multiple kinds of artifacts: repositories, papers, videos, etc.
> Please also include version information where applicable.)

https://www.empirical-soft.com

Version 0.6.9

> Q. What is the URL of the version of the benchmark being used?

https://github.com/brownplt/B2T2/tree/74c604d3c0e1ff96428e6db9e29838a3920144f4

> Q. On what date was this version of the datasheet last updated?

2021-12-15

> Q. If you are not using the latest benchmark available on that date, please explain why not.

N/A

## Example Tables

> Q. Do tables express heterogeneous data, or must data be homogenized?

Data can be heterogeneous.

> Q. Do tables capture missing data and, if so, how?

Missing data is a sentinel that depends on type: `nil` for integers and `nan` for floating points.

> Q. Are mutable tables supported? Are there any limitations?

The schema can't be changed, though values within a table are mutable.

> You may reference, instead of duplicating, the responses to the above questions in answering those below:

> Q. Which tables are inexpressible? Why?

As of now, Empirical only permits columns of builtin types. That means `gradebookSeq` and `gradebookTable` are currently not possible because there cannot be arrays or nesting (user-defined types) in a column.

The reason for this limitation is simply one of time and priorities when implementing Empirical.

> Q. Which tables are only partially expressible? Why, and what’s missing?

See above.

> Q. Which tables’ expressibility is unknown? Why?

See above.

> Q. Which tables can be expressed more precisely than in the benchmark? How?

See above.

> Q. How direct is the mapping from the tables in the benchmark to representations in your system? How complex is the encoding?

Column names must be a valid Empirical identifier. So "Department ID" was changed to "department_id", etc. This is a requirement of static typing.

## TableAPI

> Q. Are there consistent changes made to the way the operations are represented?

Empirical's operations rely on `from` for one table and `join` for two tables. Because Empirical is a vector-aware language, most actions involve simply calling vector functions. The fact that Empirical is an actual language with a compiler means that arbitrary expressions are permissible.

> Q. Which operations are entirely inexpressible? Why?

Empirical does not have nested structures. As noted above, this limitation is deliberate in the face of priorities and limited time for implementing the language.

The following functions have no plans for inclusion, at least as defined in API's description:

 - `crossJoin`
 - `pivotTable`
 - `dropna`
 - `pivotLonger`
 - `pivotWider`
 - `flatten`
 - `find`
 - `groupByRetentive`
 - `groupBySubtractive`
 - `selectMany`
 - `groupJoin`
 - `join`

The following functions require an `append()` routine:

 - `addRows`
 - `vcat`

The following functions require row indexing and array indexing:

 - `getRow`
 - `selectRows` (non-bool version)
 - `head`

The following functions should be trivial to add:

 - `hcat`
 - `distinct`
 - `bin`

> Q. Which operations are only partially expressible? Why, and what’s missing?

Empirical currently only offers `select` operations on a table. It needs `update`, `delete`, and `rename`. This affects:

 - `addColumn`
 - `buildColumn`
 - `dropColumn`
 - `dropColumns`
 - `renameColumns`
 - `update`

Additionally, Empirical needs a `map()` function since table operations assume that expressions operate on vectors. This would require a more powerful type system (eg., Hindley-Milner).

Also, Empirical needs `desc` in the `sort` operation.

Finally, Empirical needs more explicit `nil`/`nan` functions for the user, like `is_nil()` and `fill()`. That affects:

 - `completeCases`
 - `fillna`

> Q. Which operations’ expressibility is unknown? Why?

N/A

> Q. Which operations can be expressed more precisely than in the benchmark? How?

Empirical aims to express every table operation with a combination of `from`, `join`, and `sort`. These routines accept expressions, not just column names, which makes it easy to perform actions on-the-fly.

## Example Programs

> Q. Which examples are inexpressible? Why?

Empirical's lack of nested structures eliminates:

 - `groupByRetentive`
 - `groupBySubtractive`

Empirical does not represent column names as string values. That said, Empirical's `compile()` routine can handle any string expression that results in valid Empirical code at compile time. Unfortunately, Empirical's string routines are fairly non-existent, which eliminates:

 - `pHackingHomogeneous`
 - `pHackingHeterogeneous`

The lack of `random()` and `sample()` is minor, but it obviates:

 - `sampleRows`

> Q. Which examples’ expressibility is unknown? Why?

Empirical is for structured data, not matrices masquerading as Dataframes. In that case, just use matrices, which Empirical currently doesn't have. That eliminates:

 - `quizScoreSelect`

> Q. Which examples, or aspects thereof, can be expressed especially precisely? How?

These examples expect far more dynamism that what Empirical tries to represent. Literally the opposite in some cases.

> Q. How direct is the mapping from the pseudocode in the benchmark to representations in your system? How complex is the encoding?

The lack of basic routines in Empirical (given the youth of the language) has made many of the programs impossible at present.


## Errors

> There are (at least) two parts to errors: representing the source program that causes the error, and generating output that explains it. The term “error situation” refers to a representation of the cause of the error in the program source.
> 
> For each error situation it may be that the language:
> 
> - isn’t expressive enough to capture it
> - can at least partially express the situation
> - prevents the program from being constructed
> 
> Expressiveness, in turn, can be for multiple artifacts:
> 
> - the buggy versions of the programs
> - the correct variants of the programs
> - the type system’s representation of the constraints
> - the type system’s reporting of the violation

> Q. Which error situations are known to be inexpressible? Why?

All situations are either handled (error reported) or are not even possible with Empirical (even better).

Error handling is where the static nature of Empirical shines.

> Q. Which error situations are only partially expressible? Why, and what’s missing?

See above.

> Q. Which error situations’ expressibility is unknown? Why?

See above.

> Q. Which error situations can be expressed more precisely than in the benchmark? How?

Good ol' static typing caused the invalid names and mismatched types to be reported at compile time:

 - `midFinal`
 - `pieCount`
 - `brownGetAcne`
 - `favoriteColor`
 - `employeeToDepartment`

> Q. Which error situations are prevented from being constructed? How?

The way Empirical expresses table operations means that some of the error situations are not even possible to encode:

 - `blackAndWhite`
 - `brownJellybeans`

> Q. For each error situation that is at least partially expressible, what is the quality of feedback to the programmer?

Error reports include the name of the unknown ID or the expected-vs-received parameter type.

> Q. For each error situation that is prevented from being constructed, what is the quality of feedback to the programmer?

See above.