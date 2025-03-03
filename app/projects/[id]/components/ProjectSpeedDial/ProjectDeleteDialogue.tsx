"use client";

import { useEffect, useState, memo } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

import { useProject } from "../../providers/ProjectProvider";
import { useDeleteProject } from "@/app/projects/hooks/useDeleteProject";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ProjectDeleteDialogue = ({ open, onClose }: Props) => {
  const { project } = useProject();
  const { mutate: deleteProject, isSuccess } = useDeleteProject();
  const router = useRouter();

  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (open) {
      setConfirmText("");
    }
  }, [open]);

  useEffect(() => {
    if (isSuccess) {
      router.replace("/projects");
    }
  }, [isSuccess, router]);

  if (!project) return null;

  const handleConfirmDelete = () => {
    if (confirmText === project.name) {
      deleteProject(project.uuid);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Project Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Type the project name <strong>{project.name}</strong> to confirm deletion:
        </DialogContentText>
        <TextField
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} color="error" disabled={confirmText !== project.name}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(ProjectDeleteDialogue);
