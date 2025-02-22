
import React, { useEffect, useState } from "react";
import { createContext } from "react";
import Swal from "sweetalert2";
import { auth } from "../../Firebase/firebase.init";
import { GoogleAuthProvider } from "firebase/auth";
import { onAuthStateChanged, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import axios from "axios";

export const authContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  // Login in with google
  const provider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    return signInWithPopup(auth, provider)
      .then(async(result) => {
        setUser(result.user);
        setLoading(false)
        // send user infor to database
        Swal.fire({
          position: "center center",
          icon: "success",
          title: "Login With google Successful!",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: `${error.code}. ${error.message}`,
        });
      });
  };

  
  // Update user profile
  const profileUpdate = (updatedInfo) => {
    return updateProfile(auth.currentUser, updatedInfo)
      .then(() => {
        Swal.fire({
          position: "center center",
          icon: "success",
          title: "Profile Updated",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: `${error.code}. ${error.message}`,
        });
      });
  };

  // Sign out
  const userSignOut = () => {
    return signOut(auth)
      .then(() => {
        localStorage.removeItem('access-token');
        setUser(null)
        Swal.fire({
          position: "center center",
          icon: "success",
          title: "Signed Out",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: `${error.code}. ${error.message}`,
        });
      });
  };

  // currently signed in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
      if (currentUser?.email) {
        setUser(currentUser);

        console.log(currentUser)
        
        // Send new user data database
        const {data} = await axios.post(`${import.meta.env.VITE_MAIN_URL}/users/${currentUser?.email}`, {
          name: currentUser?.displayName,
          email: currentUser?.email,
          image: currentUser?.photoURL
        })
      }

      setLoading(false)

    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authContextValue = {
    loading,
    user,
    signInWithGoogle,
    profileUpdate,
    userSignOut,
  };

  return (
    <authContext.Provider value={authContextValue}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
