'use client';

import { Provider } from 'react-redux';
import store from '../store/store';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthProvider from './AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SidebarProvider>
          <AuthProvider>
{children}
          </AuthProvider>
          
        </SidebarProvider>
      </ThemeProvider>
    </Provider>
  );
}