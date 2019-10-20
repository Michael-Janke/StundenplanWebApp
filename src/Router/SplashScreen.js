export function hideSplash(now = false) {
    const splashScreen = document.getElementById('splash-screen');
    setTimeout(() => requestAnimationFrame(() => (splashScreen.className = 'ended')), now ? 0 : 150);
    setTimeout(() => document.getElementById('preloader') && document.getElementById('preloader').remove(), 1500);
}
