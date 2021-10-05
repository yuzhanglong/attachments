import * as plop from 'node-plop';
import * as path from 'path';
import {
  createAddConfigAction,
  createAddManyTemplatesAction, getTemplatePath,
} from '../../utils';


enum MICRO_FE_TYPE {
  BASE_APP = 'Base App',
  MICRO_APP = 'Micro App'
}


const project = function(plop: plop.NodePlopAPI) {
  const basePath = path.resolve(process.cwd(), '{{projectName}}');
  const templatePath = path.resolve(getTemplatePath(), 'micro-frontend');

  const CORE_VERSION = '0.1.0';

  plop.setGenerator('micro frontend generator', {
    description: 'generate a micro app or base app by micro frontend generator',
    prompts: [
      {
        type: 'input',
        name: 'projectName',
        message: 'Please enter the name of the package:',
        validate: (v: any) => {
          if (!v || typeof v !== 'string') {
            return 'invalid project name, the name cannot be empty!';
          }
          if (!v.match(/^[^\s]*$/)) {
            return 'invalid project name, the name cannot not contain space!';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'appType',
        message: 'Please select the type of project (base-app or micro-app):',
        choices: [
          {
            value: MICRO_FE_TYPE.BASE_APP,
          },
          {
            value: MICRO_FE_TYPE.MICRO_APP,
          },
        ],
      },
    ],
    actions: function(data) {
      const isBaseApp = data.appType === MICRO_FE_TYPE.BASE_APP;
      return [
        // 基本代码模板
        createAddManyTemplatesAction(
          `micro-frontend/${isBaseApp ? 'base-app' : 'micro-app'}`,
          basePath,
        ),

        // eslint config
        createAddConfigAction('eslintrc.js.hbs', path.resolve(basePath, '.eslintrc.js')),

        // prettier config
        createAddConfigAction('prettierrc.json.hbs', path.resolve(basePath, '.prettierrc.json')),

        // shared
        {
          type: 'add',
          path: path.resolve(basePath, '.gitignore'),
          templateFile: path.resolve(templatePath, 'shared', 'gitignore.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(basePath, 'package.json'),
          templateFile: path.resolve(templatePath, 'shared', 'package.json.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(basePath, 'tsconfig.json'),
          templateFile: path.resolve(templatePath, 'shared', 'tsconfig.json.hbs'),
        },
      ];
    },
  });

  plop.setHelper('coreVersion', () => {
    return CORE_VERSION;
  });
};

export default project;

