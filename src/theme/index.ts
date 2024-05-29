import { createTheme, responsiveFontSizes } from '@mui/material'
import { red } from '@mui/material/colors'

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: '#0077B6',
        contrastText: '#fff',
      },
      secondary: {
        main: '#E9F1FA',
        contrastText: '#fff',
      },
      error: {
        main: '#ff4c51',
        light: '#ff4c51',
        contrastText: '#fff',
      },
      success: {
        main: '#56ca00',
        light: '#56ca00',
        contrastText: '#fff',
      },
      warning: {
        main: '#ffb400',
        light: '#ffb400',
        contrastText: '#fff',
      },
    },
    typography: {
      fontFamily: 'Roboto',
      h3: {
        fontSize: 30,
        fontWeight: 600,
      },
      h4: {
        fontSize: 20,
        fontWeight: 600,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: '#6b6b6b',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              backgroundColor: '#fff',
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: '#e2e2e2',
              minHeight: 24,
            },
            '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
              {
                backgroundColor: '#959595',
              },
            '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
              {
                backgroundColor: '#959595',
              },
            '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
              {
                backgroundColor: '#959595',
              },
            '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
              backgroundColor: '#2b2b2b',
            },
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            width: '100%',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {},
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            minWidth: '90px',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          root: {
            height: '500px',
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            '&:focus': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            zIndex: 1050,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            minWidth: 110,
          },
        },
      },
    },
  }),
)

export default theme
