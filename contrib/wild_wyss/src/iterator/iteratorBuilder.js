export { IteratorBuilder }
import { emptyIterator, nextOf } from "./iterator.js";

/**
 * A mutable builder for an {@link IteratorType}.
 * This allows the creation of an {@link IteratorType} by generating elements individually and adding them to the Builder (without the copying overhead that comes from using {@link cons}).
 * Using the {@link IteratorBuilderType} allows you to construct {@link IteratorType} with many elements over time.
 * An {@link IteratorBuilderType} has a lifecycle, which starts in a building phase, during which elements can be added, and then transitions to a built phase, after which elements may not be added.
 * The built phase begins when the build() method is called, which creates {@link IteratorType} whose elements are the elements that were added to the {@link IteratorBuilderType}.
 *
 *
 * **Consider the following:**
 * - Passed {@link IteratorType} will not be copied automatically (to save performance). Copy them manually if needed.
 * - Build must only be called at most once. After the first time, build() returns an {@link emptyIterator}.
 * - After build has been called, no elements can be added.
 *
 * @template _T_
 * @param  { IteratorType<_T_> } start
 * @returns { IteratorBuilderType<_T_> }
 * @constructor
 * @example
 * const range = Range(3);
 * const it = IteratorBuilder()
 * .append(range)
 * .append(4)
 * .append(5,6,7)
 * .build();
 * // [...it] === [0,1,2,3,4,5,6,7]
 */
const IteratorBuilder = (start = emptyIterator) => {
  /**
   * @template _T_
   * @type { Array<IteratorType<_T_> | _T_> }
   */
  const elements = [start];
  let built      = false;

  const append  = (...args) => {
    if (!built) elements.push(...args);
    return builder;
  };

  const prepend  = (...args) => {
    if (!built) elements.unshift(...args);
    return builder;
  };

  const build = () => {
    if (built) return emptyIterator;
    built = true;
    return InternalBuilder(elements);
  };

  const builder = { append, prepend, build };

  return builder;
};

/**
 * @template _T_
 * @param   { ( _T_ | IteratorType<_T_>)[] } elements
 * @param   { ?Number }                       currentIdx
 * @returns { IteratorType<_T_> }
 * @constructor
 */
const InternalBuilder = (elements, currentIdx = 0) => {
  let currentIterator = emptyIterator;

  const next = () => {
    // early return, if all elements have been processed
    if (currentIdx === elements.length) return { done: true, value: undefined };

    /**
     * @template _T_
     * @type {_T_| IteratorType<_T_>}
     */
    const value = elements[currentIdx];

    if (!isIterable(value)) {
      currentIdx++;
      return { done: false, value };
    }

    if (currentIterator === emptyIterator) currentIterator = value.copy(); // defensively copy the iterator
    const result = nextOf(currentIterator);

    if (result.done) {
      currentIterator = emptyIterator;
      currentIdx++;
      return next(); // recursive call, might be optimized later
    }

    return result;
  };

  return {
    [Symbol.iterator]: () => ({ next }),
    copy: () => InternalBuilder(elements, currentIdx),
  }
};

/**
 * checks if a given value is iterable
 * @param { any } value
 * @return { boolean }
 */
const isIterable = value => value && value[Symbol.iterator] !== undefined;
