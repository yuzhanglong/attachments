import { Construction, ConstructionOptions, SerendipityPlugin } from '@attachments/serendipity-core'


@SerendipityPlugin('my-plugin')
export class SerendipityPluginTypeScript {
  @Construction()
  async myConstruction(options: ConstructionOptions) {
    options.appManager.packageManager.mergeIntoCurrent({
      main: 'lib/index.js',
      module: 'esm/index.js',
      scripts: {
        // cjs && esm
        'lib:cjs': 'tsc -p tsconfig.json --target ESNext --module commonjs --outDir lib',
        'lib:esm': 'tsc -p tsconfig.json --target ESNext --module ESNext --outDir esm',
        'build': 'run-p lib:*',
        'clean': 'rimraf lib esm',
        'start': 'tsc -w'
      },
      files: [
        'esm',
        'lib',
        'src'
      ],
      devDependencies: {
        'typescript': '^4.2.3',
        'npm-run-all': '^4.1.5',
        'rimraf': '^3.0.2',
        '@types/node': '^15.12.2'
      }
    })

    await options.renderTemplate('ts-template')
  }
}
