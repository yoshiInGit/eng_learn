// Firebaseのコア機能とAuthenticationをインポート
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // あなたのAPIキー
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, // あなたのSender ID
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID, // あなたのApp ID
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Google Analyticsを使っている場合
};

// Firebaseを初期化
export const app = initializeApp(firebaseConfig);

// // Authenticationサービスを取得
export const auth = getAuth(app);

