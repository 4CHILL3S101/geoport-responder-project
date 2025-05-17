import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import {SERVER_IP,SERVER_PORT,CHECK_USER_VALIDITY} from "@env"

export default class UserController{
  
  async signinController(email, password) {
    const firebaseErrorMessages = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/user-disabled": "Your account has been disabled. Please contact support.",
      "auth/too-many-requests": "Too many failed attempts. Try again later.",
      "auth/network-request-failed": "Network error. Please check your internet connection.",
    };    
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { successful: true };
    } catch (error) {
      const customMessage = firebaseErrorMessages[error.code] || "An unexpected error occurred.";
      return { successful: false, error: customMessage };
    }
  }
  
  

  async checkResponderValidity(){
      try{
           let url = `http://${SERVER_IP}:${SERVER_PORT}/${CHECK_USER_VALIDITY}`
          const isAccountValid = await axios.post(url,data,{
            headers: {
              "Content-Type": "application/json",
            }
          })

          if(isAccountValid.status === 200){
              return true
          }else{
            return false
          }
      }catch(error){
        console.error(error)
      }
  }


  async  signoutController(){
            const auth = getAuth();
            try {
            await signOut(auth);
            console.log("User signed out successfully!");
            } catch (error) {
            console.error("Error signing out: ", error);
            }
    }
}