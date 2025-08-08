import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const SignalFollowersTable = ({ data, type = 'followers' }) => {
  const getColumns = () => {
    if (type === 'deleted') {
      return [
        { id: 'deleted', label: 'Deleted', minWidth: 150 },
        { id: 'followerName', label: 'Follower Name', minWidth: 120 },
        { id: 'followerId', label: 'Follower ID', minWidth: 100 },
        { id: 'entityId', label: 'Entity ID', minWidth: 100 },
        { id: 'email', label: 'Email', minWidth: 150 },
        { id: 'account', label: 'Account', minWidth: 150 },
        { id: 'emailAlerts', label: 'Email Alerts', minWidth: 100, align: 'center' },
        { id: 'tradeCopier', label: 'Trade Copier', minWidth: 100, align: 'center' },
        { id: 'accessTerms', label: 'Access Terms', minWidth: 120 },
        { id: 'expires', label: 'Expires', minWidth: 100, align: 'center' },
        { id: 'actions', label: '', minWidth: 50, align: 'center' }
      ];
    }
    
    return [
      { id: 'followerName', label: 'Follower Name', minWidth: 120 },
      { id: 'followerId', label: 'Follower ID', minWidth: 100 },
      { id: 'email', label: 'Email', minWidth: 150 },
      { id: 'account', label: 'Account', minWidth: 150 },
      { id: 'emailAlerts', label: 'Email Alerts', minWidth: 100, align: 'center' },
      { id: 'tradeCopier', label: 'Trade Copier', minWidth: 100, align: 'center' },
      { id: 'accessTerms', label: 'Access Terms', minWidth: 120 },
      { id: 'expires', label: 'Expires', minWidth: 100, align: 'center' },
      { id: 'actions', label: '', minWidth: 50, align: 'center' }
    ];
  };

  const renderCell = (row, column) => {
    switch (column.id) {
      case 'emailAlerts':
      case 'tradeCopier':
        return row[column.id] ? 
          <CheckCircleIcon sx={{ color: '#47a447' }} /> : 
          <CancelIcon sx={{ color: '#d2322d' }} />;
      
      case 'expires':
        return row[column.id] ? 
          row[column.id] : 
          <CancelIcon sx={{ color: '#d2322d' }} />;
      
      case 'account':
        return (
          <span style={{ color: type === 'deleted' ? '#d2322d' : '#ccc' }}>
            {row[column.id]}
          </span>
        );
      
      case 'actions':
        return (
          <IconButton size="small">
            <SettingsIcon sx={{ color: '#0099e6' }} />
          </IconButton>
        );
      
      default:
        return row[column.id];
    }
  };

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#2E353E', boxShadow: 'none' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#282D36' }}>
            {getColumns().map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  color: '#ccc',
                  borderColor: '#282D36',
                  textAlign: column.align || 'left',
                  minWidth: column.minWidth
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {getColumns().map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    color: '#ccc',
                    borderColor: '#282D36',
                    textAlign: column.align || 'left'
                  }}
                >
                  {renderCell(row, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SignalFollowersTable; 