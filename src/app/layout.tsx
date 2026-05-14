import "./globals.css";
import RefreshRedirect from '@/components/RefreshRedirect'

export const metadata = {
  metadataBase: new URL('https://bohdan-portfolio.vercel.app'),
  title: "Bohdan Kharuk — Full Stack Developer",
  description: "Full stack developer based in Madrid, specialized in React, Python/FastAPI and .NET. Open to full-time and freelance opportunities.",
  keywords: ["Bohdan Kharuk", "Full Stack Developer", "React", "FastAPI", "ASP.NET", "Python", "Madrid", "Portfolio"],
  authors: [{ name: "Bohdan Kharuk" }],
  creator: "Bohdan Kharuk",
  openGraph: {
    type: "website",
    url: "https://bohdan-portfolio.vercel.app",
    title: "Bohdan Kharuk — Full Stack Developer",
    description: "Full stack developer based in Madrid, specialized in React, Python/FastAPI and .NET. Open to full-time and freelance opportunities.",
    siteName: "Bohdan Kharuk Portfolio",
    images: [
      {
        url: "/assets/mephoto.png",
        width: 800,
        height: 800,
        alt: "Bohdan Kharuk — Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bohdan Kharuk — Full Stack Developer",
    description: "Full stack developer based in Madrid, specialized in React, Python/FastAPI and .NET.",
    images: ["/assets/mephoto.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RefreshRedirect />
        {children}
      </body>
    </html>
  );
}