import * as path from 'path';

export const getBasePath = () => path.resolve(__dirname, '..');

export const getSourcePath = () => path.resolve(getBasePath(), 'src');

export const getTemplatePath = () => path.resolve(getSourcePath(), 'templates');

export const getTemplatePathByName = (name: string) => path.resolve(getTemplatePath(), name);

export const createAddConfigAction = (name: string, p: string) => {
  return {
    type: 'add',
    path: p,
    templateFile: path.resolve(getTemplatePath(), name),
  };
};

export const createAddManyTemplatesAction = (name: string, destination: string) => {
  const tsTemplatePath = getTemplatePathByName(name);

  return {
    type: 'addMany',
    destination: destination,
    templateFiles: `${tsTemplatePath}/**/*`,
    base: tsTemplatePath,
  };
};
