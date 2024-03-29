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
        main: red.A400,
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
              backgroundColor: '#ffffff',
              width: '7px',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: '#00ABE4',
              minHeight: 24,
              border: '1px solid #2b2b2b',
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
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            padding: 0,
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
          root: {
            minWidth: '135px',
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
    },
  }),
)

export default theme
