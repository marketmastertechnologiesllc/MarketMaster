import { lazy } from 'react';
import AuthGuard from '../utils/AuthGuard';
import Loadable from '../third-party/Loadable';
import EditUser from '../pages/Whitelabel/WhitelabelUsers/EditUser';

const DefaultLayout = Loadable(lazy(() => import('../layouts/DefaultLayout')));
const Dashboard = Loadable(lazy(() => import('../pages/Dashboard')));
const Strategies = Loadable(lazy(() => import('../pages/Strategies')));
const Accounts = Loadable(lazy(() => import('../pages/Configurator/Accounts')));
const AddAccount = Loadable(
  lazy(() => import('../pages/Configurator/Accounts/AddAccount'))
);
const EditAccount = Loadable(
  lazy(() => import('../pages/Configurator/Accounts/EditAccount'))
);
const TradeCopier = Loadable(
  lazy(() => import('../pages/Configurator/TradeCopier'))
);
const CreateNewTradeCopier = Loadable(
  lazy(() => import('../pages/Configurator/TradeCopier/CreateNewTradeCopier'))
);
const EditTradeCopier = Loadable(
  lazy(() => import('../pages/Configurator/TradeCopier/EditTradeCopier'))
);
const EquityMonitors = Loadable(
  lazy(() => import('../pages/Configurator/EquityMonitors'))
);
const EmailAlerts = Loadable(
  lazy(() => import('../pages/Configurator/EmailAlerts'))
);
const Analysis = Loadable(lazy(() => import('../pages/Analysis')));
const AccountAnalysis = Loadable(
  lazy(() => import('../pages/Analysis/AccountAnalysis'))
);
const PerformanceChartPage = Loadable(
  lazy(() => import('../pages/Analysis/PerformanceChartPage'))
);
const TradingStatsPage = Loadable(
  lazy(() => import('../pages/Analysis/TradingStatsPage'))
);
const TimeAnalysisPage = Loadable(
  lazy(() => import('../pages/Analysis/TimeAnalysisPage'))
);
const StrategyFollowers = Loadable(
  lazy(() => import('../pages/StrategyFollowers'))
);
const AddFollower = Loadable(
  lazy(() => import('../pages/Whitelabel/StrategyFollowers/AddFollower'))
);
const FollowerDetails = Loadable(
  lazy(() => import('../pages/Whitelabel/StrategyFollowers/FollowerDetails'))
);
const StrategyProvider = Loadable(lazy(() => import('../pages/Whitelabel/StrategyProvider')));
const ConfigurePaymentProcessor = Loadable(
  lazy(() => import('../pages/Whitelabel/StrategyProvider/ConfigurePaymentProcessor'))
);
const CreateStrategyProvider = Loadable(
  lazy(() => import('../pages/Whitelabel/StrategyProvider/CreateStrategyProvider'))
);
const FollowerTerms = Loadable(
  lazy(() => import('../pages/Whitelabel/StrategyProvider/FollowerTerms'))
);
const EditStrategyProvider = Loadable(
  lazy(() => import('../pages/Whitelabel/StrategyProvider/EditStrategyProvider'))
);
const WhitelabelDashboard = Loadable(
  lazy(() => import('../pages/Whitelabel/WhitelabelDashboard'))
);
const WhitelabelUsers = Loadable(
  lazy(() => import('../pages/Whitelabel/WhitelabelUsers'))
);
const WhitelabelHomepage = Loadable(
  lazy(() => import('../pages/Whitelabel/WhitelabelHomepage'))
);
const WhitelabelSettings = Loadable(
  lazy(() => import('../pages/Whitelabel/WhitelabelSettings'))
);
const KnowledgeBase = Loadable(
  lazy(() => import('../pages/HelpCenter/KnowledgeBase'))
);
const ContactSupport = Loadable(
  lazy(() => import('../pages/HelpCenter/ContactSupport'))
);
const Profile = Loadable(lazy(() => import('../pages/Profile')));
const EmailVerificationPageForUpdate = Loadable(
  lazy(() =>
    import('../pages/EmailVerification/EmailVerificationPageForUpdate')
  )
);
const EmailVerifyUpdate = Loadable(
  lazy(() => import('../pages/EmailVerification/EmailVerifyUpdate'))
);
const AuthView = Loadable(lazy(() => import('../pages/Maintenance/AuthView')));

const AddUser = Loadable(
  lazy(() => import('../pages/Whitelabel/WhitelabelUsers/AddUser'))
);

const coreRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <DefaultLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/view/:id',
      element: <AuthView />,
    },
    {
      path: '/dashboard',
      title: 'Dashboard',
      element: <Dashboard />,
    },
    {
      path: '/accounts',
      title: 'Accounts',
      element: <Accounts />,
    },
    {
      path: '/accounts/add-account',
      title: 'Add Account',
      element: <AddAccount />,
    },
    {
      path: '/accounts/edit/:id',
      title: 'Manage Account',
      element: <EditAccount />,
    },
    {
      path: '/analysis',
      title: 'Analysis',
      element: <Analysis />,
    },
    {
      path: '/strategy-followers',
      title: 'Strategy Followers',
      element: <StrategyFollowers />,
    },
    {
      path: '/strategy-followers/add',
      title: 'Add Strategy Follower',
      element: <AddFollower />,
    },
    {
      path: '/strategy-followers/details/:followerId',
      title: 'Follower Details',
      element: <FollowerDetails />,
    },
    {
      path: '/strategy-provider',
      title: 'Strategy Provider',
      element: <StrategyProvider />,
    },
    {
      path: '/strategy-provider/create',
      title: 'Create Strategy Provider',
      element: <CreateStrategyProvider />,
    },
    {
      path: '/strategy-provider/edit/:strategyId',
      title: 'Manage Strategy Provider',
      element: <EditStrategyProvider />,
    },
    {
      path: '/strategy-provider/follower-terms/:strategyId',
      title: 'Manage Strategy Provider',
      element: <FollowerTerms />,
    },
    {
      path: '/strategy-provider/configure-payment-processor',
      title: 'Configure Payment Processor',
      element: <ConfigurePaymentProcessor />,
    },
    {
      path: '/contact-support',
      title: 'Support',
      element: <ContactSupport />,
    },
    {
      path: '/email-alerts',
      title: 'Email Alerts',
      element: <EmailAlerts />,
    },
    {
      path: '/equity-monitors',
      title: 'Equity Monitors',
      element: <EquityMonitors />,
    },
    {
      path: '/knowledge-base',
      title: 'Knowledge Base',
      element: <KnowledgeBase />,
    },
    {
      path: '/strategies',
      title: 'Strategies',
      element: <Strategies />,
    },
    {
      path: '/connect-strategy',
      title: 'Copiers',
      element: <TradeCopier />,
    },
    {
      path: '/connect-strategy/new-connect-strategy',
      title: 'Connect Strategy',
      element: <CreateNewTradeCopier />,
    },
    {
      path: '/connect-strategy/edit/:subscriberId/:strategyId',
      title: 'Manage Copier',
      element: <EditTradeCopier />,
    },
    {
      path: '/analysis/analysis-account/:id',
      title: 'Account Analysis',
      element: <AccountAnalysis />,
    },
    {
      path: '/analysis/performance-chart/:accountId',
      title: 'Performance Chart',
      element: <PerformanceChartPage />,
    },
    {
      path: '/analysis/trading-stats/:accountId',
      title: 'Trading Statistics',
      element: <TradingStatsPage />,
    },
    {
      path: '/analysis/time-analysis/:id',
      title: 'Time Analysis',
      element: <TimeAnalysisPage />,
    },
    {
      path: '/profile',
      title: 'Profile',
      element: <Profile />,
    },
    {
      path: '/email-verification-page-for-update',
      element: <EmailVerificationPageForUpdate />,
    },
    {
      path: '/email-verify-update/:token',
      element: <EmailVerifyUpdate />,
    },
    {
      path: '/whitelabel/dashboard',
      title: 'Whitelabel',
      element: <WhitelabelDashboard />,
    },
    {
      path: '/whitelabel/users',
      title: 'Whitelabel Users',
      element: <WhitelabelUsers />,
    },
    {
      path: '/whitelabel/users/edit/:id',
      title: 'Profile',
      element: <EditUser />,
    },
    {
      path: '/whitelabel/homepage',
      element: <WhitelabelHomepage />,
    },
    {
      path: '/whitelabel/settings',
      element: <WhitelabelSettings />,
    },
    {
      path: '/whitelabel/users/add-user',
      element: <AddUser />,
    },
  ],
};

export default coreRoutes;

// export default function CoreRoutes() {
//   return useRoutes([coreRoutes]);
// }
