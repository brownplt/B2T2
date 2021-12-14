# B2T2

The Brown Benchmark for Table Types

## Context

This benchmark is documented in the paper
[Types for Tables: A Language Design Benchmark](https://cs.brown.edu/~sk/Publications/Papers/Published/lgk-b2t2/).
Please read it to understand what this benchmark is trying to
accomplish and what the following components are about.

## Benchmark Components

- [Definition of a Table](WhatIsATable.md)
- [Example Tables](ExampleTables.md)
- [Table API](TableAPI.md)
- [Example Programs](ExamplePrograms.md)
- [Errors](Errors.md)
- [Datasheet Template](Datasheet.md)

## Submissions

To submit an implementation of B2T2, open a pull request with a new folder in
the `Media/` directory for your programming medium (which might be a language,
a theoretical model, or some other way of expressing tabular programs).
The folder should include at least two things:

- code that addresses the main components of B2T2 (Tables, API, Example Programs, Errors)
- a datasheet describing the implementation

Refer to [`Media/TypeScript`](Media/TypeScript) for an example.

## Citation

To refer to this benchmark, please use the following citation:

```
  @article{lgk-pj-2022,
   title={Types for Tables: A Language Design Benchmark},
   author={Kuang-Chen Lu and Ben Greenman and and Shriram Krishnamurthi},
   journal={The Art, Science, and Engineering of Programming},
   volume={6},
   number={2},
   numpages={26},
   year={2022}
  }
```

You may, if you wish, refer to this repository in *addition*, but
please do refer to the above paper.
