import * as React from 'react';
import ReactApexChart from 'react-apexcharts';
import { formatNumber } from '../../utils/formatNumber';

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
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());

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
      },
      plotOptions: {
        bar: {
          distributed: true,
          colors: {
            ranges: [
              {
                from: -Infinity,
                to: -0.01,
                color: '#FF0000'
              },
              {
                from: 0,
                to: Infinity,
                color: '#00FF00'
              }
            ]
          }
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
      markers: {
        size: 0,
      },
      yaxis: {
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '12px',
          },
          formatter: function (val) {
            // Check if value needs rounding to 2 decimal places
            // const rounded = Math.round(val * 100) / 100;
            // return Math.abs(val - rounded) < 0.001 ? rounded : val.toFixed(2);
            return val.toFixed(2);
          },
        },
      },
      xaxis: {
        categories: _makeMonthlyData(data).xData,
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '12px',
          },
        },
      },
      tooltip: {
        shared: false,
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            // Check if value needs rounding to 2 decimal places
            // const rounded = Math.round(val * 100) / 100;
            // return Math.abs(val - rounded) < 0.001 ? rounded : val.toFixed(2);
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
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#FFFFFF'],
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
      colors: ['#00BFFF', '#FFD700'],
      fill: {
        colors: ['#00BFFF', '#FFD700'],
      },
      stroke: {
        lineCap: 'round',
        curve: 'smooth',
        colors: ['#00BFFF', '#FFD700'],
      },
      legend: {
        labels: {
          colors: '#FFFFFF',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '12px',
          },
          formatter: function (val) {
            // Check if value needs rounding to 2 decimal places
            // const rounded = Math.round(val * 100) / 100;
            // return Math.abs(val - rounded) < 0.001 ? rounded : val.toFixed(2);
            return val.toFixed(2);
          },
        },
      },
      xaxis: {
        categories: _makeDailyData(data).dates,
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '12px',
          },
        },
      },
      tooltip: {
        shared: false,
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            // Check if value needs rounding to 2 decimal places
            // const rounded = Math.round(val * 100) / 100;
            // return Math.abs(val - rounded) < 0.001 ? rounded : val.toFixed(2);
            return val.toFixed(2);
          },
        },
      },
    },
  };

  const pieChartConfig = {
    series: [100],
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      legend: {
        position: 'left',
        labels: {
          colors: '#ccc',
          useSeriesColors: false,
        },
      },
      labels: ['USDEUR'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
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
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#FFFFFF'],
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
      colors: ['#00BFFF', '#FFD700'],
      fill: {
        colors: ['#00BFFF', '#FFD700'],
      },
      stroke: {
        lineCap: 'round',
        curve: 'smooth',
        colors: ['#00BFFF', '#FFD700'],
      },
      legend: {
        labels: {
          colors: '#FFFFFF',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '12px',
          },
          formatter: function (val) {
            // Check if value needs rounding to 2 decimal places
            // const rounded = Math.round(val * 100) / 100;
            // return Math.abs(val - rounded) < 0.001 ? rounded : val.toFixed(2);
            return val.toFixed(2);
          },
        },
      },
      xaxis: {
        categories: _makeHourlyData(data).dates,
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '12px',
          },
        },
      },
      tooltip: {
        shared: false,
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            // Check if value needs rounding to 2 decimal places
            // const rounded = Math.round(val * 100) / 100;
            // return Math.abs(val - rounded) < 0.001 ? rounded : val.toFixed(2);
            return val.toFixed(2);
          },
        },
      },
    },
  };

  const [tab, setTab] = React.useState(1);

  // Generate last 2 years dynamically
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1];

  const _renderMonthlyData = () => (
    <div className="flex items-center gap-[30px]">
      <div className="w-[100%]">
        <select
          name="year"
          required
          className="bg-[#282d36] text-[#fff] px-3 py-1.5 rounded text-[14px] h-[34px] mb-4"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <ReactApexChart
          options={monthlyChartConfig.options}
          series={monthlyChartConfig.series}
          type="bar"
          height={350}
        />
      </div>
      {/* <div className="w-[34%]">
        <ReactApexChart
          options={pieChartConfig.options}
          series={pieChartConfig.series}
          type="pie"
          width={'88%'}
        />
      </div> */}
    </div>
  );

  const _renderDailyData = () => (
    <div className="">
      <div className="flex gap-4 mb-4">
        <select
          name="year"
          required
          className="bg-[#282d36] text-[#fff] px-3 py-1.5 rounded text-[14px] h-[34px]"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select
          name="type"
          required
          className="bg-[#282d36] text-[#fff] px-3 py-1.5 rounded text-[14px] h-[34px]"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value={'buy_sell'}>Buy vs Sell</option>
          <option value={'win_loss'}>Win vs Loss</option>
        </select>
      </div>
      <ReactApexChart
        options={dailyChartConfig.options}
        series={dailyChartConfig.series}
        type="bar"
        height={350}
      />
    </div>
  );

  const _renderHourlyData = () => (
    <div className="">
      <div className="flex gap-4 mb-4">
        <select
          name="year"
          required
          className="bg-[#282d36] text-[#fff] px-3 py-1.5 rounded text-[14px] h-[34px]"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select
          name="type"
          required
          className="bg-[#282d36] text-[#fff] px-3 py-1.5 rounded text-[14px] h-[34px]"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value={'buy_sell'}>Buy vs Sell</option>
          <option value={'win_loss'}>Win vs Loss</option>
        </select>
      </div>
      <ReactApexChart
        options={hourlyChartConfig.options}
        series={hourlyChartConfig.series}
        type="bar"
        height={350}
      />
    </div>
  );

  return (
    <div>
      <ul className="flex text-sm font-medium text-center  dark:text-gray-400">
        <li className="mr-[2px]">
          <a
            onClick={() => setTab(1)}
            href="#"
            aria-current="page"
            className={`inline-block px-[15px] py-[10px] text-white bg-[#282D36]  rounded-t border-t-[3px] box-border hover:border-white ${
              tab === 1 ? 'border-white bg-[#2E353E]' : 'border-[#282D36]'
            }`}
          >
            Monthly
          </a>
        </li>
        <li className="mr-[2px]">
          <a
            onClick={() => setTab(2)}
            href="#"
            className={`inline-block px-[15px] py-[10px] text-white bg-[#282D36]  rounded-t border-t-[3px] box-border hover:border-white ${
              tab === 2 ? 'border-white bg-[#2E353E]' : 'border-[#282D36]'
            }`}
          >
            Weekly
          </a>
        </li>
        <li className="mr-[2px]">
          <a
            onClick={() => setTab(3)}
            href="#"
            className={`inline-block px-[15px] py-[10px] text-white bg-[#282D36]  rounded-t border-t-[3px] box-border hover:border-white ${
              tab === 3 ? 'border-white bg-[#2E353E]' : 'border-[#282D36]'
            }`}
          >
            Hourly
          </a>
        </li>
      </ul>
      <div className="bg-[#2E353E] rounded-b p-[15px]">
        {tab === 1 && _renderMonthlyData()}
        {tab === 2 && _renderDailyData()}
        {tab === 3 && _renderHourlyData()}
      </div>
    </div>
  );
};

export default AnalysisByTime;
