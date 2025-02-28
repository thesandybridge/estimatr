"use client"

import { useState } from "react";
import { Avatar, Popover, Box } from "@mui/material";
import { User } from "@supabase/supabase-js";
import UserActions from "./MenuActions";

interface Props {
  user: User;
}

export default function UserMenu({ user }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "user-menu-popover" : undefined;

  return (
    <>
      <Avatar
        src={user?.user_metadata.avatar_url}
        sx={{ cursor: "pointer", border: "solid 1px black" }}
        onClick={handleClick}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2 }}>
          <UserActions />
        </Box>
      </Popover>
    </>
  );
}
