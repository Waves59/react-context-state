import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useContext,
	useMemo,
	useState as useReactState,
} from "react";

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
} & A &
	D;

export function createContextState<
	T,
	A extends Record<string, unknown> = Record<string, never>,
	D extends Record<string, unknown> = Record<string, never>,
>(config: Config<T, A, D>) {
	const {
		initialState,
		actions: createActions,
		derivedStates: createDerivedStates,
	} = config;

	type ContextValue = ContextValueType<T, A, D>;

	const Context = createContext<ContextValue | undefined>(undefined);

	const Provider = ({ children }: { children: ReactNode }) => {
		const [state, setState] = useReactState<T>(initialState);
		const actionsObj = (createActions?.(setState) ?? {}) as A;

		const derivedStatesObj = useMemo(() => {
			return (createDerivedStates?.(state) ?? {}) as D;
		}, [state]);

		const value = {
			state,
			setState,
			...actionsObj,
			...derivedStatesObj,
		} as ContextValue;

		return <Context.Provider value={value}>{children}</Context.Provider>;
	};

	const use = () => {
		const ctx = useContext(Context);
		if (!ctx) {
			throw new Error("use must be used within Provider");
		}
		return ctx;
	};

	const useState = (): [T, Dispatch<SetStateAction<T>>] => {
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

		const actions = {} as A;
		if (createActions) {
			const actionKeys = Object.keys(createActions(context.setState));
			for (const key of actionKeys) {
				(actions as Record<string, unknown>)[key] = (
					rest as Record<string, unknown>
				)[key];
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

		const derived = {} as D;
		if (createDerivedStates) {
			const derivedKeys = Object.keys(createDerivedStates(context.state));
			for (const key of derivedKeys) {
				(derived as Record<string, unknown>)[key] = (
					rest as Record<string, unknown>
				)[key];
			}
		}
		return derived;
	};

	return {
		Provider,
		use,
		useState,
		useActions,
		useDerivedStates,
	};
}
