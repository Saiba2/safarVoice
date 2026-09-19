import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/contexts/ToastContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { PreferencesProvider } from '@/contexts/PreferencesContext';
import { THEME_INIT_SCRIPT } from '@/lib/preferences';

// The Banani theme pins DM Sans for both body and headings. The variable is
// consumed by --font-body / --font-headings in globals.css.
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SafarVoice — Voice AI, Without Borders',
  description:
    'Transformez vos textes en voix naturelles et expressives. Synthèse vocale en wolof, français, anglais, arabe et swahili.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={dmSans.variable} suppressHydrationWarning>
      <head>
        {/*
          Runs before the first paint so a dark-mode user never sees a white
          flash. It sets data-theme on <html>, which is why that element
          carries suppressHydrationWarning: the server cannot know the
          stored value, so the attribute legitimately differs on hydration.
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <PreferencesProvider>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
