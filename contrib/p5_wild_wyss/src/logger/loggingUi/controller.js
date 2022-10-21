export {LogUiController}
import {fst, snd, Pair} from "../lamdaCalculus.js";
import {setGlobalContext} from "../logger.js";

const LogUiController = model => {

  const onFilterChange = callback => {
    callback([]);
  };


  const flipLogLevel = logLevelPair => {
    const allLogLevels = model.getAvailableLogLevels()
      .map(logLevel =>
        logLevel(fst) === logLevelPair(fst)
          ? Pair(logLevel(fst))(!logLevel(snd))
          : logLevel
      );
    model.setActiveLogLevel(allLogLevels);
  };

  return {
    onFilterChange,
    onChangeActiveLogLevel:  model.onChangeActiveLogLevel,
    flipLogLevel:            flipLogLevel,
    getActiveLogLevel:       model.getActiveLogLevel,
    getAvailableLogLevels:   model.getAvailableLogLevels,
    getMessages:             model.getMessages,
    onMessagesChange:        model.onMessagesChange,

    onTextFilterChange:      model.onTextFilterChange,
    setTextFilter:           model.setTextFilter,

    setGlobalContext: setGlobalContext
  }
};

