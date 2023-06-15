import { GeneratorOptions } from '@prisma/generator-helper';
import path from 'path';
import fs from 'fs';
import * as child_process from 'child_process';
import os from 'os';

type SchemaEnum = {
	name: string;
	values: string[];
};

const enumRegex = /enum [\s\S]*?\}/g;
const curlyBracesRegex = /\{([^{}]+)\}/g;

function parseEnums(dataModel: string) {
	const enumStrings = dataModel.match(enumRegex);

	const enums: SchemaEnum[] =
		enumStrings?.map((enumString) => {
			const name = enumString.split(' ')[1];

			const valueString = enumString.substring(enumString.indexOf('{')).replace('{', '').replace('}', '').trim();

			const values = valueString.split(/\s/).filter(Boolean);

			return { name, values };
		}) ?? [];

	return enums;
}

function generateFileContent(enums: SchemaEnum[], isTs = true) {
	return `
  // This file was generated from your schema.prisma file.
  // Any changes made to this file will be overridden by the nex generate command.
  
  import { ${enums.map((e) => e.name).join(', ')} } from '@prisma/client';

  ${enums
		.map(
			(e) => `
  /**
   * A function to validate if a string is of type {@link ${e.name}}.
   * @param {string | null | undefined} value The value to test.
   * @returns {boolean} \`true\` if {@link value} is of type {@link ${e.name}}. Otherwise \`false\`. 
   */
  export function is${e.name} (value${isTs ? `: string | null | undefined): value is ${e.name}` : ')'} {
  \tif(!value) return false;
  \treturn Object.values(${e.name}).includes(value${isTs ? ` as ${e.name}` : ''});
  }`
		)
		.join('\n')}
  `;
}

export default async (options: GeneratorOptions) => {
	try {
		const config = options.generator.config;
		console.log(config);

		const isTs = !!config.useTs ? config.useTs === 'true' : true;
		console.log(isTs);

		const output = options.generator.output?.value || `./prisma/enum-validators.${isTs ? 'ts' : 'js'}`;
		const enums = parseEnums(options.datamodel);

		const fileContent = generateFileContent(enums, isTs);
		console.log(output);

		fs.writeFileSync(output, fileContent);
	} catch (error) {
		console.error(error);
		throw error;
	}
};
