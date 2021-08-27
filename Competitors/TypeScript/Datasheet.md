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

Overloaded operations are defined as distinct operations with related names. For example, we have `selectRows1` and `selectRows2`.

`Error<T>` is encoded as if it was `T`. Errors are represented as exceptions and hence not described as part of the types.

`Seq<>` is encoded as `Array<>`.

Every table type is translated to `Table<S>`, where `S` is a type that represent an _unorderred_ schema.

When two schemas are equal, we create a type variable and use that variable for both.

When we need to constraint a column name, we create a type variable (usually named `C`) and constraint that type variable. For example, to specify that a variable `c` must be a column name of a `Table<S>`, we write `c: C` and `C extends CTop & keyof S`, which means `C` must be a column name (`CTop`) and must be a key of the object type that represents the unorderred schema (`S`). 

An exception to the last "consistent change" is that if we need to specify the type that `c` maps to, we write `C extends CTop` and constraint the schema. For example, our `tsort` operator only accepts a numeric column. We wrote `S extends STop & Record<C, number>` to specify that `S`, the unordered schema of the table to be sorted, must map `C` to `number`.

### Which operations are entirely inexpressible? Why?

All operations are at least partially expressible.

### Which operations are only partially expressible? Why, and what’s missing?

We cannot express constraints on the number of rows, the number of columns, and the order of column names. We also cannot specify that a sequence has no duplicates.

Yet another prevalent limitation on the expressibility of the operations comes from the fact that we cannot constraint variables themselves, but only their types. This limitation is most obvious in column names. The best way we can do to constraint variables bound to column names is to write `c: C` and then constarint `C`. Many operators will have a broken output type if `C` is not instantiated with string literal types. For example, if a programmer wrote `addColumn(t, c, vs)` and the type of `c` is a union of string literal types (e.g. `"foo" | "bar"`), then the type system will think two columns are added. This limitation is so prevalent that we chose not to document it throught out `TableAPI.ts`.

### Which operations’ expressibility is unknown? Why?

All operations are expressible. Most of them are partialy expressible.

### Which operations can be expressed more precisely than in the benchmark? How?

No operation can be expressed more precisely than in the benchmark.

## Example Programs

### Which examples are inexpressible? Why?

All examples are expressible.

### Which examples’ expressibility is unknown? Why?

All examples are expressible.

### Which examples, or aspects thereof, can be expressed especially precisely? How?

None of the examples are especially precise.

### How direct is the mapping from the pseudocode in the benchmark to representations in your system? How complex is the encoding?

In general, constraints must be translated to type annotations. This part of translation is similar to the translation of TableAPI.

In certain examples, sometimes explicit casts must be inserted to convince the type system. For details, please see the comments on `quizScoreFilter` and `quizScoreSelect` in [ExamplePrograms.ts](ExamplePrograms.ts).

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

`swappedColumns`. In the benchmark, table cells are associated with column indices, so are table headers. It is the mismatch between the two association that leads to the error. In our encoding, table cells are associated with column names rather than column indices. 

### Which error situations are only partially expressible? Why, and what’s missing?

`getOnlyRow`. The feedback is missing. Our encoding can express the buggy program but cannot detect the error. 

### Which error situations’ expressibility is unknown? Why?

None.

### Which error situations can be expressed more precisely than in the benchmark? How?

None.

### Which error situations are prevented from being constructed? How?

None.

### For each error situation that is at least partially expressible, what is the quality of feedback to the programmer?

All "Malformed Tables" situations provide readable feedback.

The feedback of `midFinal` is long and not pointing out the similarity between the given, invalid column name (`"mid"`) and a valid one (`"midterm"`)

The feedback of `blackAndWhite` is not pointing out the similarity between the given, invalid column name (`"black and white"`) and valid ones (`"black"` and `"white"`).

The feedback of `pieCount` can be misleading, as it underlines the table argument but the real problem lies in the other two argument.

The feedback of `brownGetAcne` gives the programmer enough information to find the issue. It could be better if it suggests the programm to focus on the mismatch between `"part2"` and `brownAndGetAcneTable`/`"brown and get acne"`.

`getOnlyRow` is missing feedback.

The feedback of `favoriteColor` gives the programmer enough information to find the issue. We can not see much room for improvement.

The feedback of `brownJellybeans` is not very helpful. It only points out one code fragment that might be at fault, but there are more, including the definition of `keep`, the string constant `"color"`, and the unused parameter `color`.

The feedback of `employeeToDepartment` gives the programmer enough information to find the issue. It points out that `"Last Name"` is not one of `"Department Name"` and `"Department ID"`. From this mismatch, the programmer should be able to realize that they confuse the department table with the employee table. 

### For each error situation that is prevented from being constructed, what is the quality of feedback to the programmer?

No situation is prevented from being constructed.