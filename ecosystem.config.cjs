module.exports = {
    apps: [
        {
            name: "estate-api",
            script: "./server/index.js",
            cwd: "/home/ubuntu/interactive-estate-map",
            instances: 1,
            exec_mode: "fork",

            env: {
                NODE_ENV: "production",
                PORT: 3001,
            },

            autorestart: true,
            watch: false,
            max_memory_restart: "100M",

            error_file: "/var/log/estate-api-error.log",
            out_file: "/var/log/estate-api-out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss",
        },
    ],
};

