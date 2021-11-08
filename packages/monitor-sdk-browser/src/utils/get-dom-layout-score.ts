import { isFunction } from 'lodash';

type HTMLElementWithCss = HTMLElement & {
  readonly style?: CSSStyleDeclaration;
};

// 需要忽略的功能性标签
export const IGNORE_TAGS = ['SCRIPT', 'STYLE', 'META', 'HEAD'];

/**
 * 递归地获取 DOM 布局分数, 该分数体现了某个节点的复杂程度
 * 注：不在视口中的子元素不会被考虑
 *
 * @author yuzhanglong
 * @date 2021-11-07 11:58:16
 * @param element 根 dom 元素
 * @param depth 当前元素的深度
 * @param isSiblingExists 符合标准的（在视口中）的兄弟节点是否存在
 * @param exact 是否开启精确模式，如果开启，则还会验证元素的宽度和 css 样式属性，确保不在视口内，这可能会影响性能，默认为 false
 * @param onGetScore 在获取得分之后做些什么（使用者可忽略此 API，主要用于单测方便查看效果）
 */
export const getDomLayoutScore = (
  element: HTMLElementWithCss,
  depth: number,
  isSiblingExists: boolean,
  exact?: boolean,
  onGetScore?: (element: HTMLElementWithCss, score: number, depth: number, isPositionCheckNeeded: boolean) => void
) => {
  const { tagName, children } = element;

  if (!element || IGNORE_TAGS.includes(tagName)) {
    return 0;
  }

  const childNodes = Array.from(children || []) as HTMLElementWithCss[];

  const childrenScore = childNodes.reduceRight((siblingScore, currentNode) => {
    // 如果它的右子树兄弟分数存在，则无需计算 dom 位置
    const score = getDomLayoutScore(currentNode, depth + 1, siblingScore > 0, exact, onGetScore);
    return siblingScore + score;
  }, 0);

  // 如果有必要的话，会对该元素的位置进行 check
  // 需要满足的条件：1. 它的相邻兄弟节点没有分数 2. 它不是叶子节点
  const isPositionCheckNeeded = childrenScore <= 0 && !isSiblingExists;

  if (isPositionCheckNeeded) {
    if (!isFunction(element.getBoundingClientRect)) {
      return 0;
    }

    const { top, height, width } = element.getBoundingClientRect();

    // 这个 dom 元素是否可见，如果不可见那么这个元素对我们的 fmp 没有影响
    // https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view#
    // 主要包括：元素顶部位置是否在视口之下
    // 宽度是否小于 0，visibility 是否为 hidden 按理说也应该被考虑进去
    // 但是基于性能考虑默认尽可能忽略它们（在实际应用中这样的 DOM 元素应该也很少碰到，但也提供了 exact 选项进行判断）
    const isUnderView = top > window.innerHeight;
    let isNotVisible: boolean;

    if (!exact) {
      isNotVisible = height <= 0;
    } else {
      isNotVisible = height <= 0 || width <= 0 || element.style.visibility === 'hidden';
    }

    const isElementOutOfView = isUnderView || isNotVisible;
    if (isElementOutOfView) {
      return 0;
    }
  }

  const score = childrenScore + 1 + 0.5 * depth;

  if (isFunction(onGetScore)) {
    onGetScore(element, score, depth, isPositionCheckNeeded);
  }

  return score;
};
