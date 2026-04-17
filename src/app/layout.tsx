import "./globals.css";
import type { Metadata } from "next";
import type { Session } from "next-auth";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { handleSignOut } from "@/app/action";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meetpie",
  description: "Meetpie app",
};

function Header({ user }: { user: Session["user"] }) {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1 text-xl">
        <Link href="/" className="btn btn-ghost text-xl">
          Meetpie
        </Link>
      </div>
      {user && (
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle avatar" aria-label="ユーザーメニュー" aria-haspopup="menu">
              <div className="w-10 rounded-full">
                {user.image ? (
                  <Image
                    alt={user.name ?? "ユーザー"}
                    src={user.image}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-neutral text-neutral-content flex items-center justify-center w-full h-full text-sm font-bold">
                    {user.name?.[0] ?? "U"}
                  </div>
                )}
              </div>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-25 p-2 shadow"
            >
              <li>
                <form action={handleSignOut}>
                  <button type="submit" className="w-full text-left">
                    ログアウト
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header user={session.user} />
        {children}
      </body>
    </html>
  );
}
