"use client"

import { useState } from "react";
import { Avatar } from "@mui/material";
import UserDrawer from "./UserDrawer";
import { useUser } from "@/app/providers/UserProvider";

export default function UserMenu() {
  const { user, loading } = useUser();
  const [openDrawer, setOpenDrawer] = useState(false);

  if (loading) return null;

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
