// "use client";

// import { signIn, signOut, useSession } from "next-auth/react";

// export default function LoginButton() {
//   const { data: session } = useSession();

//   console.log("first userAuth details:", session);

//   if (session) {
//     return (
//       <div>
//         <p>Signed in as {session.user?.email}</p>
//         <button onClick={() => signOut()}>Logout</button>
//       </div>
//     );
//   }

//   return <button onClick={() => signIn("github")}>Sign in with GitHub</button>;
// }
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center ">
        <p className="text-gray-600">Checking session...</p>
      </div>
    );
  }

  // Logged-in UI
  if (session) {
    return (
      <div className="flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Welcome 🎉</h1>

          {session.user?.image && (
            <img
              src={session.user.image}
              alt="User avatar"
              className="w-16 h-16 rounded-full mx-auto"
            />
          )}

          <p className="text-gray-700 font-medium">{session.user?.name}</p>

          <p className="text-gray-500 text-sm">{session.user?.email}</p>

          <button
            onClick={() => signOut()}
            className="bg-red-400 hover:bg-red-600 text-white px-4 py-2 rounded-xl w-full transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Login UI
  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Wallet App</h1>

        <p className="text-gray-600">Sign in to continue</p>

        <button
          onClick={() => signIn("github")}
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-3 rounded-xl w-full transition"
        >
          {/* GitHub icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-white"
          >
            <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 008 10.95c.6.1.82-.26.82-.58v-2.02c-3.26.71-3.95-1.57-3.95-1.57-.54-1.37-1.32-1.73-1.32-1.73-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.82 2.81 1.3 3.49.99.1-.78.42-1.3.77-1.6-2.6-.3-5.34-1.3-5.34-5.77 0-1.27.45-2.3 1.22-3.12-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.2a11.3 11.3 0 016 0c2.3-1.52 3.3-1.2 3.3-1.2.65 1.65.24 2.87.12 3.17.77.82 1.22 1.85 1.22 3.12 0 4.48-2.74 5.46-5.35 5.76.43.37.82 1.1.82 2.22v3.3c0 .32.22.69.82.58A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
          </svg>
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
