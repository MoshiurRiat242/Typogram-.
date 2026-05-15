import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  browserPopupRedirectResolver,
  indexedDBLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Use indexedDB persistence if available, falling back to default
setPersistence(auth, indexedDBLocalPersistence).catch(err => console.error("Persistence error:", err));

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

let isSigningIn = false;

export async function signInWithGoogle() {
  if (isSigningIn) return;
  isSigningIn = true;
  
  try {
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    return result.user;
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.code === 'auth/popup-blocked') {
        alert('The sign-in popup was blocked by your browser. Please allow popups for this site or open the application in a new tab.');
    } else if (error.code === 'auth/cancelled-popup-request' || error.message?.includes('Pending promise')) {
        // These are often due to multiple clicks or iframe restrictions
        console.warn('Auth request interrupted or overlapping. Retrying might work if done from a fresh user action.');
    } else {
        alert(`Authentication error: ${error.message}. Try opening the app in a new tab if you're in a restricted environment.`);
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
}

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection successful');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();
