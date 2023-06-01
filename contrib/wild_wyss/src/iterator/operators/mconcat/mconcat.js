import { createMonadicIterable, iteratorOf } from "../../util/util.js";

export { mconcat }

/**
 * Flatten an {@link Iterable} of {@link Iterable Iterables}.
 *
 * @function
 * @template _T_
 * @pure iterable and sub iterators will not be changed
 * @haskell [a] -> a
 * @param { Iterable<Iterable<_T_>> } iterable -
 * @returns IteratorMonadType<_T_>
 * @example
 * const ranges = map(x => Range(x))(Range(2));
 * const result = mconcat(ranges);
 * console.log(...result);
 * // => Logs 0, 0, 1, 0, 1, 2
 */
const mconcat = iterable => {

  const mconcatIterator = () => {
    /**
     * @template _T_
     * @type { Iterator<_T_> }
     */
    let current = undefined;
    const outer = iteratorOf(iterable);

    const next = () => {
      while (true) {
        if (current === undefined) {
          // if there is no current, get the next sub iterable of the outer iterable
          const nextOfOuter = outer.next();
          if (nextOfOuter.done) return nextOfOuter;
          current = iteratorOf(nextOfOuter.value);
        }

        // grab next value from sub iterable until it is done
        const nextOfCurrent = current.next();
        if (!nextOfCurrent.done) return nextOfCurrent;

        current = undefined;
      }
    };

    return { next }
  };

  return createMonadicIterable(mconcatIterator);
};