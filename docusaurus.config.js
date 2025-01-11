// docusaurus.config.js
const config = {
  title: 'Weather Dashboard',
  tagline: 'Weather data visualization',
  url: 'https://your-domain.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'your-github-username',
  projectName: 'weather-dashboard',

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
