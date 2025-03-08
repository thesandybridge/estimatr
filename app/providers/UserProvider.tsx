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

  const { data, isPending } = useQuery({
    enabled: async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      return userError || userData?.user
    },
    queryKey: ["user_data"],
    queryFn: async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        router.replace("/login");
        return { user: null, userOrg: null };
      }

      const { data: orgData } = await supabase
        .from("org_members")
        .select("org_id")
        .eq("member_id", userData.user.id)
        .single();

      return { user: userData.user, userOrg: orgData?.org_id ?? null };
    },
    staleTime: Infinity,
    retry: false,
  });

  return (
    <UserContext.Provider value={{ user: data?.user, userOrg: data?.userOrg, loading: isPending }}>
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
