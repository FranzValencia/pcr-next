'use client';

import { useRouter, usePathname } from 'next/navigation';
import { getUser } from "@/lib/auth/getUser";
import { useEffect, useState } from 'react';

import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ username: string }>(); // Replace 'any' with your user type
  const [loading, setLoading] = useState(true);

  // async function handleLogout() {
  //   await logout();
  //   router.push("/login");
  // }

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Handle error (e.g., redirect to login)
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [pathname, router]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className='text-center mt-20'>
      <span className='text-xl'>Welcome user! {user ? user.username : ''}</span>
      {/* <div className="btn" onClick={handleGetUser}>Get User Info</div> */}
    </div>
  );
}
