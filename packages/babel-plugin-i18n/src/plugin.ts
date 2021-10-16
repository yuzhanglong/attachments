/**
 * File: plugin.ts
 * Description: babel plugin
 * Created: 2021-08-04 23:44:23
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { NodePath, PluginObj, Node } from '@babel/core';
import { StringLiteral } from '@babel/types';

export interface PluginOptions {
  intlKeyPrefix: string;
  include: RegExp;
  compressPrefix?: string;
}

type StringLiteralPath = NodePath<StringLiteral>

function createIntlKeyCommentManager(compressPrefix: string = '$') {
  const mapFromOldKeyToNewKey = new Map<string, string>();

  let count = 0;

  const addCommentAndDoReplacement = (path: StringLiteralPath, oldKey: string, newKey: string) => {
    path.addComment('leading', `{ "oldKey": "${oldKey}", "newKey": "${newKey}" }`);
    // 防止爆栈
    if (oldKey !== newKey) {
      path.replaceWithSourceString(`'${newKey}'`);
    }
  };

  // 生成一个新的 key
  const getNewKey = (oldKey: string, compress: boolean) => {
    // 不压缩 key
    if (!compress) {
      return oldKey;
    }
    // old key 已经在之前出现过，返回之前生成的 key 就可以
    if (mapFromOldKeyToNewKey.has(oldKey)) {
      return mapFromOldKeyToNewKey.get(oldKey);
    }
    count += 1;
    const newKey = `${compressPrefix}${count.toString()}`;
    mapFromOldKeyToNewKey.set(oldKey, newKey);
    return newKey;
  };

  // 注入注释，为后续压缩做好准备
  const addComment = (path: StringLiteralPath, oldKey: string, compress = true) => {
    const newKey = getNewKey(oldKey, compress);
    addCommentAndDoReplacement(path, oldKey, newKey);
  };

  const clear = () => {
    count = 0;
  };


  return {
    addComment,
    clear,
  };
}

// intl 方法 + 字符串直接调用，在其中没有字符串拼接和模板字符串，形如 intl('my-str', {})
function isCallByIntlMethodDirectly(path: NodePath<Node>) {
  const { parent } = path;
  // 1. 父亲节点的类型是否为 CallExpression 且名字是 intl
  const isParentIntlCallExpression = parent.type === 'CallExpression';

  // 2. 全局变量名是否符合我们的要求
  // @ts-ignore
  const isCalleeNamedIntl = parent?.callee?.name === 'intl';

  return isParentIntlCallExpression && isCalleeNamedIntl;
}

function isCallByConditionalExpression(path: StringLiteralPath) {
  const { parent, parentPath } = path;
  // 父表达式是否为三元表达式
  if (!(parent.type === 'ConditionalExpression')) {
    return false;
  }

  // 是否由 intl 方法直接调用
  return isCallByIntlMethodDirectly(parentPath);
}

export function BabelPluginI18n(api: any, options: PluginOptions) {
  const { intlKeyPrefix, compressPrefix } = options;

  const addCommentManager = createIntlKeyCommentManager(compressPrefix);

  const pluginInstance: PluginObj = {
    visitor: {
      StringLiteral(path: StringLiteralPath) {
        const {
          node: {
            value: stringValue,
          },
        } = path;

        // 该字符串匹配了 options 中给予的 prefix
        const isValueStartWithProvidedIntlPrefix = stringValue.startsWith(intlKeyPrefix);
        // 除了全局以外，其作用域内没有 intl
        const isParentScopeHasIntlBinding = path.scope.hasBinding('intl');

        if (isValueStartWithProvidedIntlPrefix && !isParentScopeHasIntlBinding) {
          if (isCallByIntlMethodDirectly(path)) {
            addCommentManager.addComment(path, stringValue);
          } else if (isCallByConditionalExpression(path)) {
            addCommentManager.addComment(path, stringValue);
          } else {
            // 如果只是字符串中包含 prefix，例如将 key 赋值给了一个常量、把 key 放在对象中
            // 为了打包不出错，我们会在产物中保留这些 key
            // 但最佳实践应该是上面两种情况，事实上在实际开发过程中上面两种情况已经足够
            addCommentManager.addComment(path, stringValue, false);
          }
        }
      },
    },
  };
  return pluginInstance;
}
