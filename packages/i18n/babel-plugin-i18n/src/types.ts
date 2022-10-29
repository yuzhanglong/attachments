import type { NodePath } from '@babel/core';
import type { StringLiteral } from '@babel/types';

export interface PluginOptions {
  intlKeyPrefix: string
  include?: RegExp
  intlCallee?: string
}

export type StringLiteralPath = NodePath<StringLiteral>;
