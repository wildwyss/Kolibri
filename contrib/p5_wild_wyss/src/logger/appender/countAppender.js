export {Appender}
import {True} from "../lamdaCalculus.js";

/**
 * Provides console appender.
 * @returns {AppenderType<Object>}
 * @constructor
 */
const Appender = () => ({
  trace,
  debug,
  info,
  warn,
  error,
  fatal,
  getValue,
  reset,
});

/**
 *
 * @type {{warn: number, trace: number, debug: number, error: number, info: number, fatal: number}}
 */
let statistic = { trace: 0, debug: 0, info: 0, warn: 0, error: 0, fatal: 0};

/**
 * Resets the values of all level to zero.
 * @type {{warn: number, trace: number, debug: number, error: number, info: number, fatal: number}}
 */
const reset = () => {
  statistic = {trace: 0, debug: 0, info: 0, warn: 0, error: 0, fatal: 0};
};

/**
 * Returns an object with summarized counter values.
 * @returns {{warn: number, trace: number, debug: number, error: number, info: number, fatal: number}}
 */
const getValue = () => statistic;

/**
 * @type { (String) => (Consumer) => (String) => churchBoolean }
 */
const appenderCallback = type => callback => msg => {
  statistic[type] = statistic[type] + 1;
  callback(` (${statistic[type]}) ` + msg);
  return True;
};

/**
 * the function to log trace logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const trace = appenderCallback("trace")(console.trace);

/**
 * the function to log debug logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const debug = appenderCallback("debug")(console.debug);

/**
 * the function to log debug logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const info = appenderCallback("info")(console.info);

/**
 * the function to log warn logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const warn = appenderCallback("warn")(console.warn);

/**
 * the function to log error logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const error = appenderCallback("error")(console.error);

/**
 * the function to log error logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const fatal = appenderCallback("fatal")(console.error);
