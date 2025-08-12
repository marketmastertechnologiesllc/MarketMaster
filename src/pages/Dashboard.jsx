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
import TradesTable from '../components/Tables/TradesTable';
import HistoryTable from '../components/Tables/HistoryTable';
import InfoModal from '../components/modals/InfoModal';
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

  // React.useEffect(() => {
  //   _intervalRef3.current = setInterval(async () => {
  //     try {
  //       let temp = [...ids];
  //       console.log('temp -> ', temp);
  //       if (temp.length === 0) {
  //         clearInterval(_intervalRef3.current);
  //       }
  //       for (let i = 0; i < temp.length; i++) {
  //         api.put(`/account/update-account-information/${temp[i]}`)
  //           .then((res) => {
  //             console.log('res -> ', res.data.data);
  //             dispatch({
  //               type: 'DELETE_ID',
  //               payload: temp[i],
  //             });
  //           })
  //           .catch((err) => {
  //           });
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }, 3000);

  //   // setIntervalId(id);

  //   return () => {
  //     clearInterval(_intervalRef3.current);
  //   };
  // }, [ids]);

  // React.useEffect(() => {
  //   _intervalRef300.current = setInterval(() => {
  //     async function fetcher() {
  //       try {
  //         await api.put(`/account/update-all-accounts-information`);
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //     fetcher();
  //   }, 1000 * 60 * 5);

  //   return () => {
  //     clearInterval(_intervalRef300);
  //   };
  // }, []);

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
   * when click view all button
   */
  const handleViewAll = (e) => {
    const index = activeTab;
    setHeaders((prev) => ({
      ...prev,
      [index]: prev[index].map((item) => ({
        ...item,
        checked: e.target.checked,
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

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        display={'flex'}
        justifyContent={'space-between'}
      >
        <div className="flex gap-2">
          <StyledButton
            variant="contained"
            size="small"
            sx={{
              backgroundColor: activeTab == '1' ? '#11B3AE' : '#0B1220',
              textTransform: 'none',
              color: '#FFFFFF',
              fontWeight: 500,
              padding: '8px 16px',
            }}
            onClick={() => handleTabClick('1')}
          >
            Accounts
          </StyledButton>
          {/* <StyledButton
            variant="contained"
            size="small"
            sx={{
              backgroundColor: activeTab == '2' ? '#11B3AE' : '#0B1220',
              textTransform: 'none',
            }}
            onClick={() => handleTabClick('2')}
          >
            Trades
          </StyledButton>
          <StyledButton
            variant="contained"
            size="small"
            sx={{
              backgroundColor: activeTab == '3' ? '#11B3AE' : '#0B1220',
              textTransform: 'none',
            }}
            onClick={() => handleTabClick('3')}
          >
            History
          </StyledButton> */}
        </div>
        <div className="flex gap-2">
          <StyledButton
            variant="contained"
            size="small"
            startIcon={<FilterAltIcon />}
            sx={{ 
              textTransform: 'none', 
              backgroundColor: '#11B3AE!important',
              color: '#FFFFFF',
              fontWeight: 500,
              padding: '8px 16px',
            }}
          >
            Filter
          </StyledButton>
          <div className="relative">
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
                padding: '8px 16px',
                position: 'relative',
              }}
            >
              Columns
            </StyledButton>
            <div
              className={`text-center absolute z-50 top-full mt-2 p-4 w-[280px] bg-[#0B1220] border border-[#11B3AE] rounded-lg shadow-xl right-[-20px] ${!showFilterModal && 'hidden'
                }`}
            >
              <div
                className="fixed opacity-0 top-0 left-0 right-0 bottom-0"
                onClick={() => setShowFilterModal(false)}
              ></div>
              <div className="text-[#E9D8C8] font-medium mb-3">Toggle visible columns</div>
              <div className="relative">
                <StyledButton
                  onClick={() => setShowFilterItems((prev) => !prev)}
                  className="w-full p-3 mt-1 rounded-lg text-[0.95rem] bg-[#11B3AE] hover:bg-[#0F9A95] text-white font-medium transition-all duration-200"
                >
                  All selected ({headers[activeTab].length})
                </StyledButton>
                <div
                  className={`absolute w-full bg-[#0B1220] border border-[#11B3AE] rounded-lg mt-1 shadow-lg ${!showFilterItems && 'hidden'
                    }`}
                >
                  <div
                    className={`flex pl-4 py-2 hover:bg-[#11B3AE] hover:bg-opacity-20 gap-2 cursor-pointer transition-all duration-200 rounded-t-lg ${headers[activeTab].reduce(
                      (count, { checked }) => count + checked,
                      0
                    ) === headers[activeTab].length && 'bg-[#11B3AE] bg-opacity-30'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={
                        headers[activeTab].reduce(
                          (count, { checked }) => count + checked,
                          0
                        ) === headers[activeTab].length
                      }
                      // onClick={handleViewAll}
                      onChange={handleViewAll}
                      className="accent-[#11B3AE]"
                    />
                    <div className="text-[0.9rem] p-1 cursor-pointer font-medium text-[#E9D8C8]">
                      View all
                    </div>
                  </div>
                  {headers[activeTab].map((item, i) => (
                    <div
                      key={`input_${i}`}
                      className={`flex pl-4 py-2 hover:bg-[#11B3AE] hover:bg-opacity-20 gap-2 cursor-pointer transition-all duration-200 ${item.checked && 'bg-[#11B3AE] bg-opacity-30'
                        }`}
                    >
                      <input
                        name={item.id}
                        onChange={handleVisibleChange}
                        checked={item.checked}
                        type="checkbox"
                        className="accent-[#11B3AE]"
                      />
                      <div className="text-[0.9rem] p-1 cursor-pointer text-[#E9D8C8]">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                <StyledButton
                  onClick={resetColumns}
                  className="w-full p-3 mt-2 rounded-lg text-white text-[0.95rem] bg-[#11B3AE] hover:bg-[#0F9A95] font-medium transition-all duration-200"
                >
                  Reset Columns
                </StyledButton>
              </div>
            </div>
          </div>
        </div>
      </Stack>
      {activeTab === '1' && <DashboardTable headers={headers['1']} />}
      {/* {activeTab === '2' && <TradesTable headers={headers['2']} />}
      {activeTab === '3' && <HistoryTable headers={headers['3']} />} */}
    </div>
  );
}

export default Dashboard;
