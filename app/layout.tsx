import { AuthProvider } from '@/components/auth/AuthProvider';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta
          name="google-site-verification"
          content="_6dVqOeIkYiLj5bRALMmjPYBr2u-xN_foeOhFSZ2Ael"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
