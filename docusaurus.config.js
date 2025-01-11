// docusaurus.config.js
const config = {
  title: 'Weather Dashboard',
  tagline: 'Weather data visualization',
  url: 'https://parmar-h.github.io/weather/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'parmar-h',
  projectName: 'weather',

  themeConfig: {
    navbar: {
      title: 'Weather Dashboard',
      
    },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

module.exports = config;
