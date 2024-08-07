import { MailSlurp } from 'mailslurp-client';

export class MailslurpWidget {
    constructor(apiKey, id) {
        this.apiKey = apiKey;
        this.id = id;
        this.mailslurp = new MailSlurp({ apiKey });
    };

    async createEmail() {
        const { id, emailAddress } = await this.mailslurp.createInbox();
        const email = {
            'id': id,
            'address': emailAddress,
            'password': 'E2ETestUser'
        };

        return email;
    };

    async extractConfirmationLink() {
        const email = await this.mailslurp.waitForLatestEmail(this.id);
        const body = email.body;
        const extractedLink = body.match(/https?:\/\/(\.)?\b([-a-zA-Z0-9()@:%_\+.~#?&//=;]*)/)[0]; 
        const emailConfirmationLink = extractedLink.replace(/amp;/g, '');

        return emailConfirmationLink;
    };
    
    async extractConfirmationCode() {
        const email = await this.mailslurp.waitForLatestEmail(this.id);
        const body = email.body;
        const confirmationCode = body.match(/(?<=is\s)\d{6}/)[0];
 
        return confirmationCode;
    };  
};