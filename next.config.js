/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: config => {
      config.resolve.fallback = { fs: false, net: false, tls: false };
      return config;
    },
    i18n: {
      locales: ['en-US', 'zh-CN'],
      defaultLocale: 'en-US',
      localeDetection: true,
    },
    images: {
      domains: ['gold-thorough-bobolink-856.mypinata.cloud', 'bafybeidpovsjaqre7dc7jpgaz2xldr7vqmguyzqx75mnebymrhsgi4eaeq.ipfs.w3s.link']
    },
  };

module.exports = nextConfig
