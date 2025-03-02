"use client";

import { Box, Divider, ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useTransition } from "react";
import { logout } from "./actions";
import Link from "next/link";

interface Props {
  userId: string
}

export default function UserActions({ userId }: Props) {
  const [isPending, startTransition] = useTransition();

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
        <Link href={`/user/${userId}`}>
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
      </MenuItem>
    </MenuList>
  );
}
