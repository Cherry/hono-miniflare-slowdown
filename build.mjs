import 'dotenv/config';
import NodeModulesPolyfills from '@esbuild-plugins/node-modules-polyfill';
import globalsPolyfills from '@esbuild-plugins/node-globals-polyfill';
import {build} from 'esbuild';
import fs from 'node:fs/promises';

async function buildScript(){
	const result = await build({
		entryPoints: ['./src/index.ts'],
		platform: 'neutral',
		bundle: true,
		sourcemap: true,
		minify: process.argv.includes('--mode=production'),
		outfile: 'dist/index.mjs',
		format: 'esm',
		metafile: process.argv.includes('--metafile'),
		mainFields: ["worker", "browser", "module", "jsnext", "main"],
		plugins: [
			NodeModulesPolyfills.default(),
			globalsPolyfills.default({
				buffer: true,
			}),
		],
		define: {
			'process.env.NODE_ENV': process.argv.includes('--mode=production') ? JSON.stringify('production') : JSON.stringify('development'),
		},
		external: [
			'__STATIC_CONTENT_MANIFEST',
		],
	});
	if(result.metafile){
		await fs.writeFile('./esbuild-meta.json', JSON.stringify(result.metafile, null, 2));
	}
}
buildScript();