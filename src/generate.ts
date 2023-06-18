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
const modelRegex = /model [\s\S]*?\}/g;
const curlyBracesRegex = /\{([^{}]+)\}/g;

function parseEnums(dataModel: string) {
	const enumStrings = dataModel.match(enumRegex);
	const modelStrings = dataModel.match(modelRegex);

	const enums: string[] =
		enumStrings?.map((enumString) => {
			const name = enumString.split(' ')[1];

			// const valueString = enumString.substring(enumString.indexOf('{')).replace('{', '').replace('}', '').trim();
			// const values = valueString.split(/\s/).filter(Boolean);

			return name;
		}) ?? [];

	const enumUsage: any = {};
	enums.forEach((e) => (enumUsage[e] = 0));

	const ignoreTokens = ['@@', '//'];

	for (const modelString of modelStrings ?? []) {
		const fieldsString = modelString.substring(modelString.indexOf('{')).replace('{', '').replace('}', '').trim();
		const fields = fieldsString
			.split('\n')
			.map((f) => f.trim())
			.filter((f) => f && !ignoreTokens.some((it) => f.startsWith(it)));
		for (const field of fields) {
			const tokens = field.split(/\s/).filter(Boolean);

			const fieldType = tokens[1] ?? null;

			if (!fieldType) continue;

			if (enums.includes(fieldType)) {
				enumUsage[fieldType]++;
			}
		}
	}

	return enums.filter((e) => enumUsage[e] > 0);
}

function generateFileContent(enums: string[], isTs = true) {
	return `
  // This file was generated from your schema.prisma file.
  // Any changes made to this file will be overridden by the nex generate command.
  
  import { ${enums.join(', ')} } from '@prisma/client';

  ${enums
		.map(
			(enumName) => `
  /**
   * A function to validate if a string is of type {@link ${enumName}}.
   * @param {string | null | undefined} value The value to test.
   * @returns {boolean} \`true\` if {@link value} is of type {@link ${enumName}}. Otherwise \`false\`. 
   */
  export function is${enumName} (value${isTs ? `: string | null | undefined): value is ${enumName}` : ')'} {
  \tif(!value) return false;
  \treturn Object.values(${enumName}).includes(value${isTs ? ` as ${enumName}` : ''});
  }`
		)
		.join('\n')}
  `;
}

export default async (options: GeneratorOptions) => {
	try {
		const config = options.generator.config;

		const isTs = !!config.useTs ? config.useTs === 'true' : true;

		const output = options.generator.output?.value || `./prisma/enum-validators.${isTs ? 'ts' : 'js'}`;
		const enums = parseEnums(options.datamodel);

		const fileContent = generateFileContent(enums, isTs);

		fs.writeFileSync(output, fileContent);
	} catch (error) {
		console.error(error);
		throw error;
	}
};
