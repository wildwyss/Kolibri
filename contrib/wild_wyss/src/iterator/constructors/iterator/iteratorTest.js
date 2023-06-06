import { TestSuite }        from "../../../test/test.js";
import { createTestConfig } from "../../util/testUtil.js";
import { Iterator }         from "./iterator.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Iterator: Constructor Iterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "Iterator",
    iterator:  () => Iterator(0, current => current + 1, current => 4 < current),
    expected:  [0,1,2,3,4],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
      TESTS.TEST_INVARIANTS,
    ]
  })
);

testSuite.add("test special case: no increment after done", assert => {
  let result = true;
  const iterator = Iterator(true, _ => result = false, _ => true);
  for (const iteratorElement of iterator) { /* exhausting iterator */ }
  assert.isTrue(result);
});

//TODO: fix
// testSuite.add("test : and", assert => {
//   const result = Range(3).and(el => Range(el));
//   assert.isTrue(arrayEq([0, 0, 1, 0, 1, 2, 0, 1, 2, 3])([...result]));
// });


testSuite.run();