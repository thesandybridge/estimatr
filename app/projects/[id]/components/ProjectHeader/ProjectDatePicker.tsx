"use client";

import { useState, memo } from "react";
import {
  Popover,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import useUpdateProject from "@/app/projects/hooks/useUpdateProject";

import { useProject } from "../../providers/ProjectProvider";
import styles from "./styles.module.css";

const ProjectDatePicker = () => {
  const { project, loading: isPending, projectId } = useProject();
  const { mutate: updateProject } = useUpdateProject();

  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null);


  const handleDateChange = (newDate: Dayjs | null) => {
    if (!newDate || !project) return;

    updateProject({
      projectId,
      data: { deadline: newDate.toISOString() },
    });
  };

  if (isPending) return <p>Loading...</p>;
  if (!project) return null;

  return (
    <div>
      <time
        className={styles.projectDate}
        dateTime={project.deadline}
        onClick={(e) => setDateAnchorEl(e.currentTarget)}
      >
        Due Date: {project.deadline ? dayjs(project.deadline).format("MMM D, YYYY") : "N/A"}
      </time>

      <Popover
        open={Boolean(dateAnchorEl)}
        anchorEl={dateAnchorEl}
        onClose={() => setDateAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <DateTimePicker
          value={project.deadline ? dayjs(project.deadline) : null}
          onChange={handleDateChange}
          slotProps={{ textField: { size: "small", variant: "outlined" } }}
        />
      </Popover>
    </div>
  );
}

export default memo(ProjectDatePicker);
