let url = new URL(document.baseURI);
import {
  convertToArray,
  getKeyFromObject,
  addKeysToObject,
  addAppendKeysToObject,
  arrayModifiers,
  recreate,
  getFullNumber,
} from "oberknecht-utils";
let { buttons: buttonsData } = require("./buttons.json");
let currentButtonData;
let currentButtonDataOld;
let pageData = {};
let tempID = 0;

class elements {
  static jH = (options) => {
    return this.createElement("jh", options);
  };

  /** @returns {HTMLElement} */
  static createElement = (elementName, options) => {
    let r = document.createElement(elementName);

    functions.appendElementOptions(r, options);

    return r;
  };
}

class functions {
  static appendElementOptions = (element, options) => {
    if (!element || !options) return;
    Object.keys(options).forEach((optionName) => {
      switch (optionName) {
        case "classes": {
          convertToArray(options[optionName]).forEach((a) =>
            element.classList.add(a)
          );
          break;
        }

        case "childNodes": {
          convertToArray(options[optionName]).forEach((a) => {
            element.appendChild(a);
          });
          break;
        }

        case "style": {
          Object.keys(options[optionName]).forEach((a) => {
            element.style[a] = options[optionName][a];
          });
          break;
        }

        default: {
          element[optionName] = options[optionName];
        }
      }
    });
  };
}

const jTop = elements.createElement("jtop");
const jBody = elements.createElement("jbody");

const jTopMiddleStatus = elements.jH({ innerText: "Disconnected" });

(() => {
  const jTopMiddle = elements.createElement("div", {
    classList: "jTopMiddleContainer",
  });

  const jTopMiddleTitle = elements.jH({ innerText: "Streamdeck configurator" });

  [jTopMiddleTitle, jTopMiddleStatus].forEach((a) => jTopMiddle.appendChild(a));
  jTop.appendChild(jTopMiddle);
})();

(() => {
  const configuratorContainer = elements.createElement("div", {
    classes: "streamdeckConfiguratorContainer",
  });

  const streamdeckContainer = elements.createElement("div", {
    classes: ["streamdeckContainer", "streamdeckContainer-full"],
  });

  const configContainer = elements.createElement("div", {
    classes: ["configContainer", "dp-none"],
  });

  // (() => {
  //   const streamdeckImage = elements.createElement("img", {
  //     src: "../img/streamdeck.png",
  //     classList: "streamdeckImage",
  //   });

  //   streamdeckImage.setAttribute("usemap", "#streamdeckmap");

  //   const streamdeckImageMap = elements.createElement("map", {
  //     name: "streamdeckmap"
  //   });

  //   buttonsData.forEach(dat => {
  //     if(!dat.imageCoords || !dat.imageShape) return;

  //     const areaElem = elements.createElement("area", {
  //       alt: dat.name,
  //       title: dat.name,
  //       coords: dat.imageCoords,
  //       shape: dat.imageShape ?? "rect",
  //       href: "/",
  //       classes: dat.imageClasses ?? []
  //     });

  //     streamdeckImageMap.appendChild(areaElem);
  //   });

  //   [streamdeckImage, streamdeckImageMap].forEach((a) => streamdeckContainer.appendChild(a));
  // })();

  (() => {
    const streamdeckContainerInner = elements.createElement("div", {
      classes: "streamdeckContainer-inner",
    });

    const streamdeckContainerTop = elements.createElement("div", {
      classes: "streamdeckContainer-inner-top",
    });

    const streamdeckContainerBottom = elements.createElement("div", {
      classes: "streamdeckContainer-inner-bottom",
    });

    buttonsData.forEach((buttonData, i) => {
      const buttonElement = elements.createElement("div", {
        style: {
          // position: "absolute",
        },
        classes: buttonData.imageClasses,
      });

      const buttonDataImageCoordsStyleNames = ["width", "height"];

      buttonData.imageCoords?.split(",")?.forEach((a, i2) => {
        buttonElement.style[buttonDataImageCoordsStyleNames[i2]] = `${a}${
          typeof parseInt(a) !== NaN ? "px" : ""
        }`;
      });

      switch (i) {
        case 0:
        case 1: {
          streamdeckContainerTop.appendChild(buttonElement);
          break;
        }

        default: {
          const buttonIDNum = parseInt(buttonData.id.split("btn-")[1]);
          const gridRow = getFullNumber(buttonIDNum / 5);
          const gridColumn = buttonIDNum - (gridRow - 1) * 5;

          buttonElement.style.gridArea = `${gridRow}/${gridColumn}/${gridRow}/${gridColumn}`;

          streamdeckContainerBottom.appendChild(buttonElement);
          break;
        }
      }

      buttonElement.onclick = () => {
        loadButtonConfig(buttonData.id);
      };
    });

    [streamdeckContainerTop, streamdeckContainerBottom].forEach((a) =>
      streamdeckContainerInner.appendChild(a)
    );
    streamdeckContainer.appendChild(streamdeckContainerInner);
  })();

  const configContainerTitleName = elements.jH();

  const configActionsContainer = elements.createElement("div", {
    classes: "configActionContainer",
  });

  const exitContainer = elements.createElement("div", {
    classes: "configContainerBottomExit",
  });

  const saveContainer = elements.createElement("div", {
    classes: "configContainerBottomSave",
  });

  (() => {
    const configContainerTop = elements.createElement("div", {
      classes: "configContainerTop",
    });
    const configContainerMiddle = elements.createElement("div", {
      classes: "configContainerMiddle",
    });
    const configContainerBottom = elements.createElement("div", {
      classes: "configContainerBottom",
    });

    (() => {
      const configContainerTitle = elements.jH({
        innerText: `Configuring `,
      });

      [configContainerTitle, configContainerTitleName].forEach((a) =>
        configContainerTop.appendChild(a)
      );
    })();

    (() => {
      const configExecutionAdd = elements.createElement("button", {
        innerText: "Add Execution",
      });

      configExecutionAdd.onclick = () => {
        addConfigExecution();
      };

      (() => {
        const exitButton = elements.createElement("button", {
          innerText: "Exit",
          classes: "bg-red",
        });
        exitButton.onclick = () => {
          exitButtonConfig();
        };

        [exitButton].forEach((a) => exitContainer.appendChild(a));
      })();

      (() => {
        const cancelButton = elements.createElement("button", {
          innerText: "Cancel",
          classes: "bg-red",
        });

        cancelButton.onclick = () => {
          currentButtonData = currentButtonDataOld;
          exitButtonConfig();
        };

        const saveButton = elements.createElement("button", {
          innerText: "Save",
          classes: "bg-green",
        });

        saveButton.onclick = () => {
          saveButtonConfig();
          switchBottomButtons(0);
        };
      })();

      [configExecutionAdd, exitContainer, saveContainer].forEach((a) =>
        configContainerBottom.appendChild(a)
      );
    })();

    [
      configContainerTop,
      configActionsContainer,
      configContainerBottom,
    ].forEach((a) => configContainer.appendChild(a));
  })();

  function loadButtonConfig(buttonID) {
    addKeysToObject(pageData, ["currentButtonID"], buttonID);
    addKeysToObject(
      pageData,
      ["currentButtonData"],
      buttonsData.filter((a) => a.id === buttonID)?.[0]
    );
    currentButtonData = buttonsData.filter((a) => a.id === buttonID)?.[0];
    currentButtonDataOld = recreate(currentButtonData);

    streamdeckContainer.classList.remove("streamdeckContainer-full");
    configContainer.classList.remove("dp-none");
    loadConfigContainer(buttonID);
  }

  function getButtonNameByID(buttonID) {
    return buttonsData.filter((a) => a.id === buttonID)[0]?.name;
  }

  function loadConfigContainer(buttonID) {
    configContainerTitleName.innerText = getButtonNameByID(buttonID);
    configActionsContainer.innerHTML = "";
  }

  function addConfigExecution() {
    let buttonID = getKeyFromObject(pageData, ["currentButtonID"]);
    let executionData = {
      status: 1,
      trigger: 0,
      executionType: 0,
      executionArgs: [],
      actions: [],
    };
    addAppendKeysToObject(currentButtonData, ["executions"], [executionData]);

    const configExecutionsContainer = elements.createElement("div", {
      classes: "configExecutionsActionContainer",
    });

    const configExecutionsContainerLeft = elements.createElement("div", {
      classes: "configExecutionsActionContainerLeft",
    });

    const configExecutionsContainerRight = elements.createElement("div", {
      classes: "configExecutionsActionContainerRight",
    });

    (() => {
      const configExecutionsExecutionsStatus = elements.createElement("input", {
        type: "checkbox",
        checked: true,
        classes: ["configExecutionsStatus"],
      });

      configExecutionsExecutionsStatus.onchange = () => {
        executionData.status = configExecutionsExecutionsStatus.checked ? 1 : 0;
      };

      [configExecutionsExecutionsStatus].forEach((a) =>
        configExecutionsContainerLeft.appendChild(a)
      );
    })();

    (() => {
      const configExecutionsTriggerContainer = elements.createElement("div");
      (() => {
        const configExecutionsTriggerTitle = elements.jH({
          innerText: "Trigger:",
        });

        const configExecutionsTriggerSelect = elements.createElement("select", {
          defaultValue: 0,
        });

        const configExecutionsTriggerSelectOptions = [["Press", 0]];
        (() => {
          configExecutionsTriggerSelectOptions.forEach((a) => {
            const configActionsActionsTriggerOption = elements.createElement(
              "option",
              {
                innerText: a[0],
                value: a[1],
              }
            );

            configExecutionsTriggerSelect.appendChild(
              configActionsActionsTriggerOption
            );
          });
        })();

        configExecutionsTriggerSelect.onchange = () => {
          executionData.trigger = parseInt(configExecutionsTriggerSelect.value);
        };

        [
          configExecutionsTriggerTitle,
          configExecutionsTriggerSelect,
        ].forEach((a) => configExecutionsTriggerContainer.appendChild(a));
      })();

      const configExecutionsExecutionContainer = elements.createElement("div");
      (() => {
        const configExecutionsExecutionTitle = elements.jH({
          innerText: "Execution:",
        });

        const configExecutionsExecutionSelect = elements.createElement(
          "select",
          {
            defaultValue: 0,
          }
        );

        const configActionsExecutionSelectOptions = [
          ["Repeat x times", 0],
          ["Repeat until stopped", 1],
        ];

        (() => {
          configActionsExecutionSelectOptions.forEach((a) => {
            const configActionsExecutionOption = elements.createElement(
              "option",
              {
                innerText: a[0],
                value: a[1],
              }
            );

            configExecutionsExecutionSelect.appendChild(
              configActionsExecutionOption
            );
          });
        })();

        configExecutionsExecutionSelect.onchange = () => {
          executionData.executionType = parseInt(
            configExecutionsExecutionSelect.value
          );

          appendExecutionArgElements();
        };

        function appendExecutionArgElements() {
          [
            ...document.querySelectorAll(".configExecutionsExecutionSelect"),
          ].forEach((a) => a.remove());
          executionData.executionArgs = [];

          switch (parseInt(configExecutionsExecutionSelect.value)) {
            case 0: {
              let configExecutionsExecutionArg = elements.createElement(
                "input",
                {
                  type: "number",
                  defaultValue: 1,
                  min: 1,
                  classes: "configExecutionsExecutionSelect",
                }
              );

              configExecutionsExecutionArg.oninput = () => {
                executionData.executionArgs = [
                  parseInt(configExecutionsExecutionArg.value),
                ];
              };

              configExecutionsExecutionContainer.appendChild(
                configExecutionsExecutionArg
              );

              break;
            }

            case 1: {
              break;
            }
          }
        }

        [
          configExecutionsExecutionTitle,
          configExecutionsExecutionSelect,
        ].forEach((a) => configExecutionsExecutionContainer.appendChild(a));

        appendExecutionArgElements();
      })();

      const configExecutionActionsContainer = elements.createElement("div");
      const configExecutionActionsInnerContainer = elements.createElement(
        "div"
      );
      (() => {
        const configExecutionActionTitle = elements.jH({
          innerText: "Actions:",
        });

        const configExectutionActionAdd = elements.createElement("button", {
          innerText: "+",
        });

        configExectutionActionAdd.onclick = () => {
          removeExecutionActionElements();
          appendExecutionActionElements(true);
        };

        [
          configExecutionActionTitle,
          configExectutionActionAdd,
          configExecutionActionsInnerContainer,
        ].forEach((a) => configExecutionActionsContainer.appendChild(a));
      })();

      function appendActionsAction(actionData, actionDataIndex) {
        if (!actionData) {
          actionData = { type: 0, args: [] };
          addAppendKeysToObject(executionData, ["actions"], []);
          executionData.actions[actionDataIndex] = actionData;
        }

        const configExecutionActionsActionContainer = elements.createElement(
          "div",
          {
            classes: "configExecutionActionsActionContainer",
          }
        );

        const configExecutionActionsActionContainerLeft = elements.createElement(
          "div",
          { classes: "configExecutionActionsActionContainerLeft" }
        );
        const configExecutionActionsActionContainerRight = elements.createElement(
          "div",
          { classes: "configExecutionActionsActionContainerRight" }
        );

        (() => {
          const configExecutionActionsActionDelete = elements.createElement(
            "button",
            {
              innerText: "🗑",
              classes: [
                "configExecutionActionsActionButton",
                "configExecutionActionsActionDelete",
              ],
            }
          );

          const configExecutionActionsActionMoveUp = elements.createElement(
            "button",
            {
              innerText: "↑",
              classes: [
                "configExecutionActionsActionButton",
                "configExecutionActionsActionMove",
              ],
            }
          );
          const configExecutionActionsActionMoveDown = elements.createElement(
            "button",
            {
              innerText: "↓",
              classes: [
                "configExecutionActionsActionButton",
                "configExecutionActionsActionMove",
              ],
            }
          );

          configExecutionActionsActionDelete.onclick = () => {
            removeExecutionAction(actionData);

            removeExecutionActionElements();
            appendExecutionActionElements();
          };

          if (actionDataIndex > 0) {
            configExecutionActionsActionMoveUp.onclick = () => {
              moveAction(actionData, -1);
            };
          } else {
            configExecutionActionsActionMoveUp.setAttribute("disabled", true);
          }

          if (actionDataIndex + 1 < executionData.actions.length) {
            configExecutionActionsActionMoveDown.onclick = () => {
              moveAction(actionData, 1);
            };
          } else {
            configExecutionActionsActionMoveDown.setAttribute("disabled", true);
          }

          [
            configExecutionActionsActionDelete,
            configExecutionActionsActionMoveUp,
            configExecutionActionsActionMoveDown,
          ].forEach((a) =>
            configExecutionActionsActionContainerLeft.appendChild(a)
          );
        })();

        (() => {
          const configExecutionsActionsActionSelect = elements.createElement(
            "select",
            {
              defaultValue: 0,
            }
          );

          const configExecutionsActionsActionSelectOptions = [
            ["Keypress", 0],
            ["Command", 1],
            ["Delay", 2],
          ];
          (() => {
            configExecutionsActionsActionSelectOptions.forEach((a) => {
              const configExecutionsActionsActionOption = elements.createElement(
                "option",
                {
                  innerText: a[0],
                  value: a[1],
                }
              );

              configExecutionsActionsActionSelect.appendChild(
                configExecutionsActionsActionOption
              );
            });
          })();

          if (actionData.type)
            configExecutionsActionsActionSelect.value = actionData.type;

          configExecutionsActionsActionSelect.onchange = () => {
            actionData.type = parseInt(
              configExecutionsActionsActionSelect.value
            );

            appendActionFields(true);
          };

          function appendActionFields(resetValues) {
            [
              ...configExecutionActionsActionContainer.querySelectorAll(
                ".configExecutionsActionsActionArgsInput"
              ),
            ].forEach((a) => a.remove());
            if (resetValues) actionData.args = [];

            switch (parseInt(configExecutionsActionsActionSelect.value)) {
              case 0: {
                // input, support (shift/ctrl)+(<key>)
                // oninput: verify via regex, disable save button if invalid and make border red

                const configExecutionsActionsActionArgsInput = elements.createElement(
                  "input",
                  {
                    placeholder: "Keys to simulate (e.g. 'a' or 'shift+a')",
                    classes: "configExecutionsActionsActionArgsInput",
                  }
                );

                configExecutionsActionsActionArgsInput.oninput = () => {
                  // validate input
                  actionData.args = [
                    configExecutionsActionsActionArgsInput.value,
                  ];
                };

                if (actionData.args[0])
                  configExecutionsActionsActionArgsInput.value =
                    actionData.args[0];

                configExecutionActionsActionContainerRight.appendChild(
                  configExecutionsActionsActionArgsInput
                );
                break;
              }

              case 1: {
                const configExecutionsActionsActionArgsInput = elements.createElement(
                  "input",
                  {
                    placeholder: "Command to execute in terminal",
                    classes: "configExecutionsActionsActionArgsInput",
                  }
                );

                configExecutionsActionsActionArgsInput.oninput = () => {
                  // validate input
                  actionData.args = [
                    configExecutionsActionsActionArgsInput.value,
                  ];
                };
                if (actionData.args[0])
                  configExecutionsActionsActionArgsInput.value =
                    actionData.args[0];

                configExecutionActionsActionContainerRight.appendChild(
                  configExecutionsActionsActionArgsInput
                );
                break;
              }

              case 2: {
                const configExecutionsActionsActionArgsInput = elements.createElement(
                  "input",
                  {
                    type: "number",
                    defaultValue: 0,
                    classes: "configExecutionsActionsActionArgsInput",
                  }
                );

                if (actionData.args[0])
                  configExecutionsActionsActionArgsInput.value =
                    actionData.args[0];

                const configExecutionsActionActionArgsH = elements.jH({
                  innerText: "ms",
                });

                configExecutionsActionsActionArgsInput.oninput = () => {
                  actionData.args = [
                    parseInt(configExecutionsActionsActionArgsInput.value),
                  ];
                };

                [
                  configExecutionsActionsActionArgsInput,
                  configExecutionsActionActionArgsH,
                ].forEach((a) =>
                  configExecutionActionsActionContainerRight.appendChild(a)
                );
                break;
              }
            }
          }

          [configExecutionsActionsActionSelect].forEach((a) =>
            configExecutionActionsActionContainerRight.appendChild(a)
          );

          appendActionFields();
        })();

        [
          configExecutionActionsActionContainerLeft,
          configExecutionActionsActionContainerRight,
        ].forEach((a) => configExecutionActionsActionContainer.appendChild(a));

        configExecutionActionsInnerContainer.appendChild(
          configExecutionActionsActionContainer
        );

        switchBottomButtons(1);
      }

      function appendExecutionActionElements(appendNew) {
        if (appendNew)
          addAppendKeysToObject(executionData, ["actions"], [undefined]);

        (getKeyFromObject(executionData, ["actions"]) ?? []).forEach(
          (actionData, i) => {
            appendActionsAction(actionData, i);
          }
        );
      }

      function removeExecutionActionElements() {
        configExecutionActionsInnerContainer.innerHTML = "";
      }

      function removeExecutionAction(actionData) {
        addKeysToObject(
          executionData,
          ["actions"],
          arrayModifiers.splice(
            getKeyFromObject(executionData, ["actions"]),
            getKeyFromObject(executionData, ["actions"]).indexOf(actionData)
          )
        );
      }

      function moveAction(actionData, moveType) {
        let actionDataIndex = executionData.actions.indexOf(actionData);

        executionData.actions = arrayModifiers.moveByIndex(
          executionData.actions,
          actionDataIndex,
          undefined,
          moveType
        );

        removeExecutionActionElements();
        appendExecutionActionElements();
      }

      appendExecutionActionElements();

      [
        configExecutionsTriggerContainer,
        configExecutionsExecutionContainer,
        configExecutionActionsContainer,
      ].forEach((a) => configExecutionsContainerRight.appendChild(a));
    })();

    [
      configExecutionsContainerLeft,
      configExecutionsContainerRight,
    ].forEach((a) => configExecutionsContainer.appendChild(a));
    configActionsContainer.appendChild(configExecutionsContainer);
  }

  function appendConfigExecutionElements() {
    currentButtonData;
  }

  function switchBottomButtons(type) {
    switch (type) {
      case 0: {
        // show exit
        exitContainer.classList.remove("dp-none");
        saveContainer.classList.add("dp-none");

        break;
      }

      case 1: {
        // show save / discard
        exitContainer.classList.add("dp-none");
        saveContainer.classList.remove("dp-none");

        break;
      }
    }
  }

  function exitButtonConfig() {
    streamdeckContainer.classList.add("streamdeckContainer-full");
    configContainer.classList.add("dp-none");
  }

  function saveButtonConfig() {}

  switchBottomButtons(0);
  loadButtonConfig("btn-1");

  [streamdeckContainer, configContainer].forEach((a) =>
    configuratorContainer.appendChild(a)
  );

  [configuratorContainer].forEach((a) => jBody.appendChild(a));
})();

[jTop, jBody].forEach((a) => document.querySelector("body").appendChild(a));

global.pageData = pageData;
