'use client'

import { Box, Drawer } from "@mui/material";
import UserActions from "./MenuActions";
import { useUser } from "@/app/providers/UserProvider";

interface Props {
  open: boolean
  closeDrawer: (boolean) => void
}
export default function UserDrawer({ open, closeDrawer}: Props) {

  const { user, loading } = useUser();
  if (loading) return null;

  return (
    <Drawer open={open} onClose={closeDrawer} anchor="right">
      <Box
        sx={{ width: 250, height: '100%' }}
        role="presentation"
        onClick={closeDrawer}
        onKeyDown={closeDrawer}
      >
        <UserActions userId={user.id}/>
      </Box>
    </Drawer>
  );
}
