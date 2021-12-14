## Implement B2T2 in TypeScript

### Limitations

- This implementation cannot specify that a table must not contain duplicated column names.
- Every type variable that is declared as `extend CTop` should be instantiated with a string-literal type (e.g. `'foobar'`). If it is instantiated with the string type or a union of string literals, the output type might be broken.

### Credits

Thanks Thomas and Max for their annotated `pivotLonger`, `pivotWider`, and other operators.
