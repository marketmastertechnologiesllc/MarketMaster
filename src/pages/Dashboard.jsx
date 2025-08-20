import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import DashboardTable from '../components/Tables/DashboardTable';
import DashboardTradesTable from '../components/Tables/DashboardTradesTable';
import DashboardHistoryTable from '../components/Tables/DashboardHistoryTable';
import InfoModal from '../components/modals/InfoModal';
import DashboardAnalysis from '../components/DashboardAnalysis';
import api from '../utils/api';

const initialHeaders = {
  1: [
    {
      id: 'connectionStatus',
      label: 'Connection',
      minWidth: 15,
      checked: true,
    },
    { id: 'account', label: 'Account', minWidth: 138, checked: true },
    {
      id: 'platform',
      label: 'Platform',
      checked: true,
    },
    {
      id: 'role',
      label: 'Role',
      checked: true,
    },
    {
      id: 'balance',
      label: 'Balance',
      checked: true,
    },
    {
      id: 'equity',
      label: 'Equity',
      checked: true,
    },
    {
      id: 'equityPercentage',
      label: 'Equity %',
      checked: true,
    },
    {
      id: 'openTrades',
      label: 'Open Trades (Lots)',
      checked: true,
    },
    {
      id: 'dayProfit',
      label: 'Day',
      checked: true,
    },
    {
      id: 'weekProfit',
      label: 'Week',
      checked: true,
    },
    {
      id: 'monthProfit',
      label: 'Month',
      checked: true,
    },
    {
      id: 'totalProfit',
      label: 'Total',
      checked: true,
    },
    {
      id: 'actions',
      label: 'Actions',
      checked: true,
    },
  ],
  2: [
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
  ],
  3: [
    // { id: 'positionId', label: 'ID' },
    { id: 'positionTicket', label: 'Ticket' },
    { id: 'start_time', label: 'OpenTime' },
    { id: 'symbol', label: 'Symbol' },
    { id: 'type', label: 'Type' },
    { id: 'lots', label: 'Lots' },
    { id: 'price', label: 'OpenPrice' },
    { id: 'stopLoss', label: 'SL' },
    { id: 'takeProfit', label: 'TP' },
    { id: 'openTimeAsDateTime', label: 'CloseTime' },
    { id: 'openPrice', label: 'ClosePrice' },
    { id: 'duration', label: 'Duration' },
    { id: 'commission', label: 'Com' },
    { id: 'swap', label: 'Swap' },
    { id: 'profit', label: 'Profit' },
    { id: 'comment', label: 'comment' },
  ],
};

const StyledInfoButton = styled(IconButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#11B3AE',
    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#0B1220',
    boxShadow: '0 4px 12px rgba(11, 18, 32, 0.3)',
    transform: 'translateY(-1px)',
  },
  '&:active, &:focus, &.selected': {
    backgroundColor: '#11B3AE',
    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.4)',
  },
}));

function Dashboard() {

  const [headers, setHeaders] = React.useState(initialHeaders);
  const [activeTab, setActiveTab] = React.useState('1');
  // const [exclamationModalShow, setExclamationModalShow] = React.useState(false);
  const dispatch = useDispatch();
  const { ids } = useSelector((state) => state.utils);

  const _intervalRef3 = React.useRef(null);
  const _intervalRef300 = React.useRef(null);

  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [showFilterItems, setShowFilterItems] = React.useState(true);
  const filterModalRef = React.useRef(null);

  React.useEffect(() => {
    let config = sessionStorage.getItem('dashboard');
    if (!config) {
      config = {
        tab: 1,
        accounts: {
          page: 1,
          pagecount: 10,
          sort: '',
          type: '',
        },
        trades: {
          page: 1,
          pagecount: 10,
          sort: '',
          type: '',
        },
        history: {
          page: 1,
          pagecount: 10,
          sort: '',
          type: '',
        },
      };
      sessionStorage.setItem('dashboard', JSON.stringify(config));
    } else {
      config = JSON.parse(config);
      setActiveTab(config.tab);
    }
  }, []);

  /**
   * when visible items is changed...
   * @param {*} e
   */
  const handleVisibleChange = (e) => {
    const { name, checked } = e.target;
    const index = activeTab;
    setHeaders((prev) => ({
      ...prev,
      [index]: prev[index].map((item) =>
        item.id === name ? { ...item, checked } : item
      ),
    }));
  };

  /**
   * Handle click on entire row (checkbox + title)
   */
  const handleRowClick = (itemId, currentChecked) => {
    const index = activeTab;
    setHeaders((prev) => ({
      ...prev,
      [index]: prev[index].map((item) =>
        item.id === itemId ? { ...item, checked: !currentChecked } : item
      ),
    }));
  };

  /**
   * when click view all button
   */
  const handleViewAll = (e) => {
    const index = activeTab;
    const allChecked = headers[activeTab].every(item => item.checked);
    setHeaders((prev) => ({
      ...prev,
      [index]: prev[index].map((item) => ({
        ...item,
        checked: !allChecked,
      })),
    }));
  };

  const resetColumns = () => {
    const index = activeTab;
    setHeaders((prev) => ({
      ...prev,
      [index]: prev[index].map((item) => ({ ...item, checked: true })),
    }));
  };

  const handleTabClick = (id) => {
    setActiveTab(id);
    let config = JSON.parse(sessionStorage.getItem('dashboard'));
    config.tab = id;
    sessionStorage.setItem('dashboard', JSON.stringify(config));
  };

  // Handle click outside to close filter modal
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterModalRef.current && !filterModalRef.current.contains(event.target)) {
        setShowFilterModal(false);
      }
    };

    if (showFilterModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterModal]);

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={{ xs: 2, sm: 1 }}
          display={'flex'}
          justifyContent={'space-between'}
          sx={{ gap: { xs: 2, sm: 1 } }}
        >
          <div className="flex gap-2 justify-center sm:justify-start">
            <StyledButton
              variant="contained"
              size="small"
              sx={{
                backgroundColor: activeTab == '1' ? '#11B3AE' : 'rgba(255, 255, 255, 0.1)',
                textTransform: 'none',
                color: activeTab == '1' ? '#FFFFFF' : '#E9D8C8',
                fontWeight: 500,
                padding: { xs: '4px 8px', sm: '8px 12px' },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                border: activeTab == '1' ? '1px solid #11B3AE' : '1px solid rgba(17, 179, 174, 0.3)',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: activeTab == '1' ? '#0F9A95' : 'rgba(17, 179, 174, 0.1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                },
              }}
              onClick={() => handleTabClick('1')}
            >
              Accounts
            </StyledButton>
            <StyledButton
              variant="contained"
              size="small"
              sx={{
                backgroundColor: activeTab == '2' ? '#11B3AE' : 'rgba(255, 255, 255, 0.1)',
                textTransform: 'none',
                color: activeTab == '2' ? '#FFFFFF' : '#E9D8C8',
                fontWeight: 500,
                padding: { xs: '4px 8px', sm: '8px 12px' },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                border: activeTab == '2' ? '1px solid #11B3AE' : '1px solid rgba(17, 179, 174, 0.3)',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: activeTab == '2' ? '#0F9A95' : 'rgba(17, 179, 174, 0.1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                },
              }}
              onClick={() => handleTabClick('2')}
            >
              Trades
            </StyledButton>
            <StyledButton
              variant="contained"
              size="small"
              sx={{
                backgroundColor: activeTab == '3' ? '#11B3AE' : 'rgba(255, 255, 255, 0.1)',
                textTransform: 'none',
                color: activeTab == '3' ? '#FFFFFF' : '#E9D8C8',
                fontWeight: 500,
                padding: { xs: '4px 8px', sm: '8px 12px' },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                border: activeTab == '3' ? '1px solid #11B3AE' : '1px solid rgba(17, 179, 174, 0.3)',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: activeTab == '3' ? '#0F9A95' : 'rgba(17, 179, 174, 0.1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                },
              }}
              onClick={() => handleTabClick('3')}
            >
              Analysis
            </StyledButton>
            <StyledButton
              variant="contained"
              size="small"
              sx={{
                backgroundColor: activeTab == '4' ? '#11B3AE' : 'rgba(255, 255, 255, 0.1)',
                textTransform: 'none',
                color: activeTab == '4' ? '#FFFFFF' : '#E9D8C8',
                fontWeight: 500,
                padding: { xs: '4px 8px', sm: '8px 12px' },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                border: activeTab == '4' ? '1px solid #11B3AE' : '1px solid rgba(17, 179, 174, 0.3)',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: activeTab == '4' ? '#0F9A95' : 'rgba(17, 179, 174, 0.1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                },
              }}
              onClick={() => handleTabClick('4')}
            >
              History
            </StyledButton>
          </div>
          <div className="flex gap-2 justify-center sm:justify-end">
            {/* <StyledButton
              variant="contained"
              size="small"
              startIcon={<FilterAltIcon />}
              sx={{ 
                textTransform: 'none', 
                backgroundColor: '#11B3AE!important',
                color: '#FFFFFF',
                fontWeight: 500,
                padding: { xs: '6px 12px', sm: '8px 16px' },
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Filter
            </StyledButton> */}
            <div className="relative" ref={filterModalRef}>
              <StyledButton
                variant="contained"
                size="small"
                onClick={() => setShowFilterModal((prev) => !prev)}
                startIcon={<VisibilityOffIcon />}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#11B3AE!important',
                  color: '#FFFFFF',
                  fontWeight: 500,
                  padding: { xs: '4px 8px', sm: '8px 12px' },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  position: 'relative',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#0F9A95!important',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                  },
                }}
              >
                Columns
              </StyledButton>
              {showFilterModal && (
                <div className="absolute z-50 top-full mt-2 p-4 w-[280px] text-white bg-[#0B1220] border border-[#11B3AE] rounded-lg shadow-xl right-0 sm:right-0 xs:right-[-50px]">
                  <div className="text-[#E9D8C8] font-medium mb-3 text-sm sm:text-base">Toggle visible columns</div>
                  <div className="space-y-2">
                    <StyledButton
                      onClick={() => setShowFilterItems((prev) => !prev)}
                      sx={{
                        width: '100%',
                        padding: { xs: '4px 8px', sm: '8px 12px' },
                        borderRadius: '8px',
                        fontSize: { xs: '0.875rem', sm: '0.95rem' },
                        backgroundColor: '#11B3AE',
                        color: '#FFFFFF !important',
                        fontWeight: 500,
                        textTransform: 'none',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#0F9A95',
                          color: '#FFFFFF !important',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      Selected ({headers[activeTab].filter(item => item.checked).length})
                    </StyledButton>
                    {showFilterItems && (
                      <div className="bg-[#0B1220] border border-[#11B3AE] rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                        <div
                          className={`flex pl-4 py-2 hover:bg-[#11B3AE] hover:bg-opacity-20 gap-2 cursor-pointer transition-all duration-200 rounded-t-lg ${headers[activeTab].every(item => item.checked) && 'bg-[#11B3AE] bg-opacity-30'
                            }`}
                          onClick={handleViewAll}
                        >
                          <input
                            type="checkbox"
                            checked={headers[activeTab].every(item => item.checked)}
                            onChange={handleViewAll}
                            className="accent-[#11B3AE]"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="text-[0.8rem] sm:text-[0.9rem] p-1 cursor-pointer font-medium text-[#E9D8C8]">
                            View all
                          </div>
                        </div>
                        {headers[activeTab].map((item, i) => (
                          <div
                            key={`input_${i}`}
                            className={`flex pl-4 py-2 hover:bg-[#11B3AE] hover:bg-opacity-20 gap-2 cursor-pointer transition-all duration-200 ${item.checked && 'bg-[#11B3AE] bg-opacity-30'
                              }`}
                            onClick={() => handleRowClick(item.id, item.checked)}
                          >
                            <input
                              name={item.id}
                              checked={item.checked}
                              type="checkbox"
                              className="accent-[#11B3AE]"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="text-[0.8rem] sm:text-[0.9rem] p-1 cursor-pointer text-[#E9D8C8]">
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <StyledButton
                      onClick={resetColumns}
                      sx={{
                        width: '100%',
                        padding: { xs: '4px 8px', sm: '8px 12px' },
                        borderRadius: '8px',
                        fontSize: { xs: '0.875rem', sm: '0.95rem' },
                        backgroundColor: '#11B3AE',
                        color: '#FFFFFF !important',
                        fontWeight: 500,
                        textTransform: 'none',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#0F9A95',
                          color: '#FFFFFF !important',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      Reset Columns
                    </StyledButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Stack>
      {activeTab === '1' && <DashboardTable headers={headers['1']} />}
      {activeTab === '2' && <DashboardTradesTable />}
      {activeTab === '3' && <DashboardAnalysis />}
      {activeTab === '4' && <DashboardHistoryTable />}
    </div>
  );
}

export default Dashboard;
