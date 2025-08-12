import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Icon } from '@iconify/react';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

import Logo from '../assets/img/dark-logo-img.png';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';
import api from '../utils/api';
import useToast from '../hooks/useToast';

function Header() {
  const { showToast } = useToast();
  const { socket } = useSocket();
  const { isAuthenticated, user, signOut } = useAuth();

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [lastMessage, setLastMessage] = React.useState(null);

  if (user.role === 'Admin') {
    socket.once('alert', (msg) => {
      setLastMessage(msg);
    });
  }

  React.useEffect(() => {
    if (lastMessage !== null) {
      setData((prev) => [...prev, lastMessage.payload]);
    }
  }, [lastMessage]);

  React.useEffect(() => {
    async function fetchNotificationData() {
      const notificationData = await api.get('/notification');
      setData(notificationData.data.data);
    }

    fetchNotificationData();
  }, []);

  const handleNotificationUserClicked = async (userId) => {
    setIsNotificationOpen(false);
    const res = await api.post('/notification', {
      userId: userId,
    });
    if (res.data.status === 'OK') {
      const notificationData = await api.get('/notification');
      setData(notificationData.data.data);
      navigate(`/whitelabel/users/edit/${userId}`);
    } else {
      showToast('Something went wrong!', 'error');
    }
  };

  const handleNotificationButtonClicked = async () => {
    try {
      const notificationData = await api.get('/notification');
      setData(notificationData.data.data);
      setIsNotificationOpen(true);
      // const res = await api.put('/notification');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between h-[70px] bg-[#0B1220] text-[#E9D8C8] p-[15px] border-b border-[rgba(17,179,174,0.3)] shadow-[0_4px_12px_rgba(17,179,174,0.1)]">
      <img className="h-10 w-10" src={Logo} alt="" />
      <div className="flex flex-row gap-x-2">
        {!isAuthenticated ? (
          <>
            <Link
              to={'/auth/login'}
              className="bg-[#11B3AE] border-[#11B3AE] inline-block py-1.5 px-3 rounded-md mb-0 text-sm font-normal cursor-pointer border text-white transition-all duration-200 hover:bg-[#0F9A95] hover:transform hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(17,179,174,0.3)]"
            >
              Login
            </Link>
            <Link
              to={'/auth/signup'}
              className="bg-[#11B3AE] border-[#11B3AE] inline-block py-1.5 px-3 rounded-md mb-0 text-sm font-normal cursor-pointer border text-white transition-all duration-200 hover:bg-[#0F9A95] hover:transform hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(17,179,174,0.3)]"
            >
              SignUp
            </Link>
          </>
        ) : user.role === 'Admin' ? (
          <div className="flex items-center justify-center gap-3">
            <Badge
              badgeContent={data.length}
              color="error"
              sx={{ mr: '5px' }}
              onClick={handleNotificationButtonClicked}
            >
              <NotificationsIcon 
                sx={{ 
                  fontSize: 30,
                  color: '#E9D8C8',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: '#11B3AE',
                    transform: 'translateY(-1px)',
                  }
                }} 
              />
            </Badge>
            <div
              id="notificationDropdown"
              className={`z-[1205] right-[200px] top-[70px] absolute bg-[#0B1220] divide-gray-100 rounded-lg shadow-xl w-44 border border-[rgba(17,179,174,0.3)] ${
                !isNotificationOpen && 'hidden'
              }`}
            >
              <ul
                className="py-1 text-sm text-[#E9D8C8]"
                aria-labelledby="avatarButton"
              >
                {data.length > 0 ? (
                  data.map((item, idx) => {
                    // Check if item.users exists before accessing its properties
                    if (!item.users) {
                      return null; // Skip rendering this item if users is undefined
                    }
                    
                    return (
                      <li
                        key={idx}
                        className="flex justify-between font-medium text-[#E9D8C8] truncate p-2 text-right text-base rounded cursor-pointer hover:bg-[#11B3AE] hover:text-white transition-all duration-200"
                        onClick={() =>
                          handleNotificationUserClicked(item.users.id)
                        }
                      >
                        <Avatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/2.jpg"
                          sx={{
                            position: 'relative',
                            width: 26,
                            height: 26,
                          }}
                        />
                        {item.users.fullName}
                      </li>
                    );
                  }).filter(Boolean) // Remove null items from the array
                ) : (
                  <li className="flex justify-center font-medium text-[#E9D8C8] truncate p-2 text-base rounded">
                    No Notifications
                  </li>
                )}
              </ul>
            </div>
            <Avatar
              alt={`${user.fullName.toUpperCase()} avatar`}
              src="/static/images/avatar/2.jpg"
              sx={{ position: 'relative' }}
            />
            <Typography sx={{ color: '#E9D8C8', fontWeight: 500 }}>{user.fullName}</Typography>
            <Box
              onClick={() => {
                if (isNotificationOpen) setIsNotificationOpen(false);
                setIsOpen(!isOpen);
              }}
              className="cursor-pointer text-[#E9D8C8] z-[1204] transition-all duration-200 hover:text-[#11B3AE] hover:transform hover:translate-y-[-1px]"
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </Box>
            <div
              className={`fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1203] ${
                !isOpen && !isNotificationOpen && 'hidden'
              }`}
              onClick={() => {
                setIsOpen(false);
                setIsNotificationOpen(false);
                // setData({});
              }}
            ></div>
            <div
              id="userDropdown"
              className={`z-[1205] right-[10px] top-[70px] absolute bg-[#0B1220] divide-gray-100 rounded-lg shadow-xl w-44 border border-[rgba(17,179,174,0.3)] ${
                !isOpen && 'hidden'
              }`}
            >
              <div className="px-4 py-3 text-sm">
                <div className="font-medium text-[#E9D8C8] truncate">
                  {user.email}
                </div>
              </div>
              <hr className="bg-[rgba(17,179,174,0.3)] h-[1px] border-0 my-0 mx-1" />
              <ul
                className="py-1 text-sm text-[#E9D8C8]"
                aria-labelledby="avatarButton"
              >
                <li>
                  <Link
                    to={'/profile'}
                    className="block px-2 py-2 hover:bg-[#11B3AE] hover:text-white m-1 rounded transition-all duration-200"
                  >
                    <div className="flex flex-row gap-2">
                      <Icon
                        icon="majesticons:user"
                        color="#E9D8C8"
                        width="20"
                        height="20"
                      />
                      Profile
                    </div>
                  </Link>
                </li>
              </ul>
              <hr className="bg-[rgba(17,179,174,0.3)] h-[1px] border-0 my-0 mx-1" />
              <div
                className="cursor-pointer rounded px-2 py-2 text-sm text-[#E9D8C8] hover:bg-[#11B3AE] hover:text-white m-1 transition-all duration-200"
                onClick={signOut}
              >
                <div className="flex flex-row gap-2 items-center">
                  <Icon
                    icon="wpf:shutdown"
                    color="#E9D8C8"
                    width="20"
                    height="20"
                  />
                  Logout
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <Avatar
              alt={`${user.fullName.toUpperCase()} avatar`}
              src="/static/images/avatar/2.jpg"
              sx={{ position: 'relative' }}
            />
            <Typography sx={{ color: '#E9D8C8', fontWeight: 500 }}>{user.fullName}</Typography>
            <Box
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer text-[#E9D8C8] z-[1204] transition-all duration-200 hover:text-[#11B3AE] hover:transform hover:translate-y-[-1px]"
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </Box>
            <div
              className={`fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1203] ${
                !isOpen && 'hidden'
              }`}
              onClick={() => setIsOpen(false)}
            ></div>
            <div
              id="userDropdown"
              className={`z-[1205] right-[10px] top-[70px] absolute bg-[#0B1220] divide-gray-100 rounded-lg shadow-xl w-44 border border-[rgba(17,179,174,0.3)] ${
                !isOpen && 'hidden'
              }`}
            >
              <div className="px-4 py-3 text-sm">
                <div className="font-medium text-[#E9D8C8] truncate">
                  {user.email}
                </div>
              </div>
              <hr className="bg-[rgba(17,179,174,0.3)] h-[1px] border-0 my-0 mx-1" />
              <ul
                className="py-1 text-sm text-[#E9D8C8]"
                aria-labelledby="avatarButton"
              >
                <li>
                  <Link
                    to={'/profile'}
                    className="block px-2 py-2 hover:bg-[#11B3AE] hover:text-white m-1 rounded transition-all duration-200"
                  >
                    <div className="flex flex-row gap-2">
                      <Icon
                        icon="majesticons:user"
                        color="#E9D8C8"
                        width="20"
                        height="20"
                      />
                      Profile
                    </div>
                  </Link>
                </li>
              </ul>
              <hr className="bg-[rgba(17,179,174,0.3)] h-[1px] border-0 my-0 mx-1" />
              <div
                className="cursor-pointer rounded px-2 py-2 text-sm text-[#E9D8C8] hover:bg-[#11B3AE] hover:text-white m-1 transition-all duration-200"
                onClick={signOut}
              >
                <div className="flex flex-row gap-2 items-center">
                  <Icon
                    icon="wpf:shutdown"
                    color="#E9D8C8"
                    width="20"
                    height="20"
                  />
                  Logout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
