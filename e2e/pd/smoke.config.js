const config = {
    timeout: 60000,
    retries: 0,
    testDir: 'tests/e2e',
    use: {
        headless: true,
        viewport: { width: 1440, height: 900 },
        actionTimeout: 15000,
        ignoreHTTPSErrors: true,
        video: 'off',
        screenshot: 'off'
    },
    projects: [
        {
            name: 'Chromium',
            use: { browserName: 'chromium' }
        },
        {
            name: 'Firefox',
            use: { browserName: 'firefox' }
        },
        {
            name: 'Safari',
            use: { browserName: 'webkit' }
        }
    ]
};

export default config;