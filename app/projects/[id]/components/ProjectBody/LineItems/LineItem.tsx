"use client";

import { useState, memo } from "react";
import { TableRow, TableCell, TextField, MenuItem, Select, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { LineItem } from "@/lib/lineItems";
import dayjs from "dayjs";

interface Props {
  lineItem: LineItem;
  onDelete: (id: string) => void;
  onSave: (updatedItem: LineItem) => void;
}

const LineItem = ({ lineItem, onDelete, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(lineItem.id.startsWith("temp-"));
  const [editableItem, setEditableItem] = useState<LineItem>({
    ...lineItem,
    startDate: lineItem.start_date ? dayjs(lineItem.start_date) : null,
    endDate: lineItem.end_date ? dayjs(lineItem.end_date) : null,
  });

  const handleChange = <K extends keyof LineItem>(field: K, value: any) => {
    setEditableItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <TableRow>
      {/* Name Field */}
      <TableCell>
        <TextField
          value={editableItem.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          fullWidth
          disabled={!isEditing}
        />
      </TableCell>

      {/* Start Date Field */}
      <TableCell>
        <TextField
          type="date"
          value={editableItem.start_date ? dayjs(editableItem.start_date).format("YYYY-MM-DD") : ""}
          onChange={(e) => handleChange("start_date", dayjs(e.target.value))}
          fullWidth
          disabled={!isEditing}
        />
      </TableCell>

      {/* End Date Field */}
      <TableCell>
        <TextField
          type="date"
          value={editableItem.end_date ? dayjs(editableItem.end_date).format("YYYY-MM-DD") : ""}
          onChange={(e) => handleChange("end_date", dayjs(e.target.value))}
          fullWidth
          disabled={!isEditing}
        />
      </TableCell>

      {/* Estimated Hours Field (Number) */}
      <TableCell>
        <TextField
          type="number"
          value={editableItem.estimated_hours!== undefined ? editableItem.estimated_hours: ""}
          onChange={(e) => handleChange("estimated_hours", e.target.value ? parseFloat(e.target.value) : 0)}
          fullWidth
          disabled={!isEditing}
        />
      </TableCell>

      {/* Complexity Field (Select) */}
      <TableCell>
        <Select
          value={editableItem.complexity || 1}
          onChange={(e) => handleChange("complexity", Number(e.target.value))}
          fullWidth
          disabled={!isEditing}
        >
          {[1, 2, 3, 4, 5].map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </TableCell>

      {/* Status Field (Select) */}
      <TableCell>
        <Select
          value={editableItem.status || "pending"}
          onChange={(e) => handleChange("status", e.target.value)}
          fullWidth
          disabled={!isEditing}
        >
          {["pending", "in-progress", "completed"].map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </TableCell>

      {/* Actions */}
      <TableCell>
        {isEditing ? (
          <IconButton onClick={() => onSave(editableItem)}>
            <FontAwesomeIcon icon={faSave} />
          </IconButton>
        ) : (
          <IconButton onClick={() => setIsEditing(true)}>
            <FontAwesomeIcon icon={faEdit} />
          </IconButton>
        )}
        <IconButton onClick={() => onDelete(lineItem.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default memo(LineItem);
