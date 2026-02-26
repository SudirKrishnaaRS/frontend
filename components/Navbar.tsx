"use client";

import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";

interface NavbarProps {
  isLoggedIn: boolean;
  userName?: string | null;
  userAvatar?: string | null;
}

export default function Navbar({ isLoggedIn, userName, userAvatar }: NavbarProps) {
  const initials = userName?.charAt(0)?.toUpperCase() ?? "U";
  const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName ?? "User")}&background=6366f1&color=fff&size=64`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-gray-900 backdrop-blur-md border-b border-white/10">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <span className="text-white font-bold text-lg tracking-tight">
          💳 Digital Wallet
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName || "User"}
                className="w-8 h-8 rounded-full ring-2 ring-indigo-400 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackSrc;
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full ring-2 ring-indigo-400 bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                {initials}
              </div>
            )}
            <span className="text-sm text-gray-300 hidden sm:block">{userName}</span>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </nav>
  );
}
