import * as path from 'path';
import type * as plop from 'node-plop';
import { createAddConfigAction, createAddManyTemplatesAction } from '../../utils';

const project = function (plop: plop.NodePlopAPI) {
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
      // ts basic template
      createAddManyTemplatesAction('typescript-project', path.resolve(process.cwd(), '{{project-name}}')),
      // eslint config
      createAddConfigAction('eslintrc.js.hbs', path.resolve(process.cwd(), '{{project-name}}', '.eslintrc.js')),
      // jest config
      createAddConfigAction('jest.config.js.hbs', path.resolve(process.cwd(), '{{project-name}}', 'jest.config.js')),
    ],
  });

  plop.setHelper('package', (name) => {
    return `@attachments/${name}`;
  });
};

export default project;
