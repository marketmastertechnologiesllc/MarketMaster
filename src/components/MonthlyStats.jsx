import * as React from 'react';
import { Icon } from '@iconify/react';
import { formatNumber } from '../utils/formatNumber';

const MonthlyStats = ({ tradeHistory = [], selectedAccount }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  // Get month name
  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Go to current month
  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  };

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar data
  const generateCalendarData = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const calendar = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendar.push({ day: null, data: null });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = getDayTradingData(dateStr);
      calendar.push({ day, data: dayData });
    }

    return calendar;
  };

  // Get trading data for a specific day
  const getDayTradingData = (dateStr) => {
    if (!tradeHistory || tradeHistory.length === 0) return null;

    const dayTrades = tradeHistory.filter(trade => {
      const tradeDate = trade.start_time ? trade.start_time.substring(0, 10) : null;
      return tradeDate === dateStr;
    });

    if (dayTrades.length === 0) return null;

    const totalProfit = dayTrades.reduce((sum, trade) => sum + parseFloat(trade.profit || 0), 0);
    const winningTrades = dayTrades.filter(trade => parseFloat(trade.profit || 0) > 0);
    const winRate = dayTrades.length > 0 ? (winningTrades.length / dayTrades.length) * 100 : 0;

    return {
      profit: totalProfit,
      trades: dayTrades.length,
      winRate: winRate,
      isProfitable: totalProfit >= 0
    };
  };

  // Generate weekly stats
  const generateWeeklyStats = () => {
    const calendar = generateCalendarData();
    const weeks = [];
    let currentWeek = [];
    let weekNumber = 1;

    calendar.forEach((day, index) => {
      currentWeek.push(day);

      // End of week (Saturday) or end of month
      if ((index + 1) % 7 === 0 || index === calendar.length - 1) {
        const weekData = calculateWeekStats(currentWeek);
        weeks.push({
          weekNumber,
          ...weekData
        });
        currentWeek = [];
        weekNumber++;
      }
    });

    return weeks;
  };

  // Calculate stats for a week
  const calculateWeekStats = (weekDays) => {
    let totalProfit = 0;
    let tradingDays = 0;

    weekDays.forEach(day => {
      if (day.data) {
        totalProfit += day.data.profit;
        tradingDays++;
      }
    });

    return {
      totalProfit,
      tradingDays
    };
  };

  // Calculate monthly stats
  const calculateMonthlyStats = () => {
    const calendar = generateCalendarData();
    let totalProfit = 0;
    let tradingDays = 0;

    calendar.forEach(day => {
      if (day.data) {
        totalProfit += day.data.profit;
        tradingDays++;
      }
    });

    return {
      totalProfit,
      tradingDays
    };
  };

  // Check if a day is today
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();
  };

  const calendarData = generateCalendarData();
  const weeklyStats = generateWeeklyStats();
  const monthlyStats = calculateMonthlyStats();

  return (
    <div className="bg-[#0B1220] border border-[#11B3AE] rounded-xl p-4 shadow-[0_0_16px_rgba(17,179,174,0.3)]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-2">
        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToPreviousMonth}
            className="p-2 text-[#E9D8C8] hover:text-[#11B3AE] transition-colors"
          >
            <Icon icon="mdi:chevron-left" className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold text-white">
            {getMonthName(currentMonth)} {currentYear}
          </h2>

          <button
            onClick={goToNextMonth}
            className="p-2 text-[#E9D8C8] hover:text-[#11B3AE] transition-colors"
          >
            <Icon icon="mdi:chevron-right" className="w-5 h-5" />
          </button>

          <button
            onClick={goToCurrentMonth}
            className="px-3 py-1 bg-[#11B3AE] text-white rounded-lg text-sm hover:bg-[#0F9A95] transition-colors"
          >
            This month
          </button>
        </div>

        {/* Monthly Stats */}
        <div className="flex items-center gap-4">
          <div className="flex flex-row justify-between items-center gap-2 text-right">
            <p className="text-md text-gray-400">Monthly stats:</p>
            <div className="flex flex-row justify-between items-center gap-2">
              <p className={`text-md font-bold ${monthlyStats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${formatNumber(monthlyStats.totalProfit)}
              </p>
              <p className="text-sm text-white">
                {monthlyStats.tradingDays} days
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex items-center gap-2">
            <button className="p-2 text-[#E9D8C8] hover:text-[#11B3AE] transition-colors">
              <Icon icon="mdi:cog" className="w-5 h-5" />
            </button>
            <button className="p-2 text-[#E9D8C8] hover:text-[#11B3AE] transition-colors">
              <Icon icon="mdi:information" className="w-5 h-5" />
            </button>
            <button className="p-2 text-[#E9D8C8] hover:text-[#11B3AE] transition-colors">
              <Icon icon="mdi:bell" className="w-5 h-5" />
            </button>
          </div> */}
        </div>
      </div>

      {/* Calendar and Weekly Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-2">
        {/* Calendar Grid */}
        <div className="lg:col-span-5">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-[#E9D8C8] py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`min-h-[66px] sm:min-h-[75px] p-1 sm:p-2 rounded-lg border ${day.day ? 'border-[#11B3AE] border-opacity-30' : 'border-transparent'
                  } ${day.data ? 'bg-opacity-20' : ''
                  } ${day.data?.isProfitable ? 'bg-green-500' : day.data ? 'bg-red-500' : ''
                  }`}
              >
                {day.day && (
                  <div className="relative">
                    {/* Day Number */}
                    <div className={`text-xs sm:text-sm font-medium mb-[0.125rem] ${isToday(day.day) ? 'text-[#11B3AE]' : 'text-[#E9D8C8]'
                      }`}>
                      {day.day}
                      {isToday(day.day) && (
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </div>

                    {/* Trading Data */}
                    {day.data && (
                      <div className="sm:space-y-[0.125rem]">
                        <div className={`text-[0.5rem] sm:text-[11px] font-bold ${day.data.isProfitable ? 'text-green-400' : 'text-red-400'
                          }`}>
                          ${formatNumber(day.data.profit)}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center 1">
                          <div className="text-[0.5rem] sm:text-[11px] text-[#E9D8C8]">
                            {day.data.trades} trades
                          </div>
                          <div className="text-[0.5rem] sm:text-[11px] text-[#E9D8C8]">
                            {day.data.winRate.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Stats Sidebar */}
        <div className="flex flex-col justify-between items-center lg:col-span-1">
          <h3 className="py-2 text-sm font-semibold text-white">Weekly Stats</h3>
          <div className="space-y-1 w-full">
            {weeklyStats.map((week, index) => (
              <div key={index} className="flex flex-col justify-between min-h-[66px] sm:min-h-[75px] py-3 px-2 bg-[#0B1220] border border-[#11B3AE] rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Week {week.weekNumber}</div>
                <div className="flex flex-row justify-between items-center gap-1">
                  <div className={`text-sm sm:text-md font-bold ${week.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                    ${formatNumber(week.totalProfit)}
                  </div>
                  <div className="text-xs text-[#E9D8C8]">
                    {week.tradingDays} days
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyStats; 