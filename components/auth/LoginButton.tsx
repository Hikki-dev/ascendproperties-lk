"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
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
        </div>
        <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-text-primary hover:text-primary font-medium">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
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
