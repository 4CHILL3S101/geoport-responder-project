import { auth } from "../firebaseConfig";
import noauthapi from "../utils/noauth/noauthapi";
import { signInWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { SERVER_IP, SERVER_PORT, CHECK_USER_VALIDITY } from "@env";

export default class UserController {
  async signinController(email, password) {
    const firebaseErrorMessages = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/user-disabled":
        "Your account has been disabled. Please contact support.",
      "auth/too-many-requests": "Too many failed attempts. Try again later.",
      "auth/network-request-failed":
        "Network error. Please check your internet connection.",
    };

    try {
      const auth = getAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (result && result.user) {
        const id = result.user.uid;
        const url = `${CHECK_USER_VALIDITY}/${id}`;

        const response = await noauthapi.post(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${await result.user.getIdToken()}`,
            },
          }
        );
        console.log(response.data.status);
        if (response && response.data.status === "success") {
          return { successful: true };
        } else {
          return { successful: false, error: "Not a valid responder account." };
        }
      } else {
        return {
          successful: false,
          error: "Failed to retrieve user credentials.",
        };
      }
    } catch (error) {
      const customMessage =
        firebaseErrorMessages[error.code] || "An unexpected error occurred.";
      return { successful: false, error: customMessage };
    }
  }

  async signoutController() {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("User signed out successfully!");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }
}
