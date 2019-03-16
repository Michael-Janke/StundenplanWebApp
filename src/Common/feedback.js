import version from '../version.json';

export const createFeedbackMail = feedback => {
    const subject = feedback.subject + ' (' + version.build + ')';
    return {
        message: {
            subject: subject,
            body: {
                contentType: 'Text',
                content: feedback.content,
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: 'feedback-new-app@wgmail.onmicrosoft.com',
                    },
                },
            ],
        },
        saveToSentItems: 'false',
    };
};
