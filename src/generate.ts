import { DMMF, GeneratorOptions } from '@prisma/generator-helper';
import { writeFile } from 'fs/promises';

function extractEnums(dataModel: DMMF.Datamodel): string[] {
	const enums = dataModel.enums.map((e) => e.name);

	const enumUsage: Record<string, number> = {};
	enums.forEach((e) => (enumUsage[e] = 0));

	for (const model of dataModel.models) {
		for (const field of model.fields) {
			if (enums.includes(field.type)) enumUsage[field.type]++;
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

		let output = options.generator.output?.value || `./prisma/enum-validators.${isTs ? 'ts' : 'js'}`;

		if (!isTs && !output.endsWith('.js')) {
			output = `${output.substring(0, output.lastIndexOf('.'))}.js`;
		}

		const enums = extractEnums(options.dmmf.datamodel);
		const fileContent = generateFileContent(enums, isTs);

		await writeFile(output, fileContent);
	} catch (error) {
		console.error(error);
		throw error;
	}
};
