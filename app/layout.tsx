import { AuthProvider } from '@/components/auth/AuthProvider';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta
          name="google-site-verification"
          content="_6dVqOelkYiLj5bRALMnjPYBr2u-xN_foeQhFSZ2AeU"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
