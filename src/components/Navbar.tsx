'use client'

import { getUser } from "@/lib/auth/getUser";
import { logout } from "@/lib/auth/logout";
import { usePathname, useRouter } from 'next/navigation';

import { useEffect, useState } from "react";
import Link from 'next/link'
import Image from "next/image";

import NavbarSkeleton from "@/components/skeletons/NavbarSkeleton";

// { navLinks, rightMenu }: { navLinks?: React.ReactNode; rightMenu?: React.ReactNode; }
export default function Navbar() {
  const router = useRouter();
  const pathName = usePathname();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  const [user, setUser] = useState<{ acc_id: number, username: string }>() || null;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAuthenticatedUser() {
      if (pathName == '/login' || pathName == '/') {
        setIsAuthenticated(false)
        setIsLoading(false)
        return false
      }

      setIsLoading(true);
      try {
        const userData = await getUser();
        setUser(userData);
        setIsAuthenticated(true)
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false);
      }

    }
    getAuthenticatedUser()
  }, [router, pathName, setUser])

  if (isLoading) {
    return <NavbarSkeleton />
  }

  if (!isAuthenticated) {
    return <div></div>
  }


  const links = [
    {
      title: 'Performance Review',
      path: '/pcr'
    },
    {
      title: 'Individual Rating Scale',
      path: '/irsm'
    },
    {
      title: 'Rating Scale Matrix',
      path: '/rsm'
    }
  ]

  return (
    <div className="navbar bg-base-100 shadow-md no-print">
      <div className="flex flex-1">
        {/* <Link className="btn btn-lg btn-ghost text-xl" href={'/dashboard'}> </Link> */}
        <Image src={'/pcr-logo.png'} alt="pcr" width={50} height={50} className="mr-2" style={{ width: 'auto' }} priority />

        {
          links.map((link, index) => (
            <Link key={index} className="btn btn-ghost font-normal mt-2 mr-2" href={link.path}>{link.title}</Link>
          ))
        }

      </div>
      <div className="mr-10">{user?.username}</div>
      <div className="flex-none">
        <div className="btn" onClick={handleLogout}>Logout</div>
      </div>
    </div>
  );
}
