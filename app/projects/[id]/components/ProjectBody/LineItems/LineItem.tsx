"use client";

import { useState, memo } from "react";
import { TableRow, TableCell, TextField, MenuItem, Select, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { LineItem } from "@/lib/lineItems";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";

interface Props {
  lineItem: LineItem;
  onDelete: (id: string) => void;
  onEdit: (id: string, isEditing: boolean) => void;
  onSave: (updatedItem: LineItem) => void;
}

const LineItem = ({ lineItem, onDelete, onSave, onEdit }: Props) => {
  const [isEditing, setIsEditing] = useState(lineItem.is_editing === true);
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
      <TableCell sx={{ minWidth: '200px' }}>
        <TextField
          value={editableItem.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          fullWidth
          disabled={!isEditing}
        />
      </TableCell>

      {/* Start Date Field */}
      <TableCell sx={{ width: '200px', minWidth: '150px' }}>
        <DateTimePicker
          disabled={!isEditing}
          value={editableItem.start_date ? dayjs(editableItem.start_date) : null}
          onChange={(newValue) => handleChange("start_date", newValue)}
          format="MM-DD-YYYY"
          slotProps={{
            textField: {
              size: "small",
              variant: "outlined",
              fullWidth: true
            }
          }}
        />
      </TableCell>

      {/* End Date Field */}
      <TableCell sx={{ width: '200px', minWidth: '150px' }}>
        <DateTimePicker
          disabled={!isEditing}
          value={editableItem.end_date ? dayjs(editableItem.end_date) : null}
          onChange={(newValue) => handleChange("end_date", newValue)}
          format="MM-DD-YYYY"
          slotProps={{
            textField: {
              size: "small",
              variant: "outlined",
              fullWidth: true
            }
          }}
        />
      </TableCell>

      {/* Estimated Hours Field (Number) */}
      <TableCell sx={{ width: '125px' }}>
        <TextField
          type="text"
          inputProps={{
            inputMode: "decimal",
            pattern: "[0-9]*[.]?[0-9]*"
          }}
          value={isEditing ? editableItem.estimated_hours?.toString() || "" : (editableItem.estimated_hours || "0")}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d*\.?\d*$/.test(value)) {
              handleChange("estimated_hours", value === "" ? 0 : value);
            }
          }}
          onBlur={(e) => {
            const value = e.target.value;
            handleChange("estimated_hours", value === "" ? 0 : parseFloat(value));
          }}
          sx={{ maxWidth: '150px' }}
          size="small"
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
          <IconButton onClick={() => {
            onSave(editableItem);
            setIsEditing(false);
          }}>
            <FontAwesomeIcon icon={faSave} />
          </IconButton>
        ) : (
          <IconButton onClick={() => {
              setIsEditing(true)
              onEdit(lineItem.id, true)
            }}>
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
