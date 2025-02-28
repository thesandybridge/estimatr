"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useFetchProject from "../../hooks/useFetchProject";
import dayjs from "dayjs";

import styles from "./styles.module.css"

interface Props {
  uuid: string;
}

export default function ProjectDetails({ uuid }: Props) {
  const { data: project, isPending } = useFetchProject(uuid);
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !project) {
      router.replace("/projects");
    }
  }, [isPending, project, router]);

  if (isPending) return <p>Loading...</p>;
  if (!project) return null;

  return (
    <div className={styles.projectDetails}>
      <h1>{project.name}</h1>
      <time className={styles.projectDate} dateTime={project.deadline}>
        Due Date: {dayjs(project.deadline).format("MMM D, YYYY")}
      </time>
    </div>
  );
}
