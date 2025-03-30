"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  getUserDisplayName: () => Promise<string>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  getUserDisplayName: async () => "",
  signUp: async () => ({}),
  signIn: async () => ({}),
  signOut: async () => ({}),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);

        // Only sync for specific events
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          try {
            await fetch('/api/auth/sync', { 
              method: 'POST',
              cache: 'no-store'
            });
          } catch (error) {
            console.error('Failed to sync auth state:', error);
          }
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const getUserDisplayName = async (): Promise<string> => {
    if (!user) return "Guest";

    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user?.user_metadata?.displayName || "User";
    } catch (error) {
      console.error("Error getting user display name:", error);
      return "Guest";
    }
  };

  const value = {
    user,
    loading,
    getUserDisplayName,
    signUp: async (email: string, password: string, displayName: string) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { displayName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setUser(data.user);
        return {};
      } catch (error: any) {
        console.error("Sign up error:", error);
        throw error.message;
        //return { error: error.message };
      } finally {
        setLoading(false);
      }
    },
    signIn: async (email: string, password: string) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setUser(data.user);
        return {};
      } catch (error: any) {
        console.error("Sign in error:", error);
        throw error.message;
        //return { error: error.message };
      } finally {
        setLoading(false);
      }
    },
    signOut: async () => {
      setLoading(true);
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        return {};
      } catch (error: any) {
        console.error("Sign out error:", error);
        return { error: error.message };
      } finally {
        setLoading(false);
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};