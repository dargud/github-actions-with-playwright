import { MailSlurp } from 'mailslurp-client';

// exports.MailslurpWidget = class MailslurpWidget {
export class MailslurpWidget {
    constructor(apiKey) {
        this.mailslurp = new MailSlurp({ apiKey });
    };

    async createEmail() {
        const { id, emailAddress } = await this.mailslurp.createInbox();
        const email = {
            'id': id, 
            'address': emailAddress,
            'password': 'Qwerty1!'
        };

        return email;
    };

    async extractConfirmationLink(id) {
        const email = await this.mailslurp.waitForLatestEmail(id);
        const body = email.body;
        const emailConfirmationLink = body.match(/https?:\/\/(\.)?\b([-a-zA-Z0-9()@:%_\+.~#?&//=;]*)/)[0]; 
        console.log(body);
        console.log("The extracted URL: " + emailConfirmationLink);

        return emailConfirmationLink;
    };                                                                                                   
};