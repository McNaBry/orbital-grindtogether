module.exports = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.module.rules.push({
          test: /\.(ts|tsx)$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript'],
          },
        });
      }
  
      return config;
    },
  };