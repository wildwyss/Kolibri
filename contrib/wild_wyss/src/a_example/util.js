import {drop}         from "../sequence/operators/drop/drop.js";
import {cons}         from "../sequence/operators/cons/cons.js";
import {PureSequence} from "../sequence/constructors/pureSequence/pureSequence.js";
import {isEmpty}      from "../sequence/terminalOperations/isEmpty/isEmpty.js";
import {head}         from "../sequence/terminalOperations/head/head.js";

export { intersperse, iterateAsync, action, wait }

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

const wait   = millis => (resolve, _reject) => setTimeout( _=> resolve(), millis);
