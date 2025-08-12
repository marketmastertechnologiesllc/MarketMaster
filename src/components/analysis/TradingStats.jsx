import * as React from 'react';
import { formatNumber } from '../../utils/formatNumber';

const TradingStats = ({ data }) => {
  const [tab, setTab] = React.useState(1);

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
            Stats
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
            Profile
          </a>
        </li>
      </ul>
      <div className="bg-[#2E353E] rounded-b p-[15px]">
        <table
          className={`border-[#1D2127] border w-full ${tab !== 1 && 'hidden'}`}
        >
          <tr className="w-full">
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Total Trades
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && data.totalTrades}
            </td>
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Shorts Won
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && (
                <>
                  {data.shortsWonCount}
                  <span className="text-[12px]"> of</span> {data.shortsCount}
                </>
              )}
            </td>
          </tr>
          <tr className="w-full">
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Win %
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && (
                <>
                  {formatNumber(data.winPercentage)}%{' '}
                  <span className="text-[12px]">
                    {data.winCount} of {data.totalTrades}
                  </span>
                </>
              )}
            </td>
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Best Trade
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && (
                <>
                  {data.bestTradeProfit} USD (
                  {data.bestTradeDate.substr(0, 10)})
                </>
              )}
            </td>
          </tr>
          <tr className="w-full">
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Loss %
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && (
                <>
                  {formatNumber(data.lostPercentage)}%{' '}
                  <span className="text-[12px]">
                    {data.loseCount} of {data.totalTrades}
                  </span>
                </>
              )}
            </td>
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Worst Trade
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && (
                <React.Fragment>
                  {formatNumber(data.worstTradeProfit)} USD (
                  {data.worstTradeDate.substr(0, 10)})
                </React.Fragment>
              )}
            </td>
          </tr>
          <tr className="w-full">
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Lots
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && formatNumber(data.lots)}
            </td>
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Average Win
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && (
                <React.Fragment>{formatNumber(data.averageWon)} USD</React.Fragment>
              )}
            </td>
          </tr>
          <tr className="w-full">
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Longs Won
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && (
                <>
                  {data.longsWonCount}
                  <span className="text-[12px]"> of</span> {data.longsCount}
                </>
              )}
            </td>
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Average Loss
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && (
                <React.Fragment>{data.averageLoss} USD</React.Fragment>
              )}
            </td>
          </tr>
        </table>
        <table
          className={`border-[#1D2127] border w-full ${tab !== 2 && 'hidden'}`}
        >
          <tr className="w-full">
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Balance
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && data.balance.toFixed(2)} USD
            </td>
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Broker Server
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && data.server}
            </td>
          </tr>
          <tr className="w-full">
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Equity
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && data.equity.toFixed(2)} USD
            </td>
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Leverage
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && data.leverage} : 1
            </td>
          </tr>
          <tr className="w-full">
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Deposits
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && data.deposits} USD
            </td>
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Credit
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && data.credit}
            </td>
          </tr>
          <tr className="w-full">
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Broker
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 && data.broker}
            </td>
            <td className="w-[20%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              Account Type
            </td>
            <td className="w-[30%] text-[13px] p-[8px] text-[#ccc] font-[600] border border-[#1D2127]">
              {Object.keys(data).length > 0 &&
                data.accountType}
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default TradingStats;
