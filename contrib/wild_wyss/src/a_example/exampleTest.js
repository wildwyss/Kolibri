import {TestSuite} from "../test/test.js";
import {Range}     from "../range/range.js";
import {map}       from "../sequence/operators/map/map.js";
import {head}      from "../sequence/terminalOperations/head/head.js";

import {from}         from "../jinq/jinq.js";
import {retainAll}    from "../sequence/operators/retainAll/retainAll.js";
import {nil}          from "../sequence/constructors/nil/nil.js";
import {intersperse}  from "./util.js";

const exampleSuite = TestSuite("Example Suite");

exampleSuite.add("Pythagorean Triples 1", assert => {

    const result =
        from(Range(1, Number.MAX_VALUE))     // infinite production
        .inside( z =>
            from(Range(1, z))
            .inside( y =>
                from(Range(1, y))            // very wasteful
                .map( x => [x,y,z] )
                .result()
            )
            .result()
        )
        .where( ([x,y,z]) => x * x + y * y === z * z)
        .result();

    assert.iterableEq([3,4,5], /** @type { Iterable } */ head (result));  // late pruning

});

exampleSuite.add("Pythagorean Triples 2", assert => {

    const result =
        from(Range(1, Number.MAX_VALUE))     // infinite production
        .inside( x =>
            from(Range(1, x))
            .map( y => [x, y, x*x + y*y])
            .result()
        )
        .where ( ([_x,_y,z]) => Math.floor(Math.sqrt(z)) === Math.sqrt(z))
        .select( ([ x, y,z]) => [y, x, Math.sqrt(z)])
        .result();

    assert.iterableEq([3,4,5], /** @type { Iterable } */ head (result));  // late pruning
});

exampleSuite.add("Pythagorean Triples 3", assert => {

    const result =
        retainAll( ([x,y,z]) => x*x + y*y === z*z ) (
            Range(1, Number.MAX_VALUE)
            .and ( z => Range(1, z)
            .and ( y => map (x => [x,y,z]) (Range(1,y))
        )));

    assert.iterableEq([3,4,5], /** @type { Iterable } */ head (result));
});

exampleSuite.add("intersperse", assert => {
    assert.iterableEq( nil,                     intersperse (42) (nil));
    assert.iterableEq([0],                      intersperse (42) (Range(0)));
    assert.iterableEq([0, 42, 1, 42, 2, 42, 3], intersperse (42) (Range(3)));
});

const iterateAsync = executorSequence => {
    if (isEmpty(executorSequence)) return;
    // noinspection JSCheckFunctionSignatures // it appears that ExecutorFunction is not known as the Promise Parameter Type
    new Promise(head(executorSequence)).then( _ => iterateAsync(drop (1) (executorSequence)));
};


exampleSuite.run();
