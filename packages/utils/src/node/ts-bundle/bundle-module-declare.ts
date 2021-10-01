import { ModuleDeclarationKind, Project, SyntaxKind } from 'ts-morph';

interface FileOptions {
  // 声明文件路径
  path: string;

  // 声明文件模块名称
  moduleName: string;
}

export const bundleModuleDeclare = (fileOptions: FileOptions[]) => {
  const project = new Project();

  const content = [];

  fileOptions.forEach(file => {
    const source = project.addSourceFileAtPath(file.path);
    source.forEachDescendant(item => {
      if (item.getKind() === SyntaxKind.DeclareKeyword) {
        // 删除即可
        item.replaceWithText('');
      }
    });

    const baseStatements = source.getStructure().statements;

    source.getStatements().forEach(res => res.remove());

    source.addModule({
      name: `'${file.moduleName}'`,
      declarationKind: ModuleDeclarationKind.Module,
      hasDeclareKeyword: true,
      statements: baseStatements,
    });

    source.formatText();
    content.push(`// module name: ${file.moduleName}\n\n`);
    content.push(source.getText());
    content.push('\n');
  });

  return content.join('');
};
