import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, getAuth, signOut } from "firebase/auth";


export default class UserController{

  async signinController(email,password){
        console.log('running signinController')
        console.log('email:',email, "password is ",password)
        const isAccountValid =  await signInWithEmailAndPassword(auth, email, password)
        return isAccountValid.user
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