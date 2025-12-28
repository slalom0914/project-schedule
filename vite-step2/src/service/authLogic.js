import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import app from "./firebase"
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
/*
  인증처리/인가 처리
  Front : React(localStorage활용 -> OAuth토큰방식)
  Back : 서블릿(쿠키, 세션 제공)
*/
/*
  구글 로그인
*/
export const loginGoogle = async() => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    console.log(user)
    window.localStorage.setItem("uid", user.uid)
    window.localStorage.setItem("email", user.email)
    return user
  } catch (error) {
    console.error("구글 로그인 실패", error)
    throw error
  }
}//end of loginGoogle

/*
  구글 로그아웃
*/
export const logout = async () => {
  console.log('logout')
  try {
    //구글 firebase에서 로그아웃 처리를 해줌
    await signOut(auth)
    //로그인 성공시 localStorage저장해둔 정보 삭제처리
    window.localStorage.removeItem("uid");
    window.localStorage.removeItem("email");
  } catch(error){
      console.error("로그아웃", error)
  }  
}//end of logout
/*
  구글 인증 상태 변화 감지
*/
export const subscribeAuth = (callback) => {
  console.log('subscribeAuth')
  return onAuthStateChanged(auth, (user) => {
    callback(user)
  })
}

