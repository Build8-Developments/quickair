module.exports = {
  apps: [
    {
      name: "quickair-strapi",
      cwd: "/var/www/quickair/apps/strapi",
      script: "npm",
      args: "run start",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        ADMIN_URL: "https://quickair-admin.build8.dev/admin",
        ALLOWED_HOSTS: "quickair-admin.build8.dev,localhost,127.0.0.1",
        VITE_HMR: "false",
        PATH: "/root/.nvm/versions/node/v22.21.1/bin:" + process.env.PATH,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: 3221225472,
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 4000,
      error_file: "/var/www/quickair/logs/strapi-error.log",
      out_file: "/var/www/quickair/logs/strapi-out.log",
      log_file: "/var/www/quickair/logs/strapi-combined.log",
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm Z",
      merge_logs: true,
      kill_timeout: 5000,
      listen_timeout: 8000,
      // Performance optimizations
      node_args: "--max-old-space-size=3072 --optimize-for-size",
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
    },
    {
      name: "quickair-frontend",
      cwd: "/var/www/quickair/apps/frontend",
      script: "npm",
      args: "run start",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_STRAPI_URL: "https://quickair-admin.build8.dev",
        NEXT_PUBLIC_SITE_URL: "https://quickair.build8.dev",
        PATH: "/root/.nvm/versions/node/v22.21.1/bin:" + process.env.PATH,
      },
      // Use cluster mode for better performance (adjust based on CPU cores)
      instances: 1, // Single instance
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: 1610612736,
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 4000,
      error_file: "/var/www/quickair/logs/frontend-error.log",
      out_file: "/var/www/quickair/logs/frontend-out.log",
      log_file: "/var/www/quickair/logs/frontend-combined.log",
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm Z",
      merge_logs: true,
      kill_timeout: 5000,
      listen_timeout: 8000,
      // Performance optimizations
      node_args: "--max-old-space-size=1536 --optimize-for-size",
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      // Load balancing for cluster mode
      instance_var: "INSTANCE_ID",
    },
  ],

  // Global PM2 settings
  deploy: {
    production: {
      user: "root",
      host: ["your-server-ip"],
      ref: "origin/main",
      repo: "your-git-repo",
      path: "/var/www/quickair",
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --env production && pm2 save",
    },
  },
};
