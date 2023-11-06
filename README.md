-- HOW TO START THE PROJECT -- 
E2E autotest's for the next flow:
- Login
- Open account settings
- Search for a course
- Open a course from the search results

To run the test suit:
- Open suit in the Visual Studio Code (VS Code)
- Run command in the VS Code terminal (/node_modules folder should be added): npm install -D @playwright/test
- Run Smoke suite in the VS Code terminal for all browsers by command: npm run tests:smoke:all

-- LATEST UPDATES --
Update 07/31/2023:
- I’ve double checked the list of test cases and passed them to be sure I understand the logic. I’ve a question about two of them, because I didn’t find the way how to reproduce some of the steps. Also I need the list of right answers for the quiz. 
- The high level test cases have been updated, I’ve added a structure of test scenarios. They’ve not finished yet, that mean I need to finish with page objects models. 
- I’ve updated a few page objects, added the structure of it. Also I hope I added all page objects we need. 
- I’ve created the list of all test-ids, I hope it would be enough to cover all test scenarios.

Update 07/24/2023:
- I’ve checked the list of test cases and passed the flow
- The high level test cases have been created, need to be done once page objects be ready
- The list of new highlevel page object created, need to be done one by one
- During the page objects creation, the list of Id’s will be finished and send

Update 07/11/2023:
_ I've changed Type script to the Java Script
- I've added a separate config files for E2E and Smoke:
    - e2e.comfig.js
    - smoke.comfig.js
- Parallel test execution for Chrome, Firefox, and Safari
- Reporting: after every test run the test report will be created in //playwright-report/index.html
- I've added a custom commands to run test suite
- Run Smoke suite in the VS Code terminal for all browsers by command: npm run tests:smoke:all