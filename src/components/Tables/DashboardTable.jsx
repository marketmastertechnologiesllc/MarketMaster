import * as React from 'react';
import { Link } from 'react-router-dom';
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
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import { Icon } from '@iconify/react';
import api from '../../utils/api';
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
    // vertical padding + font size from searchIcon
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

export default function TradesTable({ headers }) {
  const [sort, setSort] = React.useState({
    id: '',
    type: '',
  });

  const [count, setCount] = React.useState(0);

  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangeRowsPerPage = (e) => {
    let config = JSON.parse(sessionStorage.getItem('dashboard'));
    config.accounts.pagecount = e.target.value;
    config.accounts.page = 1;
    sessionStorage.setItem('dashboard', JSON.stringify(config));

    setRowsPerPage(e.target.value);
    handlePageChange(null, 1);
  };

  const handlePageChange = async (e, value) => {
    setPage(value);

    try {
      let config = JSON.parse(sessionStorage.getItem('dashboard'));
      config.accounts.page = value;
      sessionStorage.setItem('dashboard', JSON.stringify(config));

      const { page, pagecount, sort, type } = config.accounts;
      const res = await api.get(
        `/account/accounts?page=${page}&pagecount=${pagecount}&sort=${sort}&type=${type}`
      );
      setData(res.data.data);
      setCount(res.data.count);
    } catch (e) {
      console.log(e);
    }
  };

  // const _calcProfitByDate = (data) => {
  //   let { day, week, month } = { day: 0, week: 0, month: 0 };
  //   data.forEach((profit) => {
  //     const gap = new Date().getTime() - new Date(profit.closeTime).getTime();
  //     if (gap < 3600 * 24 * 1000) {
  //       day += profit.profit;
  //     } else if (gap < 3600 * 24 * 1000 * 7) {
  //       week += profit.profit;
  //     } else if (gap < 3600 * 24 * 1000 * 30) {
  //       month += profit.profit;
  //     }
  //   });

  //   return { day: day.toFixed(2), week: week.toFixed(2), month: month.toFixed(2) };
  // };

  const _equityPercentageValue = (value) => {
    if (value >= 100) return <div className="text-[#58c04f] font-medium">{value}</div>;
    else if (value < 100 && value >= 95)
      return <div className="text-[#11B3AE] font-medium">{value}</div>;
    else if (value < 95 && value >= 85) return <div className='text-[#E9D8C8] font-medium'>{value}</div>; else return <div className="text-[#fa5252] font-medium">{value}</div>;
  };

  React.useEffect(() => {
    let session = sessionStorage.getItem('dashboard');
    async function fetchData(config) {
      const { page, pagecount, sort, type } = config;
      const res = await api.get(
        `/account/accounts?page=${page}&pagecount=${pagecount}&sort=${sort}&type=${type}`
      );
      setData(res.data.data);
      setCount(res.data.count);
    }
    async function fetchData1() {
      const res = await api.get(
        `/account/accounts?page=${1}&pagecount=${10}&sort=${''}&type=${''}`
      );
      setData(res.data.data);
      setCount(res.data.count);
    }
    if (session) {
      let config = JSON.parse(session).accounts;
      setPage(config.page);
      setRowsPerPage(config.pagecount);
      setSort({
        id: config.sort,
        type: config.type,
      });

      fetchData(config);
    } else {
      setPage(1);
      setRowsPerPage(10);
      setSort({
        id: '',
        type: '',
      });
      fetchData1();
    }
  }, []);

  return (
    <div className="mt-4 text-[#E9D8C8] bg-[#0B1220] p-6 rounded-xl border border-[#11B3AE] shadow-2xl pb-[20px]">
      <div className="flex justify-between w-full pb-4">
        <div className="flex items-center gap-3">
          <FormControl size="small">
            <Select
              displayEmpty
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              input={
                <OutlinedInput
                  sx={{
                    width: '80px',
                    color: '#E9D8C8',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(17, 179, 174, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(17, 179, 174, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#11B3AE',
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
          <Typography sx={{ color: '#E9D8C8', fontWeight: 500 }}>records per page</Typography>
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
          borderRadius: '12px',
          border: '1px solid rgba(17, 179, 174, 0.2)',
        }}
      >
        <TableContainer
          sx={{
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            '.MuiTable-root': {
              borderColor: 'rgba(17, 179, 174, 0.2)',
              borderWidth: '1px',
            },
          }}
        >
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{
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
            <TableHead>
              <TableRow
                sx={{
                  '&:last-child td, &:last-child th': {
                    border: 1,
                    borderColor: 'rgba(17, 179, 174, 0.2)',
                  },
                }}
              >
                {headers
                  .filter((item) => item.checked && item.id !== 'actions')
                  .map(({ label, id }, i) => (
                    <TableCell
                      key={`dashboard_table_header_${i}`}
                      align="center"
                      sx={{
                        padding: '12px 8px',
                        fontWeight: 600,
                      }}
                    >
                      <div className="flex items-center justify-between p-[6px]">
                        {label === '' ? <p></p> : <p className="font-semibold">{label}</p>}
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
              {data &&
                data.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={`dashboard_table_row_${index}`}
                      sx={{
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'rgba(17, 179, 174, 0.08)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                        },
                      }}
                    >
                      {headers
                        .filter((item) => item.checked && item.id !== 'actions')
                        .map(({ id }) => {
                          let value = row[id];
                          if (id === 'account') {
                            value = `${row.name}(${row.login})`;
                          } else if (id === 'openTrades') {
                            value = `${row.openTradesCount} (${formatNumber(row.openTradesLots)})`;
                          } else if (id === 'totalProfit') {
                            value = formatNumber(value);
                          } else if (id === 'dayProfit') {
                            value = formatNumber(value);
                          } else if (id === 'weekProfit') {
                            value = formatNumber(value);
                          } else if (id === 'monthProfit') {
                            value = formatNumber(value);
                          } else if (id === 'equity') {
                            value = formatNumber(value);
                          } else if (id === 'balance') {
                            value = formatNumber(value);
                          }
                          return (
                            <TableCell
                              key={id}
                              align="left"
                              sx={{
                                padding: '12px 16px',
                                fontSize: '0.875rem',
                              }}
                            >
                              {id === 'connectionStatus' ? (
                                <Icon
                                  icon={
                                    row[id] === 'CONNECTED'
                                      ? 'mdi:check-bold'
                                      : 'mdi:close-bold'
                                  }
                                  width={22}
                                  className="font-bold"
                                  color={
                                    row[id] === 'CONNECTED'
                                      ? '#11B3AE'
                                      : '#fa5252'
                                  }
                                />
                              ) : id === 'equityPercentage' ? (
                                _equityPercentageValue(value)
                              ) : (
                                <div className="truncate font-medium">{value}</div>
                              )}
                            </TableCell>
                          );
                        })}
                      {headers.find(({ id }) => id === 'actions').checked && (
                        <TableCell
                          key={row.id + 'goto'}
                          align="center"
                          sx={{
                            padding: '12px 8px',
                          }}
                        >
                          <Link
                            to={`/analysis/analysis-account/${row.accountId}`}
                          >
                            <IconButton
                              size="small"
                              color="inherit"
                              sx={{
                                backgroundColor: '#11B3AE',
                                borderRadius: '8px',
                                fontSize: 12,
                                padding: '10px 8px',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: '#0F9A95',
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                                },
                              }}
                            >
                              <Icon icon="fa:bar-chart" color="white" />
                            </IconButton>
                          </Link>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="flex justify-between items-center mt-4 p-4 bg-[#0B1220] rounded-lg border border-[#11B3AE] border-opacity-20">
          <Typography sx={{ color: '#E9D8C8', fontSize: 14, fontWeight: 500 }}>
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
          />
        </div>
      </Paper>
    </div>
  );
}
