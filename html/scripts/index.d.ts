type elementOptions = {
  classList?: string | string[];
  innerText?: string;
};

type buttonExecutionEntry = {
  status: 0 | 1;
  trigger: 0;
  executionType: 0 | 1;
  executionArgs: [];
  actions: buttonExecutionsActionEntry[];
};

type buttonActionTriggers = {
  0: "press";
};

type buttonActionExecutionTypes = {
  0: "repeat x times";
  1: "repeat until stopped";
};

type buttonExecutionsActionEntry = {
  type: 0 | 1 | 2;
  args: [];
};

type buttionActionsActionTypes = {
  0: "keypress";
  1: "command";
  2: "delay";
};
