import {drop}         from "../sequence/operators/drop/drop.js";
import {cons}         from "../sequence/operators/cons/cons.js";
import {PureSequence} from "../sequence/constructors/pureSequence/pureSequence.js";
import {isEmpty}      from "../sequence/terminalOperations/isEmpty/isEmpty.js";
import {head}         from "../sequence/terminalOperations/head/head.js";
import {zip}          from "../sequence/operators/zip/zip.js";
import {cycle}        from "../sequence/operators/cycle/cycle.js";
import {retainAll}    from "../sequence/operators/retainAll/retainAll.js";
import {map}          from "../sequence/operators/map/map.js";

export { intersperse, iterateAsync, action, wait, keepEven }

const intersperse = inner => sequence => drop (1) (sequence.and( value => cons (inner) (PureSequence(value))));

const iterateAsync = executorSequence => {
    if (isEmpty(executorSequence)) return;
    // noinspection JSCheckFunctionSignatures // it appears that ExecutorFunction is not known as the Promise Parameter Type
    new Promise(head(executorSequence)).then( _ => iterateAsync(drop (1) (executorSequence)));
};

const action = f => x => (resolve, reject) => {
    try {
        f(x);
        resolve();
    } catch (e) {
        console.error(e);
        reject(e);
    }
};

const wait = millis => (resolve, _reject) => setTimeout( _=> resolve(), millis);

const keepEven = sequence =>
    sequence.pipe(
        zip       ( cycle ([true, false])),             // pair with true/false
        retainAll ( ([keep, _val]) => keep ),           // keep all even entries
        map       ( ([_keep, val]) => val  ),           // unpack the pair
    );
