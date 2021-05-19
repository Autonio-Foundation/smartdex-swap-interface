import { ThemeModalStyle } from './types'

export const modalTheme: ThemeModalStyle = {
  content: {
    backgroundColor: '#1a1f28',
    borderColor: '#000',
    bottom: 'auto',
    display: 'flex',
    flexGrow: 0,
    left: 'auto',
    maxHeight: '90%',
    minWidth: '350px',
    marginTop: '-200px',
    overflow: 'hidden',
    padding: '16px',
    // position: 'relative',
    right: 'auto',
    top: 'auto',
    borderRadius: '30px'
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 12345
  }
}
