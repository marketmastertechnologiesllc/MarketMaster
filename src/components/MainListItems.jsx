import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SpeedIcon from '@mui/icons-material/Speed';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import SearchIcon from '@mui/icons-material/Search';
import ListIcon from '@mui/icons-material/List';
import ShareIcon from '@mui/icons-material/Share';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import EmailIcon from '@mui/icons-material/Email';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import LayersIcon from '@mui/icons-material/Layers';
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import Collapse from '@mui/material/Collapse';
import { Link } from 'react-router-dom';
import LabelIcon from '@mui/icons-material/Label';
import HouseIcon from '@mui/icons-material/House';
import GroupsIcon from '@mui/icons-material/Groups';
import { keyframes } from '@mui/system';

import useAuth from '../hooks/useAuth';

function MainListItems({ open, onItemClick }) {
  const [openConfigurator, setOpenConfigurator] = React.useState(false);
  const [openHelpCenter, setOpenHelpCenter] = React.useState(false);
  const [whitelabel, setWhitelabel] = React.useState(false);

  const { user } = useAuth();
  
  // Check if we're on mobile and get fullscreen state from parent
  const isMobile = window.innerWidth < 640;
  const isFullScreen = isMobile && open;

  // Animation keyframes
  const slideInFromLeft = keyframes`
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  `;

  const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;

  const handleConfiguratorClick = () => {
    setOpenConfigurator(!openConfigurator);
    setOpenHelpCenter(false);
    setWhitelabel(false);
  };

  const handleHelpCenterClick = () => {
    setOpenHelpCenter(!openHelpCenter);
    setOpenConfigurator(false);
    setWhitelabel(false);
  };

  const handleWhitelabelClick = () => {
    setWhitelabel(!whitelabel);
    setOpenHelpCenter(false);
    setOpenConfigurator(false);
  };

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 240,
        bgcolor: '#0B1220',
        flexGrow: 1,
        paddingLeft: { xs: 'auto', sm: '7px' },
        paddingTop: 0,
        marginTop: 0,
        position: isFullScreen ? 'absolute' : 'relative',
        top: isFullScreen ? '64px' : 'auto',
        left: isFullScreen ? 0 : 'auto',
        zIndex: isFullScreen ? 1400 : 'auto',
        height: isFullScreen ? 'calc(100vh - 64px)' : 'auto',
        overflowY: isFullScreen ? 'auto' : 'visible',
        borderRight: '2px solid #11B3AE',
        animation: isFullScreen ? `${slideInFromLeft} 0.3s ease-out, ${fadeIn} 0.4s ease-out` : 'none',
        '& .MuiListItemButton-root': {
          borderRadius: '8px',
          margin: '2px 2px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(17, 179, 174, 0.1)',
            transform: isMobile ? 'translateY(-2px)' : 'translateX(4px)',
            boxShadow: '0 2px 2px rgba(17, 179, 174, 0.2)',
          },
          '&.Mui-selected': {
            backgroundColor: '#11B3AE',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#0F9A95',
            },
            '& .MuiListItemIcon-root': {
              color: '#FFFFFF',
            },
          },
        },
        '& .MuiListItemIcon-root': {
          color: '#E9D8C8',
          transition: 'all 0.2s ease-in-out',
        },
        '& .MuiListItemText-primary': {
          color: '#E9D8C8',
          fontWeight: 500,
          fontSize: isMobile ? '1rem' : '0.875rem',
          transition: 'all 0.2s ease-in-out',
          display: !isMobile && !open ? 'none' : 'block',
        },
        '& .MuiCollapse-root': {
          backgroundColor: 'rgba(17, 179, 174, 0.05)',
          borderRadius: '8px',
          margin: '2px 2px',
          display: !isMobile && !open ? 'none' : 'block',
          '& .MuiListItemButton-root': {
            margin: '1px 8px',
            paddingLeft: isMobile ? '48px' : '32px',
            '&:hover': {
              backgroundColor: 'rgba(17, 179, 174, 0.1)',
              transform: isMobile ? 'translateY(-1px)' : 'translateX(2px)',
            },
          },
        },
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <Link className="flex flex-row" to={'/dashboard'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
        <ListItemButton>
          <ListItemIcon >
            <SpeedIcon sx={{ color: '#E9D8C8' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </Link>
      <Link className="flex flex-row" to={'/strategies'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
        <ListItemButton>
          <ListItemIcon>
            <SignalCellularAltIcon sx={{ color: '#E9D8C8' }} />
          </ListItemIcon>
          <ListItemText primary="Strategies" />
        </ListItemButton>
      </Link>
      <ListItemButton 
        onClick={handleConfiguratorClick}
        sx={{
          '&:hover .MuiListItemIcon-root': {
            color: '#11B3AE',
          },
        }}
      >
        <ListItemIcon>
          <SettingsSuggestIcon sx={{ color: '#E9D8C8' }} />
        </ListItemIcon>
        <ListItemText primary="Configurator" />
        {openConfigurator ? (
          <ExpandLess sx={{ color: '#11B3AE' }} />
        ) : (
          <ExpandMore sx={{ color: '#E9D8C8' }} />
        )}
      </ListItemButton>
      <Collapse
        in={openConfigurator && open}
        timeout="auto"
        unmountOnExit
        sx={{
          backgroundColor: 'rgba(17, 179, 174, 0.05)',
          borderRadius: '8px',
          margin: '2px 2px',
        }}
      >
        <List component="div" disablePadding>
          <Link className="flex flex-row" to={'/accounts'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ListIcon sx={{ color: '#E9D8C8' }} />
              </ListItemIcon>
              <ListItemText primary="Accounts" />
            </ListItemButton>
          </Link>
          <Link className="flex flex-row" to={'/connect-strategy'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ShareIcon sx={{ color: '#E9D8C8' }} />
              </ListItemIcon>
              <ListItemText primary="Connect Strategy" />
            </ListItemButton>
          </Link>
          <Link className="flex flex-row" to={'/equity-monitors'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <MonitorHeartIcon sx={{ color: '#E9D8C8' }} />
              </ListItemIcon>
              <ListItemText primary="Equity Monitors" />
            </ListItemButton>
          </Link>
          <Link className="flex flex-row" to={'/email-alerts'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <EmailIcon sx={{ color: '#E9D8C8' }} />
              </ListItemIcon>
              <ListItemText primary="Email Alerts" />
            </ListItemButton>
          </Link>
        </List>
      </Collapse>
      <Link className="flex flex-row" to={'/analysis'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
        <ListItemButton>
          <ListItemIcon>
            <SearchIcon sx={{ color: '#E9D8C8' }} />
          </ListItemIcon>
          <ListItemText primary="Analysis" />
        </ListItemButton>
      </Link>
      {
        (user.role === "Admin" || user.role === 'Provider') &&
        <>
          <ListItemButton 
            onClick={handleWhitelabelClick}
            sx={{
              '&:hover .MuiListItemIcon-root': {
                color: '#11B3AE',
              },
            }}
          >
            <ListItemIcon>
              <LabelIcon sx={{ color: '#E9D8C8' }} />
            </ListItemIcon>
            <ListItemText primary="Whitelabel" />
            {whitelabel ? (
              <ExpandLess sx={{ color: '#11B3AE' }} />
            ) : (
              <ExpandMore sx={{ color: '#E9D8C8' }} />
            )}
          </ListItemButton>
          <Collapse
            in={whitelabel && open}
            timeout="auto"
            unmountOnExit
            sx={{
              backgroundColor: 'rgba(17, 179, 174, 0.05)',
              borderRadius: '8px',
              margin: '2px 2px',
            }}
          >
            <List component="div" disablePadding>
              <Link className="flex flex-row" to={'/whitelabel/dashboard'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <SpeedIcon sx={{ color: '#E9D8C8' }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </Link>
              <Link className="flex flex-row" to={'/whitelabel/users'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <GroupsIcon sx={{ color: '#E9D8C8' }} />
                  </ListItemIcon>
                  <ListItemText primary="Users" />
                </ListItemButton>
              </Link>
              <Link className="flex flex-row" to={'/whitelabel/homepage'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <HouseIcon sx={{ color: '#E9D8C8' }} />
                  </ListItemIcon>
                  <ListItemText primary="Homepage" />
                </ListItemButton>
              </Link>
              <Link className="flex flex-row" to={'/whitelabel/settings'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <SettingsSuggestIcon sx={{ color: '#E9D8C8' }} />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </Link>
              <Link className="flex flex-row" to={'/strategy-followers'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ForwardRoundedIcon sx={{ color: '#E9D8C8' }} />
                  </ListItemIcon>
                  <ListItemText primary="Strategy Followers" />
                </ListItemButton>
              </Link>
              <Link className="flex flex-row" to={'/strategy-provider'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <SwapHorizRoundedIcon sx={{ color: '#E9D8C8' }} />
                  </ListItemIcon>
                  <ListItemText primary="Strategy Provider" />
                </ListItemButton>
              </Link>
            </List>
          </Collapse>
        </>
      }
      <ListItemButton 
        onClick={handleHelpCenterClick}
        sx={{
          '&:hover .MuiListItemIcon-root': {
            color: '#11B3AE',
          },
        }}
      >
        <ListItemIcon>
          <LayersIcon sx={{ color: '#E9D8C8' }} />
        </ListItemIcon>
        <ListItemText primary="Help Center" />
        {openHelpCenter ? (
          <ExpandLess sx={{ color: '#11B3AE' }} />
        ) : (
          <ExpandMore sx={{ color: '#E9D8C8' }} />
        )}
      </ListItemButton>
      <Collapse
        in={openHelpCenter && open}
        timeout="auto"
        unmountOnExit
        sx={{
          backgroundColor: 'rgba(17, 179, 174, 0.05)',
          borderRadius: '8px',
          margin: '2px 2px',
        }}
      >
        <List component="div" disablePadding>
          <Link className="flex flex-row" to={'/knowledge-base'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <LibraryBooksIcon sx={{ color: '#E9D8C8' }} />
              </ListItemIcon>
              <ListItemText primary="Knowledge Base" />
            </ListItemButton>
          </Link>
          <Link className="flex flex-row" to={'/contact-support'} onClick={isMobile && onItemClick ? onItemClick : undefined}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ChatBubbleIcon sx={{ color: '#E9D8C8' }} />
              </ListItemIcon>
              <ListItemText primary="Contact Support" />
            </ListItemButton>
          </Link>
        </List>
      </Collapse>
    </List>
    );
  }

export default MainListItems;
