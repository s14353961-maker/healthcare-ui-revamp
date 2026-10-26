import type { Preview } from '@storybook/react';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '../src/styles/global.scss';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    backgrounds: { default: 'app', values: [{ name: 'app', value: '#f4f6f8' }, { name: 'surface', value: '#ffffff' }] },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile (390)', styles: { width: '390px', height: '844px' } },
        tablet: { name: 'Tablet (834)', styles: { width: '834px', height: '1112px' } },
        desktop: { name: 'Desktop (1440)', styles: { width: '1440px', height: '900px' } },
      },
    },
  },
};
export default preview;
