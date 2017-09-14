import { ThemeInterface } from './theme';

/**
 *  Light Theme is the default theme used in material-ui. It is guaranteed to
 *  have all theme variables needed for every component. Variables not defined
 *  in a custom theme will default to these values.
 */
export default {
  primaryColor: '',
  primaryColorInverted: '',

  primary100: { color: '#fff', background: '#B64545' },
  primary200: { color: '#fff', background: '#CC7A7A', border: '#AD7C7C' },

  secondary100: { color: '#fff', background: '#716E8A' },
  secondary200: { color: '#fff', background: '#8885A7' },

  light100: { color: '#333', background: '#fff', border: '#ddd' },
  light200: { color: '#333', background: '#E7E7E7', border: '#ddd' },

  spacing: {
    iconSize: 24,
    desktopGutter: 24,
    desktopGutterMore: 32,
    desktopGutterLess: 16,
    desktopGutterMini: 8,
    desktopKeylineIncrement: 64,
    desktopDropDownMenuItemHeight: 32,
    desktopDropDownMenuFontSize: 15,
    desktopDrawerMenuItemHeight: 48,
    desktopSubheaderHeight: 48,
    desktopToolbarHeight: 56,
  },
  fontFamily: 'Roboto, sans-serif',
  borderRadius: 2,
  palette: {
    primary1Color: '#716E8A',
    primary2Color: '#0288D1',
    primary3Color: '#BDBDBD',
    accent1Color: '#FF4081',
    accent2Color: '#F5F5F5',
    accent3Color: '#9E9E9E',
    textColor: '#000',
    secondaryTextColor: 'rgba(0,0,0,0.54)',
    alternateTextColor: '#fff',
    canvasColor: '#fff',
    borderColor: '#E0E0E0',
    disabledColor: 'rgba(0,0,0,0.3)',
    pickerHeaderColor: '#0D47A1',
    clockCircleColor: 'rgba(0,0,0,0.3)',
    shadowColor: '#000'
  },

} as ThemeInterface;