import { isFunction } from 'lodash';

type HTMLElementWithCss = HTMLElement & {
  readonly style?: CSSStyleDeclaration;
};

// 需要忽略的功能性标签
export const IGNORE_TAGS = ['SCRIPT', 'STYLE', 'META', 'HEAD'];

/**
 * 获取 DOM 布局分数
 *
 * @author yuzhanglong
 * @date 2021-11-07 11:58:16
 * @param element 根 dom 元素
 * @param depth 当前元素的深度
 * @param isPositionCheckNeeded 是否需要验证位置的合法性，如果它的位置不在视口内或者高度、宽度为 0，则这个元素不可见，返回 0 分
 * @param onGetScore 在获取得分之后做些什么（使用者可忽略此 API，主要用于单测方便查看效果）
 */
export const getDomLayoutScore = (
  element: HTMLElementWithCss,
  depth: number,
  isPositionCheckNeeded: boolean,
  onGetScore?: (element: HTMLElementWithCss, score: number, depth: number, isPositionCheckNeeded: boolean) => void
) => {
  const { tagName, children } = element;

  if (!element || IGNORE_TAGS.includes(tagName)) {
    return 0;
  }

  const childNodes = Array.from(children || []) as HTMLElementWithCss[];

  const childrenScore = childNodes.reduceRight((siblingScore, currentNode) => {
    // 如果它的右子树兄弟分数存在，则无需计算 dom 位置
    const score = getDomLayoutScore(currentNode, depth + 1, siblingScore <= 0, onGetScore);
    return siblingScore + score;
  }, 0);

  // 如果有必要的话，会对该元素的位置进行 check
  // 只要有一个子元素在可视区域内（体现为 score > 0），当前元素就重复判断是否在可视区域内，直接计算分数就行
  if (childrenScore <= 0 && isPositionCheckNeeded) {
    if (!isFunction(element.getBoundingClientRect)) {
      return 0;
    }

    const { top, height, width } = element.getBoundingClientRect();

    // 这个 dom 元素是否可见，如果不可见那么这个元素对我们的 fmp 没有影响
    // 主要包括：元素顶部位置是否在视口之下、高度宽度是否小于 0，visibility 是否为 hidden
    // 可参阅 https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view#
    const isUnderView = top > window.innerHeight;
    const isNotVisible = height <= 0 || width <= 0 || element.style.visibility === 'hidden';
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
