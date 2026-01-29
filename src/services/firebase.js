import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'registrations';

export const saveRegistration = async (data) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Firestore save error:', error);
    throw new Error('Failed to save registration. Please try again.');
  }
};

export const getAllRegistrations = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Firestore fetch error:', error);
    throw new Error('Failed to fetch registrations.');
  }
};
