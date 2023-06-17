import { generatorHandler } from '@prisma/generator-helper';
import generate from './generate';

generatorHandler({
	onManifest: () => ({
		defaultOutput: 'enums-validators.ts',
		prettyName: 'Enums Validators',
	}),
	onGenerate: generate,
});
