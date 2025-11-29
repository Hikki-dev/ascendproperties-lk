"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (session) {
    return (
      <div className="relative" ref={menuRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 hover:bg-hover p-2 rounded-lg transition-colors"
        >
          {session.user?.image ? (
            <Image 
              src={session.user.image} 
              alt={session.user.name || "User"} 
              width={32} 
              height={32} 
              className="rounded-full border border-border-light"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          )}
          <span className="text-sm font-bold text-text-primary hidden md:block">{session.user?.name}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border-light rounded-xl shadow-lg py-2 z-50">
            <div className="px-4 py-2 border-b border-border-light mb-2">
              <p className="font-bold text-text-primary truncate">{session.user?.name}</p>
              <p className="text-xs text-text-secondary truncate">{session.user?.email}</p>
            </div>

            {(session.user?.email === "admin@ascend.lk" || session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) && (
               <Link 
                 href="/admin" 
                 className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-hover hover:text-primary transition-colors"
                 onClick={() => setIsOpen(false)}
               >
                 <LayoutDashboard className="w-4 h-4" />
                 Dashboard
               </Link>
            )}

            <Link 
              href="/profile" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-hover hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Profile Settings
            </Link>

            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent-error hover:bg-accent-error/10 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button variant="ghost" onClick={() => signIn()} className="text-text-primary hover:text-primary font-medium">
      <LogIn className="w-4 h-4 mr-2" />
      Sign In
    </Button>
  );
}
