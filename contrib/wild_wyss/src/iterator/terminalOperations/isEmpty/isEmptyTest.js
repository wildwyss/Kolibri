import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../test/test.js";
import { take }                     from "../../operators/take/take.js";
import { isEmpty }                  from "./isEmpty.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal Operations isEmpty");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "isEmpty",
    iterator:  () => take(0)(newIterator(UPPER_ITERATOR_BOUNDARY)),
    operation: () => isEmpty,
    evalFn:    expected => actual => expected === actual,
    expected:  true,
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

testSuite.add("test typical case: isEmpty ist not empty", assert => {
  // Given
  const iterator = newIterator(4);

  // When
  const result   = isEmpty(iterator);

  // Then
  assert.is(result, false);
});

testSuite.run();