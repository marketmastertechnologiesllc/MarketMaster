import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import EmailAlertsTable from '../../components/Tables/EmailAlertsTable';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(17, 179, 174, 0.3)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(17, 179, 174, 0.5)',
  },
  '&:focus-within': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid #11B3AE',
    boxShadow: '0 0 0 2px rgba(17, 179, 174, 0.2)',
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#E9D8C8',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#E9D8C8',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#E9D8C8',
    opacity: 0.7,
  },
}));

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

function EmailAlerts() {
  return (
    <div className="w-auto text-[#E9D8C8] pb-[100px]">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={{ xs: 2, sm: 1 }}
        display={'flex'}
        justifyContent={'space-between'}
        sx={{ gap: { xs: 2, sm: 1 } }}
      >
        <div className="flex gap-2 justify-center sm:justify-start">
          <StyledButton
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: '#11B3AE',
              textTransform: 'none',
              color: '#FFFFFF',
              fontWeight: 500,
              padding: { xs: '4px 8px', sm: '8px 12px' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              border: '1px solid #11B3AE',
              borderRadius: '8px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#0F9A95',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(17, 179, 174, 0.3)',
              },
            }}
          >
            Add Alert
          </StyledButton>
        </div>
        <div className="flex gap-2 justify-center sm:justify-end">
          <StyledButton
            variant="contained"
            size="small"
            sx={{
              textTransform: 'none',
              backgroundColor: '#fa5252',
              color: '#FFFFFF',
              fontWeight: 500,
              padding: { xs: '4px 8px', sm: '8px 12px' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              borderRadius: '8px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#e03131',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(250, 82, 82, 0.3)',
              },
            }}
          >
            Delete All
          </StyledButton>
        </div>
      </Stack>
      <div className="mt-4 text-[#E9D8C8] bg-[#0B1220] p-3 sm:p-6 rounded-xl border border-[#11B3AE] shadow-[0_0_16px_rgba(17,179,174,0.5)] pb-[20px]">
        <div className="flex justify-end w-full pb-4">
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </div>
        <EmailAlertsTable />
      </div>
    </div>
  );
}

export default EmailAlerts;
