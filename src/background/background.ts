chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

const extensions = "https://developer.chrome.com/docs/extensions";
const webstore = "https://developer.chrome.com/docs/webstore";

chrome.action.onClicked.addListener(async tab => {
    if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
        // Check the current state
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        // Define the next state to always be the opposite of the current state
        const nextState = prevState === "ON" ? "OFF" : "ON";

        // Set the action badge to the next state
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });

        // Code to change teh layout of the page
        if (nextState === "ON") {
            // Insert the CSS file when the user turns the extension ON
            await chrome.scripting.insertCSS({
                files: ["focus-mode.css"],
                target: { tabId: tab.id },
            });
        } else if (nextState === "OFF") {
            // Remove the CSS file when the user turns the extension OFF
            await chrome.scripting.removeCSS({
                files: ["focus-mode.css"],
                target: { tabId: tab.id },
            });
        }
    }
});
