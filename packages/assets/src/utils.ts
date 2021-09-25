import * as path from 'path';
import * as execa from 'execa';
import { Plop, run } from 'plop';

export const getBasePath = () => path.resolve(__dirname, '..');

export const getSourcePath = () => path.resolve(getBasePath(), 'src');

export const getLibPath = () => path.resolve(getBasePath(), 'lib');

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


export const runCommand = async (command: string, args?: string[], path?: string): Promise<execa.ExecaChildProcess> => {
  let p = path;
  if (!p) {
    p = process.cwd();
  }
  if (!args) {
    // \s 匹配任何空白字符，包括空格、制表符、换页符
    // eslint-disable-next-line no-param-reassign
    [command, ...args] = command.split(/\s+/);
  }

  return execa(
    command,
    args,
    {
      cwd: p,
      stdio: 'inherit',
    },
  );
};
export const launchPlopByConfig = async (generator: string) => {
  const configPath = path.resolve(getLibPath(), 'configurations', 'node-plop', `${generator}.js`);
  console.log('111');
  await runCommand('plop', ['--plopfile', configPath]);
};
