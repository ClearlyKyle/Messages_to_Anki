/* backgound.js */
console.log("----- [backgound.js] LOADED");

//chrome.runtime.onMessage.addListener(
//	function (response, sender, sendResponse) {
//		console.log("background message recieved")
//		var opt = {
//			type: "basic",
//			title: response.reason,
//			message: response.message,
//			iconUrl: "/icons/256x256.png"
//		}
//		chrome.notifications.create("message", opt, (e) => console.log(e));
//		sendResponse();
//	}
//);

const showOnPages = [
	"*://*.instagram.com/direct/*",
	"*://*.whatsapp.com/*",
];


chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse)
	{
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");

		if (request.greeting === "ADD")
		{
			chrome.contextMenus.create({
				title: 'ANKI',
				onclick: function (e)
				{
					chrome.tabs.query({
						"active": true,
						"currentWindow": true
					}, function (tabs)
					{
						chrome.tabs.sendMessage(tabs[0].id, {
							"functiontoInvoke": "InstagramMessages"
						});
					});
				},
				contexts: ["selection"],
				documentUrlPatterns: showOnPages
			}, () => { });

			sendResponse({ status: "complete" });
		}
	}
);