"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  createContextState: () => createContextState
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function createContextState(config) {
  const {
    initialState,
    actions: createActions,
    derivedStates: createDerivedStates
  } = config;
  const Context = (0, import_react.createContext)(void 0);
  const Provider = ({ children }) => {
    const [state, setState] = (0, import_react.useState)(initialState);
    const actionsObj = createActions?.(setState) ?? {};
    const derivedStatesObj = (0, import_react.useMemo)(() => {
      return createDerivedStates?.(state) ?? {};
    }, [state]);
    const value = {
      state,
      setState,
      ...actionsObj,
      ...derivedStatesObj
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Context.Provider, { value, children });
  };
  const use = () => {
    const ctx = (0, import_react.useContext)(Context);
    if (!ctx) {
      throw new Error("use must be used within Provider");
    }
    return ctx;
  };
  const useState = () => {
    const context = (0, import_react.useContext)(Context);
    if (!context) {
      throw new Error("useState must be used within Provider");
    }
    return [context.state, context.setState];
  };
  const useActions = () => {
    const context = (0, import_react.useContext)(Context);
    if (!context) {
      throw new Error("useActions must be used within Provider");
    }
    const { state: _state, setState: _setState, ...rest } = context;
    const actions = {};
    if (createActions) {
      const actionKeys = Object.keys(createActions(context.setState));
      for (const key of actionKeys) {
        actions[key] = rest[key];
      }
    }
    return actions;
  };
  const useDerivedStates = () => {
    const context = (0, import_react.useContext)(Context);
    if (!context) {
      throw new Error("useDerivedStates must be used within Provider");
    }
    const { state: _state, setState: _setState, ...rest } = context;
    const derived = {};
    if (createDerivedStates) {
      const derivedKeys = Object.keys(createDerivedStates(context.state));
      for (const key of derivedKeys) {
        derived[key] = rest[key];
      }
    }
    return derived;
  };
  return {
    Provider,
    use,
    useState,
    useActions,
    useDerivedStates
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createContextState
});
