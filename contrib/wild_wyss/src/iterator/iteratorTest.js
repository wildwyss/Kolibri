import { TestSuite } from "../../../../docs/src/kolibri/util/test.js";
import { arrayEq }   from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Tuple }     from "../../../../docs/src/kolibri/stdlib.js";

import {
  Iterator,
  ArrayIterator,
  TupleIterator,
  ConcatIterator, StackIterator,
} from "./iterator.js"

import {
  map, rejectAll,
  retainAll,
} from "./intermediateOperations.js";
import {emptyStack, pop, push, stackEquals} from "../../../p6_brodwolf_andermatt/src/stack/stack.js";
import { fst, snd }    from "../../../../docs/src/kolibri/stdlib.js";

const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

const iteratorSuite = TestSuite("Iterator");

iteratorSuite.add("test typical case: Iterator", assert => {
  const iterator = Iterator(0, current => current + 1, current => current > 5);
  let currentElement = 0;
  for (const iteratorElement of iterator) {
    assert.is(currentElement++, iteratorElement);
  }
  assert.is(arrayEq([])([...iterator]), true);
});

iteratorSuite.add("test special case: no increment after done", assert => {
  let result = true;
  const iterator = Iterator(true, _ => result = false, _ => true);
  for (const iteratorElement of iterator) { /* exhausting iterator */ }
  assert.is(result, true);
});

iteratorSuite.add("test typical case: pipe", assert => {
  const iterator = newIterator(4);
  const piped    = iterator.pipe(
    map(i => i + 1),
    retainAll(el => el % 2 === 0)
  );

  assert.is(arrayEq([2,4])([...piped]), true);
});

iteratorSuite.add("test typical case: ArrayIterator", assert => {
  const  arrayIterator = ArrayIterator([1,2,3]);
  assert.is(arrayEq([1,2,3])([...arrayIterator]), true);
});

iteratorSuite.add("test advanced case: ArrayIterator", assert => {
  const arrayIterator      = ArrayIterator([1,2,3]);
  const pipedArrayIterator = arrayIterator.pipe(
    map(i => i + 1),
    retainAll(el => el % 2 === 0)
  );
  assert.is(arrayEq([2,4])([...pipedArrayIterator]), true);
});

iteratorSuite.add("test typical case: tuple iterator", assert => {
  const [ Triple ]    = Tuple(3);
  const triple        = Triple(1)(2)(3);
  const tupleIterator = TupleIterator(triple);
  assert.is(arrayEq([1,2,3])([...tupleIterator]), true);
});

iteratorSuite.add("test advanced case: tuple iterator", assert => {
  const [ Triple ]    = Tuple(3);
  const triple        = Triple(1)(2)(3);
  const tupleIterator = TupleIterator(triple);
  const pipedTupleIterator = tupleIterator.pipe(
    map(i => i + 1),
    retainAll(el => el % 2 === 0)
  );
  assert.is(arrayEq([2,4])([...pipedTupleIterator]), true);
});

iteratorSuite.add("test typical case: ConcatIterator", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(2);
  const concatIterator = ConcatIterator(it1)(it2);
  assert.is(arrayEq([0,1,2,3,4,0,1,2])([...concatIterator]), true);
});

iteratorSuite.add("test copy: ConcatIterator", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(2);
  const concatIterator = ConcatIterator(it1)(it2);
  const copy = concatIterator.copy();
  for (const _ of concatIterator) { /* Exhausting */ }
  assert.is(arrayEq([0,1,2,3,4,0,1,2])([...copy]), true);
});

iteratorSuite.add("test purity: ConcatIterator", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(2);
  const concatIterator = ConcatIterator(it1)(it2);
  for (const _ of concatIterator) { /* Exhausting */ }
  assert.is(arrayEq([0,1,2,3,4])([...it1]), true);
  assert.is(arrayEq([0,1,2])    ([...it2]), true);
});

iteratorSuite.add("test typical case: stack iterator", assert => {
  const stack = push(push(push(emptyStack)(1))(2))(3);

  const stackIterator = StackIterator(stack);
  assert.is(arrayEq([3,2,1])([...stackIterator]), true);
});

iteratorSuite.add("test copy: StackIterator", assert => {
  const stack = push(push(push(emptyStack)(1))(2))(3);

  const stackIterator = StackIterator(stack);
  const copy = stackIterator.copy();
  for (const _ of stackIterator) { /* Exhausting */ }
  assert.is(arrayEq([3,2,1])([...copy]), true);
});

iteratorSuite.run();