# react-context-state

A lightweight, type-safe React state management library built on top of Context API. Create fully-typed providers with state, actions, and derived states in a single function call.

## Installation

```bash
npm install react-context-state
```

> **Peer dependency:** React >= 18

## Quick Start

```tsx
import { createContextState } from "react-context-state";

const Counter = createContextState({
  initialState: { count: 0 },

  actions: (setState) => ({
    increment: () => setState((s) => ({ ...s, count: s.count + 1 })),
    decrement: () => setState((s) => ({ ...s, count: s.count - 1 })),
    reset: () => setState({ count: 0 }),
  }),

  derivedStates: (state) => ({
    isPositive: state.count > 0,
    doubleCount: state.count * 2,
  }),
});

function App() {
  return (
    <Counter.Provider>
      <Display />
      <Controls />
    </Counter.Provider>
  );
}

function Display() {
  const { state, doubleCount } = Counter.use();
  return (
    <p>
      {state.count} (x2: {doubleCount})
    </p>
  );
}

function Controls() {
  const { increment, decrement, reset } = Counter.useActions();
  return (
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

## API

### `createContextState(config)`

Creates a context-based store and returns a `Provider` component along with hooks to consume the state.

#### Config

| Property        | Type                               | Required | Description                                                        |
| --------------- | ---------------------------------- | -------- | ------------------------------------------------------------------ |
| `initialState`  | `T`                                | Yes      | The initial state value.                                           |
| `actions`       | `(setState) => A`                  | No       | A function that receives `setState` and returns an object of actions. |
| `derivedStates` | `(state) => D`                     | No       | A function that receives the current state and returns computed values. Memoized with `useMemo`. |

#### Returns

| Property          | Type                                     | Description                                        |
| ----------------- | ---------------------------------------- | -------------------------------------------------- |
| `Provider`        | `React.FC<{ children: ReactNode }>`      | Provider component to wrap your component tree.    |
| `use()`           | `() => { state, setState, ...actions, ...derived }` | Returns the full context value.          |
| `useState()`      | `() => [state, setState]`               | Returns only the state and its setter.             |
| `useActions()`    | `() => A`                               | Returns only the actions object.                   |
| `useDerivedStates()` | `() => D`                            | Returns only the derived states object.            |

All hooks throw an error if used outside of the corresponding `Provider`.

## Usage Patterns

### State only (no actions, no derived states)

```tsx
const Theme = createContextState({
  initialState: { mode: "light" as "light" | "dark" },
});

function ThemeToggle() {
  const [theme, setTheme] = Theme.useState();
  return (
    <button onClick={() => setTheme({ mode: theme.mode === "light" ? "dark" : "light" })}>
      {theme.mode}
    </button>
  );
}
```

### With actions

```tsx
const Auth = createContextState({
  initialState: { user: null as User | null, loading: false },

  actions: (setState) => ({
    login: async (credentials: Credentials) => {
      setState((s) => ({ ...s, loading: true }));
      const user = await api.login(credentials);
      setState({ user, loading: false });
    },
    logout: () => setState({ user: null, loading: false }),
  }),
});
```

### With derived states

Derived states are memoized — they only recompute when the state changes.

```tsx
const Cart = createContextState({
  initialState: { items: [] as CartItem[] },

  actions: (setState) => ({
    addItem: (item: CartItem) =>
      setState((s) => ({ items: [...s.items, item] })),
    removeItem: (id: string) =>
      setState((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  }),

  derivedStates: (state) => ({
    totalPrice: state.items.reduce((sum, item) => sum + item.price, 0),
    itemCount: state.items.length,
    isEmpty: state.items.length === 0,
  }),
});
```

### Granular hooks for optimized re-renders

Use specific hooks to subscribe only to what a component needs:

```tsx
// Only re-renders when actions change (stable references)
function AddButton() {
  const { addItem } = Cart.useActions();
  return <button onClick={() => addItem(newItem)}>Add</button>;
}

// Only re-renders when derived values change
function CartBadge() {
  const { itemCount } = Cart.useDerivedStates();
  return <span>{itemCount}</span>;
}

// Only re-renders when state changes
function CartList() {
  const [{ items }] = Cart.useState();
  return items.map((item) => <CartItem key={item.id} item={item} />);
}
```

## TypeScript

All types are inferred automatically from your config:

```tsx
const Store = createContextState({
  initialState: { count: 0 },
  actions: (setState) => ({
    increment: () => setState((s) => ({ count: s.count + 1 })),
  }),
  derivedStates: (state) => ({
    isEven: state.count % 2 === 0,
  }),
});

// Everything is fully typed:
const { state, increment, isEven } = Store.use();
//       ^T        ^() => void  ^boolean
```

## License

MIT
