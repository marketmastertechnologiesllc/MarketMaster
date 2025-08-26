import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { useLocation, useNavigate } from 'react-router-dom';
import { breadcrumbs } from '@material-tailwind/react';

const breadcrumb = {
  "/dashboard": [
    { name: "Dashboard", url: "/dashboard" }
  ],
  "/profile": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Profile", url: "/profile" },
  ],
  "/strategies": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Strategies", url: "/strategies" },
  ],
  "/analysis/analysis-account": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Accounts", url: "" },
    { name: "Analysis", url: "" },
  ],
  "/analysis": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Analysis", url: "/analysis" },
  ],
  "/accounts": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Configurator", url: "" },
    { name: "Accounts", url: "/accounts" },
  ],
  "/accounts/edit/": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Configurator", url: "" },
    { name: "Accounts", url: "/accounts" },
    { name: "Edit", url: "/accounts/edit/" },
  ],
  "/connect-strategy": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Configurator", url: "" },
    { name: "Connect Strategy", url: "/connect-strategy" },
  ],
  "/connect-strategy/edit": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Configurator", url: "" },
    { name: "Connect Strategy", url: "/connect-strategy" },
    { name: "Edit", url: "" },
  ],
  "/connect-strategy/new-connect-strategy": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Configurator", url: "" },
    { name: "Connect Strategy", url: "/connect-strategy" },
    { name: "New Connect Strategy", url: "/connect-strategy/new-connect-strategy" },
  ],
  "/email-alerts": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Configurator", url: "" },
    { name: "Email Alerts", url: "/email-alerts" },
  ],
  "/equity-monitors": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Configurator", url: "" },
    { name: "Equity Monitors", url: "/equity-monitors" },
  ],
  "/strategy-followers": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Strategy Followers", url: "/strategy-followers" },
  ],
  "/strategy-followers/add": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Strategy Followers", url: "/strategy-followers" },
    { name: "Add Strategy Follower", url: "/strategy-followers/add" },
  ],
  "/strategy-followers/details": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Strategy Followers", url: "/strategy-followers" },
    { name: "Follower Details", url: "" },
  ],
  "/strategy-provider": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Strategy Provider", url: "/strategy-provider" },
  ],
  "/strategy-provider/create": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Strategy Provider", url: "/strategy-provider" },
    { name: "Create Strategy Provider", url: "/strategy-provider/create" },
  ],
  "/strategy-provider/configure-payment-processor": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Strategy Provider", url: "/strategy-provider" },
    { name: "Configure Payment Processor", url: "" },
  ],
  "/strategy-provider/edit": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Strategy Provider", url: "/strategy-provider" },
    { name: "Edit", url: "" },
  ],
  "/strategy-provider/follower-terms": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Strategy Provider", url: "/strategy-provider" },
    { name: "Follower Terms", url: "" },
  ],
  "/whitelabel/dashboard": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Whitelabel", url: "" },
    { name: "Dashboard", url: "/whitelabel/dashboard" },
  ],
  "/whitelabel/users": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Whitelabel", url: "" },
    { name: "Users", url: "/whitelabel/users" },
  ],
  "/whitelabel/homepage": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Whitelabel", url: "" },
    { name: "Homepage", url: "/whitelabel/homepage" },
  ],
  "/whitelabel/users/edit": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Whitelabel", url: "" },
    { name: "Users", url: "/whitelabel/users" },
    { name: "Edit", url: "/whitelabel/users/edit" },
  ],
  "/whitelabel/users/add-user": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Whitelabel", url: "" },
    { name: "Users", url: "/whitelabel/users" },
    { name: "Add User", url: "/whitelabel/users/add-user" },
  ],
  "/whitelabel/settings": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Whitelabel", url: "" },
    { name: "Settings", url: "/whitelabel/settings" },
  ],
  "/knowledge-base": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Help Center", url: "" },
    { name: "Knowledge Base", url: "/knowledge-base" },
  ],
  "/contact-support": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Help Center", url: "" },
    { name: "Contact Support", url: "/contact-support" },
  ],
  "/accounts/add-account": [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Configurator", url: "" },
    { name: "Accounts", url: "/accounts" },
    { name: "Add account", url: "/accounts/add-account" },
  ],
}


export default function CustomSeparator() {

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const _goto = (url) => {
    if (url !== "") {
      navigate(url)
    }
  }


  const _path = (_url) => {
    if (_url.includes("/whitelabel/users/edit")) {
      return "/whitelabel/users/edit";
    } else if (_url.includes("/accounts/edit/")) {
      return "/accounts/edit/";
    } else if (_url.includes("/connect-strategy/edit")) {
      return "/connect-strategy/edit";
    } else if (_url.includes("/strategy-provider/edit")) {
      return "/strategy-provider/edit";
    } else if (_url.includes("/strategy-provider/follower-terms")) {
      return "/strategy-provider/follower-terms";
    } else if (_url.includes("/analysis/analysis-account")) {
      return "/analysis/analysis-account";
    } 

    return _url;
  }

  const breadcrumbs = breadcrumb[_path(pathname)] ? breadcrumb[_path(pathname)].map(item =>
    <Typography
      key="2"
      color="white"
      sx={{
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'underline'
        }
      }}
      onClick={() => _goto(item.url)}
    >
      {item.name}
    </Typography>
  ) : []


  return (
    <Breadcrumbs
      separator={<NavigateNextIcon sx={{ color: 'white' }} fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadcrumbs}
    </Breadcrumbs>
  );
}