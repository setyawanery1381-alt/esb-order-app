import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

const STORAGE_FIREBASE_CONFIG_KEY = 'esb_firebase_config';

export const getSavedFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_FIREBASE_CONFIG_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to parse saved Firebase config', e);
  }

  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };
  }

  return null;
};

export const saveFirebaseConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_FIREBASE_CONFIG_KEY, JSON.stringify(config));
    window.location.reload();
  } catch (e) {
    console.error('Failed to save config', e);
  }
};

let db = null;
const config = getSavedFirebaseConfig();
if (config && config.projectId) {
  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
    db = getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization error', err);
  }
}

export const isFirebaseActive = () => !!db;

// Firestore real-time listeners and mutations:
export const subscribeToOrders = (onData) => {
  if (!db) return () => {};
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => doc.data());
      onData(orders);
    }, (err) => console.warn('Firestore orders listener error', err));
  } catch (err) {
    console.warn('subscribeToOrders error', err);
    return () => {};
  }
};

export const saveOrderToFirestore = async (order) => {
  if (!db) return;
  try {
    await setDoc(doc(db, 'orders', order.orderId), order);
  } catch (err) {
    console.error('Firestore saveOrder error', err);
  }
};

export const updateOrderStatusInFirestore = async (orderId, newStatus) => {
  if (!db) return;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      orderStatus: newStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Firestore updateOrderStatus error', err);
  }
};

export const subscribeToWaiterCalls = (onData) => {
  if (!db) return () => {};
  try {
    const q = query(collection(db, 'waiterCalls'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const calls = snapshot.docs.map(doc => doc.data());
      onData(calls);
    }, (err) => console.warn('Firestore waiterCalls listener error', err));
  } catch (err) {
    console.warn('subscribeToWaiterCalls error', err);
    return () => {};
  }
};

export const saveWaiterCallToFirestore = async (call) => {
  if (!db) return;
  try {
    await setDoc(doc(db, 'waiterCalls', call.id), call);
  } catch (err) {
    console.error('Firestore saveWaiterCall error', err);
  }
};

export const resolveWaiterCallInFirestore = async (callId) => {
  if (!db) return;
  try {
    await updateDoc(doc(db, 'waiterCalls', callId), {
      resolved: true,
    });
  } catch (err) {
    console.error('Firestore resolveWaiterCall error', err);
  }
};
