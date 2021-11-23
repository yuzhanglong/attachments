import { NodePath } from '@babel/core';
import { StringLiteral } from '@babel/types';

export interface PluginOptions {
  intlKeyPrefix: string;
  include?: RegExp;
  intlCallee?: string;
}

export type StringLiteralPath = NodePath<StringLiteral>;
