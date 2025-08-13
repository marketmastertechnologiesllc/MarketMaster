import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Pagination from '@mui/material/Pagination';

const columns = [
  { id: 'accountName', label: 'Account Name', minWidth: 140 },
  { id: 'tradeOpen', label: 'Trade Open', minWidth: 100 },
  {
    id: 'tradeClosed',
    label: 'Trade Closed',
    minWidth: 100,
    // align: 'center',
    // format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'takeProfit',
    label: 'Take Profit',
    minWidth: 90,
    // align: 'center',
    // format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'stopLoss',
    label: 'Stop Loss',
    minWidth: 85,
    // align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'newPrice',
    label: 'New Price',
    minWidth: 85,
    // align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'notExecuted',
    label: 'Not Executed',
    minWidth: 85,
    // align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'option',
    label: '',
    minWidth: 32,
    maxWidth: 32,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
];

function createData(accountName, tradeOpen, tradeClosed, takeProfit, stopLoss, newPrice, notExecuted, option) {
  return {
    accountName,
    tradeOpen,
    tradeClosed,
    takeProfit,
    stopLoss,
    newPrice,
    notExecuted,
    option,
  };
}

const rows = [
  createData('Demo Account (846220)', "Trade Open", 'Trade Closed', 'Take Profit', 'Stop Loss', 'New Price', "Not Executed", ''),
  // createData('Italy', 'IT', 60483973, 301340),
  // createData('United States', 'US', 327167434, 9833520),
  // createData('Canada', 'CA', 37602103, 9984670),
  // createData('Australia', 'AU', 25475400, 7692024),
  // createData('Germany', 'DE', 83019200, 357578),
  // createData('Ireland', 'IE', 4857000, 70273),
  // createData('Mexico', 'MX', 126577691, 1972550),
  // createData('Japan', 'JP', 126317000, 377973),
  // createData('France', 'FR', 67022000, 640679),
  // createData('United Kingdom', 'GB', 67545757, 242495),
  // createData('Russia', 'RU', 146793744, 17098246),
  // createData('Nigeria', 'NG', 200962417, 923768),
  // createData('Brazil', 'BR', 210147125, 8515767),
];

export default function EmailAlertsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}
    >
      <TableContainer
        sx={{
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          maxWidth: '100%',
          overflowX: 'auto',
          '.MuiTable-root': {
            borderColor: 'rgba(17, 179, 174, 0.2)',
            borderWidth: '1px',
            minWidth: { xs: '600px', sm: 'auto' },
          },
        }}
      >
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{
            borderRadius: '12px',
            '& .MuiTableCell-root': {
              color: '#E9D8C8',
              backgroundColor: 'transparent',
              borderColor: 'rgba(17, 179, 174, 0.15)',
              fontSize: '0.875rem',
            },
            '& .MuiTableHead-root .MuiTableCell-root': {
              backgroundColor: 'rgba(17, 179, 174, 0.1)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderColor: 'rgba(17, 179, 174, 0.2)',
            },
            '& .MuiTableRow-root:hover': {
              backgroundColor: 'rgba(17, 179, 174, 0.05)',
            },
          }}
        >
          <TableHead sx={{
            borderRadius: '12px',
          }}>
            <TableRow
              sx={{
                '&:last-child td, &:last-child th': {
                  border: 1,
                  borderColor: 'rgba(17, 179, 174, 0.2)',
                },
              }}
            >
              {columns.map((column, index) => (
                <TableCell
                  key={`email_alert_table_header_${index}`}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    padding: '12px 8px',
                    fontWeight: 600,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              '&:last-child td, &:last-child th': {
                border: 1,
                borderColor: 'rgba(17, 179, 174, 0.15)',
              },
            }}
          >
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={`email_alert_table_row_${index}`}
                    sx={{
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(17, 179, 174, 0.08)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                      },
                    }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={{
                            padding: '12px 16px',
                            fontSize: '0.875rem',
                          }}
                        >
                          <div className="truncate font-medium">{column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}</div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-4 bg-[#0B1220] rounded-lg border border-[#11B3AE] border-opacity-20 gap-4">
        <div className="flex items-center gap-3">
          <FormControl size="small">
            <Select
              displayEmpty
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#0B1220',
                    border: '1px solid rgba(17, 179, 174, 0.3)',
                    borderRadius: '8px',
                    maxHeight: '200px',
                    '& .MuiMenuItem-root': {
                      color: '#E9D8C8',
                      '&:hover': {
                        backgroundColor: 'rgba(17, 179, 174, 0.1)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#11B3AE',
                        color: '#FFFFFF',
                        '&:hover': {
                          backgroundColor: '#0F9A95',
                        },
                      },
                    },
                  },
                },
              }}
              input={
                <OutlinedInput
                  sx={{
                    width: { xs: '70px', sm: '80px' },
                    color: '#E9D8C8',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(17, 179, 174, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(17, 179, 174, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#11B3AE',
                      boxShadow: '0 0 0 2px rgba(17, 179, 174, 0.2)',
                    },
                    '& .MuiSelect-icon': {
                      color: '#E9D8C8',
                    },
                  }}
                />
              }
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
          <Typography sx={{ 
            color: '#E9D8C8', 
            fontWeight: 500,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            records per page
          </Typography>
        </div>
        <Typography sx={{ 
          color: '#E9D8C8', 
          fontSize: { xs: 12, sm: 14 }, 
          fontWeight: 500,
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          Showing {rowsPerPage * page + 1} to
          {rowsPerPage * (page + 1) > rows.length ? rows.length : rowsPerPage * (page + 1)} of {rows.length}
          entries
        </Typography>
        <Pagination
          sx={{
            paddingY: 2,
            '& .MuiPaginationItem-root': {
              color: '#E9D8C8',
              borderColor: 'rgba(17, 179, 174, 0.3)',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              minWidth: { xs: '32px', sm: '40px' },
              height: { xs: '32px', sm: '40px' },
              '&:hover': {
                backgroundColor: 'rgba(17, 179, 174, 0.1)',
                borderColor: 'rgba(17, 179, 174, 0.5)',
              },
              '&.Mui-selected': {
                backgroundColor: '#11B3AE',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#0F9A95',
                },
              },
            },
          }}
          count={
            rows.length % rowsPerPage === 0
              ? rows.length / rowsPerPage
              : Math.floor(rows.length / rowsPerPage) + 1
          }
          page={page + 1}
          onChange={(e, value) => handleChangePage(e, value - 1)}
          variant="outlined"
          shape="rounded"
          showFirstButton
          showLastButton
          size="small"
        />
      </div>
    </Paper>
  );
}
