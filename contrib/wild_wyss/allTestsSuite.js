import { total } from "./src/test/test.js";
import { versionInfo } from "../../docs/src/kolibri/version.js";

// logger
import "./src/logger/loggerTest.js";
import "./src/logger/appender/arrayAppenderTest.js";
import "./src/logger/appender/countAppenderTest.js";
import "./src/logger/appender/consoleAppenderTest.js";
import "./src/logger/appender/observableAppenderTest.js";
import "./src/logger/logUi/logUiControllerTest.js";

// iterator
import "./src/iterator/constructors/constructorTest.js";
import "./src/iterator/operators/operatorsTest.js";
import "./src/iterator/terminalOperations/terminalOperationsTest.js";
// import "./src/iterator/iteratorBuilderTest.js";

// range
// import "./src/range/rangeTest.js";

// focusring
// import "./src/focusring/focusRingTest.js";

// stdlib
import "./src/stdlib/stdlibTest.js";
import "./src/stdlib/maybeTest.js";
import "./src/stdlib/pairTest.js";

// jinq
// import "./src/jinq/jinqTest.js";
// import "./src/json/jsonMonadTest.js"

//poc
import "./src/iterator/poc/pocTest.js"

total.onChange(value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;
