"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Extension } from '@tiptap/core';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Popover, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField } from '@mui/material';
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

import useFetchProject from "../../hooks/useFetchProject";
import useUpdateProject from "../../hooks/useUpdateProject";

import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useDeleteProject } from "../../hooks/useDeleteProject";

interface Props {
  uuid: string;
}

export default function ProjectDetails({ uuid }: Props) {
  const { data: project, isPending } = useFetchProject(uuid);
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject, isSuccess } = useDeleteProject();
  const router = useRouter();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
    setConfirmText(""); // Reset input field on open
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (confirmText === project?.name) {
      deleteProject(uuid);
      setIsDeleteDialogOpen(false);
    }
  };

  const EnterKeyHandler = Extension.create({
    name: 'enterKeyHandler',
    addKeyboardShortcuts() {
      return {
        'Enter': () => {
          handleTitleSubmit();
          return true;
        },
      }
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable everything except heading
        paragraph: false,
        hardBreak: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        bold: false,
        italic: false,
        strike: false,
        // Only allow h1
        heading: {
          levels: [1]
        }
      }),
      EnterKeyHandler
    ],
    editorProps: {
      attributes: {
        class: styles.titleEditor,
      },
    },
    onCreate: ({ editor }) => {
      // Force content to be h1 on creation
      editor.commands.setHeading({ level: 1 });
    },
  });

  useEffect(() => {
    if (project?.name && editor && !isEditingTitle) {
      editor.commands.setContent('');
      editor.commands.setHeading({ level: 1 });
      editor.commands.insertContent(project.name);
    }
  }, [project?.name, editor, isEditingTitle]);

  useEffect(() => {
    if ((!isPending && !project || isSuccess) ) {
      router.replace("/projects");
    }
  }, [isPending, project, router, isSuccess]);

  useEffect(() => {
    if (project?.name && editor && !isEditingTitle) {
      editor.commands.setContent(project.name);
    }
  }, [project?.name, editor, isEditingTitle]);

  const handleTitleSubmit = useCallback(() => {
    if (!editor || !project) return;

    const newTitle = editor.getText().trim();
    if (newTitle !== project.name) {
      updateProject({
        projectId: uuid,
        data: { name: newTitle }
      });
    }
    setIsEditingTitle(false);
  }, [editor, project, updateProject, uuid]);

  const handleDateChange = (newDate: Dayjs | null) => {
    if (!newDate || !project) return;

    updateProject({
      projectId: uuid,
      data: { deadline: newDate.toISOString() }
    });
  };

  if (isPending) return <p>Loading...</p>;
  if (!project) return null;

  return (
    <div className={styles.projectDetails}>
      {isEditingTitle ? (
        <EditorContent
          editor={editor}
          onBlur={handleTitleSubmit}
        />
      ) : (
        <h1
          onClick={() => setIsEditingTitle(true)}
          className={styles.editableTitle}
        >
          {project.name}
        </h1>
      )}

      <time
        className={styles.projectDate}
        dateTime={project.deadline}
        onClick={(e) => setDateAnchorEl(e.currentTarget)}
      >
        Due Date: {project.deadline ?
          dayjs(project.deadline).format("MMM D, YYYY")
          : "N/A"
        }
      </time>

      <Popover
        open={Boolean(dateAnchorEl)}
        anchorEl={dateAnchorEl}
        onClose={() => setDateAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <DateTimePicker
          value={project.deadline ? dayjs(project.deadline): null}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              size: "small",
              variant: "outlined",
            },
          }}
        />
      </Popover>

      <SpeedDial
        ariaLabel="Project Settings"
        icon={<SpeedDialIcon icon={<FontAwesomeIcon icon={faCog} />} />}
        sx={{ position: "absolute", bottom: "1rem", right: "1rem" }}
      >
        <SpeedDialAction
          onClick={handleOpenDeleteDialog}
          icon={<FontAwesomeIcon icon={faTrashCan} />}
          slotProps={{
            tooltip: {
              title: "Delete Project"
            }
          }}
        />
      </SpeedDial>

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Project Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Type the project name <strong>{project?.name}</strong> to confirm deletion:
          </DialogContentText>
          <TextField
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={confirmText !== project?.name}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

