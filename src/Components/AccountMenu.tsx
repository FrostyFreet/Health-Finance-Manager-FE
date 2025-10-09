import { IconButton, Avatar, Menu, MenuItem, ListItemIcon, Divider, Tooltip } from "@mui/material";
import { useContext, useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { IsLoggedInContext } from "../App";
import { useNavigate } from "react-router";
import { supabaseLogOut } from "../API/Authentication";

export default function AccountMenu() {
  const session = useContext(IsLoggedInContext)
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {setAnchorEl(null);};

  const handleLogout = async () => {
    try{
      await supabaseLogOut()
    }
    catch(e: unknown){
      return e
    }
    handleClose();
  };


  return (
    <>
      <Tooltip title="Account">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32,
              bgcolor: 'primary.main',
            }}
           
          >
            {session?.user?.email?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              minWidth: 200,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {session !== null ? (
          <>
            <MenuItem onClick={()=> navigate("/profile")} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={()=> navigate("/change-password")} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </ListItemIcon>
              Change Password
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </>
        ) : (
          <MenuItem onClick={()=> navigate("/login")} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            Login
          </MenuItem>
        )}
          </Menu>
        
    </>
  );
}