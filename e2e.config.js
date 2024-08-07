const config = {
    timeout: 60000,
    retries: 1,
    testDir: 'e2e-pd/tests/e2e',
    use: {
        trace: 'on-first-retry',
        headless: true,
        viewport: { width: 1440, height: 900 },
        actionTimeout: 15000,
        ignoreHTTPSErrors: true,
        video: 'retain-on-failure',
        screenshot: 'only-on-failure'
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