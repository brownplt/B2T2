# B2T2

The Brown Benchmark for Table Types

Version 1.2

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

## Implementations

Implementations live in the Media folder:

- [`Media/`](Media)

To submit your own implementation of B2T2, open a pull request with a new folder in
the `Media/` directory for your programming medium --- which might be a language,
a theoretical model, or some other way of expressing tabular programs.
The new folder should include at least two things:

1. code that addresses the components of B2T2 (Tables, API, Example Programs, Errors)
2. a datasheet describing the implementation

Refer to [`Media/TypeScript`](Media/TypeScript) for an example.

If you have a work-in-progress implementation or other work that draws inspiration from
B2T2, open a pull request to list it in the catalog at [`Media/README.md`](Media/README.md).


## What Makes B2T2 Good?

B2T2 strives to be fair, comprehensive, concise, and realistic:

- **Fairness**. A benchmark would be unfair if it was designed to favor some type
  systems over others. Since B2T2 combines operators from untyped languages and
  we (its authors) don't currently "own" a type system for tables, there is
  no obvious problem when it comes to fairness.

- **Comprehensiveness**. A benchmark would be incomprehensive if it left out
  things that are obviously important. B2T2 draws from several widely-used
  programming media and also some educational materials in an effort to
  cover all the bases.

- **Conciseness**. Although we tried to be comprehensive, we also wanted to
  keep B2T2 within a reasonable size. So we kept important things but
  also compressed them. For example, if an operation is equivalent to a
  composition of other operations, the composition is not included.

- **Realistic**. An unrealistic benchmark would address synthetic or
  hypothesized use-cases rather than real ones. B2T2 draws from existing
  libraries to satisfy real needs.

Future changes to B2T2 will be made with these perspectives in mind.


## Citation

To refer to this benchmark, please use the following citation:

```
  @article{lgk-pj-2022,
   title={Types for Tables: A Language Design Benchmark},
   author={Kuang-Chen Lu and Ben Greenman and and Shriram Krishnamurthi},
   journal={The Art, Science, and Engineering of Programming},
   volume={6},
   number={2},
   pages={8:1--8:30},
   year={2022}
  }
```

You may, if you wish, refer to this repository in *addition*, but
please do refer to the above paper.
