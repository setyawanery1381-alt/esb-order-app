import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENU_ITEMS, RESTAURANT_INFO } from '../data/menuData';

const AppContext = createContext();

const STORAGE_ORDERS_KEY = 'esb_kitchen_orders';
const STORAGE_WAITER_KEY = 'esb_waiter_calls';
const STORAGE_STOCK_KEY = 'esb_menu_stock';

export const AppProvider = ({ children }) => {
  // Parse URL query parameters & path: /CPBS/RRGW/order?mode=dinein&tableNumber=38
  const getInitialParams = () => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode') || 'dinein';
    const table = params.get('tableNumber') || '38';

    // Parse path segments, e.g. /CPBS/RRGW/order
    const segments = window.location.pathname.split('/').filter(Boolean);
    const company = segments.length >= 1 && segments[0].toLowerCase() !== 'order' ? segments[0].toUpperCase() : RESTAURANT_INFO.companyCode;
    const branch = segments.length >= 2 && segments[1].toLowerCase() !== 'order' ? segments[1].toUpperCase() : RESTAURANT_INFO.branchCode;

    return { mode, table, company, branch };
  };

  const { mode: initMode, table: initTable, company: initCompany, branch: initBranch } = getInitialParams();

  const [companyCode, setCompanyCode] = useState(initCompany);
  const [branchCode, setBranchCode] = useState(initBranch);
  const [orderMode, setOrderMode] = useState(initMode); // 'dinein' | 'takeaway'
  const [tableNumber, setTableNumber] = useState(initTable);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Cart state
  const [cart, setCart] = useState([]);

  // Active tracking order
  const [activeOrderId, setActiveOrderId] = useState(null);

  // View modes: 'customer' | 'kitchen' | 'qr_generator'
  const [viewMode, setViewMode] = useState('customer');

  // Kitchen / Global orders synced via localStorage and events
  const [kitchenOrders, setKitchenOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Waiter calls
  const [waiterCalls, setWaiterCalls] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WAITER_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Out of stock tracking
  const [outOfStockIds, setOutOfStockIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STOCK_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(kitchenOrders));
  }, [kitchenOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_WAITER_KEY, JSON.stringify(waiterCalls));
  }, [waiterCalls]);

  useEffect(() => {
    localStorage.setItem(STORAGE_STOCK_KEY, JSON.stringify(outOfStockIds));
  }, [outOfStockIds]);

  // Listen to cross-tab updates via storage event & BroadcastChannel
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel('esb_sync_channel');
      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'NEW_ORDER' || type === 'UPDATE_ORDER_STATUS') {
          if (payload && Array.isArray(payload)) {
            setKitchenOrders(payload);
          } else {
            const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
            if (saved) setKitchenOrders(JSON.parse(saved));
          }
        } else if (type === 'WAITER_CALL' || type === 'RESOLVE_WAITER_CALL') {
          if (payload && Array.isArray(payload)) {
            setWaiterCalls(payload);
          } else {
            const saved = localStorage.getItem(STORAGE_WAITER_KEY);
            if (saved) setWaiterCalls(JSON.parse(saved));
          }
        } else if (type === 'TOGGLE_STOCK') {
          if (payload && Array.isArray(payload)) {
            setOutOfStockIds(payload);
          } else {
            const saved = localStorage.getItem(STORAGE_STOCK_KEY);
            if (saved) setOutOfStockIds(JSON.parse(saved));
          }
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }

    const handleStorage = (e) => {
      if (e.key === STORAGE_ORDERS_KEY && e.newValue) {
        setKitchenOrders(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_WAITER_KEY && e.newValue) {
        setWaiterCalls(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_STOCK_KEY && e.newValue) {
        setOutOfStockIds(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const broadcast = (type, payload) => {
    try {
      const channel = new BroadcastChannel('esb_sync_channel');
      channel.postMessage({ type, payload });
      setTimeout(() => {
        try { channel.close(); } catch {}
      }, 1000);
    } catch (e) {
      console.warn('BroadcastChannel error', e);
    }
  };

  // Add item to cart
  const addToCart = (item, selectedModifiers, notes, quantity) => {
    // Calculate total unit price including modifiers
    let unitPrice = item.price;
    Object.values(selectedModifiers).forEach(mod => {
      if (Array.isArray(mod)) {
        mod.forEach(opt => { unitPrice += opt.price || 0; });
      } else if (mod && mod.price) {
        unitPrice += mod.price;
      }
    });

    const cartItemId = `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const newItem = {
      cartItemId,
      item,
      selectedModifiers,
      notes,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };

    setCart(prev => [...prev, newItem]);
  };

  // Update item quantity in cart
  const updateCartItemQty = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(cItem => {
      if (cItem.cartItemId === cartItemId) {
        return {
          ...cItem,
          quantity: newQty,
          totalPrice: cItem.unitPrice * newQty,
        };
      }
      return cItem;
    }));
  };

  // Remove from cart
  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(c => c.cartItemId !== cartItemId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Cart calculations
  const subtotal = cart.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const serviceCharge = Math.round(subtotal * (RESTAURANT_INFO.serviceChargePercent / 100));
  const tax = Math.round((subtotal + serviceCharge) * (RESTAURANT_INFO.taxPercent / 100));
  const grandTotal = subtotal + serviceCharge + tax;
  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  // Submit Order
  const submitOrder = (paymentMethod = 'CASHIER') => {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      orderId,
      tableNumber,
      orderMode,
      customerName: customerName.trim() || `Pelanggan Meja ${tableNumber}`,
      customerPhone: customerPhone.trim() || '-',
      items: [...cart],
      subtotal,
      serviceCharge,
      tax,
      grandTotal,
      paymentMethod, // 'QRIS' | 'CASHIER'
      paymentStatus: paymentMethod === 'QRIS' ? 'PAID' : 'PENDING_CASHIER',
      orderStatus: 'RECEIVED', // 'RECEIVED' -> 'COOKING' -> 'READY' -> 'COMPLETED'
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newOrder, ...kitchenOrders];
    setKitchenOrders(updated);
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('localStorage error', e);
    }
    setActiveOrderId(orderId);
    clearCart();
    broadcast('NEW_ORDER', updated);
    return newOrder;
  };

  // Update Order Status (for Kitchen staff)
  const updateOrderStatus = (orderId, newStatus) => {
    const updated = kitchenOrders.map(ord => {
      if (ord.orderId === orderId) {
        return { ...ord, orderStatus: newStatus, updatedAt: new Date().toISOString() };
      }
      return ord;
    });
    setKitchenOrders(updated);
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('localStorage error', e);
    }
    broadcast('UPDATE_ORDER_STATUS', updated);
  };

  // Call Waiter
  const callWaiter = (reason) => {
    const newCall = {
      id: `call-${Date.now()}`,
      tableNumber,
      reason,
      createdAt: new Date().toISOString(),
      resolved: false,
    };
    const updated = [newCall, ...waiterCalls];
    setWaiterCalls(updated);
    try {
      localStorage.setItem(STORAGE_WAITER_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('localStorage error', e);
    }
    broadcast('WAITER_CALL', updated);
    return newCall;
  };

  // Resolve Waiter Call
  const resolveWaiterCall = (callId) => {
    const updated = waiterCalls.map(c => c.id === callId ? { ...c, resolved: true } : c);
    setWaiterCalls(updated);
    try {
      localStorage.setItem(STORAGE_WAITER_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('localStorage error', e);
    }
    broadcast('RESOLVE_WAITER_CALL', updated);
  };

  // Toggle Out of Stock
  const toggleItemStock = (menuId) => {
    setOutOfStockIds(prev => {
      const exists = prev.includes(menuId);
      const updated = exists ? prev.filter(id => id !== menuId) : [...prev, menuId];
      try {
        localStorage.setItem(STORAGE_STOCK_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('localStorage error', e);
      }
      broadcast('TOGGLE_STOCK', updated);
      return updated;
    });
  };

  // Find active order for this table
  const currentTableOrder = kitchenOrders.find(
    ord => ord.orderId === activeOrderId || (ord.tableNumber === tableNumber && ord.orderStatus !== 'COMPLETED')
  );

  return (
    <AppContext.Provider
      value={{
        companyCode,
        branchCode,
        orderMode,
        setOrderMode,
        tableNumber,
        setTableNumber,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        cart,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        subtotal,
        serviceCharge,
        tax,
        grandTotal,
        totalCartCount,
        submitOrder,
        activeOrderId,
        setActiveOrderId,
        currentTableOrder,
        kitchenOrders,
        updateOrderStatus,
        waiterCalls,
        callWaiter,
        resolveWaiterCall,
        outOfStockIds,
        toggleItemStock,
        viewMode,
        setViewMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
