/*

1. Set Up Your Project
Create a Project Directory
mkdir my-project
cd my-project

Initialize a Node.js Project
npm init -y

// ===================================================================

2. Install Dependencies
You need the following npm packages:

axios for making HTTP requests.
dotenv for managing environment variables.
random-username-generator for generating random strings.
moment for handling date and time.

Install them using npm:
npm install axios dotenv random-username-generator moment

// ===================================================================

3. Create Configuration Files
.env File
- Create a .env file in your project directory to store environment variables. For example:
TEST_URI=http://localhost:3000
TEST_CLIENT_ID=your-client-id
TEST_CLIENT_SECRET=your-client-secret
SERVICE_AUTH_HEADER=your-service-auth-header
TEST_REDIRECT_URI=http://localhost:3000/callback

- index.js File
Create an index.js file and add the provided JavaScript code.

// ===================================================================

4. Implement Utility Functions
You need to implement or import utility functions used in the code. Here are examples of how you might define them:

// utils.js
import axios from 'axios';
import { URL, URLSearchParams } from 'url';

// Base URL for your API
const BASE_URL = process.env.TEST_URI;

// Utility function to perform HTTP redirects
export const curlRedirect = async (method, endpoint, params) => {
    try {
        const response = await axios({
            method,
            url: `${BASE_URL}${endpoint}`,
            params,
            maxRedirects: 0, // To capture the redirect URL
        });
        // Return the redirect location from the response headers
        return response.headers.location;
    } catch (error) {
        throw new Error(`Error in curlRedirect: ${error.message}`);
    }
};

// Utility function to make JSON requests
export const curlJson = async (method, endpoint, options) => {
    try {
        const response = await axios({
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: options.headers || {},
            params: options.query || {},
            data: options.data || {},
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error in curlJson: ${error.message}`);
    }
};

// Utility function to make form-data requests
export const curlForm = async (method, endpoint, options) => {
    try {
        const response = await axios({
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams(options.data || {}).toString(),
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error in curlForm: ${error.message}`);
    }
};

// Utility function to make raw requests
export const curlRaw = async (method, endpoint, options) => {
    try {
        const response = await axios({
            method,
            url: `${BASE_URL}${endpoint}`,
            params: options.query || {},
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error in curlRaw: ${error.message}`);
    }
};

// Utility function to extract path parameter from URL
export const getPathParam = (url, param) => {
    const urlObj = new URL(url, BASE_URL);
    return urlObj.pathname.split('/').find(segment => segment.includes(param));
};

// Utility function to get query parameter from URL
export const getQueryParam = (url, param) => {
    const urlObj = new URL(url, BASE_URL);
    return urlObj.searchParams.get(param);
};

Explanation
curlRedirect: Uses Axios to perform an HTTP request and captures the redirect location from the response headers.
curlJson: Makes an HTTP request expecting JSON response and supports optional query parameters and data.
curlForm: Sends form-encoded data. The URLSearchParams object is used to convert the data into the correct format for the application/x-www-form-urlencoded content type.
curlRaw: Performs a raw HTTP request, primarily used for simple GET requests with query parameters.
getPathParam: Parses the pathname of the URL to find a specific segment that contains a given parameter.
getQueryParam: Extracts the value of a query parameter from the URL.

// ===================================================================

5. Run Your Code
Ensure you have your environment variables set, then run your code using Node.js:
node index.js

// ===================================================================

6. Troubleshoot and Validate
Check Logs: Verify that the output matches expectations and look for any error messages.
API Endpoints: Ensure that the API endpoints specified in your code are correct and accessible.
Adjust Code: Modify the code as needed based on any discrepancies or issues you encounter during testing.
This setup provides a comprehensive environment to run your JavaScript code, with dependencies and configurations in place. If you run into any specific issues or need further adjustments, feel free to ask!

*/

import axios from 'axios';
import dotenv from 'dotenv';
import { generateUsername } from 'random-username-generator';
import moment from 'moment';

dotenv.config();

class CreateEmailVerifiedUser {
    constructor() {
        const randomString = this.__generateRandomString__();
        const randomDate = this.__generateRandomDate__();

        // user data
        this.username = `test-user-${randomString}`;
        this.email = `${randomString}@test-email.org`;
        this.password = 'password';
        this.nickname = randomString;
        this.firstName = `test-user-${randomString.slice(0, 5)}`;
        this.lastName = randomString.slice(5);
        this.gender = ['male', 'female'][Math.floor(Math.random() * 2)];
        this.dob = randomDate;
        this.pin = '1234';
        this.countryOfResidence = 'US';
        this.stateCode = 'CA';
        this.acceptOptin = 'true';
        this.acceptAnalytics = 'true';
        this.tos = '';
        this.id = '';

        // internal state
        this.userData = {};
        this.evc = '';
    }

    __generateRandomString__() {
        const length = 10;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        if (result.length !== length) throw new Error('Generated string has an incorrect length');
        return result;
    }

    __generateRandomDate__() {
        const start = moment('1980-01-01');
        const end = moment('2006-01-02');
        const randomDate = moment(start).add(Math.random() * end.diff(start), 'milliseconds');
        const formattedDate = randomDate.format('YYYY-MM-DD');
        if (!formattedDate) throw new Error('Generated date is invalid');
        return formattedDate;
    }

    async do() {
        await this.__startUserRegisterFlow__();
        await this.__validateUnverifiedEmailUser__();
        await this.__validateUnverifiedEmailUserLogin__();
        await this.__verifyEmail__();
        await this.__validateVerifiedEmailUser__();
        await this.__validateResendVerificationEmail__();
        await this.__validateVerifiedEmailUserLogout__();
        this.__printInfo__("Successfully registered a new user with successful email verification");
        return this;
    }

    __generateRegisterUserData__() {
        this.userData = {
            username: this.username,
            password: this.password,
            email: this.email,
            nickname: this.nickname,
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            dob: this.dob,
            pin: this.pin,
            country: this.countryOfResidence,
            state: this.stateCode,
            acceptOptin: this.acceptOptin,
            acceptAnalytics: this.acceptAnalytics,
            tos: this.tos
        };
        if (Object.keys(this.userData).length === 0) throw new Error('User data is empty');
    }

    async __startUserRegisterFlow__() {
        this.__generateRegisterUserData__();
        const response = await axios.get(`${process.env.TEST_URI}/v1/oauth2/authorize`, {
            params: {
                client_id: process.env.TEST_CLIENT_ID,
                response_type: 'code',
                scope: 'identity',
                redirect_uri: process.env.TEST_REDIRECT_URI
            }
        }).catch(error => error.response);

        if (!response || response.status !== 302) throw new Error('Authorization failed');

        const location = response.headers.location;
        const cid = new URL(location).pathname.split('conversations/')[1];
        if (!cid) throw new Error('Failed to retrieve conversation ID');

        console.info('1. Starting the OAuth2 flow to register a new user');
        let flowResponse = await axios.get(`${process.env.TEST_URI}/v1/oauth2/flow`, {
            params: { cid }
        }).catch(error => error.response.data);

        if (flowResponse.view !== 'loginRegister' || 
            flowResponse.model.display !== 'PAGE' || 
            flowResponse.model.locale !== 'en-US' || 
            flowResponse.model.isReg !== false || 
            flowResponse.errors.length !== 0) {
            throw new Error('OAuth2 flow validation failed');
        }

        console.info('2. Continuing the conversation flow to send the "register" event to register a new user');
        const registerResponse = await axios.post(`${process.env.TEST_URI}/v1/oauth2/authorize`, {
            ...this.userData,
            cid,
            event: 'register'
        }).catch(error => error.response.data);

        if (registerResponse.view !== 'emailVerifyRequired' || 
            registerResponse.model.username !== this.username || 
            registerResponse.model.locale !== 'en-US' || 
            !registerResponse.model.link.includes('locale=en-US') || 
            registerResponse.errors.length !== 0) {
            throw new Error('User registration failed');
        }

        const link = registerResponse.model.link;
        this.evc = new URL(link).searchParams.get('evc');
        if (!this.evc) throw new Error('Email verification code is missing');
    }

    async __validateUnverifiedEmailUser__() {
        console.info("Validating a new registered user record's state in the DB before email verification");
        const users = await axios.get(`${process.env.TEST_URI}/v1/users`, {
            headers: { Authorization: `Bearer ${process.env.SERVICE_AUTH_HEADER}` },
            params: { email: this.email }
        }).catch(error => error.response.data);

        if (!users || users.results.length !== 1) throw new Error('User record validation failed');

        const user = users.results[0];
        if (user.emails.length !== 1 || 
            user.emails[0].value.toLowerCase() !== this.email.toLowerCase() || 
            user.emails[0].primary !== true || 
            user.emails[0].verified !== false) {
            throw new Error('User email validation failed');
        }

        if (user.username !== this.username || 
            user.name.givenName !== this.firstName || 
            user.name.familyName !== this.lastName || 
            user.gender.toLowerCase() !== this.gender || 
            user.countryOfResidence !== this.countryOfResidence || 
            user.extendedProperties.USER_STATE_CODE.stateCode !== this.stateCode || 
            user.extendedProperties.USER_OPTIN_ACCEPTANCE !== 'true') {
            throw new Error('User data validation failed');
        }

        this.id = user.id;
    }

    async __validateUnverifiedEmailUserLogin__() {
        console.info('Attempting to login a new user before email verification');
        const response = await axios.post(`${process.env.TEST_URI}/v1/oauth2/token`, {
            client_id: process.env.TEST_CLIENT_ID,
            client_secret: process.env.TEST_CLIENT_SECRET,
            grant_type: 'password',
            username: this.email,
            password: this.password
        }).catch(error => error.response.data);

        if (!response || 
            response.message !== 'User Email Not Verified' || 
            response.code !== '132.180') {
            throw new Error('Login before email verification failed');
        }
    }

    async __verifyEmail__() {
        console.info('1. Start verify email conversation flow action: emailVerifyRequired');
        const location = await axios.get(`${process.env.TEST_URI}/v1/oauth2/verify-email`, {
            params: { evc: this.evc }
        }).then(response => response.headers.location);

        if (!location) throw new Error('Email verification step 1 failed');

        const cid = new URL(location).pathname.split('conversations/')[1];
        if (!cid) throw new Error('Email verification step 1 failed: missing conversation ID');

        console.info('2. Verify email conversation flow action: emailVerifyCaptcha');
        let response = await axios.post(`${process.env.TEST_URI}/v1/oauth2/authorize`, {
            cid,
            event: 'next'
        }).catch(error => error.response.data);

        if (!response || 
            response.view !== 'emailVerifyCaptcha' || 
            response.model.locale !== 'en-US' || 
            response.errors.length !== 0) {
            throw new Error('Email verification step 2 failed');
        }

        console.info('3. Verify email conversation flow action: emailVerifyCaptcha');
        response = await axios.post(`${process.env.TEST_URI}/v1/oauth2/flow`, {
            cid
        }, {
            params: { event: 'next' }
        }).catch(error => error.response.data);

        if (!response || 
            response.view !== 'redirect' || 
            response.model.location !== 'http://localhost:3000/en/confirmation/success' || 
            response.model.locale !== 'en-US' || 
            response.errors.length !== 0) {
            throw new Error('Email verification step 3 failed');
        }
    }

    async __validateVerifiedEmailUser__() {
        console.info("Validating a new registered user record's state in the DB after the successful email verification");
        const users = await axios.get(`${process.env.TEST_URI}/v1/users`, {
            headers: { Authorization: `Bearer ${process.env.SERVICE_AUTH_HEADER}` },
            params: { email: this.email }
        }).catch(error => error.response.data);

        if (!users || users.results.length !== 1) throw new Error('User record validation failed');

        const user = users.results[0];
        if (user.emails.length !== 1 || 
            user.emails[0].value.toLowerCase() !== this.email.toLowerCase() || 
            user.emails[0].primary !== true || 
            user.emails[0].verified !== true) {
            throw new Error('User email validation failed');
        }

        if (user.username !== this.username || 
            user.name.givenName !== this.firstName || 
            user.name.familyName !== this.lastName || 
            user.gender.toLowerCase() !== this.gender || 
            user.countryOfResidence !== this.countryOfResidence || 
            user.extendedProperties.USER_STATE_CODE.stateCode !== this.stateCode || 
            user.extendedProperties.USER_OPTIN_ACCEPTANCE !== 'true') {
            throw new Error('User data validation after email verification failed');
        }
    }

    async __validateResendVerificationEmail__() {
        console.info('Resending an email verification email for the user with a verified email');
        const response = await axios.post(`${process.env.TEST_URI}/v1/oauth2/verify-email/welcome/resend`, {
            email: this.email
        }).catch(error => error.response.data);

        if (!response || response.code !== '132.184' || response.message !== 'User email verified') {
            throw new Error('Resend email verification failed');
        }
    }

    async __validateVerifiedEmailUserLogin__() {
        console.info('Attempting to login a user with a verified email');
        const response = await axios.post(`${process.env.TEST_URI}/v1/oauth2/token`, {
            client_id: process.env.TEST_CLIENT_ID,
            client_secret: process.env.TEST_CLIENT_SECRET,
            grant_type: 'password',
            username: this.email,
            password: this.password
        }).catch(error => error.response.data);

        if (!response || 
            !response.access_token || 
            response.token_type !== 'Bearer' || 
            !response.refresh_token || 
            response.display_name !== this.username || 
            response.user !== this.id) {
            throw new Error('Login with verified email failed');
        }
    }

    async __validateVerifiedEmailUserLogout__() {
        await this.__validateVerifiedEmailUserLogin__();

        console.info('Attempting to logout a user with a verified email');
        await axios.get(`${process.env.TEST_URI}/v1/oauth2/end-session`, {
            params: { post_logout_redirect_uri: process.env.TEST_REDIRECT_URI }
        });

        const location = await axios.get(`${process.env.TEST_URI}/v1/oauth2/authorize`, {
            params: {
                client_id: process.env.TEST_CLIENT_ID,
                response_type: 'code',
                scope: 'identity',
                redirect_uri: process.env.TEST_REDIRECT_URI
            }
        }).then(response => response.headers.location);

        if (new URL(location).searchParams.get('code')) throw new Error('User should be logged out');
        const cid = new URL(location).pathname.split('conversations/')[1];
        if (!cid) throw new Error('Silent sign-in test failed: missing conversation ID');
    }

    __printInfo__(infoStr) {
        console.info('');
        console.info('===================================================================');
        if (infoStr) console.info(infoStr);
        this.__printUserInformation__();
        console.info('===================================================================');
        console.info('');
    }

    __printUserInformation__() {
        console.info(`username: ${this.username}`);
        console.info(`email: ${this.email}`);
        console.info(`password: ${this.password}`);
        console.info(`id: ${this.id}`);
    }
}

export default CreateEmailVerifiedUser;
