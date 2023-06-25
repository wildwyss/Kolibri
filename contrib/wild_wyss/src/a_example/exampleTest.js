import {TestSuite} from "../test/test.js";
import {Range}     from "../range/range.js";
import {map}      from "../sequence/operators/map/map.js";
import {head}      from "../sequence/terminalOperations/head/head.js";

import {from}      from "../jinq/jinq.js";
import {retainAll} from "../sequence/operators/retainAll/retainAll.js";

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
            Range(1, Number.MAX_VALUE).and ( z =>
                Range(1, z).and (y =>
                    map (x => [x,y,z]) (Range(1,y))
               )
           )
        );

    assert.iterableEq([3,4,5], /** @type { Iterable } */ head (result));
});

exampleSuite.run();
