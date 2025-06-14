// authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { auth } from "../lib/firebase";
import AuthState from "./state/authState";

// パスワードのバリデーション
export const validatePassword = (password: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("パスワードは8文字以上である必要があります");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("小文字を1文字以上含めてください");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("大文字を1文字以上含めてください");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("数字を1文字以上含めてください");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};


// ユーザー登録
export const signUp = async (email: string, password: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// ログイン
export const login = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// ログアウト
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// 認証状態を監視（ログイン中ユーザー取得など）
export const initAuth = (callback: (user: User | null) => void): void => {
  onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in

    AuthState.getState().user = user;
    AuthState.getState().notify();
  } else {
    // User is signed out
    
    AuthState.getState().user = user;
    AuthState.getState().notify();;
  }
});

};
