import { AuthProvider } from '@/components/auth/AuthProvider';

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
