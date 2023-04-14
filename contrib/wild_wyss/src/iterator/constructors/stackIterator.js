import { pop, emptyStack, stackEquals } from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import { convertToJsBool }              from "../../logger/lamdaCalculus.js";

/**
 * Creates an {@link IteratorType} on top of the given {@link stack}
 * @param { stack } stack
 * @template _T_
 * @returns IteratorType<_T_>
 * @constructor
 * @example
 * const stack = push(push(push(emptyStack)(1))(2))(3);
 * const stackIterator = StackIterator(stack);
 * console.log(...stackIterator); // 3, 2, 1
 */
const StackIterator = stack => {
  let internalStack = stack;

  const next = () => {
    const stackTuple  = pop(internalStack);
    const value       = stackTuple(snd);
    const done        = convertToJsBool(stackEquals(emptyStack)(internalStack));
    internalStack     = stackTuple(fst);

    return { value, done }
  };

  const copy = () => StackIterator(internalStack);

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
  }
};

