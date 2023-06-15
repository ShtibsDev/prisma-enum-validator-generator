import { generatorHandler } from '@prisma/generator-helper';
import generate from './generate';

generatorHandler({
	onManifest: () => ({
		defaultOutput: 'enum-validation.ts',
		prettyName: 'Enum Validator',
		requiresGenerators: ['client'],
	}),
	onGenerate: generate,
});
