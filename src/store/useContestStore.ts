import { create } from 'zustand';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs,
  orderBy
} from 'firebase/firestore';

interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: any;
  createdAt: any;
  startAt?: string; // ISO string
  endAt?: string; // ISO string
  duration: number;
  text: string;
  createdBy: string;
  createdByDisplayName?: string;
  isPublic: boolean;
  status: 'scheduled' | 'active' | 'finished';
  inviteCode?: string;
  minWpm?: number;
  maxParticipants?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface ContestState {
  contests: Contest[];
  loading: boolean;
  createContest: (data: Omit<Contest, 'id' | 'status' | 'startTime' | 'createdAt' | 'inviteCode'> & { inviteCode?: string, minWpm?: number, maxParticipants?: number, difficulty?: 'easy' | 'medium' | 'hard' }) => Promise<string>;
  fetchContests: (filters?: { status?: string; createdBy?: string; isPublic?: boolean }, isAdmin?: boolean) => Promise<void>;
  fetchContestById: (id: string) => Promise<Contest | null>;
  deleteContest: (id: string) => Promise<void>;
  updateContestStatus: (id: string, status: Contest['status']) => Promise<void>;
}

export const useContestStore = create<ContestState>((set, get) => ({
  contests: [],
  loading: false,
  createContest: async (data) => {
    const docRef = await addDoc(collection(db, 'contests'), {
      ...data,
      status: 'scheduled',
      startTime: serverTimestamp(),
      createdAt: serverTimestamp(),
      minWpm: data.minWpm || 0,
      maxParticipants: data.maxParticipants || 0,
      difficulty: data.difficulty || 'medium'
    });
    return docRef.id;
  },
  fetchContests: async (filters, isAdmin = false) => {
    set({ loading: true });
    let q = query(collection(db, 'contests'), orderBy('createdAt', 'desc'));
    
    const snap = await getDocs(q);
    let contests = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contest));
    
    if (!isAdmin) {
      // Only show public or owned contests for regular users
      // For simplicity here, regular fetch only shows public if no specific filter
      contests = contests.filter(c => c.isPublic || filters?.createdBy === c.createdBy);
    }

    if (filters) {
      if (filters.status) contests = contests.filter(c => c.status === filters.status);
      if (filters.createdBy) contests = contests.filter(c => c.createdBy === filters.createdBy);
      if (filters.isPublic !== undefined) contests = contests.filter(c => c.isPublic === filters.isPublic);
    }

    set({ contests, loading: false });
  },
  fetchContestById: async (id) => {
    const { doc, getDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'contests', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Contest;
    }
    return null;
  },
  deleteContest: async (id) => {
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'contests', id));
    set({ contests: get().contests.filter(c => c.id !== id) });
  },
  updateContestStatus: async (id, status) => {
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'contests', id), { status });
    set({ 
      contests: get().contests.map(c => c.id === id ? { ...c, status } : c)
    });
  }
}));
