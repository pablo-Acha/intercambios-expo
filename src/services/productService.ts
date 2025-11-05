import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  orderBy,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../app/config/firebase";

export const createProduct = async (payload: any, ownerId: string) => {
  const colRef = collection(db, "products");
  const data = { 
    ...payload, 
    ownerId, 
    status: "pending", 
    createdAt: serverTimestamp(),
    location: payload.location ? {
      latitude: Number(payload.location.latitude),
      longitude: Number(payload.location.longitude),
      address: payload.location.address || '',
      meetingPoint: payload.location.meetingPoint || ''
    } : null
  };
  const refDoc = await addDoc(colRef, data);
  return refDoc.id;
};

export const fetchPendingProducts = async () => {
  const colRef = collection(db, "products");
  const q = query(colRef, where("status", "==", "pending"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const fetchApprovedProducts = async () => {
  const colRef = collection(db, "products");
  const q = query(colRef, where("status", "==", "approved"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const fetchProductsByOwner = async (uid: string) => {
  const colRef = collection(db, "products");
  const q = query(colRef, where("ownerId", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteProduct = async (productId: string) => {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);
  const data: any = docSnap.exists() ? docSnap.data() : {};
  if (data.image) {
    const storageRef = ref(storage, data.image);
    await deleteObject(storageRef).catch(() => {});
  }
  await deleteDoc(docRef);
};

export const updateProduct = async (productId: string, payload: any) => {
  const docRef = doc(db, "products", productId);
  await updateDoc(docRef, payload);
};

export const approveProduct = async (productId: string, adminId: string) => {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, { status: "approved", approvedBy: adminId, approvedAt: serverTimestamp() });
  const logRef = doc(collection(productRef, "moderationLogs"));
  await setDoc(logRef, { action: "approved", adminId, timestamp: serverTimestamp() });
};

export const rejectProduct = async (productId: string, adminId: string, reason?: string) => {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, {
    status: "rejected",
    rejectedBy: adminId,
    rejectedAt: serverTimestamp(),
    rejectedReason: reason || null,
  });
  const logRef = doc(collection(productRef, "moderationLogs"));
  await setDoc(logRef, { action: "rejected", reason: reason || null, adminId, timestamp: serverTimestamp() });
};

export const updateProductStatus = async (productId: string, status: 'available' | 'reserved' | 'sold') => {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, { 
    status,
    updatedAt: serverTimestamp()
  });
};

export const getProductSeller = async (productId: string) => {

  return {
    userId: 'seller_user_id', 
    username: 'seller_username',
    email: 'seller@example.com'
  };
};
export const getProductById = async (productId: string) => {
  try {
    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        location: data.location ? {
          latitude: Number(data.location.latitude),
          longitude: Number(data.location.longitude),
          address: data.location.address || '',
          meetingPoint: data.location.meetingPoint || ''
        } : null
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw error;
  }
};
