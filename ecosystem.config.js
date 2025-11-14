module.exports = {
  apps: [
    {
      name: "quickair-strapi",
      cwd: "/var/www/quickair/apps/strapi",
      script: "./node_modules/.bin/strapi",
      args: "start",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "/var/www/quickair/logs/strapi-error.log",
      out_file: "/var/www/quickair/logs/strapi-out.log",
      time: true,
    },
    {
      name: "quickair-frontend",
      cwd: "/var/www/quickair/apps/frontend",
      script: "./node_modules/.bin/next",
      args: "start",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "/var/www/quickair/logs/frontend-error.log",
      out_file: "/var/www/quickair/logs/frontend-out.log",
      time: true,
    },
  ],
};
