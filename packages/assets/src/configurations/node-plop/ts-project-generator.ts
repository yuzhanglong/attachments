import * as path from 'path';
import * as plop from 'plop';
import { getTemplatePath } from '../../const';

const project = function(plop: plop.NodePlopAPI) {
  plop.setGenerator('typescript package', {
    description: 'generate a typescript package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Please enter the name of the package:',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: path.resolve(process.cwd(), '{{name}}'),
        templateFiles: `${path.resolve(getTemplatePath(), 'typescript-project')}/**/*`,
        base: `${path.resolve(getTemplatePath(), 'typescript-project')}`,
      },
    ],
  });
  plop.setHelper('package', (pkg) => {
    return `@attachments/${pkg}`;
  });
};

export default project;

