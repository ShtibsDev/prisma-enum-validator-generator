# Prisma Enum Validator Generator

This package will generate enum validation methods from your `schema.prisma` file.

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
enum Colors {RED
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
