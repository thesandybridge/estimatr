import { Box, Drawer } from "@mui/material";
import UserActions from "./MenuActions";

interface Props {
  open: boolean
  closeDrawer: (boolean) => void
}
export default function UserDrawer({ open, closeDrawer}: Props) {

  return (
    <Drawer open={open} onClose={closeDrawer} anchor="right">
      <Box
        sx={{ width: 250, height: '100%' }}
        role="presentation"
        onClick={closeDrawer}
        onKeyDown={closeDrawer}
      >
        <UserActions />
      </Box>
    </Drawer>
  );
}
