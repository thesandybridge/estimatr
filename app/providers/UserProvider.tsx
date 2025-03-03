"use client";

import { createContext, useContext } from "react";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

interface UserContextType {
  user: User | null;
  userOrg: string | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  const { data: user, isPending: userLoading } = useQuery({
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

  const { data: userOrg, isPending: orgLoading } = useQuery({
    queryKey: ["user_org"],
    queryFn: async () => {
      if (!user) return null;
      const { data: orgData } = await supabase
        .from("org_members")
        .select("org_id")
        .eq("member_id", user.id)
        .single();
      return orgData?.org_id ?? null;
    },
    enabled: !!user,
  });

  return (
    <UserContext.Provider value={{ user, userOrg, loading: userLoading || orgLoading }}>
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
