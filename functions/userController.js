import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import {SERVER_IP,SERVER_PORT,CHECK_USER_VALIDITY} from "@env"

export default class UserController{

  async signinController(email,password){
        console.log('running signinController')
        console.log('email:',email, "password is ",password)
        const isAccountValid =  await signInWithEmailAndPassword(auth, email, password)
        return isAccountValid.user
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