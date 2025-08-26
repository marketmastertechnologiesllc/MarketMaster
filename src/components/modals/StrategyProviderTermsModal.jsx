import * as React from 'react';
import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';

function StrategyProviderTermsModal({
  strategyProviderTermsModalShow,
  handleCreateStrategyProviderModalButtonClicked,
  isLoading,
}) {
  const [checkboxSelected, setCheckboxSelected] = React.useState(false);

  return (
    <div className="fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1201]">
      <div
        className="fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1202] bg-opacity-80 bg-[#1D2127]"
        onClick={() => strategyProviderTermsModalShow(false)}
      ></div>
      <section className="mb-[20px] rounded bg-[#282D36] w-[500px] z-[100000]">
        <header className="p-[18px] text-white flex justify-between items-center">
          <h2 className="mt-[5px] text-[20px] font-normal">
            Strategy provider terms
          </h2>
          <button
            className="bg-[#0099e6] w-[33px] h-[33px] rounded font-extrabold"
            onClick={() => strategyProviderTermsModalShow(false)}
          >
            ✖
          </button>
        </header>
        <div className="p-[15px] bg-[#2E353E] text-white">
          <p className="pb-[10px] text-sm text-[#ccc]">
            If you decide to sell or share any strategy, you should be aware that
            this is considered a regulated activity in some jurisdictions, and
            you represent and warrant that you are appropriately authorised in
            the relevant jurisdictions and sharing the strategy will not violate
            any applicable law or regulation.
          </p>
          <label className="flex gap-2 justify-center items-center mb-[25px]">
            <input
              type="checkbox"
              onChange={(e) => setCheckboxSelected(e.target.checked)}
            />
            <span className="text-[13px] text-[#ccc]">
              I accept the terms above.
            </span>
          </label>
        </div>
        <footer className="px-4 py-3 text-white flex justify-end items-center">
          <LoadingButton
            variant="contained"
            size="small"
            sx={{
              textTransform: 'none',
              color: '#ffffff!important',
              backgroundColor: '#0088cc',
              borderRadius: '5px',
              paddingX: '12px',
              paddingY: '6px',
              '&:hover': { backgroundColor: '#0088cc!important' },
              '&:disabled': {
                opacity: 0.5,
                backgroundColor: '#0088cc!important',
              },
            }}
            onClick={handleCreateStrategyProviderModalButtonClicked}
            loading={isLoading}
            disabled={!checkboxSelected}
          >
            Create strategy page
          </LoadingButton>
        </footer>
      </section>
    </div>
  );
}

StrategyProviderTermsModal.propTypes = {
  strategyProviderTermsModalShow: PropTypes.func.isRequired,
  handleCreateStrategyProviderButtonClicked: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default StrategyProviderTermsModal;
