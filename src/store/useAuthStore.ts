import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db, signInWithGoogle } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role?: 'admin' | 'user';
  badges: string[];
  stats: {
    highestWpm: number;
    highestAccuracy: number;
    averageWpm: number;
    averageAccuracy: number;
    totalTests: number;
    totalXP: number;
    level: number;
    coins: number;
  };
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isSigningIn: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
  fetchProfile: (uid: string) => Promise<void>;
  updateStats: (wpm: number, accuracy: number) => Promise<void>;
}

const ADM_EMAILS = [
    'riat.moshiur22@gmail.com', 
    'riat.moshiur22@diu.edu.bd',
    'riat.moshiur.22@gmail.com',
    'rahaman242-35-606@diu.edu.bd'
];

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isSigningIn: false,
  error: null,
  setUser: (user) => {
    set({ user, loading: false, isAdmin: user ? ADM_EMAILS.includes(user.email || '') : false });
    if (user) {
      if (!user.emailVerified) {
         set({ error: 'Email verification required by neural firewall.' });
      }
      get().fetchProfile(user.uid);
    } else {
      set({ profile: null, isAdmin: false });
    }
  },
  setError: (error) => set({ error }),
  login: async () => {
    if (get().isSigningIn) return;
    set({ isSigningIn: true, error: null });
    try {
      const user = await signInWithGoogle();
      if (user && !user.emailVerified) {
         set({ error: 'Connection rejected: Unverified frequency found.' });
      }
    } catch (error: any) {
      console.error('Store login error:', error);
      set({ error: error.message || 'FATAL: Neural synchronization protocol failed.' });
    } finally {
      set({ isSigningIn: false });
    }
  },
  logout: async () => {
    try {
      await auth.signOut();
      set({ user: null, profile: null, isAdmin: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  fetchProfile: async (uid) => {
    const userDoc = doc(db, 'users', uid);
    const snap = await getDoc(userDoc);
    
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      set({ profile: { ...data, badges: data.badges || [] } });
    } else {
      // Initialize new profile
      const { user } = get();
      if (!user) return;
      
      const newProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'Typogrammer',
        email: user.email || '',
        photoURL: user.photoURL || '',
        role: ADM_EMAILS.includes(user.email || '') ? 'admin' : 'user',
        badges: [],
        stats: {
          highestWpm: 0,
          highestAccuracy: 0,
          averageWpm: 0,
          averageAccuracy: 0,
          totalTests: 0,
          totalXP: 0,
          level: 1,
          coins: 100
        }
      };
      await setDoc(userDoc, { ...newProfile, createdAt: serverTimestamp() });
      set({ profile: newProfile });
    }
  },
  updateStats: async (wpm, accuracy) => {
    const { profile, user } = get();
    if (!profile || !user) return;

    const newTests = profile.stats.totalTests + 1;
    const newAvgWpm = (profile.stats.averageWpm * profile.stats.totalTests + wpm) / newTests;
    const newAvgAcc = (profile.stats.averageAccuracy * profile.stats.totalTests + accuracy) / newTests;
    const newHighestWpm = Math.max(profile.stats.highestWpm, wpm);
    const newHighestAccuracy = Math.max(profile.stats.highestAccuracy || 0, accuracy);
    const xpGained = Math.floor(wpm * (accuracy / 100)) * 5; // Balanced XP
    const newXP = profile.stats.totalXP + xpGained;
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1; // Square root scaling for levels
    const coinsGained = Math.floor(wpm / 10) + (accuracy === 100 ? 50 : 0);

    // Award badges
    const newBadges = [...(profile.badges || [])];
    if (newHighestWpm >= 50 && !newBadges.includes('speed_demon_50')) newBadges.push('speed_demon_50');
    if (newHighestWpm >= 80 && !newBadges.includes('high_velocity_80')) newBadges.push('high_velocity_80');
    if (newHighestWpm >= 100 && !newBadges.includes('sonic_scribe_100')) newBadges.push('sonic_scribe_100');
    if (newHighestWpm >= 120 && !newBadges.includes('neural_overdrive_120')) newBadges.push('neural_overdrive_120');
    if (accuracy === 100 && !newBadges.includes('pixel_perfect')) newBadges.push('pixel_perfect');
    if (newLevel >= 10 && !newBadges.includes('veteran_node')) newBadges.push('veteran_node');
    if (newLevel >= 25 && !newBadges.includes('cyber_sentinel')) newBadges.push('cyber_sentinel');
    if (newTests >= 100 && !newBadges.includes('marathon_scribe')) newBadges.push('marathon_scribe');

    const updatedProfile = {
      ...profile,
      badges: newBadges,
      stats: {
        ...profile.stats,
        totalTests: newTests,
        averageWpm: Math.round(newAvgWpm),
        averageAccuracy: Math.round(newAvgAcc),
        highestWpm: newHighestWpm,
        highestAccuracy: newHighestAccuracy,
        totalXP: newXP,
        level: newLevel,
        coins: profile.stats.coins + coinsGained
      }
    };

    await updateDoc(doc(db, 'users', user.uid), {
      'stats': updatedProfile.stats,
      'badges': updatedProfile.badges
    });
    set({ profile: updatedProfile });
  }
}));

// Initialize auth listener
onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user);
});
