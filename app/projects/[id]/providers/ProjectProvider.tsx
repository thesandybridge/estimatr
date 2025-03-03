"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/projects";
import useFetchProject from "../../hooks/useFetchProject";

interface ProjectContextType {
  project: Project | null
  loading: boolean
  projectId?: string
  ownerId?: string
}

const ProjectContext = createContext<ProjectContextType | null>(undefined);

export function ProjectProvider({ children, uuid }: { children: React.ReactNode; uuid: string }) {
  const router = useRouter();
  const { data: project, isPending, error } = useFetchProject(uuid);

  if (error) {
    router.replace("/projects");
    return null;
  }

  return (
    <ProjectContext.Provider value={{
      project,
      loading: isPending,
      projectId: project?.uuid,
      ownerId: project?.ownerId,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext) as ProjectContextType;
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
