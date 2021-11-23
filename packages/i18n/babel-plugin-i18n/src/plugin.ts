/**
 * File: plugin.ts
 * Description: babel plugin
 * Created: 2021-08-04 23:44:23
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { NodePath, PluginObj, Node } from '@babel/core';
import { PluginOptions, StringLiteralPath } from './types';

/**
 * intl 方法 + 字符串直接调用，在其中没有字符串拼接和模板字符串，形如 intl('my-str', {})
 *
 * @author yuzhanglong
 * @date 2021-11-23 23:42:00
 * @param path 目标节点的 path 属性
 */
function isCallByIntlMethodDirectly(path: NodePath<Node>) {
  const { parent } = path;
  // 1. 父亲节点的类型是否为 CallExpression 且名字是 intl(或者配置的 intlCallee)
  const isParentIntlCallExpression = parent.type === 'CallExpression';

  // 2. 全局变量名是否符合我们的要求
  // @ts-ignore
  const isCalleeNamedIntl = parent?.callee?.name === 'intl';

  return isParentIntlCallExpression && isCalleeNamedIntl;
}

/**
 * 是否被三元表达式调用
 *
 * @author yuzhanglong
 * @date 2021-11-23 23:42:00
 * @param path 目标节点的 path 属性
 */
function isCallByConditionalExpression(path: StringLiteralPath) {
  const { parent, parentPath } = path;
  // 父表达式是否为三元表达式
  if (!(parent.type === 'ConditionalExpression')) {
    return false;
  }
  // 是否由 intl 方法直接调用
  return isCallByIntlMethodDirectly(parentPath);
}

/**
 * 为一个 NodePath 节点增加注释
 *
 * @author yuzhanglong
 * @date 2021-11-23 23:41:19
 */
export const addComment = (path: NodePath<Node>, comment: string) => {
  path.addComment('leading', comment);
};

/**
 * babel plugin 入口实例
 *
 * @author yuzhanglong
 * @date 2021-11-23 23:41:38
 */
export function BabelPluginI18n(api: any, options: PluginOptions) {
  const { intlKeyPrefix, intlCallee } = options;

  const pluginInstance: PluginObj = {
    visitor: {
      StringLiteral(path: StringLiteralPath) {
        const {
          node: { value: stringValue },
        } = path;

        // 该字符串匹配了 options 中给予的 prefix
        const isValueStartWithProvidedIntlPrefix = stringValue.startsWith(intlKeyPrefix);

        // 除了全局以外，其作用域内没有 intl
        const isParentScopeHasIntlBinding = path.scope.hasBinding(intlCallee || 'intl');

        if (isValueStartWithProvidedIntlPrefix && !isParentScopeHasIntlBinding) {
          if (isCallByIntlMethodDirectly(path)) {
            addComment(path, `i18n-key-to-compress: "${stringValue}" `);
          } else if (isCallByConditionalExpression(path)) {
            addComment(path, `i18n-key-to-compress: "${stringValue}" `);
          } else {
            // 一些动态性的情况，例如将 key 赋值给了一个常量、把 key 放在对象中
            // 为了打包不出错，我们会在产物中保留这些 key
            // 但最佳实践应该是上面两种情况，事实上在实际开发过程中上面两种情况已经足够
            addComment(path, `i18n-key-compress-ignore: "${stringValue}" `);
          }
        }
      },
    },
  };

  return pluginInstance;
}
