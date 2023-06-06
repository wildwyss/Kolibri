import { TestSuite }            from "../../../test/test.js";
import { createTestConfig }     from "../../util/testUtil.js";
import { takeWithoutCopy  }     from "../../util/util.js";
import { SquareNumberIterator } from "./squareNumberIterator.js";
import { arrayEq }              from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Iterator: Constructor SquareNumberIterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "SquareNumberIterator",
    iterator: SquareNumberIterator,
    expected: [1, 4, 9, 16, 25],
    evalFn:   expected => actual => {
      const expectedArray = takeWithoutCopy(5)(expected);
      const actualArray   = takeWithoutCopy(5)(actual);
      return arrayEq(expectedArray)(actualArray);
    },
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
      TESTS.TEST_INVARIANTS,
    ]
  })
);

testSuite.run();