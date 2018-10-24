
export function hideSplash() {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen.className !== "ended" && splashScreen.className !== "ending") {
        splashScreen.className = "ending";
        setTimeout(() => splashScreen.className = "ended", 300);
    }
}
