/* This runs on all "youtube.com/watch" web pages */
console.log("----- [content_script.js] LOADED");

if (window.location.href.includes("instagram.com/direct"))
{
    console.log("Adding Right Click option to Instagram messenger")

    chrome.runtime.sendMessage({ greeting: "ADD" }, function (response)
    {
        console.log(response.farewell);
    });
}

chrome.extension.onMessage.addListener(function (message, sender, callback)
{
    if (message.functiontoInvoke == "InstagramMessages")
    {
        InstagramMessages();
    }
});

function InstagramMessages()
{
    console.log("[InstagramMessages] Start...")

    const selection = window.getSelection()
    const selected_word = selection.toString()

    const parent_of_selected = selection.anchorNode.parentNode
    let message_current_text = parent_of_selected.innerText
    message_current_text = message_current_text.replace(selected_word, "<b>" + selected_word + "</b>");

    const root_element = parent_of_selected.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;

    let messages = [];
    let node_above = root_element

    const message_side = getComputedStyle(root_element.childNodes[1].children[0].children[0]).alignSelf;

    messages.push([message_current_text, message_side])

    // qF0y9
    let number_of_messages_before = 3;
    let count = 0;
    while ((node_above = node_above.previousSibling) !== null && count !== number_of_messages_before && node_above.childElementCount > 1)
    {
        const node_with_css = node_above.childNodes[1].children[0].children[0]
        const chat_side = getComputedStyle(node_with_css).alignSelf;

        messages.push([node_above.innerText, chat_side])
        count += 1;
    }

    console.log(messages)
    console.log("[InstagramMessages] End")

    GenerateChatHTML(messages)
}

function GenerateChatHTML(messages)
{
    console.log("[GenerateChatHTML] Start...")

    var base_HTML = "<style>\
        .center {\
            width: 50%;\
            margin: 0 auto;\
            font-family: Red hat Display, sans-serif;\
            font-weight: 400;\
            text-align: left;\
            line-height: 1.5em;\
            letter-spacing: 0.025em;\
            color: #333;\
            background: #f7f7f7;\
        }\
        .message {\
            font-size: 0.9rem;\
            color: #999;\
        }\
        .chat {\
            position: relative;\
            border-radius: 1rem;\
            background: white;\
            border-radius: 1.125rem 1.125rem 1.125rem 1.125rem;\
        }\
        .chat .messages {\
            padding: 1rem;\
            background: #f7f7f7;\
            flex-shrink: 2;\
            overflow-y: auto;\
        }\
        .chat .messages .message {\
            box-sizing: border-box;\
            padding: 0.5rem 1rem;\
            margin: 1rem;\
            background: #fff;\
            border-radius: 1.125rem 1.125rem 1.125rem 0;\
            min-height: 2.25rem;\
            width: -webkit-fit-content;\
            width: -moz-fit-content;\
            width: fit-content;\
            max-width: 66%;\
            box-shadow: 0 0 2rem rgba(0, 0, 0, 0.075), 0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.1);\
        }\
        .chat .messages .message.right {\
            margin: 1rem 1rem 1rem auto;\
            border-radius: 1.125rem 1.125rem 0 1.125rem;\
            background: #333;\
            color: white;\
        }\
    </style>\
        <div class=\"center\">\
            <div class=\"chat\">\
                <div class=\"messages\" id=\"chat\">"

    // left message  = 'flex-start'
    // right message = 'flex-end'
    //<div class="message right"></div>
    //<div class="message left"></div>

    // add the messages in reverse order
    for (var i = messages.length - 1; i >= 0; i--)
    {
        if (messages[i][1] === 'flex-start')
        {
            base_HTML += "<div class=\"message left\">" + messages[i][0] + "</div>"
        }
        else if (messages[i][1] === 'flex-end')
        {
            base_HTML += "<div class=\"message right\">" + messages[i][0] + "</div>"
        }
    }

    base_HTML += "</div>\
            </div>\
        </div>"

    //console.log(base_HTML)

    sendToAnki(messages, base_HTML)
}


function sendToAnki(messages, chat_message_HTML)
{
    console.log("Sending to Anki...")

    chrome.storage.local.get(['ankiDeckNameSelected', 'ankiNoteNameSelected', 'ankiFieldChatImage', 'ankiSelectedMessage', 'ankiConnectUrl'],
        ({ ankiDeckNameSelected, ankiNoteNameSelected, ankiFieldChatImage, ankiSelectedMessage, ankiConnectUrl }) =>
        {
            url = ankiConnectUrl || 'http://localhost:8765';
            model = ankiNoteNameSelected || 'Basic';
            deck = ankiDeckNameSelected || 'Default';

            console.log({
                ankiDeckNameSelected,
                ankiNoteNameSelected,
                ankiFieldChatImage,
                ankiSelectedMessage,
                ankiConnectUrl
            })

            var fields = {
                [ankiFieldChatImage]: chat_message_HTML,
                [ankiSelectedMessage]: messages[0][0]
            };

            console.log(fields)

            var body = {
                "action": "addNote",
                "version": 5,
                "params": {
                    "note": {
                        "fields": fields,
                        "modelName": model,
                        "deckName": deck,
                        "tags": ["Translator2Anki"]
                    }
                }
            };
            var permission_data = {
                "action": "requestPermission",
                "version": 6,
            };

            console.log("Fetching...")

            fetch(url, {
                method: "POST",
                body: JSON.stringify(permission_data),
            })
                .then((res) => res.json())
                .then((data) =>
                {
                    console.log(data);
                    fetch(url, {
                        method: "POST",
                        body: JSON.stringify(body),
                    })
                        .then((res) => res.json())
                        .then((data) =>
                        {
                            console.log("Fetch Return:")
                            if (data.result === null)
                            {
                                alert("Error!\n" + data.error)
                            }
                            console.log("Sucess")
                        }).catch((error) => console.log("EEROR! ", error));
                })
                .catch((error) => console.log("EEROR! ", error));
            console.log("Sent to ANKI complete!\n");
        });
}