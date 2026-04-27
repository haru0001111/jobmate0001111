import { AuthProvider } from '@/components/auth/AuthProvider';

<head>
 <meta name="google-site-verification" content="_6dVqOelkYiLj5bRALMnjPYBr2u-xN_foeQhFSZ2AeU" />
<head>

export default function RootLayout({ children }: any) {
 return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
