import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AppRouteConfig from '../Routes/AppRoute.config';
import UserContext from '../AppContext/UserContext';
const applogo = require('../Media/images/applogo.png'); //convert into base64 image

//const pages = [{name:'Home', href:'/'},{name: 'About', href:'/About'}];

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar(props: { onIconClick: () => void }) {
  const context = React.useContext(UserContext);
  const pages = AppRouteConfig.pages.filter((p) => p.isVisible);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [__user, __setUser] = React.useState<{ name: string, email: string }>();
  React.useEffect(() => {
    context.DefaultSPListProvider.getUserProfile().then((u) => {
      __setUser(u);
    })
  }, [context.DefaultSPListProvider]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const onMenuClick = (page: string) => {
    setAnchorElNav(null);
    window.location.hash = page;
  };


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="sticky">
        <Box sx={{ margin: '0px 10px' }} >
          <Toolbar disableGutters>
            <MenuIcon onClick={props.onIconClick} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            {/* <Notebook sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
            <img src={applogo} alt='applogo' width={'24px'} style={{ display: 'flex', margin: '0px 10px' }}></img>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              MY NOTES
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.name}
                    onClick={(e) => { onMenuClick(page.href); e.preventDefault(); }}
                  >
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            {/* <Notebook sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
            {/* <img src={applogo} width={'24px'} style={{display:'flex', marginRight: 1  }}></img> */}
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              MY NOTES
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={(e) => { onMenuClick(page.href); e.preventDefault(); }}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0, float: 'right' }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={__user?.name} src={`${context.SPHost}/_layouts/15/userphoto.aspx?size=L&accountname=${__user?.email}`} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
    </>
  );
}
export default ResponsiveAppBar;