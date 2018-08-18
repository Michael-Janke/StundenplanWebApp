
export const createFeedbackMail = (feedback) => {
    const subject = feedback.subject + " (" + process.env.REACT_APP_VERSION + ")";
    return {
        "message": {
            "subject": subject,
            "body": {
                "contentType": "Text",
                "content": feedback.content
            },
            "toRecipients": [
                {
                    "emailAddress": {
                        "address": "thomas.janke@wgmail.de"
                    }
                }
            ],
        },
        "saveToSentItems": "false"
    }
};