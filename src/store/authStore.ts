import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const defaultCredentials = {
  email: 'rajan@devinfotech.net',
  password: 'Dev!nf0tech@07'
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: (email: string, password: string) => {
    if (email === defaultCredentials.email && password === defaultCredentials.password) {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false })
}));