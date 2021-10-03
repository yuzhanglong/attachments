import * as path from 'path';
import { runCommand } from '@attachments/utils/lib/node/run-command';

export const getBasePath = () => path.resolve(__dirname, '..');

export const getSourcePath = () => path.resolve(getBasePath(), 'src');

export const getLibPath = () => path.resolve(getBasePath(), 'lib');

export const getTemplatePath = () => path.resolve(getSourcePath(), 'templates');

export const getTemplatePathByName = (name: string) => path.resolve(getTemplatePath(), name);

export const createAddConfigAction = (name: string, p: string) => {
  return {
    type: 'add',
    path: p,
    templateFile: path.resolve(getTemplatePath(), 'common', name),
  };
};

export const createAddManyTemplatesAction = (name: string, destination: string) => {
  const tsTemplatePath = getTemplatePathByName(name);

  return {
    type: 'addMany',
    destination: destination,
    templateFiles: `${tsTemplatePath}/**/*`,
    base: tsTemplatePath
  };
};


export const launchPlopByConfig = async (generator: string) => {
  const configPath = path.resolve(getLibPath(), 'configurations', 'node-plop', `${generator}.js`);
  await runCommand('plop', ['--plopfile', configPath]);
};
