import { redirect } from "next/navigation";

import { createClient } from '@/utils/supabase/server'
import { ProjectProvider } from "./providers/ProjectProvider";
import ProjectHeader from "./components/ProjectHeader";
import ProjectSpeedDial from "./components/ProjectSpeedDial";
import ProjectBody from "./components/ProjectBody";

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  if (!id) {
    redirect("/projects");
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <ProjectProvider uuid={id}>
      <ProjectHeader />
      <ProjectBody />
      <ProjectSpeedDial />
    </ProjectProvider>
  );
}
