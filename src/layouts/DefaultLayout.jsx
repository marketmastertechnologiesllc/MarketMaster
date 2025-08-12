import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HelpIcon from '@mui/icons-material/Help';
import ListSubheader from '@mui/material/ListSubheader';
import MainListItems from '../components/MainListItems';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

import BreadCrumb from '../components/BreadCrumb';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#0B1220',
  color: '#E9D8C8',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#0B1220',
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    backgroundColor: '#0B1220',
    color: '#E9D8C8',
    borderRight: '1px solid rgba(17, 179, 174, 0.3)',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({});

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openManual, setOpenManual] = React.useState(false);
  const { isAuthenticated } = useAuth();

  const toggleDrawer = () => {
    setOpen(!open);
    setOpenManual(!openManual);
  };

  if (isAuthenticated) {
    return (
      <div className="bg-[#0B1220] text-[#E9D8C8] h-screen">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex h-fit overflow-hidden w-full">
          <div className="relative flex-1">
            <ThemeProvider theme={defaultTheme}>
              <Box
                sx={{
                  display: 'flex',
                  overflowY: 'scroll',
                }}
              >
                {/* <CssBaseline /> */}
                <AppBar position="absolute" open={open}>
                  <Toolbar
                    sx={{
                      pr: '24px', // keep right padding when drawer closed,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'radial-gradient(120% 150% at 10% 0%, rgba(17,179,174,.25) 0%, rgba(17,179,174,0) 60%), #0B1220',
                      color: '#E9D8C8',
                      borderBottom: '1px solid rgba(17, 179, 174, 0.3)',
                      boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                    }}
                  >
                    <Grid container alignItems='center'>
                      <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                          marginRight: '36px',
                          ...(open && { display: 'none' }),
                          '&:hover': {
                            backgroundColor: 'rgba(17, 179, 174, 0.1)',
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <MenuIcon />
                      </IconButton>
                      <BreadCrumb />
                    </Grid>
                    <Button
                      variant="contained"
                      startIcon={<HelpIcon />}
                      size="small"
                      sx={{ 
                        textTransform: 'none', 
                        float: 'right!important',
                        backgroundColor: '#11B3AE',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        fontWeight: 500,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#0F9A95',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                        },
                      }}
                    >
                      Help
                    </Button>
                  </Toolbar>
                </AppBar>
                <Drawer
                  variant="permanent"
                  open={open}
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => {
                    if (!openManual) setOpen(false);
                  }}
                  sx={{
                    backgroundColor: '#0B1220',
                    position: 'sticky',
                    top: '0px',
                  }}
                >
                  <Toolbar
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: [1],
                      backgroundColor: 'rgba(17, 179, 174, 0.1)',
                      borderBottom: '1px solid rgba(17, 179, 174, 0.3)',
                    }}
                  >
                    <ListSubheader
                      component="div"
                      sx={{ 
                        color: '#E9D8C8', 
                        backgroundColor: 'transparent',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                    >
                      Navigation
                    </ListSubheader>
                    <IconButton
                      color="inherit"
                      onClick={toggleDrawer}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        '&:hover': {
                          backgroundColor: 'rgba(17, 179, 174, 0.1)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                  </Toolbar>
                  <MainListItems open={open} />
                </Drawer>
                <Box
                  component="main"
                  sx={{
                    backgroundColor: '#0B1220',
                    flexGrow: 1,
                    overflowY: 'scroll',
                    height: '100vh',
                    width: 'calc(100vw - 240px)',
                  }}
                >
                  <Toolbar />
                  <div className="m-10">
                    <Outlet />
                  </div>
                </Box>
              </Box>
            </ThemeProvider>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default DefaultLayout;
