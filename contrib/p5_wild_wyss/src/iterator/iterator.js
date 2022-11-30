

export { Iterator }


/** @typedef  IteratorType
 * @template _T_
 * @property { () => { next: () => IteratorResult } }            [Symbol.iterator]
 * @property { (callback:Consumer<_T_>)         => void }              forEach   - executes the callback for each element and exhausts the iterator
 * @property { (predicate:Predicate<_T_>)       => IteratorType<_T_> } dropWhile - proceed with the iteration where the predicate no longer holds
 * @property { (count:Number)                   => IteratorType<_T_> } drop      - jump over so many elements
 * @property { (predicate:Predicate<_T_>)       => IteratorType<_T_> } takeWhile - proceed with the iteration until the predicate becomes true
 * @property { (count:Number)                   => IteratorType<_T_> } take      - stop after so many elements
 * @property { ()                               => IteratorType<_T_> } copy      - TODO => IteratorTest with side effect
 * @property { (mapper:Functor<_T_, *>)         => IteratorType<_T_> } map       - transform each element
 * @property { (predicate:Predicate<_T_>)       => IteratorType<_T_> } retainAll - only keep elements which fulfill the predicate
 * @property { (predicate:Predicate<_T_>)       => IteratorType<_T_> } rejectAll - ignore elements which fulfill the predicate
 * @property { (op:BinaryOperation<_T_>, _T_)   => _T_ }               reduce    - Performs a reduction on the elements, using the provided start value and an accumulation function, and returns the reduced value.
 */

/**
 * @template _T_
 * @param { _T_ }               value
 * @param { (_T_) => _T_ }      incrementFunction
 * @param { (_T_) => Boolean }  stopDetected - returns true if the iteration should stop
 * @return { IteratorType<_T_> }
 * @constructor
 */
const Iterator = (value, incrementFunction, stopDetected) => {

  let next = () => {
    const current = value;
    const done    = stopDetected(current);
    if (!done) value = incrementFunction(value);

    return { done, value: current };
  };

  const forEach = consume => {
    for (const elem of iteratorObject) {
      consume(elem);
    }
  };

  const dropWhile = predicate => {
    while (predicate(value) && !stopDetected(value)) next();

    return iteratorObject;
  };

  const drop = count => {
    let i = 0;
    return dropWhile(_ => i++ < count);
  };

  const takeWhile = predicate => {
    const oldDetected = stopDetected;
    stopDetected = value => oldDetected(value) || !predicate(value);
    return iteratorObject;
  };

  const take = count => {
    let i = 0;
    return takeWhile(_ => i++ < count);
  };

  const copy = () => Iterator(value, incrementFunction, stopDetected);

  const map = mapper => {
    const oldNext = next;
    next = () => {
      const  { done, value } = oldNext()
      return { done, value: mapper(value) };
    }
    return iteratorObject;
  };

  const filter = predicate => {
    const oldNext = next;
    next = () => {
      const {done, value} = oldNext();
      const result = predicate(value) || done;
      return result ? ({done, value}): next();
    }
    return iteratorObject;
  };

  const retainAll = filter;

  const rejectAll = predicate => filter(val => !predicate(val));

  const reduce = (reducer, start) => {
    let accumulator = start;
    for (const current of iteratorObject) {
      accumulator = reducer(accumulator, current);
    }
    return accumulator;
  };

  const iteratorObject = {
    [Symbol.iterator]: () => ({ next }),
    forEach,
    dropWhile,
    drop,
    takeWhile,
    take,
    map,
    retainAll,
    rejectAll,
    reduce,
    copy,
  };

  return iteratorObject;
};
