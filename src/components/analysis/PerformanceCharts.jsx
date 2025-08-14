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

const PerformanceChart = ({ data }) => {
  const [type, setType] = React.useState('Growth');
  const [timePeriod, setTimePeriod] = React.useState('All');
  
  // Get available years and set initial year to the first available year
  const availableYears = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const years = new Set();
    data.forEach(item => {
      const year = new Date(item.openTimeAsDateTime).getFullYear();
      years.add(year);
    });
    
    return Array.from(years).sort((a, b) => a - b);
  }, [data]);
  
  const [selectedYear, setSelectedYear] = React.useState(() => {
    return availableYears.length > 0 ? availableYears[0] : new Date().getFullYear();
  });

  // Helper function to calculate total profit (profit + swap + commission)
  const calculateTotalProfit = (item) => {
    return (item.profit || 0) + (item.swap || 0) + (item.commission || 0);
  };



  // Helper function to filter data by selected year
  const filterDataByYear = (props) => {
    if (!props || props.length === 0) return [];
    
    return props.filter(item => {
      const itemYear = new Date(item.openTimeAsDateTime).getFullYear();
      return itemYear === selectedYear;
    });
  };

  // Helper function to group data by time period
  const groupDataByTimePeriod = (props, period) => {
    if (!props || props.length === 0) return [];

    // Filter data by selected year if not "All" time period
    const filteredData = period === 'All' ? props : filterDataByYear(props);

    // Sort props from past to present based on openTimeAsDateTime
    const sortedProps = [...filteredData].sort((a, b) => 
      new Date(a.openTimeAsDateTime) - new Date(b.openTimeAsDateTime)
    );

    if (period === 'All') {
      return sortedProps;
    }

    const groupedData = {};
    
    sortedProps.forEach(item => {
      const date = new Date(item.openTimeAsDateTime);
      let key;
      
      if (period === 'Daily') {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      } else if (period === 'Weekly') {
        // Get the start of the week (Monday)
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
        const startOfWeek = new Date(date.setDate(diff));
        key = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`; // YYYY-MM-DD format for week start
      } else if (period === 'Monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM format
      } else if (period === 'Hourly') {
        key = `${date.toISOString().split('T')[0]}T${String(date.getHours()).padStart(2, '0')}:00`; // YYYY-MM-DDTHH:00 format
      }
      
      if (!groupedData[key]) {
        groupedData[key] = {
          items: [],
          totalProfit: 0,
          totalBalance: 0,
          count: 0
        };
      }
      
      groupedData[key].items.push(item);
      groupedData[key].totalProfit += calculateTotalProfit(item);
      groupedData[key].totalBalance = item.balance; // Use the latest balance for the period
      groupedData[key].count += 1;
    });

    // Convert grouped data back to array format
    return Object.keys(groupedData).map(key => {
      const group = groupedData[key];
      const lastItem = group.items[group.items.length - 1];
      
      return {
        openTimeAsDateTime: key,
        profit: group.totalProfit,
        commission: 0, // Already included in totalProfit
        swap: 0, // Already included in totalProfit
        balance: group.totalBalance,
        count: group.count
      };
    }).sort((a, b) => new Date(a.openTimeAsDateTime) - new Date(b.openTimeAsDateTime));
  };

  const _makeData = (props) => {
    if (props.length === 0) {
      return {
        xData: [],
        yData: [],
      };
    }

    // Group data by time period
    const groupedData = groupDataByTimePeriod(props, timePeriod);

    let xData = [];
    let yData = [];
    
    if (type === 'Profit') {
      xData = groupedData.map((item) => {
        if (timePeriod === 'Hourly') {
          const date = new Date(item.openTimeAsDateTime);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const hour = date.getHours();
          return `${date.getDate()} ${monthNames[date.getMonth()]} ${hour}h`;
        } else if (timePeriod === 'Monthly') {
          const [year, month] = item.openTimeAsDateTime.split('-');
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${monthNames[parseInt(month) - 1]} '${year.slice(-2)}`;
        } else if (timePeriod === 'Daily') {
          const date = new Date(item.openTimeAsDateTime);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${date.getDate()} ${monthNames[date.getMonth()]}`;
        } else if (timePeriod === 'Weekly') {
          const date = new Date(item.openTimeAsDateTime);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const dayOfWeek = date.getDay();
          const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          const startOfWeek = new Date(date.setDate(diff));
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return `${startOfWeek.getDate()} ${monthNames[startOfWeek.getMonth()]} - ${endOfWeek.getDate()} ${monthNames[endOfWeek.getMonth()]}`;
        } else {
          const date = new Date(item.openTimeAsDateTime);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        }
      });
      let cumulativeProfit = 0;
      yData = groupedData.map((item) => {
        cumulativeProfit += item.profit;
        return cumulativeProfit;
      });
    } else if (type === 'Growth') {
      xData = groupedData.map((item) => {
        if (timePeriod === 'Hourly') {
          const date = new Date(item.openTimeAsDateTime);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const hour = date.getHours();
          return `${date.getDate()} ${monthNames[date.getMonth()]} ${hour}h`;
        } else if (timePeriod === 'Monthly') {
          const [year, month] = item.openTimeAsDateTime.split('-');
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${monthNames[parseInt(month) - 1]} '${year.slice(-2)}`;
        } else if (timePeriod === 'Daily') {
          const date = new Date(item.openTimeAsDateTime);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${date.getDate()} ${monthNames[date.getMonth()]}`;
        } else if (timePeriod === 'Weekly') {
          const date = new Date(item.openTimeAsDateTime);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const dayOfWeek = date.getDay();
          const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          const startOfWeek = new Date(date.setDate(diff));
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return `${startOfWeek.getDate()} ${monthNames[startOfWeek.getMonth()]} - ${endOfWeek.getDate()} ${monthNames[endOfWeek.getMonth()]}`;
        } else {
          const date = new Date(item.openTimeAsDateTime);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        }
      });
      let cumulativeProfit = 0;
      yData = groupedData.map((item) => {
        cumulativeProfit += item.profit;
        return cumulativeProfit / (item.balance - cumulativeProfit) * 100;
      });
    } else if (type === 'Balance') {
      xData = groupedData.map((item) => {
        if (timePeriod === 'Hourly') {
          const date = new Date(item.openTimeAsDateTime);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const hour = date.getHours();
          return `${date.getDate()} ${monthNames[date.getMonth()]} ${hour}h`;
        } else if (timePeriod === 'Monthly') {
          const [year, month] = item.openTimeAsDateTime.split('-');
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${monthNames[parseInt(month) - 1]} '${year.slice(-2)}`;
        } else if (timePeriod === 'Daily') {
          const date = new Date(item.openTimeAsDateTime);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${date.getDate()} ${monthNames[date.getMonth()]}`;
        } else if (timePeriod === 'Weekly') {
          const date = new Date(item.openTimeAsDateTime);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const dayOfWeek = date.getDay();
          const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          const startOfWeek = new Date(date.setDate(diff));
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return `${startOfWeek.getDate()} ${monthNames[startOfWeek.getMonth()]} - ${endOfWeek.getDate()} ${monthNames[endOfWeek.getMonth()]}`;
        } else {
          const date = new Date(item.openTimeAsDateTime);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        }
      });
      yData = groupedData.map((item) => item.balance);
    }

    return { xData, yData };
  };

  const chartConfig = {
    series: [
      {
        name: type,
        data: _makeData(data).yData,
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
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 2,
        colors: timePeriod === 'All' ? ['#11B3AE'] : ['#11B3AE', '#FF4444'],
        strokeColors: timePeriod === 'All' ? ['#11B3AE'] : ['#11B3AE', '#FF4444'],
        strokeWidth: 1,
        hover: {
          size: 4,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.3,
          gradientToColors: ['#11B3AE'],
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      colors: ['#11B3AE', '#FF4444'],
      plotOptions: {
        area: {
          fillTo: 'origin',
        },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: timePeriod === 'All' ? ['#11B3AE'] : ['#11B3AE', '#FF4444'],
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
            return type !== 'Growth' ? formatNumber(val) : formatNumber(val) + '%';
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
        categories: _makeData(data).xData,
        labels: {
          style: {
            colors: '#E9D8C8',
            fontSize: '12px',
          },
          rotate: timePeriod === 'Hourly' ? -45 : 0,
          rotateAlways: timePeriod === 'Hourly',
          maxHeight: timePeriod === 'Hourly' ? 60 : undefined,
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
            return type !== 'Growth' ? formatNumber(val) : formatNumber(val) + '%';
          },
        },
        marker: {
          show: true,
        },
      },
      legend: {
        labels: {
          colors: '#E9D8C8',
        },
      },
    },
  };

  return (
    <div className="h-full">
      {/* Tab Header */}
      <div className="p-4 border-b border-[#11B3AE] border-opacity-20">
        <StyledTab active={true}>
          Performance Chart
        </StyledTab>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Chart Type Selector */}
        <div className="mt-2 mb-4">
          <FormControl size="small" fullWidth>
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
              <MenuItem value={'Growth'}>Growth</MenuItem>
              <MenuItem value={'Balance'}>Balance</MenuItem>
              <MenuItem value={'Profit'}>Profit</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Time Period Selector */}
        <div className="mb-4">
          <FormControl size="small" fullWidth>
            <Select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
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
              <MenuItem value={'All'}>All Data</MenuItem>
              <MenuItem value={'Hourly'}>Hourly</MenuItem>
              <MenuItem value={'Daily'}>Daily</MenuItem>
              <MenuItem value={'Weekly'}>Weekly</MenuItem>
              <MenuItem value={'Monthly'}>Monthly</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Year Selector */}
        {timePeriod !== 'All' && (
          <div className="mb-4">
            <FormControl size="small" fullWidth>
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
                {availableYears.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        {/* Chart */}
        <div className="bg-[#0B1220] rounded-lg border border-[#11B3AE] border-opacity-20 p-4">
          <ReactApexChart
            options={chartConfig.options}
            series={chartConfig.series}
            type="area"
            height={350}
          />
        </div>

        {/* Updated timestamp */}
        {/* <div className="mt-4 p-3 bg-[#0B1220] rounded-lg border border-[#11B3AE] border-opacity-10">
          <Typography sx={{ color: '#666', fontSize: '0.75rem', textAlign: 'center' }}>
            Updated: 2023-12-22 11:23
          </Typography>
        </div> */}
      </div>
    </div>
  );
};

export default PerformanceChart;
