import { memo } from "react"
import useCreateLineItem from "../../../hooks/useCreateLineItem";
import { Button } from "@mui/material";
import { useProject } from "../../../providers/ProjectProvider";

const AddLineItem = () => {
  const { projectId } = useProject()
  const { mutate: createLineItem } = useCreateLineItem()

  const handleAddNew = () => {
    createLineItem({
      project_id: projectId,
      name: "",
      start_date: null,
      end_date: null,
      assignee: null,
      estimated_hours: 0,
      complexity: 1,
      status: "pending",
    });
  };

  return (
    <Button onClick={handleAddNew} variant="contained" color="primary" sx={{ m: 2 }}>
      Add Line Item
    </Button>
  )
}

export default memo(AddLineItem)
