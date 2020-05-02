import { runApplication, runApplicationToken } from './Common/Authentication';
import 'react-app-polyfill/stable';
import localForage from 'localforage';
import { unregister } from './serviceWorker';

let deparam = function (querystring) {
    // remove any preceding url and split
    querystring = querystring.substring(querystring.indexOf('?') + 1).split('&');
    var params = {},
        pair,
        d = decodeURIComponent;
    // march and parse
    for (var i = querystring.length - 1; i >= 0; i--) {
        pair = querystring[i].split('=');
        params[d(pair[0])] = d(pair[1] || '');
    }

    return params;
};
window.params = deparam(window.location.href);

if (window.location.hash === '#reset') {
    unregister();
    localForage.clear().then(() => {
        window.location.hash = '';
        window.location.reload();
    });
} else {
    if (window.params.token) {
        let client_secret = window.params.token;
        runApplicationToken(client_secret, () => {
            // eslint-disable-next-line
            require('./indexReact.js');
        });
    } else {
        runApplication(() => {
            // eslint-disable-next-line
            require('./indexReact.js');
        });
    }
}

(() => {
    document.getElementById('splash-screen-quote').innerText = randomQuote();
    function randomQuote() {
        const quotes = [
            'Nicht die Menschen, die immer gewinnen sind die stärksten, sondern die die niemals aufgeben.',
            'Es ist immer zu früh, um aufzugeben!',
            'Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren!',
            'Man liebt das, wofür man sich müht, und man müht sich für das, was man liebt.',
            'Ehrgeiz ist die Fähigkeit, die Träume real werden lässt.',
            'Es gibt mehr Leute, die kapitulieren, als solche, die scheitern.',
            'Wer aufhört, besser werden zu wollen, hört auf, gut zu sein.',
            'Wenn Du in Deinem Training immer nur 90% gibst, dann wirst Du auch wenn es darauf ankommt nur 90% geben.',
            'Die Kunst ist, einmal mehr aufzustehen, als man umgeworfen wird.',
            'Wer einen Misserfolg nur als kleinen Umweg betrachtet, verliert nie sein Ziel aus den Augen.',
            'Mit Fleiß, mit Mut und festem Willen lässt jeder Wunsch sich endlich stillen.',
            'Unsere Körper sind unsere Gärten – unsere Willen sind unsere Gärtner.',
            'In dem Moment an dem du am aufgeben bist denke daran, warum du soviel gegeben hast.',
            'Entweder werden wir einen Weg finden oder wir machen einen!',
            'Der Schmerz, den du heute fühlst, ist die Kraft, die morgen spürst.',
            'Indem man das, was man zu tun hat, aufschiebt, läuft man Gefahr, es nie tun zu können.',
            'Gefühl von Grenze darf nicht heißen: hier bist du zu Ende, sondern: hier hast du noch zu wachsen.',
            'Kontinuierliche Anstrengung – nicht Kraft oder Intelligenz – ist der Schlüssel, um Dein Potential freizusetzen.',
            'Hindernisse sollten Dich nicht aufhalten. Wenn Du gegen eine Wand läufst, dreh Dich nicht um, gib nicht auf. Finde heraus wie Du darüber klettern, hindurchgehen oder außenrum gehen kannst.',
            'Mach es wie die Briefmarke. Sie sichert sich den Erfolg durch die Fähigkeit an einer Sache festzuhalten bis sie ankommt.',
            'Auch im Alphabet kommt Anstrengung vor Erfolg.',
        ];
        return quotes[Math.floor(Date.now() / 1000 / 60 / 60) % quotes.length];
    }
})();
