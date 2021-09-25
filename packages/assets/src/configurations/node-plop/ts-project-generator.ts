import * as plop from 'plop';
import * as path from 'path';
import { getTemplatePath, getTemplatePathByName } from '../../utils';

const project = function(plop: plop.NodePlopAPI) {
  const tsTemplatePath = getTemplatePathByName('typescript-project');

  plop.setGenerator('typescript package', {
    description: 'generate a typescript package',
    prompts: [
      {
        type: 'input',
        name: 'project-name',
        message: 'Please enter the name of the package:',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: path.resolve(process.cwd(), '{{project-name}}'),
        templateFiles: `${tsTemplatePath}/**/*`,
        base: tsTemplatePath,
      },
      {
        type: 'add',
        path: path.resolve(process.cwd(), '{{project-name}}', '.eslintrc.js'),
        templateFile: path.resolve(getTemplatePath(), 'eslintrc.js'),
      },
      {
        type: 'add',
        path: path.resolve(process.cwd(), '{{project-name}}', 'jest.config.js'),
        templateFile: path.resolve(getTemplatePath(), 'eslintrc.js'),
      },
    ],
  });

  plop.setHelper('package', (name) => {
    return `@attachments/${name}`;
  });
};

export default project;

