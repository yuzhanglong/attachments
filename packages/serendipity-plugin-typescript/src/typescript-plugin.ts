import { Construction, SerendipityPlugin } from '@attachments/serendipity-core'
import { ConstructionOptions } from '@attachments/serendipity-core/lib/types/pluginExecute'


@SerendipityPlugin('my-plugin')
class SerendipityPluginTypeScript {
  @Construction()
  myConstruction(options: ConstructionOptions) {
    options.appManager.packageManager.mergeIntoCurrent({
      main: 'lib/index.js',
      module: 'esm/index.js',
      scripts: {
        // cjs && esm
        'lib:cjs': 'tsc -p tsconfig.json --target ESNext --module commonjs --outDir lib',
        'lib:esm': 'tsc -p tsconfig.json --target ESNext --module ESNext --outDir esm',
        'build': 'run-p lib:*',
        'clean': 'rimraf lib esm'
      },
      files: [
        'esm',
        'lib',
        'src'
      ],
      devDependencies: {
        'typescript': '^4.2.3',
        'npm-run-all': '^4.1.5',
        'rimraf': '^3.0.2'
      }
    })

    options.renderTemplate('ts-template')
  }
}

export default SerendipityPluginTypeScript
