# B2T2

The Brown Benchmark for Table Types

## Benchmark Files

- [Definition of a Table](WhatIsATable.md)
- [Example Tables](ExampleTables.md)
- [Table API](TableAPI.md)
- [Example Programs](ExamplePrograms.md)
- [Errors](Errors.md)
- [Datasheet Template](Datasheet.md)

## Competitors

To submit an implementation of B2T2, open a pull request with a new folder for
the `Competitors/` directory. The folder should include at least two things:

- code that addresses the main components of B2T2 (Tables, API, Example Programs, Errors)
- a datasheet describing the implementation

Refer to [`Competitors/TypeScript`](Competitors/TypeScript) for an example.

## Resources

This benchmark has an associated paper:

```
  @article{lgk-pj-2021,
   title={Types for Tables: A Language Design Benchmark},
   author={Kuang-Chen Lu and Ben Greenman and and Shriram Krisnamurthi},
   journal={The Art, Science, and Engineering of Programming},
   volume={6},
   number={2},
   numpages={26},
   year={2022}
  }
```

