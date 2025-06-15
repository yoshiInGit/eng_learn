"use client"

import { Mail, Lock} from 'lucide-react';
import { useRef, useState } from 'react';
import { signUp, validatePassword } from '../../action/auth'; 
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter()

  // ログインフォームとサインアップフォームの表示を切り替えるための状態
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => {
    emailRef.current = "";
    passwordRef.current = "";
    confirmPasswordRef.current = "";
    setIsLogin(!isLogin);
  }

  const [passwordValidateErrMsg, setPasswordValidateErrMsg] = useState("");

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");


  const onSignUpClick = async () => {
    const result = validatePassword(passwordRef.current);
    if (passwordRef.current !== confirmPasswordRef.current) {
      setPasswordValidateErrMsg("パスワードが一致しません");
      return;
    }
    
    if (result.valid == false) {
      setPasswordValidateErrMsg(result.errors[0]);
      return;
    }

    // パスワードのバリデーションが成功した場合、サインアップを実行
    try {
      await signUp(emailRef.current, passwordRef.current);
      router.push('/'); // サインアップ成功後、ホームページにリダイレクト
    }catch (error) {
      //TODO: エラー処理
    }

  }

  const onLoginClick = async () => {
    // ログイン処理を実装
    try {
      await signUp(emailRef.current, passwordRef.current);
      router.push('/'); // ログイン成功後、ホームページにリダイレクト
    } catch (error) {
      //TODO: エラー処理  
      console.error("ログインエラー:", error);      
    }
}

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* フォームコンテナ */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* ヘッダーと切り替えボタン */}
        <div className="flex flex-col gap-2 justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'ログイン' : 'サインアップ'}
          </h2>
          <button
            onClick={() => toggleForm()}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors duration-200 cursor-pointer"
          >
            {isLogin ? 'アカウントをお持ちでないですか？ サインアップ' : 'すでにアカウントをお持ちですか？ ログイン'}
          </button>
        </div>

        {/* フォーム本体 */}
        {isLogin ? (

          // ログインフォーム
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                  onChange={(e) => emailRef.current = e.target.value}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                  onChange={(e) => passwordRef.current = e.target.value}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  パスワードをお忘れですか？
                </a>
              </div>
            </div>

            <div>
              <button
                onClick={onLoginClick}
                className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                ログイン
              </button>
            </div>
          </div>
        ) : (


          // サインアップフォーム
          <div className="space-y-6">
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="signup-email"
                  name="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                  onChange={(e) => emailRef.current = e.target.value}
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="signup-password"
                  name="signup-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                  onChange={(e) => passwordRef.current = e.target.value}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワードの確認
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                  onChange={(e) => confirmPasswordRef.current = e.target.value}
                />
              </div>
            </div>

            <div className="text-red-500 text-sm">
              {passwordValidateErrMsg}
            </div>

            <div>
              <button
                onClick={onSignUpClick}
                className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                サインアップ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;