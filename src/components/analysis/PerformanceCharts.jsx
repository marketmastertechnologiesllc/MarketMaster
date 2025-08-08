import * as React from 'react';
import ReactApexChart from 'react-apexcharts';
import { formatNumber } from '../../utils/formatNumber';

const PerformanceChart = ({ data }) => {
  const [type, setType] = React.useState('Growth');

  const _makeData = (props) => {
    if (props.length === 0) {
      return {
        xData: [],
        yData: [],
      };
    }

    let xData = [];
    let yData = [];
    if (type === 'Profit') {
      xData = props.map((item) => item.openTimeAsDateTime.substr(0, 10));
      let cumulativeProfit = 0;
      yData = props.map((item) => {
        cumulativeProfit += (item.profit + item.commission + item.swap);
        return cumulativeProfit;
      });
    } else if (type === 'Growth') {
      xData = props.map((item) => item.openTimeAsDateTime.substr(0, 10));
      yData = [...yData, 100];
      let cumulativeProfit = 0;
      yData = props.map((item) => {
        cumulativeProfit += (item.profit + item.commission + item.swap);
        return cumulativeProfit / (item.balance - cumulativeProfit) * 100;
      });
    } else if (type === 'Balance') {
      xData = props.map((item) => item.openTimeAsDateTime.substr(0, 10));
      yData = props.map((item) => item.balance);
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
        // type: 'area',
        stacked: false,
        height: 450,
        // zoom: {
        //   type: 'x',
        //   enabled: true,
        //   autoScaleYaxis: true,
        // },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      fill: {
        opacity: 0.8,
      },
      // stroke: {
      //   lineCap: 'round',
      //   curve: 'smooth',
      // },
      yaxis: {
        labels: {
          style: {
            colors: '#545454',
          },
          formatter: function (val) {
            return type !== 'Growth' ? formatNumber(val) : formatNumber(val) + '%';
          },
        },
      },
      xaxis: {
        categories: _makeData(data).xData,
        labels: {
          style: {
            colors: '#545454',
          },
          // formatter: function (value) {
          //   return (value + '').substr(0, 10);
          // },
        },
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return type !== 'Growth' ? formatNumber(val) : formatNumber(val) + '%';
          },
        },
      },
    },
  };

  return (
    <div>
      <ul className="flex text-sm font-medium text-center  dark:text-gray-400">
        <li className="mr-[2px]">
          <a
            href="#"
            aria-current="page"
            className="inline-block px-[15px] py-[10px] text-white rounded-t border-t-[3px] box-border hover:border-white
              border-white bg-[#2E353E]"
          >
            Performance Chart
          </a>
        </li>
      </ul>
      <div className="bg-[#2E353E] px-[15px] py-[10px] rounded-b">
        <select
          name="platform"
          required
          className="bg-[#282d36] text-[#fff] px-3 py-1.5 rounded text-[14px] h-[34px]"
          onChange={(e) => {
            setType(e.target.value);
          }}
        >
          <option value={'Growth'}>Growth</option>
          <option value={'Balance'}>Balance</option>
          <option value={'Profit'}>Profit</option>
        </select>
        <ReactApexChart
          options={chartConfig.options}
          series={chartConfig.series}
          type="line"
          height={273}
        />
        <p className="mt-[5px] text-[#505461] text-[13px]">
          Updated: 2023-12-22 11:23
        </p>
      </div>
    </div>
  );
};

export default PerformanceChart;
