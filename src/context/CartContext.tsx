import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { CartState, CartItem } from '../types';

// ──────────────────────────────────────────────────────────
// CART REDUCER
// ──────────────────────────────────────────────────────────
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'INCREMENT'; payload: { id: string } }
  | { type: 'DECREMENT'; payload: { id: string } }
  | { type: 'CLEAR' };

function computeTotals(items: Record<string, CartItem>): { totalCount: number; totalPrice: number } {
  return Object.values(items).reduce(
    (acc, item) => ({
      totalCount: acc.totalCount + item.quantity,
      totalPrice: acc.totalPrice + item.price * item.quantity,
    }),
    { totalCount: 0, totalPrice: 0 }
  );
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items[action.payload.id];
      const updatedItems = {
        ...state.items,
        [action.payload.id]: existing
          ? { ...existing, quantity: existing.quantity + 1 }
          : { ...action.payload, quantity: 1 },
      };
      return { items: updatedItems, ...computeTotals(updatedItems) };
    }
    case 'REMOVE_ITEM': {
      const { [action.payload.id]: _, ...rest } = state.items;
      return { items: rest, ...computeTotals(rest) };
    }
    case 'INCREMENT': {
      const item = state.items[action.payload.id];
      if (!item) return state;
      const updatedItems = {
        ...state.items,
        [action.payload.id]: { ...item, quantity: item.quantity + 1 },
      };
      return { items: updatedItems, ...computeTotals(updatedItems) };
    }
    case 'DECREMENT': {
      const item = state.items[action.payload.id];
      if (!item) return state;
      if (item.quantity <= 1) {
        const { [action.payload.id]: _, ...rest } = state.items;
        return { items: rest, ...computeTotals(rest) };
      }
      const updatedItems = {
        ...state.items,
        [action.payload.id]: { ...item, quantity: item.quantity - 1 },
      };
      return { items: updatedItems, ...computeTotals(updatedItems) };
    }
    case 'CLEAR':
      return { items: {}, totalCount: 0, totalPrice: 0 };
    default:
      return state;
  }
}

const INITIAL_CART_STATE: CartState = {
  items: {},
  totalCount: 0,
  totalPrice: 0,
};

// ──────────────────────────────────────────────────────────
// CONTEXT — SPLIT into State + Dispatch to avoid re-renders
// ──────────────────────────────────────────────────────────
// ARCHITECTURAL MANDATE:
// Mutating one product's cart state MUST NOT re-render the
// entire 30+ block feed. We achieve this by:
// 1. Splitting state and dispatch contexts
// 2. Components only subscribe to what they need
// 3. Per-item selectors via useCartItem hook
// ──────────────────────────────────────────────────────────

const CartStateContext = createContext<CartState>(INITIAL_CART_STATE);
const CartDispatchContext = createContext<React.Dispatch<CartAction>>(() => {});

// Selector context for cart total count (header badge only)
const CartCountContext = createContext<number>(0);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_CART_STATE);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        <CartCountContext.Provider value={state.totalCount}>
          {children}
        </CartCountContext.Provider>
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

// ──────────────────────────────────────────────────────────
// HOOKS
// ──────────────────────────────────────────────────────────

// Full cart state — use only where needed (cart screen)
export const useCartState = (): CartState => useContext(CartStateContext);

// Dispatch only — components that only dispatch won't re-render on state change
export const useCartDispatch = (): React.Dispatch<CartAction> =>
  useContext(CartDispatchContext);

// Cart total count for header badge — isolated re-render
export const useCartCount = (): number => useContext(CartCountContext);

// Per-item hook — a product card ONLY subscribes to its own item
// This prevents other 30+ cards from re-rendering when one changes
export const useCartItem = (productId: string): { quantity: number } => {
  const state = useContext(CartStateContext);
  return useMemo(
    () => ({ quantity: state.items[productId]?.quantity ?? 0 }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.items[productId]?.quantity]
  );
};

// Convenience action hooks
export const useAddToCart = () => {
  const dispatch = useCartDispatch();
  return useCallback(
    (item: Omit<CartItem, 'quantity'>) =>
      dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } }),
    [dispatch]
  );
};

export const useIncrementCart = () => {
  const dispatch = useCartDispatch();
  return useCallback(
    (id: string) => dispatch({ type: 'INCREMENT', payload: { id } }),
    [dispatch]
  );
};

export const useDecrementCart = () => {
  const dispatch = useCartDispatch();
  return useCallback(
    (id: string) => dispatch({ type: 'DECREMENT', payload: { id } }),
    [dispatch]
  );
};

export type { CartAction };
