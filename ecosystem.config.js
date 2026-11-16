module.exports = {
  apps: [{
    name: 'aishu-pro',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '400M',
    env: { NODE_ENV: 'production' }
  }]
};
