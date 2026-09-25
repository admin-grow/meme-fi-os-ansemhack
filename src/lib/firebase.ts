import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface RecentGenerationRecord {
  id?: string;
  token_name: string;
  ticker: string;
  tagline: string;
  category: string;
  prompt: string;
  mascot_prompt?: string;
  mascot_svg?: string;
  rallying_phrase?: string;
  viral_score?: number;
  agent1?: any;
  agent2?: any;
  agent3?: any;
  createdAt: string;
}

/**
 * Fetch recent token generation campaigns directly from Firestore
 */
export async function fetchRecentGenerationsFromDb(count = 12): Promise<RecentGenerationRecord[]> {
  try {
    const q = query(
      collection(db, 'recent_generations'),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as RecentGenerationRecord[];
  } catch (err) {
    console.warn('Failed to fetch recent generations from Firestore:', err);
    return [];
  }
}

/**
 * Persist a newly generated campaign directly to Firestore
 */
export async function persistRecentGenerationToDb(
  data: Omit<RecentGenerationRecord, 'id' | 'createdAt'>
): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'recent_generations'), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (err) {
    console.error('Failed to persist recent generation to Firestore:', err);
    return null;
  }
}
