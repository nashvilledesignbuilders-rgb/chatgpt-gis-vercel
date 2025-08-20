
import './globals.css';

export const metadata = {
  title: 'ChatGPT GIS API',
  description: 'Proxy API to Metro Nashville and TN property services'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
