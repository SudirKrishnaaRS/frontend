"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

const FALLBACK_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2363b3ed'/%3E%3Cpath d='M50 45c7.5 0 13.64-6.14 13.64-13.64S57.5 17.72 50 17.72s-13.64 6.14-13.64 13.64S42.5 45 50 45zm0 6.82c-9.09 0-27.28 4.56-27.28 13.64v3.41c0 1.88 1.53 3.41 3.41 3.41h47.74c1.88 0 3.41-1.53 3.41-3.41v-3.41c0-9.08-18.19-13.64-27.28-13.64z' fill='%23fff'/%3E%3C/svg%3E`;

export default function Profile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex justify-center py-2">
        <p className="text-sm text-gray-400 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <img
        src={user.picture || FALLBACK_AVATAR}
        alt={user.name || "User profile"}
        className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-400 ring-offset-2 ring-offset-transparent"
        onError={(e) => {
          (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
        }}
      />
      <h2 className="text-base font-semibold text-white">{user.name}</h2>
      <p className="text-xs text-gray-400">{user.email}</p>
    </div>
  );
}

