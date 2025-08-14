import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import api from '../../utils/api';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Icon } from '@iconify/react';
import Pagination from '@mui/material/Pagination';
import { useParams } from 'react-router-dom';
import { formatNumber } from '../../utils/formatNumber';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(17, 179, 174, 0.3)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(17, 179, 174, 0.5)',
  },
  '&:focus-within': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid #11B3AE',
    boxShadow: '0 0 0 2px rgba(17, 179, 174, 0.2)',
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#E9D8C8',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#E9D8C8',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#E9D8C8',
    opacity: 0.7,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#E9D8C8',
  backgroundColor: 'transparent',
  borderColor: 'rgba(17, 179, 174, 0.15)',
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: '12px 16px',
  '&.MuiTableCell-head': {
    backgroundColor: 'rgba(17, 179, 174, 0.1)',
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: '0.875rem',
    borderColor: 'rgba(17, 179, 174, 0.2)',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(17, 179, 174, 0.05)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
  },
}));

const headers = [
  { id: 'positionTicket', label: 'Ticket' },
  { id: 'openTimeAsDateTime', label: 'OpenTime' },
  { id: 'symbol', label: 'Symbol' },
  { id: 'type', label: 'Type' },
  { id: 'lots', label: 'Lots' },
  { id: 'openPrice', label: 'OpenPrice' },
  { id: 'stopLoss', label: 'SL' },
  { id: 'takeProfit', label: 'TP' },
  { id: 'commission', label: 'Com' },
  { id: 'swap', label: 'Swap' },
  { id: 'profit', label: 'Profit' },
  { id: 'comment', label: 'comment' },
];

export default function OpenTradeTable() {
  const [sort, setSort] = React.useState({
    id: '',
    type: '',
  });

  const { id } = useParams();
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(e.target.value);
    handlePageChange(null, 1, e.target.value);
  };

  const handlePageChange = async (e, value, pageCount) => {
    setPage(value);

    try {
      const res = await api.get(
        `/trade/${id}?page=${value}&pagecount=${pageCount ? pageCount : rowsPerPage
        }&sort=${sort.id}&type=${sort.type}`
      );
      setData(res.data.data);
      setCount(res.data.count);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    async function fetchData() {
      const res = await api.get(
        `/trade/${id}?page=${page}&pagecount=${rowsPerPage}&sort=${sort.id}&type=${sort.type}`
      );
      setData(res.data.data);
      setCount(res.data.count);
    }
    fetchData();
  }, [id]);

  return (
    // <div className="text-[#E9D8C8] bg-[#0B1220] p-6 rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
    <div className="text-[#E9D8C8] bg-[#0B1220] p-6 rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
      <div className="flex flex-col sm:flex-row justify-between w-full pb-4 gap-4">
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
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
      </div>
      
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
                {headers.map(({ label, id }, index) => (
                  <StyledTableCell
                    key={`header_${index}`}
                    align="center"
                    sx={{
                      padding: '12px 8px',
                      fontWeight: 600,
                    }}
                  >
                    <div className="flex items-center justify-between p-[6px]">
                      {label}
                      <div className="flex flex-col cursor-pointer">
                        <Icon
                          icon="teenyicons:up-solid"
                          color="#11B3AE"
                          className="mb-[-4px] hover:text-[#E9D8C8] transition-colors"
                          width={11}
                        />
                        <Icon
                          icon="teenyicons:down-solid"
                          width={11}
                          color="#11B3AE"
                          className="hover:text-[#E9D8C8] transition-colors"
                        />
                      </div>
                    </div>
                  </StyledTableCell>
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
              {data && data.map((row) => {
                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(17, 179, 174, 0.08)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                      },
                      '&:last-child td, &:last-child th': {
                        border: 1,
                        borderColor: 'rgba(17, 179, 174, 0.15)',
                      },
                    }}
                  >
                    {headers.map(({ id }) => {
                      let value = row[id];
                      if (id === 'type') {
                        value = value === 'DealBuy' ? 'Sell' : 'Buy';
                      } else if (id === 'openTimeAsDateTime') {
                        value = value.substring(0, 10) + ' ' + value.substring(11, 19);
                      } else if (id === 'openPrice') {
                        value = formatNumber(value);
                      } else if (id === 'profit') {
                        value = formatNumber(value);
                      } else if (id === 'swap') {
                        value = formatNumber(value);
                      }
                      return (
                        <StyledTableCell
                          key={id}
                          align="left"
                          sx={{
                            padding: '12px 16px',
                            fontSize: '0.875rem',
                          }}
                        >
                          <div className="truncate font-medium">{value}</div>
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-4 bg-[#0B1220] rounded-lg border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)] gap-4">
          <Typography sx={{ 
            color: '#E9D8C8', 
            fontSize: { xs: 12, sm: 14 }, 
            fontWeight: 500,
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            Showing {rowsPerPage * (page - 1) + 1} to{' '}
            {rowsPerPage * page > count ? count : rowsPerPage * page} of {count}{' '}
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
              count % rowsPerPage === 0
                ? count / rowsPerPage
                : Math.floor(count / rowsPerPage) + 1
            }
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            showFirstButton
            showLastButton
            size="small"
          />
        </div>
      </Paper>
    </div>
  );
}
