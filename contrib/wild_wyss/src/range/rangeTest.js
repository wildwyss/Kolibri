import { Range }      from "./range.js"
import { TestSuite }  from "../test/test.js";
import { createMonadicSequence, iteratorOf } from "../sequence/util/util.js";

const rangeSuite = TestSuite("Range");

rangeSuite.add("test typical case for of", assert => {
  const result = [];
  for(const value of Range(1)){
    result.push(value);
  }
  assert.is(result.length, 2);
});

rangeSuite.add("test typical case spread", assert => {
  const result = [...Range(2)];
  assert.is(result.length, 3);
});

rangeSuite.add("test typical case deconstruction", assert => {
  const [zero, one, two] = Range(2);
  assert.is(zero, 0);
  assert.is(one,  1);
  assert.is(two,  2);
});

rangeSuite.add("test typical case deconstruction", assert => {
  const result = Array.from(/** @type ArrayLike */ Range(3));
  assert.is(result.length, 4);
});

const testRange = (from, to, step, range, assert) => {
  const rangeIterator = iteratorOf(range);
  for (let expected = from; expected <= to; expected += step) {

    const { done, value } = rangeIterator.next();
    assert.is(value, expected);
    assert.isTrue(!done)
  }
  assert.isTrue(rangeIterator.next().done)
};

const testRangeNegativeStepSize = (from, to, step, range, assert) => {
  const rangeIterator = iteratorOf(range);
  for (let expected = from; expected >= to; expected += step) {
    const { done, value } = rangeIterator.next();
    assert.is(value, expected);
    assert.isTrue(!done)
  }
  assert.isTrue(rangeIterator.next().done)
};

rangeSuite.add("test simple Range(2,3)", assert =>
  testRange(2, 3, 1, Range(2, 3), assert));

rangeSuite.add("test simple Range(3,2,1)", assert => {
  testRange(2, 3, 1, Range(3,2,1), assert)
});

rangeSuite.add("test break Range(7)", assert => {
  const range = Range(7);
  const result = [];

  // noinspection LoopStatementThatDoesntLoopJS
  for (const value of range) {
    result.push(value);
    break;
  }
  assert.is(result.length, 1);
  assert.is(result[0], 0);
});


rangeSuite.add("test use range twice", assert => {
  const range = Range(0);

  const [zero] = range;
  assert.is(zero, 0);

  const [repeat] = range;
  assert.is(repeat, 0);
});

rangeSuite.add("test continue and break", assert => {
  for (const value of Range(Number.MAX_VALUE)) {
    if(4 > value) continue; // dropWhile value < 4
    if(4 < value) break;    // take(1)
    assert.is(value, 4);
  }
});

rangeSuite.add("test running out of range", assert => {
  const range = Range(2);
  const rangeIterator = iteratorOf(range);

  rangeIterator.next();
  const rangeIterable = createMonadicSequence(() => rangeIterator);
  for (const _ of rangeIterable) { /* Range gets exhausted. */ }

  assert.is(rangeIterator.next().done, true);
});

rangeSuite.add("test negative Range(4, 6,- 2)", assert =>
  testRangeNegativeStepSize(6, 4, -2, Range(4, 6, -2), assert));

rangeSuite.add("test negative Range(6, 4, -2)", assert =>
  testRangeNegativeStepSize(6, 2, -2, Range(6, 2, -2), assert));

rangeSuite.add("test negative Range(0, -2, -1)", assert =>
  testRangeNegativeStepSize(0, -2, -1, Range(0, -2, -1), assert));

rangeSuite.add("test negative Range(-12, -2, -2)", assert =>
  testRangeNegativeStepSize(-2, -12, -2, Range(-12, -2, -2), assert));

// all combinations
rangeSuite.add("test of all combinations", assert => {
  testRange(0, 5, 1, Range(0, 5, 1), assert);
  testRange(0, 5, 1, Range(5, 0, 1), assert);

  testRange(-5, 5, 1, Range(-5, 5, 1), assert);
  testRange(-5, 5, 1, Range(5, -5, 1), assert);

  testRange(-5, 0, 1, Range(-5, 0, 1), assert);
  testRange(-5, 0, 1, Range(0, -5, 1), assert);

  testRangeNegativeStepSize(5, 0, -1, Range(0, 5, -1), assert);
  testRangeNegativeStepSize(5, 0, -1, Range(5, 0, -1), assert);

  testRangeNegativeStepSize(5, -5, -1, Range(-5, 5, -1), assert);
  testRangeNegativeStepSize(5, -5, -1, Range(5, -5, -1), assert);

  testRangeNegativeStepSize(0, -5, -1, Range(-5, 0, -1), assert);
  testRangeNegativeStepSize(0, -5, -1, Range(0, -5, -1), assert);
});

rangeSuite.run();