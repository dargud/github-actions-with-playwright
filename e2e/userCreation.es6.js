/*

    Ensure you have these dependencies installed:
    npm install axios dotenv

    Key Changes:
Imports and Exports: Used ES6 import and export statements.
String Interpolation: Replaced string concatenation with template literals for improved readability.
Arrow Functions: Used arrow functions where appropriate.
Destructuring: Utilized destructuring for accessing properties from objects.
Array Methods: Used Array.from and join for generating random strings.
Error Handling: Simplified error handling in HTTP requests.
Notes:
Ensure to use a .env file or environment variables for sensitive information.
The dotenv package is used for loading environment variables, and axios for HTTP requests.
You might need to install these packages if they are not already included in your project: npm install axios dotenv.
This refactoring makes the code more modern and easier to maintain.

*/

import axios from 'axios';
import { config } from 'dotenv';
import { URL } from 'url';

config(); // Load environment variables

class CreateEmailVerifiedUser {
    constructor() {
        const randomString = this.generateRandomString();
        const randomDate = this.generateRandomDate();

        // User data
        this.username = `test-user-${randomString}`;
        this.email = `${randomString}@test-email.org`;
        this.password = 'password';
        this.nickname = randomString;
        this.firstName = `test-user-${randomString.slice(0, 5)}`;
        this.lastName = randomString.slice(5);
        this.gender = this.getRandomGender();
        this.dob = randomDate;
        this.pin = '1234';
        this.countryOfResidence = 'US';
        this.stateCode = 'CA';
        this.acceptOptin = 'true';
        this.acceptAnalytics = 'true';
        this.tos = '';
        this.id = '';

        // Internal state
        this.userData = {};
        this.evc = '';
    }

    generateRandomString(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    }

    generateRandomDate() {
        const start = new Date(1980, 0, 1);
        const end = new Date(2006, 0, 2);
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return randomDate.toISOString().split('T')[0];
    }

    getRandomGender() {
        const genders = ['male', 'female'];
        return genders[Math.floor(Math.random() * genders.length)];
    }

    async do() {
        try {
            await this.startUserRegisterFlow();
            await this.validateUnverifiedEmailUser();
            await this.validateUnverifiedEmailUserLogin();
            await this.verifyEmail();
            await this.validateVerifiedEmailUser();
            await this.validateResendVerificationEmail();
            await this.validateVerifiedEmailUserLogout();
            this.printInfo('Successfully registered a new user with successful email verification');
        } catch (error) {
            console.error('An error occurred:', error);
        }
        return this;
    }

    generateRegisterUserData() {
        this.userData = {
            username: this.username,
            password: this.password,
            email: this.email,
            nickname: this.nickname,
            first_name: this.firstName,
            last_name: this.lastName,
            gender: this.gender,
            dob: this.dob,
            pin: this.pin,
            country: this.countryOfResidence,
            state: this.stateCode,
            accept_optin: this.acceptOptin,
            accept_analytics: this.acceptAnalytics,
            tos: this.tos
        };
        if (!Object.keys(this.userData).length) throw new Error('User data is empty');
    }

    async startUserRegisterFlow() {
        this.generateRegisterUserData();
        const { data: authorizeResponse, headers } = await axios.get(`${process.env.TEST_URI}/v1/oauth2/authorize`, {
            params: {
                client_id: process.env.TEST_CLIENT_ID,
                response_type: 'code',
                scope: 'identity',
                redirect_uri: process.env.TEST_REDIRECT_URI
            }
        });

        const location = headers.location;
        if (!location) throw new Error('OAuth2 authorization failed');

        const cid = new URL(location).searchParams.get('conversations');
        if (!cid) throw new Error('Failed to retrieve conversation ID');

        this.printInfo('1. Starting the OAuth2 flow to register a new user');
        let response = await axios.get(`${process.env.TEST_URI}/v1/oauth2/flow`, { params: { cid } });

        if (response.data.view !== 'loginRegister' || response.data.model.display !== 'PAGE' || response.data.model.locale !== 'en-US' || response.data.model.isReg !== false || response.data.errors.length) {
            throw new Error('OAuth2 flow validation failed');
        }

        this.printInfo('2. Continuing the conversation flow to send the "register" event to register a new user');
        response = await axios.post(`${process.env.TEST_URI}/v1/oauth2/authorize`, {
            ...this.userData,
            cid,
            event: 'register'
        });

        if (response.data.view !== 'emailVerifyRequired' || response.data.model.username !== this.username || response.data.model.locale !== 'en-US' || response.data.errors.length) {
            throw new Error('User registration failed');
        }

        const link = response.data.model.link;
        if (!link) throw new Error('Email verification link is missing');
        this.evc = new URL(link).searchParams.get('evc');
        if (!this.evc) throw new Error('Email verification code is missing');
    }

    async validateUnverifiedEmailUser() {
        this.printInfo("Validating a new registered user record's state in the DB before email verification");
        const { data: users } = await axios.get(`${process.env.TEST_URI}/v1/users`, {
            headers: { Authorization: `Bearer ${process.env.SERVICE_AUTH_TOKEN}` },
            params: { email: this.email }
        });

        if (!users || users.results.length !== 1) throw new Error('User record validation failed');

        const user = users.results[0];
        if (user.emails.length !== 1 || user.emails[0].value.toLowerCase() !== this.email.toLowerCase() || user.emails[0].primary !== true || user.emails[0].verified !== false) {
            throw new Error('User email validation failed');
        }

        if (user.username !== this.username || user.name.givenName !== this.firstName || user.name.familyName !== this.lastName || user.gender.toLowerCase() !== this.gender || user.countryOfResidence !== this.countryOfResidence || user.extendedProperties.USER_STATE_CODE.stateCode !== this.stateCode || user.extendedProperties.USER_OPTIN_ACCEPTANCE !== 'true') {
            throw new Error('User data validation failed');
        }
        this.id = user.id;
    }

    async validateUnverifiedEmailUserLogin() {
        this.printInfo('Attempting to login a new user before email verification');
        const response = await axios.post(`${process.env.TEST_URI}/v1/oauth2/token`, {
            client_id: process.env.TEST_CLIENT_ID,
            client_secret: process.env.TEST_CLIENT_SECRET,
            grant_type: 'password',
            username: this.email,
            password: this.password
        }).catch(err => err.response.data);

        if (!response || response.message !== 'User Email Not Verified' || response.code !== '132.180') {
            throw new Error('Login before email verification failed');
        }
    }

    async verifyEmail() {
        this.printInfo('1. Start verify email conversation flow action: emailVerifyRequired');
        const { headers: { location } } = await axios.get(`${process.env.TEST_URI}/v1/oauth2/verify-email`, { params: { evc: this.evc } });
        if (!location) throw new Error('Email verification step 1 failed');

        const cid = new URL(location).searchParams.get('conversations');
        if (!cid) throw new Error('Email verification step 1 failed: missing conversation ID');

        this.printInfo('2. Verify email conversation flow action: emailVerifyCaptcha');
        let response = await axios.post(`${process.env.TEST_URI}/v1/oauth2/authorize`, { cid, event: 'next' });

        if (response.data.view !== 'emailVerifyCaptcha' || response.data.model.locale !== 'en-US' || response.data.errors.length) {
            throw new Error('Email verification step 2 failed');
        }

        this.printInfo('3. Verify email conversation flow action: emailVerifyCaptcha');
        response = await axios.post(`${process.env.TEST_URI}/v1/oauth2/flow`, { cid }, { event: 'next' });

        if (response.data.view !== 'redirect' || response.data.model.location !== 'http://localhost:3000/en/confirmation/success' || response.data.model.locale !== 'en-US' || response.data.errors.length) {
            throw new Error('Email verification step 3 failed');
        }
    }

    async validateVerifiedEmailUser() {
        this.printInfo("Validating a new registered user record's state in the DB after the successful email verification");
        const { data: users } = await axios.get(`${process.env.TEST_URI}/v1/users`, {
            headers: { Authorization: `Bearer ${process.env.SERVICE_AUTH_TOKEN}` },
            params: { email: this.email }
        });

        if (!users || users.results.length !== 1) throw new Error('User record validation after email verification failed');

        const user = users.results[0];
        if (user.emails.length !== 1 || user.emails[0].value.toLowerCase() !== this.email.toLowerCase() || user.emails[0].primary !== true || user.emails[0].verified !== true) {
            throw new Error('User email validation after verification failed');
        }

        if (user.username !== this.username || user.name.givenName !== this.firstName || user.name.familyName !== this.lastName || user.gender.toLowerCase() !== this.gender || user.countryOfResidence !== this.countryOfResidence || user.extendedProperties.USER_STATE_CODE.stateCode !== this.stateCode || user.extendedProperties.USER_OPTIN_ACCEPTANCE !== 'true') {
            throw new Error('User data validation after verification failed');
        }
    }

    async validateResendVerificationEmail() {
        this.printInfo('Resending an email verification email for the user with a verified email');
        const response = await axios.post(`${process.env.TEST_URI}/v1/oauth2/verify-email/welcome/resend`, { email: this.email })
            .catch(err => err.response.data);

        if (!response || response.code !== '132.184' || response.message !== 'User email verified') {
            throw new Error('Resend verification email validation failed');
        }
    }

    async validateVerifiedEmailUserLogin() {
        this.printInfo('Attempting to login a user with a verified email');
        const response = await axios.post(`${process.env.TEST_URI}/v1/oauth2/token`, {
            client_id: process.env.TEST_CLIENT_ID,
            client_secret: process.env.TEST_CLIENT_SECRET,
            grant_type: 'password',
            username: this.email,
            password: this.password
        }).catch(err => err.response.data);

        if (!response || !response.access_token || response.token_type !== 'Bearer' || !response.refresh_token || response.display_name !== this.username || response.user !== this.id) {
            throw new Error('Login after email verification failed');
        }
    }

    async validateVerifiedEmailUserLogout() {
        await this.validateVerifiedEmailUserLogin();

        this.printInfo('Attempting to logout a user with a verified email');
        await axios.get(`${process.env.TEST_URI}/v1/oauth2/end-session`, {
            params: { post_logout_redirect_uri: process.env.TEST_REDIRECT_URI }
        });

        // Test silent sign-in again
        const { headers: { location } } = await axios.get(`${process.env.TEST_URI}/v1/oauth2/authorize`, {
            params: {
                client_id: process.env.TEST_CLIENT_ID,
                response_type: 'code',
                scope: 'identity',
                redirect_uri: process.env.TEST_REDIRECT_URI
            }
        });

        if (new URL(location).searchParams.get('code') !== null) throw new Error('Silent sign-in after logout failed');

        const cid = new URL(location).searchParams.get('conversations');
        if (!cid) throw new Error('Failed to retrieve conversation ID after logout');
    }

    printInfo(infoStr) {
        console.info("");
        console.info("===================================================================");
        if (infoStr) console.info(infoStr);
        this.printUserInformation();
        console.info("===================================================================");
        console.info("");
    }

    printUserInformation() {
        console.info(`username: ${this.username}`);
        console.info(`email: ${this.email}`);
        console.info(`password: ${this.password}`);
        console.info(`id: ${this.id}`);
    }
}

export default CreateEmailVerifiedUser;
