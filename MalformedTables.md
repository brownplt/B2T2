## Missing Schema

### The Malformed Table 

This malformed table misses the schema. 

```lua
| ------- | -- | ------- |
| "Bob"   | 12 | "blue"  |
| "Alice" | 17 | "green" |
| "Eve"   | 13 | "red"   |
```

### A Corrected Table

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

## Missing Row

### The Malformed Table 

This malformed table misses the content of the last row.

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
|                                   |
```

### A Corrected Table

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

## Missing Cell

### The Malformed Table 

The first row of this malformed table misses a cell.

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | "blue" |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

### A Corrected Table

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

## Swapped Columns

### The Malformed Table 

The rows disagree with the schema on the ordering of the first two columns.

```lua
| name   | age     | favorite color |
| String | Number  | String         |
| ------ | ------- | -------------- |
| 12     | "Bob"   | "blue"         |
| 17     | "Alice" | "green"        |
| 13     | "Eve"   | "red"          |
```

### A Corrected Table

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

## Schema Too Short

### The Malformed Table 

The schema specifies that there are two columns. But the rows specifices that there are three columns.

```lua
| name    | age    |
| String  | Number |
| ------- | ------ |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

### A Corrected Table

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```

## Schema Too Long

### The Malformed Table 

The schema specifies that there are four columns. But the rows specifices that there are three columns.

```lua
| name    | age    | favorite number | favorite color |
| String  | Number | Number          | String         |
| ------- | ------ | --------------- |----------------|
| "Bob"   | 12     | "blue"          |
| "Alice" | 17     | "green"         |
| "Eve"   | 13     | "red"           |
```

### A Corrected Table

```lua
| name    | age    | favorite color |
| String  | Number | String         |
| ------- | ------ | -------------- |
| "Bob"   | 12     | "blue"         |
| "Alice" | 17     | "green"        |
| "Eve"   | 13     | "red"          |
```
