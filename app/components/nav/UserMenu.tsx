"use client"

import { useState } from "react";
import { Avatar } from "@mui/material";
import { User } from "@supabase/supabase-js";
import UserDrawer from "./UserDrawer";

interface Props {
  user: User;
}

export default function UserMenu({ user }: Props) {
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (newOpen: boolean) => {
    setOpenDrawer(newOpen);
  }

  const handleClick = () => {
    setOpenDrawer(true);
  };

  return (
    <>
      <Avatar
        src={user?.user_metadata.avatar_url}
        sx={{ cursor: "pointer", border: "solid 1px black" }}
        onClick={handleClick}
      />
      <UserDrawer open={openDrawer} closeDrawer={() => toggleDrawer(false)} />
    </>
  );
}
