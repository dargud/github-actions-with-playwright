class CreateEmailVerifiedUser {
    constructor() {
        const randomString = this.generateRandomString();
        const randomDate = this.generateRandomDate();

        // user data
        this.username = 'test-user-' + randomString;
        this.email = randomString + '@test-email.org';
        this.password = 'password';
        this.nickname = randomString;
        this.firstName = 'test-user-' + randomString.slice(0, 5);
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

        // internal state
        this.userData = {};
        this.evc = '';
    }

    generateRandomString() {
        const length = 10;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        if (result.length !== length) throw new Error('Generated string has an incorrect length');
        return result;
    }

    generateRandomDate() {
        const start = new Date(1980, 0, 1);
        const end = new Date(2006, 0, 2);
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        const formattedDate = randomDate.toISOString().split('T')[0];
        if (!formattedDate) throw new Error('Generated date is invalid');
        return formattedDate;
    }

    getRandomGender() {
        const genders = ['male', 'female'];
        return genders[Math.floor(Math.random() * genders.length)];
    }

    do() {
        this.startUserRegisterFlow();
        this.validateUnverifiedEmailUser();
        this.validateUnverifiedEmailUserLogin();
        this.verifyEmail();
        this.validateVerifiedEmailUser();
        this.validateResendVerificationEmail();
        this.validateVerifiedEmailUserLogout();
        this.printInfo('Successfully registered a new user with successful email verification');
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
        if (Object.keys(this.userData).length === 0) throw new Error('User data is empty');
    }

    startUserRegisterFlow() {
        this.generateRegisterUserData();
        const location = curlRedirect('GET', ut.test_uri, '/v1/oauth2/authorize', {
            client_id: ut.test_client_id,
            response_type: 'code',
            scope: 'identity',
            redirect_uri: ut.test_redirect_uri
        });
        if (!location) throw new Error('OAuth2 authorization failed');

        const cid = oauth.getPathParam(location, 'conversations/');
        if (!cid) throw new Error('Failed to retrieve conversation ID');

        this.printInfo('1. Starting the OAuth2 flow to register a new user');
        let response = curlJson('GET', ut.test_uri, '/v1/oauth2/flow', { cid });
        if (response.view !== 'loginRegister' || response.model.display !== 'PAGE' || response.model.locale !== 'en-US' || response.model.isReg !== false || response.errors.length !== 0) {
            throw new Error('OAuth2 flow validation failed');
        }

        this.printInfo('2. Continuing the conversation flow to send the "register" event to register a new user');
        response = curlForm('POST', ut.test_uri, '/v1/oauth2/authorize', {
            ...this.userData,
            cid: cid,
            event: 'register'
        });
        if (!response || response.view !== 'emailVerifyRequired' || response.model.username !== this.username || response.model.locale !== 'en-US' || response.errors.length !== 0) {
            throw new Error('User registration failed');
        }

        // Return the email verification link
        const link = response.model.link;
        if (!link) throw new Error('Email verification link is missing');
        this.evc = getqueryparam(link, 'evc');
        if (!this.evc) throw new Error('Email verification code is missing');
    }

    validateUnverifiedEmailUser() {
        this.printInfo("Validating a new registered user record's state in the DB before email verification");
        const users = curlJson('GET', ut.test_uri, '/v1/users', serviceauthheader(), { email: this.email });
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

    validateUnverifiedEmailUserLogin() {
        this.printInfo('Attempting to login a new user before email verification');
        const response = curlJson('POST', ut.test_uri, '/v1/oauth2/token', {
            client_id: ut.test_client_id,
            client_secret: ut.test_client_secret,
            grant_type: 'password',
            username: this.email,
            password: this.password
        }, false);
        if (!response || response.message !== 'User Email Not Verified' || response.code !== '132.180') {
            throw new Error('Login before email verification failed');
        }
    }

    verifyEmail() {
        this.printInfo('1. Start verify email conversation flow action: emailVerifyRequired');
        const location = curlRedirect('GET', ut.test_uri, '/v1/oauth2/verify-email', { evc: this.evc });
        if (!location) throw new Error('Email verification step 1 failed');

        const cid = oauth.getPathParam(location, 'conversations/');
        if (!cid) throw new Error('Email verification step 1 failed: missing conversation ID');

        this.printInfo('2. Verify email conversation flow action: emailVerifyCaptcha');
        let response = curlForm('POST', ut.test_uri, '/v1/oauth2/authorize', { cid, event: 'next' });
        if (!response || response.view !== 'emailVerifyCaptcha' || response.model.locale !== 'en-US' || response.errors.length !== 0) {
            throw new Error('Email verification step 2 failed');
        }

        this.printInfo('3. Verify email conversation flow action: emailVerifyCaptcha');
        response = curlJson('POST', ut.test_uri, '/v1/oauth2/flow', { cid }, { event: 'next' });
        if (!response || response.view !== 'redirect' || response.model.location !== 'http://localhost:3000/en/confirmation/success' || response.model.locale !== 'en-US' || response.errors.length !== 0) {
            throw new Error('Email verification step 3 failed');
        }
    }

    validateVerifiedEmailUser() {
        this.printInfo("Validating a new registered user record's state in the DB after the successful email verification");
        const users = curlJson('GET', ut.test_uri, '/v1/users', serviceauthheader(), { email: this.email });
        if (!users || users.results.length !== 1) throw new Error('User record validation after email verification failed');

        const user = users.results[0];
        if (user.emails.length !== 1 || user.emails[0].value.toLowerCase() !== this.email.toLowerCase() || user.emails[0].primary !== true || user.emails[0].verified !== true) {
            throw new Error('User email validation after verification failed');
        }

        if (user.username !== this.username || user.name.givenName !== this.firstName || user.name.familyName !== this.lastName || user.gender.toLowerCase() !== this.gender || user.countryOfResidence !== this.countryOfResidence || user.extendedProperties.USER_STATE_CODE.stateCode !== this.stateCode || user.extendedProperties.USER_OPTIN_ACCEPTANCE !== 'true') {
            throw new Error('User data validation after verification failed');
        }
    }

    validateResendVerificationEmail() {
        this.printInfo('Resending an email verification email for the user with a verified email');
        const response = curlForm('POST', ut.test_uri, '/v1/oauth2/verify-email/welcome/resend', { email: this.email }, false);
        if (!response || response.code !== '132.184' || response.message !== 'User email verified') {
            throw new Error('Resend verification email validation failed');
        }
    }

    validateVerifiedEmailUserLogin() {
        this.printInfo('Attempting to login a user with a verified email');
        const response = curlJson('POST', ut.test_uri, '/v1/oauth2/token', {
            client_id: ut.test_client_id,
            client_secret: ut.test_client_secret,
            grant_type: 'password',
            username: this.email,
            password: this.password
        }, false);
        if (!response || !response.access_token || response.token_type !== 'Bearer' || !response.refresh_token || response.display_name !== this.username || response.user !== this.id) {
            throw new Error('Login after email verification failed');
        }
    }

    validateVerifiedEmailUserLogout() {
        this.validateVerifiedEmailUserLogin();

        this.printInfo('Attempting to logout a user with a verified email');
        curlRaw('GET', ut.test_uri, '/v1/oauth2/end-session', {
            post_logout_redirect_uri: ut.test_redirect_uri
        });

        // Test silent sign-in again
        const location = curlRedirect('GET', ut.test_uri, '/v1/oauth2/authorize', {
            client_id: ut.test_client_id,
            response_type: 'code',
            scope: 'identity',
            redirect_uri: ut.test_redirect_uri
        });
        if (getqueryparam(location, 'code') !== null) throw new Error('Silent sign-in after logout failed');
        
        const cid = oauth.getPathParam(location, 'conversations/');
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
        console.info("username: " + this.username);
        console.info("email: " + this.email);
        console.info("password: " + this.password);
        console.info("id: " + this.id);
    }
}
