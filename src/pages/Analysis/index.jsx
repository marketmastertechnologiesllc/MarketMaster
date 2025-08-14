import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Icon } from '@iconify/react';

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

function Analysis() {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = React.useState('TradersNetworkClub (254738)');

  const handleAnalyseAccount = () => {
    // Navigate to account analysis page with the selected account
    navigate('/analysis/account/254738');
  };

  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      <div className="w-auto text-[#E9D8C8] grid grid-cols-12 gap-8">
        <div className="col-span-6">
          <section className="mb-[20px] rounded-xl bg-[#0B1220] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">
                Account Statistics
              </h2>
            </header>
            <div className="p-[15px] bg-[#0B1220]">
              <label className="text-[#E9D8C8] max-w-full inline-block mb-[5px] text-[13px] font-medium">
                Choose account
              </label>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
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
                  <MenuItem value="TradersNetworkClub (254738)">TradersNetworkClub (254738)</MenuItem>
                  <MenuItem value="Demo Account (123456)">Demo Account (123456)</MenuItem>
                  <MenuItem value="Live Account (789012)">Live Account (789012)</MenuItem>
                </Select>
              </FormControl>
            </div>
            <footer className="px-[15px] py-[10px] border-t border-[#11B3AE] border-opacity-20">
              <div className="flex justify-end">
                <StyledButton
                  variant="contained"
                  size="small"
                  onClick={handleAnalyseAccount}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#11B3AE!important',
                    color: '#FFFFFF!important',
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#0F9A95!important',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                    },
                  }}
                >
                  Analyse Account
                </StyledButton>
              </div>
            </footer>
          </section>
          
          <section className="mb-[20px] rounded-xl bg-[#0B1220] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">
                Performance Overview
              </h2>
            </header>
            <div className="p-[15px] bg-[#0B1220]">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0B1220] border border-[#11B3AE] border-opacity-30 rounded-lg p-4">
                  <Typography sx={{ color: '#E9D8C8', fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>
                    Win Rate
                  </Typography>
                  <Typography sx={{ color: '#11B3AE', fontSize: '1.5rem', fontWeight: 700 }}>
                    83.33%
                  </Typography>
                </div>
                <div className="bg-[#0B1220] border border-[#11B3AE] border-opacity-30 rounded-lg p-4">
                  <Typography sx={{ color: '#E9D8C8', fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>
                    Profit Factor
                  </Typography>
                  <Typography sx={{ color: '#11B3AE', fontSize: '1.5rem', fontWeight: 700 }}>
                    0.90
                  </Typography>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <div className="col-span-6">
          <section className="mb-[20px] rounded-xl bg-[#0B1220] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">
                Quick Actions
              </h2>
            </header>
            <div className="p-[15px] bg-[#0B1220]">
              <div className="space-y-3">
                <StyledButton
                  variant="contained"
                  fullWidth
                  startIcon={<Icon icon="mdi:chart-line" />}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#11B3AE!important',
                    color: '#FFFFFF!important',
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#0F9A95!important',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
                    },
                  }}
                >
                  View Performance Charts
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:table" />}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#11B3AE!important',
                    color: '#11B3AE!important',
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(17, 179, 174, 0.1)!important',
                      borderColor: '#0F9A95!important',
                      color: '#0F9A95!important',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(17, 179, 174, 0.2)',
                    },
                  }}
                >
                  Trading Statistics
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:clock-outline" />}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#11B3AE!important',
                    color: '#11B3AE!important',
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(17, 179, 174, 0.1)!important',
                      borderColor: '#0F9A95!important',
                      color: '#0F9A95!important',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(17, 179, 174, 0.2)',
                    },
                  }}
                >
                  Time Analysis
                </StyledButton>
              </div>
            </div>
          </section>
          
          <section className="mb-[20px] rounded-xl bg-[#0B1220] border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.3)]">
            <header className="p-[18px] border-b border-[#11B3AE] border-opacity-20">
              <h2 className="mt-[5px] text-[20px] font-normal text-[#E9D8C8]">
                Recent Activity
              </h2>
            </header>
            <div className="p-[15px] bg-[#0B1220]">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#0B1220] border border-[#11B3AE] border-opacity-20 rounded-lg">
                  <div>
                    <Typography sx={{ color: '#E9D8C8', fontSize: '0.875rem', fontWeight: 500 }}>
                      Last Trade
                    </Typography>
                    <Typography sx={{ color: '#11B3AE', fontSize: '0.75rem' }}>
                      2 hours ago
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Typography sx={{ color: '#47A447', fontSize: '0.875rem', fontWeight: 600 }}>
                      +$94.24
                    </Typography>
                    <Typography sx={{ color: '#E9D8C8', fontSize: '0.75rem' }}>
                      NQ
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0B1220] border border-[#11B3AE] border-opacity-20 rounded-lg">
                  <div>
                    <Typography sx={{ color: '#E9D8C8', fontSize: '0.875rem', fontWeight: 500 }}>
                      Account Update
                    </Typography>
                    <Typography sx={{ color: '#11B3AE', fontSize: '0.75rem' }}>
                      1 day ago
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Typography sx={{ color: '#E9D8C8', fontSize: '0.875rem', fontWeight: 600 }}>
                      Balance Updated
                    </Typography>
                    <Typography sx={{ color: '#E9D8C8', fontSize: '0.75rem' }}>
                      $1,052,675.26
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
