import * as react_jsx_runtime from 'react/jsx-runtime';
import { Dispatch, SetStateAction, ReactNode } from 'react';

type ActionsCreator<T, A> = (setState: Dispatch<SetStateAction<T>>) => A;
type DerivedStatesCreator<T, D> = (state: T) => D;
type Config<T, A, D> = {
    initialState: T;
    actions?: ActionsCreator<T, A>;
    derivedStates?: DerivedStatesCreator<T, D>;
};
type ContextValueType<T, A, D> = {
    state: T;
    setState: Dispatch<SetStateAction<T>>;
} & A & D;
declare function createContextState<T, A extends Record<string, unknown> = Record<string, never>, D extends Record<string, unknown> = Record<string, never>>(config: Config<T, A, D>): {
    Provider: ({ children }: {
        children: ReactNode;
    }) => react_jsx_runtime.JSX.Element;
    use: () => ContextValueType<T, A, D>;
    useState: () => [T, Dispatch<SetStateAction<T>>];
    useActions: () => A;
    useDerivedStates: () => D;
};

export { createContextState };
