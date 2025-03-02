"use client";

import { createContext, useContext } from "react";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

interface UserContextType {
  user: User | null
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.replace("/login");
        return null;
      }
      return data.user;
    },
    staleTime: Infinity,
    retry: false,
  });

  return (
    <UserContext.Provider value={{ user: data, loading: isPending }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
