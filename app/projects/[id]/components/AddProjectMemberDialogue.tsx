"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  CircularProgress,
  Typography,
} from "@mui/material";

import useFetchOrgMembers from "../../hooks/useFetchOrgMembers";
import useAddProjectMember from "../../hooks/useAddProjectMember";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: string;
  ownerId: string;
}

export default function AddProjectMemberDialog({ open, onClose, projectId, ownerId }: Props) {
  const { data: members, isLoading, error } = useFetchOrgMembers();
  const addMember = useAddProjectMember();
  const queryClient = useQueryClient();

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleToggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleAddMembers = async () => {
    try {
      await Promise.all(
        selectedMembers.map((memberId) => addMember.mutateAsync({ projectId, memberId }))
      );
      queryClient.invalidateQueries(["project_members", projectId]); // Refresh project members
      setSelectedMembers([]); // Clear selection
      onClose();
    } catch (error) {
      console.error("Failed to add members:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Members to Project</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">Error loading members.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => handleToggleMember(member.id)}
                        disabled={member.id === ownerId} // Disable selection for project owner
                      />
                    </TableCell>
                    <TableCell>{member.name ?? "N/A"}</TableCell>
                    <TableCell>{member.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddMembers} color="primary" disabled={selectedMembers.length === 0}>
          Add Members
        </Button>
      </DialogActions>
    </Dialog>
  );
}
