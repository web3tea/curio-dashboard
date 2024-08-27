import { ThemeTypes } from '@/types/themeTypes/ThemeType'

const DarkTheme: ThemeTypes = {
  name: 'DarkTheme',
  dark: true,
  variables: {
    'border-color': '#595959',
    gradient: 'linear-gradient(250.38deg, #111a2c 2.39%, #15417e 34.42%, #1668dc 60.95%, #3c89e8 84.83%, #8dc5f8 104.37%)',
    'card-shadow': '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.20)',
  },
  colors: {
    primary: '#1668dc',
    secondary: '#d9d9d9',
    info: '#13a8a8',
    success: '#49aa19',
    accent: '#fc4b6c',
    warning: '#d89614',
    error: '#a61d24',
    lightprimary: '#111a2c',
    lightsecondary: '#343131',
    lightsuccess: '#162312',
    lighterror: '#2a1215',
    lightwarning: '#2b2111',
    darkprimary: '#0c4dab',
    darksecondary: '#8c8c8c',
    darkText: '#e0e0e0',
    lightText: '#7d7d7d',
    borderLight: '#292929',
    inputBorder: '#595959',
    containerBg: '#121212',
    surface: '#1e1e1e',
    background: '#1e1e1e',
    'on-surface-variant': '#1e1e1e',
    'surface-light': '#1e1e1e',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#141414',
    primary200: '#8dc5f8',
    secondary200: '#bdbdbd',
  },
}

export { DarkTheme }
