chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

const extensions = "https://developer.chrome.com/docs/extensions";
const webstore = "https://developer.chrome.com/docs/webstore";

chrome.action.onClicked.addListener(async tab => {
    // Ensure tab.url is defined and is a string
    if (
        tab.url &&
        (tab.url.startsWith(extensions) || tab.url.startsWith(webstore))
    ) {
        // Check the current state
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        // Define the next state to always be the opposite of the current state
        const nextState = prevState === "ON" ? "OFF" : "ON";

        // Set the action badge to the next state
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });

        // Code to change the layout of the page
        if (nextState === "ON") {
            // Insert the CSS file when the user turns the extension ON
            if (typeof tab.id === "number") {
                await chrome.scripting.insertCSS({
                    files: ["focus-mode.css"],
                    target: { tabId: tab.id },
                });
            } else {
                console.error(
                    "Failed to insert CSS because tab.id is undefined."
                );
            }
        } else if (nextState === "OFF") {
            // Remove the CSS file when the user turns the extension OFF
            if (typeof tab.id === "number") {
                await chrome.scripting.removeCSS({
                    files: ["focus-mode.css"],
                    target: { tabId: tab.id },
                });
            } else {
                console.error(
                    "Failed to remove CSS because tab.id is undefined."
                );
            }
        }
    } else {
        console.error(
            "Error: tab.url is undefined or does not start with the expected strings."
        );
    }
});

// Add and empty export statement to make this file a module
export {}