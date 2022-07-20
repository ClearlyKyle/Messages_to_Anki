/* backgound.js */
console.log("----- [backgound.js] LOADED");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse)
{
    console.log(request.message)
    return true; // Inform Chrome that we will make a delayed sendResponse
});

function AddRightClickOption()
{
    console.log("[backgound.js] Adding Right Click Option");

    // https://stackoverflow.com/questions/32718645/google-chrome-extension-add-the-tab-to-context-menu/32719354#32719354

    chrome.contextMenus.removeAll(function ()
    {
        chrome.contextMenus.create({
            id: "ANKI-MESSAGE-CONTEXT-MENU",
            title: "ANKI",
            contexts: ["selection"],
            documentUrlPatterns: [
                "*://*.instagram.com/direct/*",
                "*://*.whatsapp.com/*",
                "*://*.hellotalk.com/*",
                "*://*.telegram.org/k/*",
            ]
        });
    });

    chrome.contextMenus.onClicked.addListener(function (info, tab)
    {
        if (info.menuItemId == "ANKI-MESSAGE-CONTEXT-MENU")
        {
            console.log(tab.url)
            const url = tab.url
            if (url.includes("instagram.com/direct"))
            {
                message = "InstagramMessages"
            }
            else if (url.includes("web.hellotalk.com"))
            {
                message = "HelloTalkMessages"
            }
            else if (url.includes("web.whatsapp.com"))
            {
                message = "WhatsAppMessages"
            }
            console.log("Sending message: " + message)
            chrome.tabs.sendMessage(tab.id, {
                "functiontoInvoke": message
            });
        }
    });
}

AddRightClickOption()