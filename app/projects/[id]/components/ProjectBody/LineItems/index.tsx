"use client";

import { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { LineItem as LineItemType } from "@/lib/lineItems";
import LineItem from "./LineItem";
import useFetchLineItems from "../../../hooks/useFetchLineItems";
import useCreateLineItem from "../../../hooks/useCreateLineItem";
import { useProject } from "../../../providers/ProjectProvider";
import useUpdateLineItem from "../../../hooks/useUpdateLineItem";
import useDeleteLineItem from "../../../hooks/useDeleteLineItem";

const LineItems = () => {
  const { projectId } = useProject();
  const { data: lineItems, isLoading } = useFetchLineItems(projectId);
  const { mutate: createLineItem } = useCreateLineItem();
  const { mutate: updateLineItem } = useUpdateLineItem();
  const { mutate: deleteLineItem } = useDeleteLineItem();

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

  const handleSave = (updatedItem: LineItemType) => {
    updateLineItem({
      id: updatedItem.id,
      project_id: projectId,
      name: updatedItem.name,
      start_date: updatedItem.start_date.toISOString() || null,
      end_date: updatedItem.end_date.toISOString() || null,
      assignee: updatedItem.assignee || null,
      estimated_hours: updatedItem.estimated_hours ?? 0,
      complexity: updatedItem.complexity ?? 1,
      status: updatedItem.status,
    });
  };

  const handleDelete = (id: string) => {
    deleteLineItem(id);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Estimated Hours</TableCell>
            <TableCell>Complexity</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lineItems?.map((item) => (
            <LineItem key={item.id} lineItem={item} onDelete={handleDelete} onSave={handleSave} />
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleAddNew} variant="contained" color="primary" sx={{ m: 2 }}>
        Add Line Item
      </Button>
    </TableContainer>
  );
};

export default memo(LineItems);
