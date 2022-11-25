export { Range }

/**
 *
 * @constructor
 * @param { Number } firstBoundary
 * @param { Number } secondBoundary
 * @param { Number } step
 * @returns {
 *    {
 *      [Symbol.iterator]: () => { next: () => IteratorResult }
 *    }
 *  }
 *  @example
 *  const [zero, one, two, three] = Range(3);
 *  const [five, three, one]      = Range(1, 5, -2);
 *  const [three, four, five]     = Range(5, 3);
 */
const Range = (firstBoundary, secondBoundary = 0, step = 1) => {
  const stepIsNegative  = 0 > step;
  let   done            = false;
  let   [current, end]  = normalize(firstBoundary, secondBoundary, stepIsNegative);

  const next = () => {
    if (done) return { done, value: current };

    const tmp = current;
    current += step;

    done = hasReachedEnd(stepIsNegative, current, end)
    return { done: false, value: tmp };
  };

  return {
    [Symbol.iterator]: () => ({ next })
  };
};

/**
 *
 * @param  { Number } a
 * @param  { Number } b
 * @return { [Number, Number] }
 */
const sort = (a, b) => {
  if (a < b) return [a,b];
  else return [b,a];
};

/**
 *
 * @param   { Boolean } stepIsNegative
 * @param   { Number }  next
 * @param   { Number }  end
 * @return  { boolean }
 */
const hasReachedEnd = (stepIsNegative, next, end) =>
    stepIsNegative ? next < end : next > end;

/**
 *
 * @param   { Number }  from
 * @param   { Number }  to
 * @param   { Boolean } stepIsNegative
 * @return  { [Number, Number] }
 */
const normalize = (from, to, stepIsNegative) => {
  const [min, max] = sort(from, to);
  let next = min;
  let end  = max;
  if (stepIsNegative) {
    next = max;
    end = min;
  }
  return [next, end];
};


