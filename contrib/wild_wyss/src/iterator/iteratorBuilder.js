import {createMonadicIterable, iteratorOf, nextOf} from "./util/util.js";

export { IteratorBuilder }
import { nil } from "./iterator.js";



const ALREADY_BUILT_ERROR_MESSAGE = "Unsupported operation: Iterator has already been built!";

/**
 * A mutable builder for an {@link IteratorMonadType}.
 * This allows the creation of an {@link IteratorMonadType} by generating elements individually and adding them to the Builder (without the recursion overhead that comes from using {@link cons}).
 * Using the {@link IteratorBuilderType} allows you to construct {@link IteratorMonadType} with many elements over time.
 * An {@link IteratorBuilderType} has a lifecycle, which starts in a building phase, during which elements can be added, and then transitions to a built phase, after which elements may not be added.
 * The built phase begins when the `build()` method is called, which creates {@link IteratorMonadType} whose elements are the elements that were added to the {@link IteratorBuilderType}.
 *
 *
 * **Consider the following:**
 * - Build must only be called at most once. After the first time, `build()` returns an {@link nil}.
 * - After build has been called, no elements can be added.
 *
 * @template _T_
 * @param  { Iterable<_T_> } start
 * @returns { IteratorBuilderType<_T_> }
 * @throws { string } if any method on this {@link IteratorBuilderType} is called when the iterator is in built phase.
 * @constructor
 * @example
 * const range = Range(3);
 * const it = IteratorBuilder()
 * .append(range)
 * .append(4)
 * .append(5,6,7)
 * .build();
 *
 * console.log(...it);
 * // => Logs 0,1,2,3,4,5,6,7
 */
const IteratorBuilder = (start = nil) => {
  /**
   * @template _T_
   * @type { Array<Iterable<_T_> | _T_> }
   */
  const elements = [start];
  let built      = false;

  const append  = (...args) => {
    checkIfBuilt();
    elements.push(...args);
    return builder;
  };

  const prepend  = (...args) => {
    checkIfBuilt();
    elements.unshift(...args);
    return builder;
  };

  const build = () => {
    checkIfBuilt();
    built = true;
    return InternalIterator(elements);
  };

  const builder = { append, prepend, build };

  const checkIfBuilt = () => {
    if (built) {
      throw new Error(ALREADY_BUILT_ERROR_MESSAGE);
    }
  };

  return builder;
};

/**
 * Creates an {@link IteratorMonadType } from the given elements
 * @template _T_
 * @param   { ( _T_ | Iterable<_T_>)[] }  elements   - these elements will be iterated
 * @returns { IteratorMonadType<_T_> }
 * @constructor
 */
const InternalIterator = elements => {

  const internalIterator = () => {
    let currentIdx = 0;
    let currentIterator = undefined;

    const next = () => {
      while (isIterable(elements[currentIdx])) {
        if (currentIterator === undefined) {
          // process next iterator
          currentIterator = iteratorOf(elements[currentIdx]);
        }

        const result = currentIterator.next();

        if (result.done) {
          currentIterator = undefined;
          currentIdx++;
        } else {
          return result;
        }
      }

      // if all elements of the iterator have been processed
      if (currentIdx === elements.length) {
        return { done: true, value: undefined };
      }

      return { done: false, value: elements[currentIdx++] };
    };

    return { next };
  };

  return createMonadicIterable(internalIterator);
};

/**
 * checks if a given value is iterable
 * @param { any } value
 * @return { boolean }
 */
const isIterable = value => value && value[Symbol.iterator] !== undefined;
