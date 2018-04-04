
export const createFeedbackMail = (feedback) => {
    return {
        "message": {
            "subject": feedback.subject,
            "body": {
                "contentType": "Text",
                "content": feedback.content
            },
            "toRecipients": [
                {
                    "emailAddress": {
                        "address": "feedback-new-app@wgmail.onmicrosoft.com"
                        // address: "thomas.janke@wgmail.de"
                    }
                }
            ],
        },
        "saveToSentItems": "false"
    }
};