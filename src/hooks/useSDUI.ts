import { useState, useCallback, useMemo, useRef } from 'react';
import { SDUIPayload, AnyBlock, ActionSchema } from '../types';
import { createDispatcher } from '../actions/dispatcher';
import { useAddToCart } from '../context/CartContext';

// ──────────────────────────────────────────────────────────
// useSDUI hook
//
// Ingests the SDUI payload, wires up the action dispatcher,
// and provides the data interface for the HomeScreen.
// ──────────────────────────────────────────────────────────

interface UseSDUIResult {
  blocks: AnyBlock[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  loadPayload: (payload: SDUIPayload) => void;
  refresh: () => Promise<void>;
  onAction: (action: ActionSchema) => void;
}

interface UseSDUIOptions {
  payload?: SDUIPayload;
  fetchPayload?: () => Promise<SDUIPayload>;
}

export function useSDUI({ payload: initialPayload, fetchPayload }: UseSDUIOptions): UseSDUIResult {
  const [blocks, setBlocks] = useState<AnyBlock[]>(initialPayload?.blocks ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = useAddToCart();

  // Dispatcher is stable — created once via useRef
  const dispatcherRef = useRef(
    createDispatcher({
      onAddToCart: (payload) => {
        addToCart({
          id: payload.id,
          name: payload.name ?? 'Product',
          price: payload.price ?? 0,
        });
      },
      onDeepLink: (payload) => {
        if (__DEV__) {
          console.log('[SDUI] Deep link →', payload.url);
        }
        // In production: navigation.navigate(payload.url) or router.push(payload.url)
      },
      onOpenCategory: (payload) => {
        if (__DEV__) {
          console.log('[SDUI] Open category →', payload.categoryId);
        }
        // navigation.navigate('Category', { id: payload.categoryId });
      },
      onApplyGiftCoupon: (payload) => {
        if (__DEV__) {
          console.log('[SDUI] Apply gift coupon →', payload.couponCode);
        }
        // cartService.applyCoupon(payload.couponCode);
        // Also add the product to cart
        addToCart({
          id: payload.productId ?? 'mystery-product',
          name: 'Mystery Gift',
          price: 0,
        });
      },
      onBookEvent: (payload) => {
        if (__DEV__) {
          console.log('[SDUI] Book event →', payload.eventId);
        }
        // navigation.navigate('EventBooking', { id: payload.eventId });
      },
    })
  );

  // Stable onAction reference — never changes between renders
  const onAction = useCallback((action: ActionSchema) => {
    dispatcherRef.current.dispatch(action);
  }, []);

  const loadPayload = useCallback((payload: SDUIPayload) => {
    try {
      setBlocks(payload.blocks ?? []);
      setError(null);
    } catch (e) {
      setError('Failed to parse payload');
      if (__DEV__) {
        console.error('[useSDUI] Payload parse error:', e);
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!fetchPayload) return;
    setIsRefreshing(true);
    try {
      const freshPayload = await fetchPayload();
      loadPayload(freshPayload);
    } catch (e) {
      setError('Failed to refresh feed');
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchPayload, loadPayload]);

  return {
    blocks,
    isLoading,
    isRefreshing,
    error,
    loadPayload,
    refresh,
    onAction,
  };
}
