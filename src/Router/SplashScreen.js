export function hideSplash() {
    const splashScreen = document.getElementById('splash-screen');
    requestAnimationFrame(() => (splashScreen.className = 'ended'));
}
