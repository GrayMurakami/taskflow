import { ref } from 'vue'
import { supabase } from '@/shared/api/supabase'
import type { User } from '@supabase/supabase-js'

const user = ref<User | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function login(email: string, password: string) {
  isLoading.value = true;
  error.value = null;

  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    error.value = loginError.message;
    isLoading.value = false;
    return false
  }

  user.value = data.user;
  isLoading.value = false;
  return true
}

async function loginAsGuest() {
  return login(
    import.meta.env.VITE_DEMO_EMAIL,
    import.meta.env.VITE_DEMO_PASSWORD
  )
}

async function register(email: string, password: string) {
  isLoading.value = true;
  error.value = null;

  const { data, error: registerError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (registerError) {
    error.value = registerError.message;
    isLoading.value = false;
    return false
  }

  user.value = data.user;
  isLoading.value = false;
  return true
}

async function logout() {
  const { error: logoutError } = await supabase.auth.signOut();

  if (!logoutError) {
    user.value = null;
  }
}

async function initAuth() {
  const { data } = await supabase.auth.getSession();
  user.value = data.session?.user ?? null;

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null;
  });
}

export function useAuth() {
  return {
    user,
    isLoading,
    error,
    login,
    loginAsGuest,
    register,
    logout,
    initAuth
  }
}
