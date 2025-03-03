"use client";

import { useEffect, useState, memo } from "react";
import { useRouter } from "next/navigation";
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faTrashCan, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@/app/providers/UserProvider";

import { useProject } from "../../providers/ProjectProvider";
import ProjectAddMemberDialogue from "./ProjectAddMemberDialogue";
import ProjectDeleteDialogue from "./ProjectDeleteDialogue";

const ProjectSpeedDial = () => {
  const { project, loading: isPending } = useProject();
  const { userOrg, loading: isOrgLoading } = useUser();
  const router = useRouter();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  const handleOpenAddMemberDialogue = () => {
    setIsAddMemberDialogOpen(true);
  };

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  useEffect(() => {
    if (!isPending && !project) {
      router.replace("/projects");
    }
  }, [isPending, project, router]);



  if (isPending || isOrgLoading) return <p>Loading...</p>;
  if (!project) return null;

  return (
    <div>
      <SpeedDial
        ariaLabel="Project Settings"
        icon={<SpeedDialIcon icon={<FontAwesomeIcon icon={faCog} />} />}
        sx={{ position: "absolute", bottom: "1rem", right: "1rem" }}
      >
        <SpeedDialAction
          onClick={handleOpenDeleteDialog}
          icon={<FontAwesomeIcon icon={faTrashCan} />}
          slotProps={{ tooltip: { title: "Delete Project" } }}
        />

        {userOrg && (
          <SpeedDialAction
            onClick={handleOpenAddMemberDialogue}
            icon={<FontAwesomeIcon icon={faUserPlus} />}
            slotProps={{ tooltip: { title: "Add Members" } }}
          />
        )}
      </SpeedDial>

      {userOrg && (
        <>
          <ProjectDeleteDialogue
            open={isDeleteDialogOpen}
            onClose={handleCloseDeleteDialog}
          />

          <ProjectAddMemberDialogue
            open={isAddMemberDialogOpen}
            onClose={() => setIsAddMemberDialogOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default memo(ProjectSpeedDial)
