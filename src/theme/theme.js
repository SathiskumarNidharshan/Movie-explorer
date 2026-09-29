import { createTheme, alpha } from '@mui/material/styles';

/**
 * Breakpoints
 * xs  0      mobile phones
 * sm  600    large phones / small tablets
 * md  900    tablets
 * lg  1200   laptops
 * xl  1536   desktops
 * xxl 1920   large monitors
 */
const shared = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 1920,
    },
  },
  typography: {
    fontFamily: '"Figtree", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Syne", "Figtree", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.03em',
      fontSize: 'clamp(1.9rem, 4vw, 3.4rem)',
    },
    h2: {
      fontFamily: '"Syne", "Figtree", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontSize: 'clamp(1.6rem, 3.2vw, 2.8rem)',
    },
    h3: {
      fontFamily: '"Syne", "Figtree", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontSize: 'clamp(1.4rem, 2.6vw, 2.2rem)',
    },
    h4: {
      fontFamily: '"Syne", "Figtree", sans-serif',
      fontWeight: 700,
      fontSize: 'clamp(1.2rem, 2vw, 1.75rem)',
    },
    h5: {
      fontFamily: '"Syne", "Figtree", sans-serif',
      fontWeight: 700,
      fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)',
    },
    h6: {
      fontFamily: '"Syne", "Figtree", sans-serif',
      fontWeight: 700,
    },
    button: {
      fontFamily: '"Figtree", sans-serif',
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },
  shape: { borderRadius: 14 },
};

export const getDesignTokens = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    ...shared,
    palette: {
      mode,
      primary: {
        main: isDark ? '#F5A524' : '#C97800',
        contrastText: isDark ? '#120E05' : '#FFFFFF',
      },
      secondary: {
        main: isDark ? '#2DD4BF' : '#0D9488',
      },
      background: {
        default: isDark ? '#080A0D' : '#F3F0EA',
        paper: isDark ? '#12151C' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F4F1EA' : '#17140F',
        secondary: isDark ? '#A8A29A' : '#5C564C',
      },
      divider: isDark ? alpha('#F4F1EA', 0.08) : alpha('#17140F', 0.08),
      success: { main: '#22C55E' },
      error: { main: '#EF4444' },
      warning: { main: '#F5A524' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            WebkitTextSizeAdjust: '100%',
          },
          body: {
            margin: 0,
            overflowX: 'hidden',
            backgroundImage: isDark
              ? `radial-gradient(ellipse 80% 50% at 20% -10%, ${alpha('#F5A524', 0.12)}, transparent),
                 radial-gradient(ellipse 60% 40% at 90% 10%, ${alpha('#2DD4BF', 0.08)}, transparent),
                 linear-gradient(180deg, #080A0D 0%, #0C1017 100%)`
              : `radial-gradient(ellipse 80% 50% at 15% -10%, ${alpha('#C97800', 0.12)}, transparent),
                 radial-gradient(ellipse 50% 40% at 95% 5%, ${alpha('#0D9488', 0.08)}, transparent),
                 linear-gradient(180deg, #F7F4EE 0%, #EDE8DF 100%)`,
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            '@supports (min-height: 100dvh)': {
              minHeight: '100dvh',
            },
          },
          '::selection': {
            background: alpha(isDark ? '#F5A524' : '#C97800', 0.35),
          },
          img: {
            maxWidth: '100%',
            height: 'auto',
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: ({ theme }) => ({
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
              paddingLeft: theme.spacing(3),
              paddingRight: theme.spacing(3),
            },
            [theme.breakpoints.up('lg')]: {
              paddingLeft: theme.spacing(4),
              paddingRight: theme.spacing(4),
            },
            [theme.breakpoints.up('xxl')]: {
              paddingLeft: theme.spacing(5),
              paddingRight: theme.spacing(5),
            },
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingInline: 20,
            paddingBlock: 10,
            boxShadow: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              boxShadow: 'none',
              transform: 'translateY(-1px)',
            },
          },
          containedPrimary: {
            background: isDark
              ? 'linear-gradient(135deg, #F5A524 0%, #E08912 100%)'
              : 'linear-gradient(135deg, #D98912 0%, #B86A00 100%)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(16px)',
            backgroundColor: isDark
              ? alpha('#080A0D', 0.75)
              : alpha('#F7F4EE', 0.8),
            borderBottom: `1px solid ${
              isDark ? alpha('#F4F1EA', 0.08) : alpha('#17140F', 0.08)
            }`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: isDark
              ? alpha('#FFFFFF', 0.03)
              : alpha('#FFFFFF', 0.7),
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: 56,
            '@media (min-width:600px)': {
              minHeight: 64,
            },
          },
        },
      },
    },
  });
};
