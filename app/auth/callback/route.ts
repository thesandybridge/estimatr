import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) NextResponse.redirect(`${origin}/auth/auth-code-error`)

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("❌ Error exchanging code:", error.message);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("❌ Error fetching user:", userError?.message);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const user = userData?.user;
  console.log("✅ User authenticated:", user.email);

  // ✅ Extract email domain
  const email = user.email;
  if (!email) {
    console.error("❌ User email is missing!");
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const orgDomain = email.split("@")[1];
  const domain = orgDomain === 'gmail.com' ? null : orgDomain;

  const redirectPayload = {
    next,
    request,
    origin,
  }
  // If user is not in an org continue without org check
  if (!domain) {
    return redirectUser(redirectPayload);
  }

  // ✅ Check if an organization exists for the domain
  const { data: existingOrg, error: orgError } = await supabase
    .from("orgs")
    .select("uuid")
    .eq("domain", domain)
    .single();

  let orgId;

  if (orgError) {
    console.warn("⚠️ No existing org found, creating a new one...");
  }

  if (existingOrg) {
    orgId = existingOrg.uuid;
  } else {
    const orgName = domain ? `${domain}` : null
    const { data: newOrg, error: newOrgError } = await supabase
      .from("orgs")
      .insert({ name: orgName, domain })
      .select("uuid")
      .single();

    if (newOrgError) {
      console.error("❌ Error creating new org:", newOrgError.message);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    orgId = newOrg.uuid;
  }

  console.log("✅ User should be assigned to org:", orgId);

  // ✅ Assign user to the organization if not already assigned
  const { data: existingMembership } = await supabase
    .from("org_members")
    .select("member_id")
    .eq("member_id", user.id)
    .eq("org_id", orgId)
    .single();

  if (!existingMembership) {
    console.log("✅ Adding user to org...");
    const { error: insertError } = await supabase
      .from("org_members")
      .insert({ member_id: user.id, org_id: orgId });

    if (insertError) {
      console.error("❌ Error adding user to org:", insertError.message);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  } else {
    console.log("✅ User is already part of the organization.");
  }

  return redirectUser(redirectPayload);

}

interface RedirectProps {
  next: string
  request: Request
  origin: string
}

const redirectUser = ({next, request, origin}: RedirectProps) => {
  const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
  const isLocalEnv = process.env.NODE_ENV === 'development'
  if (isLocalEnv) {
    // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
    return NextResponse.redirect(`${origin}${next}`)
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`)
  } else {
    return NextResponse.redirect(`${origin}${next}`)
  }
}
