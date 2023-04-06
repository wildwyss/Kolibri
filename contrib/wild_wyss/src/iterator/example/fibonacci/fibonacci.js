import * as _                 from "../../iterator.js";
import { Range }              from "../../../range/range.js";
import { dom }                from "../../../../../../docs/src/kolibri/util/dom.js";
import { iteratorProjector }  from "../../projector/iteratorProjector.js";
import {FibonacciIterator} from "../../iterator.js";


const fibonacciView = (rootElement, amount, scaleFactor) => {
  const iti     = _.take(amount)(FibonacciIterator());
  const iti2    = _.cons(0)(FibonacciIterator());
  const values  = _.zipWith((a, b) => ({current: a, last: b}))(iti)(iti2);
  const indexed = _.zipWith((a, b) => ({index: b, current: a.current, last: a.last}))(values)(Range(100));

  const elements = (iteratorProjector(indexed)(fibonacciProjector(scaleFactor))).children;

  rootElement.append(...elements);
};

const fibonacciProjector = scaleFactor => ({index, current, last}) => {
  const [div] = dom(`<div>${current}</div>`);
  let top = last * scaleFactor;
  let left = 0;
  if (index % 2 === 0) {
    top = 0;
    left = last * scaleFactor;
  }
  div.style.border    = `1px solid black`;
  div.style.height    = `${current * scaleFactor}px`;
  div.style.width     = `${current * scaleFactor}px`;
  div.style.position  = 'absolute';
  div.style.top       = `${top}px`;
  div.style.left      = `${left}px`;
  return div;
};

const rootElement   = document.getElementById("root");
const amountInput   = document.getElementById("amount");
const scaleInput    = document.getElementById("scale");
let amount        = 5;
let scaleFactor   = 10;


amountInput.value  = amount;
amountInput.onchange = () => {
  rootElement.innerHTML = '';
  amount = Number(amountInput.value);
  fibonacciView(rootElement, amount, scaleFactor);
};

scaleInput.onchange = () => {
  rootElement.innerHTML = '';
  scaleFactor = Number(scaleInput.value);
  fibonacciView(rootElement, amount, scaleFactor);
};
fibonacciView(rootElement, amount, scaleFactor);