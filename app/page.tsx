// "use client";

// import LoginButton from "@/components/LoginButton";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";

// export default function Home() {
//   const router = useRouter();
//   const { data: session } = useSession();

//   return (
// <main className="flex items-center justify-center min-h-screen bg-gray-100">
//   <div className="bg-white shadow-lg rounded-2xl p-10 w-105 text-center space-y-6">
//     <h1 className="text-3xl font-bold text-gray-900">Digital Wallet POC</h1>

//     <p className="text-gray-600">
//       Secure wallet management with OAuth login
//     </p>

//     {/* GitHub OAuth Login */}
//     <LoginButton />

//     {/* Show Wallet Button ONLY if logged in */}
//     {session && (
//       <button
//         className="bg-cyan-900 hover:bg-cyan-950 text-white px-4 py-3 rounded-xl w-full transition"
//         onClick={() => router.push("/wallet")}
//       >
//         Go to Wallet
//       </button>
//     )}
//   </div>
// </main>
//   );
// }

import { auth0 } from "@/auth0";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import Profile from "@/components/Profile";
import Navbar from "@/components/Navbar";
// import { useRouter } from "next/navigation";

export default async function Home() {
  // const router = useRouter();

  const session = await auth0.getSession();
  const user = session?.user;

  console.log("user", user);
  console.log("session", session);

  // let token: string | undefined;
  // if (user) {
  //   const result = await auth0.getAccessToken();
  //   token = result.token;
  // }
  // console.log("token", token);


  return (
    <div className="app-container">
      <div>
        <Navbar
          isLoggedIn={!!user}
          userName={user?.name}
          userAvatar={user?.picture}
        />
      </div>
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-10 w-105 text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Digital Wallet POC
          </h1>

          <p className="text-gray-600">
            Secure wallet management with OAuth login
          </p>
        </div>
      </main>
    </div>
  );
}
