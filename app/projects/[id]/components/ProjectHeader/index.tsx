"use client";

import { memo } from "react";
import { css } from "@emotion/react";
import { useUser } from "@/app/providers/UserProvider";

import ProjectMembers from "./ProjectMembers";
import { useProject } from "../../providers/ProjectProvider";
import ProjectTitle from "./ProjectTitle";
import ProjectDatePicker from "./ProjectDatePicker";

const styles = {
  wrapper: css({
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    alignItems: 'center',
  }),
  details: css({
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  }),
}


const ProjectHeader = () => {
  const { project, loading: isPending } = useProject();
  const { userOrg, loading: isOrgLoading } = useUser();


  if (isPending || isOrgLoading) return <p>Loading...</p>;
  if (!project) return null;

  return (
    <div css={styles.wrapper}>
      <ProjectTitle />

      <div css={styles.details}>
        {userOrg && (
          <ProjectMembers projectId={project.uuid} />
        )}

        <ProjectDatePicker />
      </div>
    </div>
  );
}

export default memo(ProjectHeader)
