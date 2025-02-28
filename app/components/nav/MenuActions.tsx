"use client";

import { ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useTransition } from "react";
import { logout } from "./actions";

export default function UserActions() {
  const [isPending, startTransition] = useTransition();

  return (
    <MenuList>
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
