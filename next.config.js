const { i18n } = require('./next-i18next.config');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
module.exports = withPWA({
  images: {
    domains: [
      'images.unsplash.com',
      'www.slazzer.com',
      '192.168.10.101',
      '192.168.10.66',
      '192.168.10.67',
      'cakeghaar.herokuapp.com',
      'cakegharbackend.swadeshnepali.com',
    ],
  },
  reactStrictMode: true,
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    runtimeCaching,
  },
  i18n,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});
