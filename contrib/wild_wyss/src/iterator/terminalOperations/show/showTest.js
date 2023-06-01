import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../test/test.js";
import { show }                     from "./show.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY
} from "../../util/testUtil.js";
import {Range} from "../../../range/range.js";
import {ArrayIterator} from "../../constructors/arrayIterator/arrayIterator.js";

const testSuite = TestSuite("Iterator: terminal Operations show");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "show",
    iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation: () => show,
    evalFn:    expected => actual => expected === actual,
    expected:  "[0,1,2,3,4]",
    excludedTests: [
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE
    ]
  })
);

testSuite.add("test boundary value", assert => {
  // Given
  const it = Range(0);

  // When
  const result = show(it);

  // Then
  assert.is(result, "[0]");
});

testSuite.add("test given output length", assert => {
  // Given
  const it     = Range(100);

  // When
  const result = show(it, 2);

  // Then
  assert.is(result, "[0,1]");
});

testSuite.add("test equality of show and toString", assert => {
  // Given
  const it     = Range(10);

  // When
  const result = show(it);

  // Then
  assert.is(result, it.toString());
});


testSuite.add("test exceed default output length (50)", assert => {
  // Given
  const it     = Range(100);

  // When
  const result = show(it);
  /**
   * 2  [braces]
   * 49 [commas]
   * 10 [0-9]
   * 40 [10-49] ( x2 )
   */
  const outputLength = 2 + 49 + 10 + 2 * 40;

  // Then
  assert.is(result.length, outputLength);
});

testSuite.add("test show of an iterator of iterators", assert => {
  // Given
  const it     = ArrayIterator([Range(1), Range(2), Range(3)]);

  // When
  const result = show(it);

  // Then
  assert.is(result, "[[0,1],[0,1,2],[0,1,2,3]]");
});

testSuite.run();
