import * as path from 'path';

export const getBasePath = () => path.resolve(__dirname, '..');

export const getSourcePath = () => path.resolve(getBasePath(), 'src');

export const getTemplatePath = () => path.resolve(getSourcePath(), 'templates');

export const getTemplatePathByName = (name: string) => path.resolve(getTemplatePath(), name);
