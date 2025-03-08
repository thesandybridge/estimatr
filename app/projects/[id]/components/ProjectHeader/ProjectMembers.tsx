"use client";

import { memo } from "react";
import { Avatar, AvatarGroup, Tooltip, Typography, Skeleton } from "@mui/material";

import useFetchProjectMembers from "@/app/projects/hooks/useFetchProjectMembers";
import { useProject } from "../../providers/ProjectProvider";
import { useUser } from "@/app/providers/UserProvider";

interface Props {
  maxAvatars?: number;
}

const ProjectMembers = ({ maxAvatars = 5 }: Props) => {
  const { projectId } = useProject()
  const { userOrg, loading: isOrgLoading } = useUser();
  const { data: members, isLoading, error } = useFetchProjectMembers(projectId);

  if (isLoading || isOrgLoading) {
    return (
      <AvatarGroup max={maxAvatars}>
        {[...Array(4)].map((_, index) => (
          <Tooltip key={index} title="Loading...">
            <Avatar>
              <Skeleton
                variant="circular"
                width="100%"
                height="100%"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
    );
  }

  if (!userOrg) {
    return null;
  }

  if (error) {
    return <Typography color="error">Failed to load project members</Typography>;
  }

  if (!members || members.length === 0) {
    return <Typography variant="body2">No members in this project</Typography>;
  }

  return (
    <AvatarGroup max={maxAvatars}>
      {members.map((member) => (
        <Tooltip key={member.id} title={member.name ?? member.email}>
          <Avatar
            src={member.avatar_url ?? ""}
            alt={member.name ?? member.email}
            sx={{ bgcolor: member.avatar_url ? "transparent" : "primary.main" }}
          >
            {!member.avatar_url && member.name
              ? member.name[0].toUpperCase()
              : member.email[0].toUpperCase()}
          </Avatar>
        </Tooltip>
      ))}
    </AvatarGroup>
  );
}

export default memo(ProjectMembers)
