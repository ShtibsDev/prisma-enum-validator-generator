# Prisma Enum Validator Generator

This package will generate enum validation methods from your `schema.prisma` file.

1. [Installation](#installation)
2. [Usage](#usage)
3. [Configuration](#configuration)
   1. [Using With Javascript](#using-with-javascript)

## Installation

```bash
npm i -D prisma-enum-validator-generator
```

Add the following to your `schema.prisma`

```prisma
generator erd {
  provider = "prisma-enum-validator-generator"
}
```

Run the generator

```bash
npx prisma generate
```

The following enum:

```prisma
enum Colors {
  RED
  BLUE
  GREEN
}
```

will result in the following code:

```typescript
/**
 * A function to validate if a string is of type {@link Colors}.
 * @param {string | null | undefined} value The value to test.
 * @returns {boolean} `true` if {@link value} is of type {@link Colors}. Otherwise `false`.
 */
export function isColors(value: string | null | undefined): value is Colors {
	if (!value) return false;
	return Object.values(Colors).includes(value as Colors);
}
```

## Usage

To use the validation functions you simply import the one you need from the generated file.
The functions are [type guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates), which means that their return value is `boolean` but they also modify the type of the the argument that you pass.

```typescript
import { isColors } from '../prisma/enum-validators';

function someFunction(str: string | null) {
	if (isColors(str)) {
		// str: Colors
	}

	// str: string | null
}
```

## Configuration

The generator provides the following configurations:

```prisma
generator erd {
  provider = "prisma-enum-validator-generator"
  output = string //Specifies where the validators file will be generated. Defaults to 'enum-validators.ts'.
  isTs = boolean //Specifies whether the output is targeted for typescript or javascript. Defaults to true.
}
```

### Using with Javascript

The generator also supports outputting to javascript format.
By setting `isTs` to `false`, all typescript exclusive syntax will be removed, allowing you to use the validation functions in your javascript project.

Typescript output:

```typescript
/**
 * A function to validate if a string is of type {@link Colors}.
 * @param {string | null | undefined} value The value to test.
 * @returns {boolean} `true` if {@link value} is of type {@link Colors}. Otherwise `false`.
 */
export function isColors(value: string | null | undefined): value is Colors {
	if (!value) return false;
	return Object.values(Colors).includes(value as Colors);
}
```

Javascript output:

```javascript
/**
 * A function to validate if a string is of type {@link Colors}.
 * @param {string | null | undefined} value The value to test.
 * @returns {boolean} `true` if {@link value} is of type {@link Colors}. Otherwise `false`.
 */
export function isColors(value) {
	if (!value) return false;
	return Object.values(Colors).includes(value);
}
```

\*\* Note that setting `isTs` to `false`, will change any output filename extension to `.js`
