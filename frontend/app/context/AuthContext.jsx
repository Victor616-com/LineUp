import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";
const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Sign up
  const signUpNewUser = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { success: false, error };

    // Insert username into profile table
    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: user.id, username });

      if (profileError) return { success: false, error: profileError };
    }

    return { success: true, data };
  };

  // Sign in
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.log("Error signing in:", error);
        return { success: false, error };
      }
      console.log("Sign-in successful:", data); // Remove before deployment
      return { success: true, data }; // Remove before deployment
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Sign Out
  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, setSession, signUpNewUser, signInUser, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
