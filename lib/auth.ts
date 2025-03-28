import { supabase } from "./supabase";

export const signUp = async (
  email: string,
  password: string,
  displayName: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { displayName },
      emailRedirectTo: `${window.location.origin}/auth/callback`, 
    },
  });

  if (error) throw error;
  return data;
};

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const logout = async () => {
  await supabase.auth.signOut();
};

export const getUserDisplayName = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) return null;

  return data.user.user_metadata?.displayName || "User";
};