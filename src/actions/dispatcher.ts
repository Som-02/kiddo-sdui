import { Alert, Linking } from 'react-native';
import {
  ActionSchema,
  AddToCartPayload,
  DeepLinkPayload,
  OpenCategoryPayload,
  ApplyGiftCouponPayload,
  BookEventPayload,
} from '../types';

// ──────────────────────────────────────────────────────────
// ACTION DISPATCHER
//
// The centralized handleAction(actionObj) coordinator.
// Atomic layout components pass context here and remain
// completely decoupled from business validation logic.
// Components fire raw interface triggers only.
// ──────────────────────────────────────────────────────────

export type ActionHandlerMap = {
  onAddToCart?: (payload: AddToCartPayload) => void;
  onDeepLink?: (payload: DeepLinkPayload) => void;
  onOpenCategory?: (payload: OpenCategoryPayload) => void;
  onApplyGiftCoupon?: (payload: ApplyGiftCouponPayload) => void;
  onBookEvent?: (payload: BookEventPayload) => void;
};

export class ActionDispatcher {
  private handlers: ActionHandlerMap;

  constructor(handlers: ActionHandlerMap) {
    this.handlers = handlers;
  }

  dispatch = (action: ActionSchema): void => {
    if (!action || !action.type) {
      if (__DEV__) {
        console.warn('[ActionDispatcher] Received invalid action schema:', action);
      }
      return;
    }

    try {
      switch (action.type) {
        case 'ADD_TO_CART': {
          const payload = action.payload as AddToCartPayload;
          if (__DEV__) {
            console.log('[Dispatcher] ADD_TO_CART →', payload);
          }
          this.handlers.onAddToCart?.(payload);
          break;
        }

        case 'DEEP_LINK': {
          const payload = action.payload as DeepLinkPayload;
          if (__DEV__) {
            console.log('[Dispatcher] DEEP_LINK →', payload.url);
          }
          this.handlers.onDeepLink?.(payload);
          // In production: router.push(payload.url) or Linking.openURL(...)
          break;
        }

        case 'OPEN_CATEGORY': {
          const payload = action.payload as OpenCategoryPayload;
          if (__DEV__) {
            console.log('[Dispatcher] OPEN_CATEGORY →', payload.categoryId);
          }
          this.handlers.onOpenCategory?.(payload);
          break;
        }

        case 'APPLY_MYSTERY_GIFT_COUPON': {
          const payload = action.payload as ApplyGiftCouponPayload;
          if (__DEV__) {
            console.log('[Dispatcher] APPLY_MYSTERY_GIFT_COUPON →', payload.couponCode);
          }
          this.handlers.onApplyGiftCoupon?.(payload);
          break;
        }

        case 'BOOK_EVENT': {
          const payload = action.payload as BookEventPayload;
          if (__DEV__) {
            console.log('[Dispatcher] BOOK_EVENT →', payload.eventId);
          }
          this.handlers.onBookEvent?.(payload);
          break;
        }

        case 'OPEN_SEARCH': {
          if (__DEV__) {
            console.log('[Dispatcher] OPEN_SEARCH');
          }
          // navigation.navigate('Search');
          break;
        }

        default: {
          // Unknown action type — log in dev, fail silently in prod
          if (__DEV__) {
            console.warn(
              `[ActionDispatcher] Unknown action type: "${action.type}". Action dropped safely.`
            );
          }
          break;
        }
      }
    } catch (error) {
      // Defensive: action dispatch must never crash the UI
      if (__DEV__) {
        console.error('[ActionDispatcher] Error dispatching action:', action, error);
      }
    }
  };
}

// ──────────────────────────────────────────────────────────
// FACTORY — create a dispatcher bound to cart & nav handlers
// ──────────────────────────────────────────────────────────
export function createDispatcher(handlers: ActionHandlerMap): ActionDispatcher {
  return new ActionDispatcher(handlers);
}
