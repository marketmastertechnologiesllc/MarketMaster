import * as React from 'react';
import ReactApexChart from 'react-apexcharts';
import { formatNumber } from '../../utils/formatNumber';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';

const StyledTab = styled('div')(({ theme, active }) => ({
  display: 'inline-block',
  padding: '12px 16px',
  color: active ? '#FFFFFF' : '#E9D8C8',
  backgroundColor: active ? '#11B3AE' : 'transparent',
  borderRadius: '8px 8px 0 0',
  borderTop: `3px solid ${active ? '#11B3AE' : 'transparent'}`,
  fontWeight: 600,
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: active ? '#0F9A95' : 'rgba(17, 179, 174, 0.1)',
    transform: 'translateY(-1px)',
  },
}));

const _dateCompare = (a, b) => {
  const first = new Date(a);
  const second = new Date(b);

  if (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  ) {
    return true;
  } else {
    return false;
  }
};

const _dateHourCompare = (a, b) => {
  const first = new Date(a);
  const second = new Date(b);

  if (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate() &&
    first.getHours() === second.getHours()
  ) {
    return true;
  } else {
    return false;
  }
};

const AnalysisByTime = ({ data }) => {
  const [type, setType] = React.useState('win_loss');
  
  // Get available years and set initial year to the first available year
  const availableYears = React.useMemo(() => {
    if (!data || data.length === 0) {
      const currentYear = new Date().getFullYear();
      return [currentYear];
    }
    
    const years = new Set();
    data.forEach(item => {
      const year = new Date(item.openTimeAsDateTime).getFullYear();
      years.add(year);
    });
    
    const currentYear = new Date().getFullYear();
    years.add(currentYear); // Ensure current year is included
    
    return Array.from(years).sort((a, b) => a - b);
  }, [data]);
  
  const [selectedYear, setSelectedYear] = React.useState(() => {
    return availableYears.length > 0 ? availableYears[0] : new Date().getFullYear();
  });

  // Helper function to calculate total profit (profit + swap + commission)
  const calculateTotalProfit = (item) => {
    return (item.profit || 0) + (item.swap || 0) + (item.commission || 0);
  };

  // Helper function to determine if a trade was won or lost
  const isWinningTrade = (item) => {
    return calculateTotalProfit(item) > 0;
  };

  // Helper function to map deal type
  const mapDealType = (dealType) => {
    return dealType === 'DealBuy' ? 'Sell' : 'Buy';
  };

  // Filter data by selected year
  const getFilteredDataByYear = (props) => {
    if (!props || props.length === 0) return [];
    
    return props.filter(item => {
      const itemYear = new Date(item.openTimeAsDateTime).getFullYear();
      return itemYear === selectedYear;
    });
  };

  const _makeMonthlyData = (props) => {
    const filteredData = getFilteredDataByYear(props);
    
    if (filteredData.length === 0) {
      return {
        xData: [],
        yData: [],
      };
    }

    // Group data by month
    const monthlyData = {};
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    filteredData.forEach(item => {
      const date = new Date(item.openTimeAsDateTime);
      const monthIndex = date.getMonth();
      const monthName = monthNames[monthIndex];
      
      if (!monthlyData[monthName]) {
        monthlyData[monthName] = {
          totalProfit: 0,
          count: 0
        };
      }
      
      monthlyData[monthName].totalProfit += calculateTotalProfit(item);
      monthlyData[monthName].count += 1;
    });

    // Convert to arrays for chart
    const xData = monthNames.filter(month => monthlyData[month]);
    const yData = xData.map(month => formatNumber(monthlyData[month].totalProfit));
    const rawYData = xData.map(month => monthlyData[month].totalProfit);

    return { xData, yData, rawYData };
  };

  const monthlyChartConfig = {
    series: [
      {
        name: 'Profit',
        data: _makeMonthlyData(data).rawYData,
      },
    ],
    options: {
      chart: {
        stacked: false,
        height: 450,
        toolbar: {
          show: false,
        },
        background: 'transparent',
        foreColor: '#E9D8C8',
      },
      plotOptions: {
        bar: {
          distributed: true,
          colors: {
            ranges: [
              {
                from: -Infinity,
                to: -0.01,
                color: '#f40b0b'
              },
              {
                from: 0,
                to: Infinity,
                color: '#47A447'
              }
            ]
          },
          borderRadius: 4,
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#FFFFFF'],
          fontSize: '12px',
          fontWeight: 'bold',
        },
        formatter: function (val) {
          return val.toFixed(2);
        },
      },
      grid: {
        borderColor: 'rgba(17, 179, 174, 0.1)',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#E9D8C8',
            fontSize: '12px',
          },
          formatter: function (val) {
            return val.toFixed(2);
          },
        },
        axisBorder: {
          color: 'rgba(17, 179, 174, 0.2)',
        },
        axisTicks: {
          color: 'rgba(17, 179, 174, 0.2)',
        },
      },
      xaxis: {
        categories: _makeMonthlyData(data).xData,
        labels: {
          style: {
            colors: '#E9D8C8',
            fontSize: '12px',
          },
        },
        axisBorder: {
          color: 'rgba(17, 179, 174, 0.2)',
        },
        axisTicks: {
          color: 'rgba(17, 179, 174, 0.2)',
        },
      },
      tooltip: {
        shared: false,
        theme: 'dark',
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            return val.toFixed(2);
          },
        },
      },
    },
  };

  const _makeDailyData = (props) => {
    const filteredData = getFilteredDataByYear(props);
    
    if (filteredData.length === 0) {
      return {
        losers: [],
        winners: [],
        buys: [],
        sells: [],
        dates: [],
      };
    }

    // Group data by day of week
    const dailyData = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    filteredData.forEach(item => {
      const date = new Date(item.openTimeAsDateTime);
      const dayName = dayNames[date.getDay()];
      
      if (!dailyData[dayName]) {
        dailyData[dayName] = {
          wins: 0,
          losses: 0,
          buys: 0,
          sells: 0
        };
      }
      
      if (isWinningTrade(item)) {
        dailyData[dayName].wins += 1;
      } else {
        dailyData[dayName].losses += 1;
      }
      
      // According to user's mapping: DealBuy -> Sell, DealSell -> Buy
      if (item.type === 'DealBuy') {
        dailyData[dayName].sells += 1;
      } else if (item.type === 'DealSell') {
        dailyData[dayName].buys += 1;
      }
    });

    // Convert to arrays for chart
    const dates = dayNames.filter(day => dailyData[day]);
    const winners = dates.map(day => dailyData[day].wins);
    const losers = dates.map(day => dailyData[day].losses);
    const buys = dates.map(day => dailyData[day].buys);
    const sells = dates.map(day => dailyData[day].sells);

    return { losers, winners, buys, sells, dates };
  };

  const _makeHourlyData = (props) => {
    const filteredData = getFilteredDataByYear(props);
    
    if (filteredData.length === 0) {
      return {
        losers: [],
        winners: [],
        buys: [],
        sells: [],
        dates: [],
      };
    }

    // Group data by hour
    const hourlyData = {};
    const hourLabels = [];

    // Initialize all 24 hours
    for (let i = 0; i < 24; i++) {
      const hourLabel = `${i}H`;
      hourLabels.push(hourLabel);
      hourlyData[hourLabel] = {
        wins: 0,
        losses: 0,
        buys: 0,
        sells: 0
      };
    }

    filteredData.forEach(item => {
      const date = new Date(item.openTimeAsDateTime);
      const hour = date.getHours();
      const hourLabel = `${hour}H`;
      
      if (isWinningTrade(item)) {
        hourlyData[hourLabel].wins += 1;
      } else {
        hourlyData[hourLabel].losses += 1;
      }
      
      // According to user's mapping: DealBuy -> Sell, DealSell -> Buy
      if (item.type === 'DealBuy') {
        hourlyData[hourLabel].sells += 1;
      } else if (item.type === 'DealSell') {
        hourlyData[hourLabel].buys += 1;
      }
    });

    // Convert to arrays for chart
    const dates = hourLabels;
    const winners = dates.map(hour => hourlyData[hour].wins);
    const losers = dates.map(hour => hourlyData[hour].losses);
    const buys = dates.map(hour => hourlyData[hour].buys);
    const sells = dates.map(hour => hourlyData[hour].sells);

    return { losers, winners, buys, sells, dates };
  };

  const dailyChartConfig = {
    series: [
      {
        name: type === 'buy_sell' ? 'Buy' : 'Win',
        data:
          type === 'buy_sell'
            ? _makeDailyData(data).buys
            : _makeDailyData(data).winners,
      },
      {
        name: type === 'buy_sell' ? 'Sell' : 'Loss',
        data:
          type === 'buy_sell'
            ? _makeDailyData(data).sells
            : _makeDailyData(data).losers,
      },
    ],
    options: {
      chart: {
        stacked: true,
        height: 450,
        toolbar: {
          show: false,
        },
        background: 'transparent',
        foreColor: '#E9D8C8',
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#FFFFFF'],
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
      colors: ['#11B3AE', '#FFD700'],
      fill: {
        colors: ['#11B3AE', '#FFD700'],
      },
      stroke: {
        lineCap: 'round',
        curve: 'smooth',
        colors: ['#11B3AE', '#FFD700'],
      },
      grid: {
        borderColor: 'rgba(17, 179, 174, 0.1)',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      legend: {
        labels: {
          colors: '#E9D8C8',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#E9D8C8',
            fontSize: '12px',
          },
          formatter: function (val) {
            return val.toFixed(2);
          },
        },
        axisBorder: {
          color: 'rgba(17, 179, 174, 0.2)',
        },
        axisTicks: {
          color: 'rgba(17, 179, 174, 0.2)',
        },
      },
      xaxis: {
        categories: _makeDailyData(data).dates,
        labels: {
          style: {
            colors: '#E9D8C8',
            fontSize: '12px',
          },
        },
        axisBorder: {
          color: 'rgba(17, 179, 174, 0.2)',
        },
        axisTicks: {
          color: 'rgba(17, 179, 174, 0.2)',
        },
      },
      tooltip: {
        shared: false,
        theme: 'dark',
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            return val.toFixed(2);
          },
        },
      },
    },
  };

  const hourlyChartConfig = {
    series: [
      {
        name: type === 'buy_sell' ? 'Buy' : 'Win',
        data:
          type === 'buy_sell'
            ? _makeHourlyData(data).buys
            : _makeHourlyData(data).winners,
      },
      {
        name: type === 'buy_sell' ? 'Sell' : 'Loss',
        data:
          type === 'buy_sell'
            ? _makeHourlyData(data).sells
            : _makeHourlyData(data).losers,
      },
    ],
    options: {
      chart: {
        stacked: true,
        height: 450,
        toolbar: {
          show: false,
        },
        background: 'transparent',
        foreColor: '#E9D8C8',
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#FFFFFF'],
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
      colors: ['#11B3AE', '#FFD700'],
      fill: {
        colors: ['#11B3AE', '#FFD700'],
      },
      stroke: {
        lineCap: 'round',
        curve: 'smooth',
        colors: ['#11B3AE', '#FFD700'],
      },
      grid: {
        borderColor: 'rgba(17, 179, 174, 0.1)',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      legend: {
        labels: {
          colors: '#E9D8C8',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#E9D8C8',
            fontSize: '12px',
          },
          formatter: function (val) {
            return val.toFixed(2);
          },
        },
        axisBorder: {
          color: 'rgba(17, 179, 174, 0.2)',
        },
        axisTicks: {
          color: 'rgba(17, 179, 174, 0.2)',
        },
      },
      xaxis: {
        categories: _makeHourlyData(data).dates,
        labels: {
          style: {
            colors: '#E9D8C8',
            fontSize: '12px',
          },
        },
        axisBorder: {
          color: 'rgba(17, 179, 174, 0.2)',
        },
        axisTicks: {
          color: 'rgba(17, 179, 174, 0.2)',
        },
      },
      tooltip: {
        shared: false,
        theme: 'dark',
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            return val.toFixed(2);
          },
        },
      },
    },
  };

  const [tab, setTab] = React.useState(1);

  const years = availableYears;

  const _renderMonthlyData = () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <FormControl size="small">
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
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
            {years.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="bg-[#0B1220] rounded-lg border border-[#11B3AE] border-opacity-20 p-4">
        <ReactApexChart
          options={monthlyChartConfig.options}
          series={monthlyChartConfig.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );

  const _renderDailyData = () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <FormControl size="small">
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
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
            {years.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
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
            <MenuItem value={'buy_sell'}>Buy vs Sell</MenuItem>
            <MenuItem value={'win_loss'}>Win vs Loss</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="bg-[#0B1220] rounded-lg border border-[#11B3AE] border-opacity-20 p-4">
        <ReactApexChart
          options={dailyChartConfig.options}
          series={dailyChartConfig.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );

  const _renderHourlyData = () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <FormControl size="small">
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
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
            {years.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
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
            <MenuItem value={'buy_sell'}>Buy vs Sell</MenuItem>
            <MenuItem value={'win_loss'}>Win vs Loss</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="bg-[#0B1220] rounded-lg border border-[#11B3AE] border-opacity-20 p-4">
        <ReactApexChart
          options={hourlyChartConfig.options}
          series={hourlyChartConfig.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {/* Tab Header */}
      <div className="p-4 border-b border-[#11B3AE] border-opacity-20">
        <div className="flex space-x-1">
          <StyledTab 
            active={tab === 1}
            onClick={() => setTab(1)}
          >
            Monthly
          </StyledTab>
          <StyledTab 
            active={tab === 2}
            onClick={() => setTab(2)}
          >
            Weekly
          </StyledTab>
          <StyledTab 
            active={tab === 3}
            onClick={() => setTab(3)}
          >
            Hourly
          </StyledTab>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {tab === 1 && _renderMonthlyData()}
        {tab === 2 && _renderDailyData()}
        {tab === 3 && _renderHourlyData()}
      </div>
    </div>
  );
};

export default AnalysisByTime;
