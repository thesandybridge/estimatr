"use server";

import { redirect } from 'next/navigation'

import { createClient } from "@/utils/supabase/server";

export async function login() {
  const supabase = await createClient();

  if (!supabase || !supabase.auth) {
    throw new Error("Supabase client is not initialized correctly.");
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  });

  if (error) {
    console.error(error.message)
    redirect('/error')
  }

  if (data.url) {
    redirect(data.url)
  }

}
