import * as React from 'react';
import { Link } from 'react-router-dom';
import { formatNumber } from '../../utils/formatNumber';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Pagination from '@mui/material/Pagination';
import { Icon } from '@iconify/react';
import api from '../../utils/api';
import { useParams } from 'react-router-dom';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import { useLoading } from '../../contexts/loadingContext';
import MonthlyStats from '../../components/MonthlyStats';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Cell
} from 'recharts';



function AccountAnalysis() {
  const { id } = useParams();
  const { loading } = useLoading();

  // State for all data
  const [selectedSymbol, setSelectedSymbol] = React.useState('');
  const [availableSymbols, setAvailableSymbols] = React.useState([]);

  // Account data
  const [accountDetails, setAccountDetails] = React.useState({});
  const [accountInfo, setAccountInfo] = React.useState({});

  // Trades data
  const [openTrades, setOpenTrades] = React.useState([]);
  const [tradeHistory, setTradeHistory] = React.useState([]);

  // Dashboard metrics
  const [dashboardMetrics, setDashboardMetrics] = React.useState({
    totalBalance: 0,
    totalEquity: 0,
    totalPnL: 0,
    winRate: 0,
    profitFactor: 0,
    avgWinLoss: 0,
    avgWin: 0,
    avgLoss: 0,
    totalTrades: 0,
    openTradesCount: 0,
    totalLots: 0,
    totalCommission: 0,
    totalSwap: 0
  });

  // Chart data
  const [dailyPnLData, setDailyPnLData] = React.useState([]);
  const [performanceData, setPerformanceData] = React.useState([]);

  // Filter modal state
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [visibleComponents, setVisibleComponents] = React.useState({
    kpiCards: true,
    charts: true,
    monthlyStats: true,
    recentTrades: true,
    accountStats: true,
    closedPositions: true,
    tradeHistory: true
  });

  const toggleComponent = (component) => {
    setVisibleComponents(prev => ({
      ...prev,
      [component]: !prev[component]
    }));
  };

  const selectAllComponents = () => {
    setVisibleComponents({
      kpiCards: true,
      charts: true,
      monthlyStats: true,
      recentTrades: true,
      accountStats: true,
      closedPositions: true,
      tradeHistory: true
    });
  };

  const deselectAllComponents = () => {
    setVisibleComponents({
      kpiCards: false,
      charts: false,
      monthlyStats: false,
      recentTrades: false,
      accountStats: false,
      closedPositions: false,
      tradeHistory: false
    });
  };

  // Recent trades tab state
  const [recentTradesTab, setRecentTradesTab] = React.useState('recent');

  // Pagination states
  const [recentTradesPage, setRecentTradesPage] = React.useState(1);
  const [openTradesPage, setOpenTradesPage] = React.useState(1);
  const [closedPositionsPage, setClosedPositionsPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Click outside handler for dropdowns
  const filterRef = React.useRef(null);
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterModal(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch account data when component mounts
  React.useEffect(() => {
    if (!id) return;

    async function fetchAccountData() {
      try {
        loading(true);

        // Fetch all data in parallel
        const [detailsRes, infoRes, tradesRes, historyRes] = await Promise.all([
          api.get(`/account/accounts/${id}`),
          api.get(`/account/accountInfo/${id}`),
          api.get(`/trade/${id}?page=1&pagecount=100&sort=&type=`),
          api.get(`/trade/history/${id}?page=1&pagecount=100&sort=&type=`)
        ]);

        // Set all data at once
        setAccountDetails(detailsRes.data);
        setAccountInfo(infoRes.data);
        setOpenTrades(tradesRes.data.data || []);
        setTradeHistory(historyRes.data.data || []);

        // Extract unique symbols
        const allTrades = [...(tradesRes.data.data || []), ...(historyRes.data.data || [])];
        const symbols = [...new Set(allTrades.map(trade => trade.symbol).filter(Boolean))];
        setAvailableSymbols(symbols);

        if (symbols.length > 0) {
          setSelectedSymbol('All Symbols');
        }

      } catch (error) {
        console.error('Error fetching account data:', error);
      } finally {
        loading(false);
      }
    }

    fetchAccountData();
  }, [id]);

  // Calculate dashboard metrics
  React.useEffect(() => {
    if (!accountDetails || !accountInfo || !tradeHistory || !openTrades) return;

    const totalBalance = accountDetails.balance || 0;
    const totalEquity = accountDetails.equity || 0;
    const totalPnL = accountDetails.profit || 0;
    
    const totalTrades = accountInfo.totalTrades || 0;
    const winCount = accountInfo.winCount || 0;
    const loseCount = accountInfo.loseCount || 0;
    const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
    
    const openTradesCount = openTrades.length;
    const totalLots = accountInfo.lots || 0;
    const totalCommission = accountInfo.commission || 0;
    const totalSwap = accountInfo.swap || 0;
    
    // Calculate profit factor and averages
    const winningTrades = tradeHistory.filter(trade => parseFloat(trade.profit || 0) > 0);
    const losingTrades = tradeHistory.filter(trade => parseFloat(trade.profit || 0) < 0);
    
    const totalProfit = winningTrades.reduce((sum, trade) => sum + parseFloat(trade.profit || 0), 0);
    const totalLoss = losingTrades.reduce((sum, trade) => sum + Math.abs(parseFloat(trade.profit || 0)), 0);
    
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0;
    const avgWin = winningTrades.length > 0 ? totalProfit / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0;
    const avgWinLoss = avgLoss > 0 ? avgWin / avgLoss : 0;
    
    setDashboardMetrics({
      totalBalance,
      totalEquity,
      totalPnL,
      winRate,
      profitFactor,
      avgWinLoss,
      avgWin,
      avgLoss,
      totalTrades,
      openTradesCount,
      totalLots,
      totalCommission,
      totalSwap
    });

    // Generate chart data
    generateChartData();
    
  }, [accountDetails, accountInfo, tradeHistory, openTrades]);

  // Update performance data when dashboard metrics change
  React.useEffect(() => {
    const performanceData = [
      { metric: 'Win %', value: dashboardMetrics.winRate },
      { metric: 'Profit Factor', value: Math.min(dashboardMetrics.profitFactor * 100, 100) },
      { metric: 'Avg Win/Loss', value: Math.min(dashboardMetrics.avgWinLoss * 100, 100) },
      { metric: 'Recovery Factor', value: 0 },
      { metric: 'Max Drawdown', value: 0 },
      { metric: 'Consistency', value: 0 }
    ];
    setPerformanceData(performanceData);
  }, [dashboardMetrics]);

  const generateChartData = () => {
    // Generate daily P&L data from trade history
    const dailyData = {};
    tradeHistory.forEach(trade => {
      const date = trade.start_time ? trade.start_time.substring(0, 10) : new Date().toISOString().substring(0, 10);
      const profit = parseFloat(trade.profit || 0);

      if (!dailyData[date]) {
        dailyData[date] = 0;
      }
      dailyData[date] += profit;
    });

    const sortedDates = Object.keys(dailyData).sort();
    let cumulative = 0;
    const cumulativeData = sortedDates.map(date => {
      cumulative += dailyData[date];
      return {
        date: date.substring(5), // Remove year for display
        pnl: dailyData[date],
        cumulative: cumulative
      };
    });

    setDailyPnLData(cumulativeData);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0 && payload[0] && payload[0].value !== undefined) {
      return (
        <div className="bg-[#0B1220] border border-[#11B3AE] p-3 rounded-lg shadow-lg">
          <p className="text-[#E9D8C8] font-medium">{`${label}`}</p>
          <p className="text-[#11B3AE]">{`P&L: $${formatNumber(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomRadarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0 && payload[0] && payload[0].value !== undefined) {
      return (
        <div className="bg-[#0B1220] border border-[#11B3AE] p-3 rounded-lg shadow-lg">
          <p className="text-[#E9D8C8] font-medium">{`${label}`}</p>
          <p className="text-[#11B3AE]">{`Score: ${payload[0].value.toFixed(1)}`}</p>
        </div>
      );
    }
    return null;
  };

  // Filter trades by symbol
  const filteredOpenTrades = selectedSymbol === 'All Symbols' ? openTrades : openTrades.filter(trade => trade.symbol === selectedSymbol);
  const filteredHistory = selectedSymbol === 'All Symbols' ? tradeHistory : tradeHistory.filter(trade => trade.symbol === selectedSymbol);

  // Get paginated data
  const getPaginatedData = (data, page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  // Get recent trades for display (only 5 most recent)
  const recentTrades = filteredHistory.slice(0, 5).map(trade => ({
    closeDate: trade.start_time ? trade.start_time.substring(0, 10) : 'N/A',
    symbol: trade.symbol || 'N/A',
    netPnL: parseFloat(trade.profit || 0),
    profit: parseFloat(trade.profit || 0) >= 0
  }));

  const openTradesData = getPaginatedData(filteredOpenTrades, openTradesPage, rowsPerPage);
  const closedPositionsData = getPaginatedData(filteredHistory, closedPositionsPage, rowsPerPage);
    
  return (
    <div className="w-full text-[#E9D8C8] pb-[100px] space-y-2 sm:space-y-2 lg:px-2">
      {/* Header Section */}
      <div className="bg-[#0B1220] border border-[#11B3AE] rounded-xl p-3 sm:p-4 lg:p-6 shadow-[0_0_16px_rgba(17,179,174,0.3)]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 sm:gap-3">
          <div className="w-full lg:w-auto">
            <Link
              to={'/dashboard'}
              className="flex flex-row items-center font-extrabold hover:opacity-80 transition-opacity mb-2"
            >
              <ReplyRoundedIcon
                fontSize="medium"
                sx={{ color: '#11B3AE', fontWeight: 'bold' }}
              />
              <Typography sx={{ color: '#E9D8C8', fontSize: '1rem', fontWeight: 700, ml: 1 }}>
                Back to Dashboard
              </Typography>
            </Link>
            <h1 className="text-md sm:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-2">Account Analysis</h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Detailed analysis for Account ID: {id}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {/* Symbol Filter */}
            {availableSymbols.length > 0 && (
              <FormControl size="small" sx={{
                minWidth: { xs: '100%', sm: 150 },
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  displayEmpty
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
                  <MenuItem value="All Symbols">All Symbols</MenuItem>
                  {availableSymbols.map(symbol => (
                    <MenuItem key={symbol} value={symbol}>{symbol}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Filters */}
            <div className="relative w-full sm:w-auto" ref={filterRef}>
              <button
                onClick={() => setShowFilterModal(!showFilterModal)}
                className="flex items-center justify-center sm:justify-start gap-2 bg-[#0B1220] border border-[#11B3AE] rounded-lg px-3 py-2 cursor-pointer hover:bg-[#11B3AE] hover:bg-opacity-10 transition-colors w-full sm:w-auto"
              >
                <Icon icon="mdi:filter" className="text-[#11B3AE]" />
                <span className="text-sm text-[#E9D8C8]">Filters</span>
              </button>

              {showFilterModal && (
                <div className="absolute z-50 top-full mt-2 p-4 w-[280px] text-white bg-[#0B1220] border border-[#11B3AE] rounded-lg shadow-xl right-0  max-w-[calc(100vw-2rem)] overflow-x-auto">
                  <div className="text-[#E9D8C8] font-medium mb-3 text-sm">Toggle visible components</div>

                  {/* Select All / Deselect All buttons */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={selectAllComponents}
                      className="px-3 py-1 bg-[#11B3AE] text-white rounded text-xs hover:bg-[#0F9A95] transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAllComponents}
                      className="px-3 py-1 bg-transparent text-[#E9D8C8] border border-[#11B3AE] rounded text-xs hover:bg-[#11B3AE] hover:bg-opacity-10 transition-colors"
                    >
                      Deselect All
                    </button>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(visibleComponents).map(([component, isVisible]) => (
                      <div
                        key={component}
                        className="flex items-center gap-2 cursor-pointer hover:bg-[#11B3AE] hover:bg-opacity-10 p-2 rounded transition-colors"
                        onClick={() => toggleComponent(component)}
                      >
                        <input
                          type="checkbox"
                          checked={isVisible}
                          onChange={() => toggleComponent(component)}
                          className="accent-[#11B3AE]"
                        />
                        <span className="text-sm text-[#E9D8C8] capitalize">
                          {component === 'monthlyStats' ? 'Monthly Stats' : component.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      {visibleComponents.kpiCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Account Balance & P&L */}
          <div className="bg-[#0B1220] border border-[#11B3AE] rounded-xl p-4 shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 mb-1">Account Balance</p>
                <p className="text-xl font-bold text-white">${formatNumber(dashboardMetrics.totalBalance)}</p>
                <p className={`text-sm ${dashboardMetrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  P&L: {dashboardMetrics.totalPnL >= 0 ? '+' : ''}${formatNumber(dashboardMetrics.totalPnL)}
                </p>
              </div>
              <Icon icon="mdi:information" className="text-[#11B3AE] cursor-pointer" />
            </div>
          </div>

          {/* Trade Win % */}
          <div className="flex items-center bg-[#0B1220] border border-[#11B3AE] rounded-xl p-4 shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <div className="flex flex-row w-full justify-between items-center text-center">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(17, 179, 174, 0.2)"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#11B3AE"
                    strokeWidth="2"
                    strokeDasharray={`${dashboardMetrics.winRate}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-md font-bold text-white">{dashboardMetrics.winRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center">
                <p className="text-sm text-gray-400">Trade Win %</p>
                <div className="mt-2 text-xs">
                  <span className="text-green-400">{accountInfo.winCount || 0} wins</span>
                  <span className="text-red-400 ml-2">{accountInfo.loseCount || 0} losses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profit Factor */}
          <div className="flex items-center bg-[#0B1220] border border-[#11B3AE] rounded-xl p-4 shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <div className="flex flex-row w-full justify-between items-center text-center">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(17, 179, 174, 0.2)"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#11B3AE"
                    strokeWidth="2"
                    strokeDasharray={`${Math.min(dashboardMetrics.profitFactor * 100, 100)}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-md font-bold text-white">{dashboardMetrics.profitFactor.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center">
                <p className="text-sm text-gray-400">Profit Factor</p>
                <div className="mt-2 text-xs">
                  <span className={`${dashboardMetrics.profitFactor >= 1 ? 'text-green-400' : dashboardMetrics.profitFactor === 0 ? 'text-gray-400' : 'text-red-400'}`}>{dashboardMetrics.profitFactor.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Avg Win/Loss Trade */}
          <div className="flex items-center bg-[#0B1220] border border-[#11B3AE] rounded-xl p-4 shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <div className="flex flex-row w-full justify-between items-center text-center">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(17, 179, 174, 0.2)"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#11B3AE"
                    strokeWidth="2"
                    strokeDasharray={`${Math.min(dashboardMetrics.avgWinLoss * 100, 100)}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-md font-bold text-white">{dashboardMetrics.avgWinLoss.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center">
                <p className="text-sm text-gray-400">Avg Win/Loss Trade</p>
                <div className="mt-2 text-xs">
                  <span className="text-green-400">${Number(dashboardMetrics.avgWin).toFixed(2)} avg win</span>
                  <span className="text-red-400 block">-${Number(dashboardMetrics.avgLoss).toFixed(2)} avg loss</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      {visibleComponents.charts && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Performance Score */}
          <div className="bg-[#0B1220] border border-[#11B3AE] rounded-xl p-4 shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <h3 className="text-md font-semibold text-white mb-4">Performance Score</h3>
            <div className="h-48">
              {performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={performanceData}>
                    <PolarGrid stroke="rgba(17, 179, 174, 0.3)" />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fill: '#E9D8C8', fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                      tick={{ fill: '#E9D8C8', fontSize: 10 }}
                      stroke="rgba(17, 179, 174, 0.3)"
                    />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#11B3AE"
                      fill="rgba(17, 179, 174, 0.3)"
                      fillOpacity={0.6}
                    />
                    <Tooltip content={<CustomRadarTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[#E9D8C8] text-center">No performance data available</p>
                </div>
              )}
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">Your Performance Score</p>
              <p className="text-2xl font-bold text-white">{dashboardMetrics.winRate.toFixed(1)}</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                  style={{ width: `${dashboardMetrics.winRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Daily Net Cumulative P&L */}
          <div className="bg-[#0B1220] border border-[#11B3AE] rounded-xl p-4 shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <h3 className="text-md font-semibold text-white mb-4">Daily Net Cumulative P&L</h3>
            <div className="h-64">
              {dailyPnLData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyPnLData}>
                    <CartesianGrid stroke="rgba(17, 179, 174, 0.1)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#E9D8C8', fontSize: 10 }}
                      stroke="rgba(17, 179, 174, 0.3)"
                    />
                    <YAxis
                      tick={{ fill: '#E9D8C8', fontSize: 10 }}
                      stroke="rgba(17, 179, 174, 0.3)"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#11B3AE"
                      fill="rgba(17, 179, 174, 0.3)"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[#E9D8C8] text-center">No trade data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Net Daily P&L */}
          <div className="bg-[#0B1220] border border-[#11B3AE] rounded-xl p-4 shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <h3 className="text-md font-semibold text-white mb-4">Net Daily P&L</h3>
            <div className="h-64">
              {dailyPnLData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyPnLData}>
                    <CartesianGrid stroke="rgba(17, 179, 174, 0.1)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#E9D8C8', fontSize: 10 }}
                      stroke="rgba(17, 179, 174, 0.3)"
                    />
                    <YAxis
                      tick={{ fill: '#E9D8C8', fontSize: 10 }}
                      stroke="rgba(17, 179, 174, 0.3)"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="pnl"
                      fill="#11B3AE"
                      stroke="#11B3AE"
                    >
                      {dailyPnLData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.pnl >= 0 ? '#059669' : '#DC2626'}
                          stroke={entry.pnl >= 0 ? '#059669' : '#DC2626'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[#E9D8C8] text-center">No trade data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Stats */}
      {visibleComponents.monthlyStats && (
        <div className="w-full">
          <MonthlyStats
            tradeHistory={tradeHistory}
            selectedAccount={id}
          />
        </div>
      )}

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Trades / Open Positions */}
        {visibleComponents.recentTrades && (
          <div className="bg-[#0B1220] border border-[#11B3AE] rounded-xl p-3 sm:p-4 shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
              <h3 className="text-base sm:text-md font-semibold text-white">Recent Trades</h3>
              <div className="flex gap-1 sm:gap-2">
                <button
                  className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors ${recentTradesTab === 'recent' ? 'bg-[#11B3AE] text-white' : 'bg-transparent text-[#E9D8C8] border border-[#11B3AE]'}`}
                  onClick={() => setRecentTradesTab('recent')}
                >
                  Recent trades
                </button>
                <button
                  className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors ${recentTradesTab === 'open' ? 'bg-[#11B3AE] text-white' : 'bg-transparent text-[#E9D8C8] border border-[#11B3AE]'}`}
                  onClick={() => setRecentTradesTab('open')}
                >
                  Open positions
                </button>
              </div>
            </div>

            {recentTradesTab === 'recent' ? (
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
                        <TableCell
                          align="center"
                          sx={{
                            padding: '12px 8px',
                            fontWeight: 600,
                          }}
                        >
                          <div className="flex items-center justify-between p-[6px]">
                            <p className="font-semibold">Close Date</p>
                            <Icon icon="mdi:calendar" className="text-[#11B3AE]" />
                          </div>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            padding: '12px 8px',
                            fontWeight: 600,
                          }}
                        >
                          <div className="flex items-center justify-between p-[6px]">
                            <p className="font-semibold">Symbol</p>
                            <Icon icon="mdi:currency-usd" className="text-[#11B3AE]" />
                          </div>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            padding: '12px 8px',
                            fontWeight: 600,
                          }}
                        >
                          <div className="flex items-center justify-between p-[6px]">
                            <p className="font-semibold">Net P&L</p>
                            <Icon icon="mdi:trending-up" className="text-[#11B3AE]" />
                          </div>
                        </TableCell>
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
                      {recentTrades.map((trade, index) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={`recent_trades_row_${index}`}
                          sx={{
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'rgba(17, 179, 174, 0.08)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                            },
                          }}
                        >
                          <TableCell
                            align="left"
                            sx={{
                              padding: '12px 16px',
                              fontSize: '0.875rem',
                            }}
                          >
                            <div className="truncate font-medium">{trade.closeDate}</div>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              padding: '12px 16px',
                              fontSize: '0.875rem',
                            }}
                          >
                            <div className="truncate font-medium">{trade.symbol}</div>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              padding: '12px 16px',
                              fontSize: '0.875rem',
                            }}
                          >
                            <div className={`truncate font-medium ${trade.profit ? 'text-green-400' : 'text-red-400'}`}>
                              ${formatNumber(trade.netPnL)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {recentTrades.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-[#E9D8C8] py-8">
                            No recent trades found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ) : (
              <Paper
                sx={{
                  width: '100%',
                  overflow: 'hidden',
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
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
                        <TableCell
                          align="center"
                          sx={{
                            padding: '12px 8px',
                            fontWeight: 600,
                          }}
                        >
                          <div className="flex items-center justify-between p-[6px]">
                            <p className="font-semibold">Ticket</p>
                            <Icon icon="mdi:ticket" className="text-[#11B3AE]" />
                          </div>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            padding: '12px 8px',
                            fontWeight: 600,
                          }}
                        >
                          <div className="flex items-center justify-between p-[6px]">
                            <p className="font-semibold">Symbol</p>
                            <Icon icon="mdi:currency-usd" className="text-[#11B3AE]" />
                          </div>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            padding: '12px 8px',
                            fontWeight: 600,
                          }}
                        >
                          <div className="flex items-center justify-between p-[6px]">
                            <p className="font-semibold">Type</p>
                            <Icon icon="mdi:swap-horizontal" className="text-[#11B3AE]" />
                          </div>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            padding: '12px 8px',
                            fontWeight: 600,
                          }}
                        >
                          <div className="flex items-center justify-between p-[6px]">
                            <p className="font-semibold">Lots</p>
                            <Icon icon="mdi:scale-balance" className="text-[#11B3AE]" />
                          </div>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            padding: '12px 8px',
                            fontWeight: 600,
                          }}
                        >
                          <div className="flex items-center justify-between p-[6px]">
                            <p className="font-semibold">Profit</p>
                            <Icon icon="mdi:trending-up" className="text-[#11B3AE]" />
                          </div>
                        </TableCell>
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
                      {openTradesData.map((trade, index) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={`open_trades_row_${index}`}
                          sx={{
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'rgba(17, 179, 174, 0.08)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                            },
                          }}
                        >
                          <TableCell
                            align="left"
                            sx={{
                              padding: '12px 16px',
                              fontSize: '0.875rem',
                            }}
                          >
                            <div className="truncate font-medium">{trade.positionTicket}</div>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              padding: '12px 16px',
                              fontSize: '0.875rem',
                            }}
                          >
                            <div className="truncate font-medium">{trade.symbol}</div>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              padding: '12px 16px',
                              fontSize: '0.875rem',
                            }}
                          >
                            <div className={`truncate font-medium ${trade.type === 'DealBuy' ? 'text-green-400' : 'text-red-400'}`}>
                              {trade.type === 'DealBuy' ? 'Buy' : 'Sell'}
                            </div>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              padding: '12px 16px',
                              fontSize: '0.875rem',
                            }}
                          >
                            <div className="truncate font-medium">{formatNumber(trade.lots)}</div>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              padding: '12px 16px',
                              fontSize: '0.875rem',
                            }}
                          >
                            <div className={`truncate font-medium ${parseFloat(trade.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              ${formatNumber(trade.profit)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {openTradesData.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-[#E9D8C8] py-8">
                            No open positions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination for Open Positions */}
                {filteredOpenTrades.length > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-2 bg-[#0B1220] rounded-lg border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)] gap-4">
                    <Typography sx={{
                      color: '#E9D8C8',
                      fontSize: { xs: 12, sm: 14 },
                      fontWeight: 500,
                      textAlign: { xs: 'center', sm: 'left' },
                      display: { xs: 'none', sm: 'block' }
                    }}>
                      Showing {rowsPerPage * (openTradesPage - 1) + 1} to{' '}
                      {rowsPerPage * openTradesPage > filteredOpenTrades.length ? filteredOpenTrades.length : rowsPerPage * openTradesPage} of {filteredOpenTrades.length}{' '}
                      entries
                    </Typography>
                    <Pagination
                      sx={{
                        paddingY: 2,
                        '& .MuiPaginationItem-root': {
                          color: '#E9D8C8',
                          borderColor: 'rgba(17, 179, 174, 0.3)',
                          fontSize: { xs: '0.5rem', sm: '0.75rem' },
                          minWidth: { xs: '28px', sm: '32px' },
                          height: { xs: '28px', sm: '32px' },
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
                        filteredOpenTrades.length % rowsPerPage === 0
                          ? filteredOpenTrades.length / rowsPerPage
                          : Math.floor(filteredOpenTrades.length / rowsPerPage) + 1
                      }
                      page={openTradesPage}
                      onChange={(e, value) => setOpenTradesPage(value)}
                      variant="outlined"
                      shape="rounded"
                      showFirstButton
                      showLastButton
                      size="small"
                    />
                  </div>
                )}
              </Paper>
            )}
          </div>
        )}

        {/* Closed Positions Table */}
        {visibleComponents.closedPositions && (
          <div className="bg-[#0B1220] border border-[#11B3AE] rounded-xl p-3 sm:p-4 shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <h3 className="text-base sm:text-md font-semibold text-white mb-3 sm:mb-4">Closed Positions</h3>
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
                      <TableCell
                        align="center"
                        sx={{
                          padding: '12px 8px',
                          fontWeight: 600,
                        }}
                      >
                        <div className="flex items-center justify-between p-[6px]">
                          <p className="font-semibold">Ticket</p>
                          <Icon icon="mdi:ticket" className="text-[#11B3AE]" />
                        </div>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: '12px 8px',
                          fontWeight: 600,
                        }}
                      >
                        <div className="flex items-center justify-between p-[6px]">
                          <p className="font-semibold">Symbol</p>
                          <Icon icon="mdi:currency-usd" className="text-[#11B3AE]" />
                        </div>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: '12px 8px',
                          fontWeight: 600,
                        }}
                      >
                        <div className="flex items-center justify-between p-[6px]">
                          <p className="font-semibold">Type</p>
                          <Icon icon="mdi:swap-horizontal" className="text-[#11B3AE]" />
                        </div>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: '12px 8px',
                          fontWeight: 600,
                        }}
                      >
                        <div className="flex items-center justify-between p-[6px]">
                          <p className="font-semibold">Lots</p>
                          <Icon icon="mdi:scale-balance" className="text-[#11B3AE]" />
                        </div>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: '12px 8px',
                          fontWeight: 600,
                        }}
                      >
                        <div className="flex items-center justify-between p-[6px]">
                          <p className="font-semibold">Profit</p>
                          <Icon icon="mdi:trending-up" className="text-[#11B3AE]" />
                        </div>
                      </TableCell>
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
                    {closedPositionsData.map((trade, index) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={`closed_positions_row_${index}`}
                        sx={{
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: 'rgba(17, 179, 174, 0.08)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(17, 179, 174, 0.1)',
                          },
                        }}
                      >
                        <TableCell
                          align="left"
                          sx={{
                            padding: '12px 16px',
                            fontSize: '0.875rem',
                          }}
                        >
                          <div className="truncate font-medium">{trade.positionTicket}</div>
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            padding: '12px 16px',
                            fontSize: '0.875rem',
                          }}
                        >
                          <div className="truncate font-medium">{trade.symbol}</div>
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            padding: '12px 16px',
                            fontSize: '0.875rem',
                          }}
                        >
                          <div className={`truncate font-medium ${trade.type === 'DealBuy' ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.type === 'DealBuy' ? 'Buy' : 'Sell'}
                          </div>
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            padding: '12px 16px',
                            fontSize: '0.875rem',
                          }}
                        >
                          <div className="truncate font-medium">{formatNumber(trade.lots)}</div>
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            padding: '12px 16px',
                            fontSize: '0.875rem',
                          }}
                        >
                          <div className={`truncate font-medium ${parseFloat(trade.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${formatNumber(trade.profit)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {closedPositionsData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-[#E9D8C8] py-8">
                          No closed positions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination for Closed Positions */}
              {filteredHistory.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-2 bg-[#0B1220] rounded-lg border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)] gap-4">
                  <Typography sx={{
                    color: '#E9D8C8',
                    fontSize: { xs: 12, sm: 14 },
                    fontWeight: 500,
                    textAlign: { xs: 'center', sm: 'left' },
                    display: { xs: 'none', sm: 'block' }
                  }}>
                    Showing {rowsPerPage * (closedPositionsPage - 1) + 1} to{' '}
                    {rowsPerPage * closedPositionsPage > filteredHistory.length ? filteredHistory.length : rowsPerPage * closedPositionsPage} of {filteredHistory.length}{' '}
                    entries
                  </Typography>
                  <Pagination
                    sx={{
                      paddingY: 2,
                      '& .MuiPaginationItem-root': {
                        color: '#E9D8C8',
                        borderColor: 'rgba(17, 179, 174, 0.3)',
                        fontSize: { xs: '0.5rem', sm: '0.75rem' },
                        minWidth: { xs: '28px', sm: '32px' },
                        height: { xs: '28px', sm: '32px' },
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
                      filteredHistory.length % rowsPerPage === 0
                        ? filteredHistory.length / rowsPerPage
                        : Math.floor(filteredHistory.length / rowsPerPage) + 1
                    }
                    page={closedPositionsPage}
                    onChange={(e, value) => setClosedPositionsPage(value)}
                    variant="outlined"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    size="small"
                  />
                </div>
              )}
            </Paper>
          </div>
        )}
      </div>

      {/* Additional Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Account Statistics */}
        {visibleComponents.accountStats && (
          <div className="bg-[#0B1220] border border-[#11B3AE] rounded-xl p-3 sm:p-4 shadow-[0_0_16px_rgba(17,179,174,0.3)] h-full flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
              <h3 className="text-base sm:text-md font-semibold text-white">Account Statistics</h3>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:chart-bar" className="text-[#11B3AE]" />
                <span className="text-xs sm:text-sm text-[#E9D8C8]">Overview</span>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-[#0B1220] border border-[#11B3AE] rounded-lg p-2 sm:p-3">
                  <div className="text-xs sm:text-sm text-gray-400">Total Equity</div>
                  <div className="text-sm sm:text-md font-bold text-white">${formatNumber(dashboardMetrics.totalEquity)}</div>
                </div>
                <div className="bg-[#0B1220] border border-[#11B3AE] rounded-lg p-2 sm:p-3">
                  <div className="text-xs sm:text-sm text-gray-400">Open Trades</div>
                  <div className="text-sm sm:text-md font-bold text-white">{dashboardMetrics.openTradesCount}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-[#0B1220] border border-[#11B3AE] rounded-lg p-2 sm:p-3">
                  <div className="text-xs sm:text-sm text-gray-400">Total Lots</div>
                  <div className="text-sm sm:text-md font-bold text-white">{formatNumber(dashboardMetrics.totalLots)}</div>
                </div>
                <div className="bg-[#0B1220] border border-[#11B3AE] rounded-lg p-2 sm:p-3">
                  <div className="text-xs sm:text-sm text-gray-400">Commission</div>
                  <div className="text-sm sm:text-md font-bold text-white">${formatNumber(dashboardMetrics.totalCommission)}</div>
                </div>
              </div>

              <div className="bg-[#0B1220] border border-[#11B3AE] rounded-lg p-2 sm:p-3">
                <div className="text-xs sm:text-sm text-gray-400">Swap</div>
                <div className="text-sm sm:text-md font-bold text-white">${formatNumber(dashboardMetrics.totalSwap)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Trade History Summary */}
        {visibleComponents.tradeHistory && (
          <div className="bg-[#0B1220] border border-[#11B3AE] rounded-xl p-3 sm:p-4 shadow-[0_0_16px_rgba(17,179,174,0.3)] h-full flex flex-col">
            <h3 className="text-base sm:text-md font-semibold text-white mb-3 sm:mb-4">Trade History Summary</h3>
            <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-[#0B1220] border border-[#11B3AE] rounded-lg p-2 sm:p-3">
                  <div className="text-xs sm:text-sm text-gray-400">Total Trades</div>
                  <div className="text-sm sm:text-md font-bold text-white">{dashboardMetrics.totalTrades}</div>
                </div>
                <div className="bg-[#0B1220] border border-[#11B3AE] rounded-lg p-2 sm:p-3">
                  <div className="text-xs sm:text-sm text-gray-400">Win Rate</div>
                  <div className="text-sm sm:text-md font-bold text-white">{dashboardMetrics.winRate.toFixed(1)}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-[#0B1220] border border-[#11B3AE] rounded-lg p-2 sm:p-3">
                  <div className="text-xs sm:text-sm text-gray-400">Winning Trades</div>
                  <div className="text-sm sm:text-md font-bold text-green-400">{accountInfo.winCount || 0}</div>
                </div>
                <div className="bg-[#0B1220] border border-[#11B3AE] rounded-lg p-2 sm:p-3">
                  <div className="text-xs sm:text-sm text-gray-400">Losing Trades</div>
                  <div className="text-sm sm:text-md font-bold text-red-400">{accountInfo.loseCount || 0}</div>
                </div>
              </div>

              <div className="bg-[#0B1220] border border-[#11B3AE] rounded-lg p-2 sm:p-3">
                <div className="text-xs sm:text-sm text-gray-400">Total Profit/Loss</div>
                <div className={`text-sm sm:text-md font-bold ${dashboardMetrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {dashboardMetrics.totalPnL >= 0 ? '+' : ''}${formatNumber(dashboardMetrics.totalPnL)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountAnalysis;
