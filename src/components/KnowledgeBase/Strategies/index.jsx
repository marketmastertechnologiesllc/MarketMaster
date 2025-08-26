import * as React from 'react';
import { Icon } from '@iconify/react';

function StrategiesOverview() {
  return (
    <React.Fragment>
      <p className="py-2.5 text-[13px]">
        From the strategy page, you can view any strategies you are following.
        Strategies are accounts you have either signed up to follow via a strategy
        page or another user has granted you access to the account.
      </p>
      <h4 className="my-2.5 text-[18px] text-white">My Strategies</h4>
      <p className="py-2.5 text-[13px]">
        Each strategy shows the provider of the strategy, access rights, access
        terms and expiry date (if applicable).
      </p>
      <p className="py-2.5 text-[13px]">
        A strategy will have specific access rights. The rights can be:
      </p>
      <ul className="mb-0 pl-[8px] text-[13px]">
        <li className="flex flex-row justify-start items-center gap-1">
          <Icon
            icon="icon-park-outline:dot"
            width="12"
            height="12"
            className="inline-block"
          />
          <p>
            <strong>No rights</strong> - only see the account stats and trades
          </p>
        </li>
        <li className="flex flex-row justify-start items-center gap-1">
          <Icon
            icon="icon-park-outline:dot"
            width="12"
            height="12"
            className="inline-block"
          />
          <p>
            <strong>Email Alerts</strong> - set up email alerts for trading
            events on the account only
          </p>
        </li>
        <li className="flex flex-row justify-start items-center gap-1">
          <Icon
            icon="icon-park-outline:dot"
            width="12"
            height="12"
            className="inline-block"
          />
          <p>
            <strong>Trade Copier</strong> - set up a trade copier to copy trades
            from the account only
          </p>
        </li>
        <li className="flex flex-row justify-start items-center gap-1">
          <Icon
            icon="icon-park-outline:dot"
            width="12"
            height="12"
            className="inline-block"
          />
          <p>
            <strong>Email Alerts & Trade Copier</strong> - set up email alerts
            and trader copiers
          </p>
        </li>
      </ul>
      <p className="py-2.5 text-[13px]">
        Depending on the specific rights you have you can configure Trade Alerts
        and/or Trade Copiers in the <strong>configurator</strong> section.
      </p>
      <p className="py-2.5 text-[13px]">
        The access terms show if a strategy requires a payment to maintain access.
      </p>
      <h4 className="my-2.5 text-[18px] text-white">Manage Strategies</h4>
      <p className="py-2.5 text-[13px]">
        For a more detailed view of a particular strategy, click{' '}
        <strong>manage strategy</strong> on any strategy.
      </p>
      <h4 className="my-2.5 text-[18px] text-white">Renewals</h4>
      <p className="py-2.5 text-[13px]">
        Strategy access can be paid for access. You can manage related
        payments/renewals by clicking <strong>manage renewals</strong>.
      </p>
      <h4 className="my-2.5 text-[18px] text-white">Deleting Strategies</h4>
      <p className="py-2.5 text-[13px]">
        If you no longer wish to follow a strategy you can remove it by clicking
        the <strong>red trash can</strong>.
      </p>
    </React.Fragment>
  );
}

export default StrategiesOverview;
