// Firebaseのコア機能とAuthenticationをインポート
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY, // あなたのAPIキー
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID, // あなたのSender ID
  appId: process.env.FIREBASE_APP_ID, // あなたのApp ID
  measurementId: process.env.FIREBASE_MEASUREMENT_ID // Google Analyticsを使っている場合
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);

// Authenticationサービスを取得
export const auth = getAuth(app);

