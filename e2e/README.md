-- HOW TO START THE PROJECT --

Install Playwright with dependencies:
- go to test dir:       cd e2e/pd
- install dependencies: npm install
- install playwright:   npx playwright install

Variables:
- change .env.example -> .env
- fill in variables values

Update gmail-tester token:
- need to be updated one time a week
- go to test dir: cd e2e/pd
- add file 'gmail-credentials.json' with gmail test account credentials
- run command: node node_modules/gmail-tester/init.js gmail-credentials.json gmail-token.json unitye2euser@gmail.com
- in opened window login with 'unitye2euser@gmail.com' user to confirm 'gmail-token.json' file creation
- update .env and variable on github

Run tests localy with Playwright UI runner:
- cd e2e/pd
- npx playwright test --ui
- run test that you're interested in
- Test run screencast: https://drive.google.com/file/d/1JWEAYNcmKVYm4s9jUZsDsSB73rA9t0Uh/view?usp=sharing
