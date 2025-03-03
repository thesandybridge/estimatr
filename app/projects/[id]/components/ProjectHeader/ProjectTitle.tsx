"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Extension } from "@tiptap/core";
import useUpdateProject from "@/app/projects/hooks/useUpdateProject";
import { css } from "@emotion/react";

import { useProject } from "../../providers/ProjectProvider";

const styles = {
  editableTitle: css({
    cursor: 'text',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0,04)'
    }
  }),
}

const ProjectTitle = () => {
  const { project, loading: isPending, projectId } = useProject();
  const { mutate: updateProject } = useUpdateProject();

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const EnterKeyHandler = Extension.create({
    name: "enterKeyHandler",
    addKeyboardShortcuts() {
      return {
        Enter: () => {
          handleTitleSubmit();
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
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
        heading: { levels: [1] },
      }),
      EnterKeyHandler,
    ],
    onCreate: ({ editor }) => {
      editor.commands.setHeading({ level: 1 });
    },
  });

  useEffect(() => {
    if (project?.name && editor && !isEditingTitle) {
      editor.commands.setContent("");
      editor.commands.setHeading({ level: 1 });
      editor.commands.insertContent(project.name);
    }
  }, [project?.name, editor, isEditingTitle]);

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
        projectId,
        data: { name: newTitle },
      });
    }
    setIsEditingTitle(false);
  }, [editor, project, updateProject, projectId]);

  if (isPending) return <p>Loading...</p>;
  if (!project) return null;

  return (
    <div>
      {isEditingTitle ? (
        <EditorContent editor={editor} onBlur={handleTitleSubmit} />
      ) : (
        <h1 onClick={() => setIsEditingTitle(true)} css={styles.editableTitle}>
          {project.name}
        </h1>
      )}
    </div>
  );
}

export default memo(ProjectTitle)
