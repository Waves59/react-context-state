// src/index.tsx
import {
  createContext,
  useContext,
  useMemo,
  useState as useReactState
} from "react";
import { jsx } from "react/jsx-runtime";
function createContextState(config) {
  const {
    initialState,
    actions: createActions,
    derivedStates: createDerivedStates
  } = config;
  const Context = createContext(void 0);
  const Provider = ({ children }) => {
    const [state, setState] = useReactState(initialState);
    const actionsObj = createActions?.(setState) ?? {};
    const derivedStatesObj = useMemo(() => {
      return createDerivedStates?.(state) ?? {};
    }, [state]);
    const value = {
      state,
      setState,
      ...actionsObj,
      ...derivedStatesObj
    };
    return /* @__PURE__ */ jsx(Context.Provider, { value, children });
  };
  const use = () => {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error("use must be used within Provider");
    }
    return ctx;
  };
  const useState = () => {
    const context = useContext(Context);
    if (!context) {
      throw new Error("useState must be used within Provider");
    }
    return [context.state, context.setState];
  };
  const useActions = () => {
    const context = useContext(Context);
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
    const context = useContext(Context);
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
export {
  createContextState
};
