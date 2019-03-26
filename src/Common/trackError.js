import { detect } from 'detect-browser';
import version from '../version.json';
import { API_URL } from '../Common/services/generator';

export default function trackError({ upn, code, error }) {
    try {
        fetch(API_URL + 'error', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                upn,
                browser: detect(),
                buildNumber: version.build,
                version: version.version,
                errorCode: code,
                error,
            }),
        });
    } catch (e) {}
}
