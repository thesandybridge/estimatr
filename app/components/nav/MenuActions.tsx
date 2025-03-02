"use client";

import { Avatar, Box, Divider, ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useTransition } from "react";
import { logout } from "./actions";
import Link from "next/link";
import { useUser } from "@/app/providers/UserProvider";

export default function UserActions() {
  const [isPending, startTransition] = useTransition();
  const { user, loading } = useUser();

  if (loading) return null;

  return (
    <MenuList
      component={Box}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <MenuItem>
        <Link href={`/user/${user?.id}`}>
          Profile
        </Link>
      </MenuItem>
      <MenuItem>Settings</MenuItem>
      <Box sx={{ flexGrow: 1 }} />
      <Divider
        sx={{
          margin: '.5rem 0'
        }}
      />
      <MenuItem
        onClick={() => startTransition(() => logout())}
        disabled={isPending}
      >
        <ListItemIcon>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </ListItemIcon>
        <ListItemText>{isPending ? "Logging out..." : "Logout"}</ListItemText>
        <Avatar
          src={user?.user_metadata.avatar_url}
        />
      </MenuItem>
    </MenuList>
  );
}
