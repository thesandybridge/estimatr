"use client";

import { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from "@mui/material";
import { LineItem as LineItemType } from "@/lib/lineItems";
import LineItem from "./LineItem";
import useFetchLineItems from "../../../hooks/useFetchLineItems";
import { useProject } from "../../../providers/ProjectProvider";
import useUpdateLineItem from "../../../hooks/useUpdateLineItem";
import useDeleteLineItem from "../../../hooks/useDeleteLineItem";
import AddLineItem from "./AddLineItem";
import useSetEditStatus from "../../../hooks/useSetEditStatus";

const LineItems = () => {
  const { projectId } = useProject();
  const { data: lineItems, isLoading } = useFetchLineItems(projectId);
  const { mutate: updateLineItem } = useUpdateLineItem();
  const { mutate: deleteLineItem } = useDeleteLineItem();
  const { mutate: setEditStatus } = useSetEditStatus();

  const handleSave = (updatedItem: LineItemType) => {
    updateLineItem({
      id: updatedItem.id,
      project_id: projectId,
      name: updatedItem.name,
      start_date: updatedItem.start_date || null,
      end_date: updatedItem.end_date || null,
      assignee: updatedItem.assignee || null,
      estimated_hours: updatedItem.estimated_hours ?? 0,
      complexity: updatedItem.complexity ?? 1,
      status: updatedItem.status,
      is_editing: false,
    });
  };

  const handleEditItem = (id: string, isEditing: boolean) => {
    setEditStatus({ id, project_id: projectId, is_editing: isEditing });
  }

  const handleDelete = (id: string) => {
    deleteLineItem({ id, project_id: projectId });
  };

  if (isLoading) {
    return (
      <TableContainer>
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
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                <TableCell><Skeleton variant="text" width={100} /></TableCell>
                <TableCell><Skeleton variant="text" width={100} /></TableCell>
                <TableCell><Skeleton variant="text" width={60} /></TableCell>
                <TableCell><Skeleton variant="text" width={40} /></TableCell>
                <TableCell><Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} /></TableCell>
                <TableCell>
                  <Skeleton variant="circular" width={32} height={32} sx={{ display: 'inline-block', mr: 1 }} />
                  <Skeleton variant="circular" width={32} height={32} sx={{ display: 'inline-block' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
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
            <LineItem
              key={item.id}
              lineItem={item}
              onDelete={handleDelete}
              onSave={handleSave}
              onEdit={handleEditItem}
            />
          ))}
        </TableBody>
      </Table>
      <AddLineItem />
    </TableContainer>
  );
};

export default memo(LineItems);
