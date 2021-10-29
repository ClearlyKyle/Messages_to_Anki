/* backgound.js */
console.log("----- [backgound.js] LOADED");

const showOnPages = [
	"*://*.instagram.com/direct/*",
	"*://*.whatsapp.com/*",
	"*://*.hellotalk.com/*"
];

function AddRightClickOption()
{
	console.log("[backgound.js] Adding Right Click Option");

	chrome.contextMenus.create({
		title: 'ANKI',
		onclick: function (e)
		{
			chrome.tabs.query({
				"active": true,
				"currentWindow": true
			}, function (tabs)
			{
				//console.log(tabs[0].url)
				const url = tabs[0].url
				if (url.includes("instagram.com/direct"))
				{
					message = "InstagramMessages"
				}
				else if (url.includes("web.hellotalk.com"))
				{
					message = "HelloTalkMessages"
				}
				console.log("Sending message: " + message)
				chrome.tabs.sendMessage(tabs[0].id, {
					"functiontoInvoke": message
				});
			});
		},
		contexts: ["selection"],
		documentUrlPatterns: showOnPages
	}, () => { });
}

AddRightClickOption()