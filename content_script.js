/* This runs on all "youtube.com/watch" web pages */
console.log("----- [content_script.js] LOADED");

// TODO: add option for number of messages before

(function ()
{
    chrome.extension.onMessage.addListener(function (message, sender, callback)
    {
        if (message.functiontoInvoke == "InstagramMessages")
        {
            InstagramMessages();
        }
        else if (message.functiontoInvoke == "HelloTalkMessages")
        {
            HelloTalkMessages();
        }
        else if (message.functiontoInvoke == "WhatsAppMessages")
        {
            WhatsAppMessages();
        }
    });
    //
    // INSTAGRAM 
    //
    function InstagramMessages()
    {
        console.log("\n[InstagramMessages] Start...")

        const selection = window.getSelection()
        const selected_word = selection.toString()

        const parent_of_selected = selection.anchorNode.parentNode
        const root_element = parent_of_selected.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;

        let messages = [];
        if (root_element.children[1].children.length > 1) // a message with a reply
        {
            // Get reply message
            let message_reply = root_element.children[1].children[1].innerText;
            message_reply = message_reply.replace(selected_word, "<b>" + selected_word + "</b>");

            // Get message that was replied from
            const message_replied_from = root_element.children[1].children[0].children[1].innerText;
            const message_side = getComputedStyle(root_element.children[1].children[0]).alignItems;

            messages.push([message_reply, message_side, selected_word.toLowerCase()])
            messages.push([message_replied_from, message_side + " reply"])

        } else 
        {
            const message_side = getComputedStyle(root_element.childNodes[1].children[0].children[0]).alignSelf;

            let message_current_text = parent_of_selected.innerText
            message_current_text = message_current_text.replace(selected_word, "<b>" + selected_word + "</b>");

            messages.push([message_current_text, message_side, selected_word.toLowerCase()])
        }

        console.log("Selected word message")
        console.log(messages)

        let node_above = root_element

        // loop through X number of messages before (up direction in chat)
        chrome.storage.local.get("messagesBefore", (stored) =>
        {
            const number_of_messages_before = Number(stored["messagesBefore"]);
            let count = 0;

            console.log("Number of messages to collect = ", number_of_messages_before);

            while ((node_above = node_above.previousSibling) !== null && count !== number_of_messages_before)
            {
                if (node_above.childNodes[1] === undefined || node_above.innerText === "")
                    continue

                console.log("Message to collect :")
                console.log(node_above);
                console.log(node_above.children[1].children.length);

                if (node_above.children[1].children.length > 1) // a message with a reply
                {
                    // Get reply message
                    let message_reply = node_above.children[1].children[1].innerText;
                    message_reply = message_reply.replace('Like\nCopy\nReport\n', '');

                    // Get message that was replied from
                    const message_replied_from = node_above.children[1].children[0].children[1].innerText;
                    const message_side = getComputedStyle(node_above.children[1].children[0]).alignItems;

                    console.log({ message_reply })
                    console.log({ message_replied_from })

                    messages.push([message_reply.replace('\n❤️', ''), message_side])
                    messages.push([message_replied_from, message_side + " reply"])

                } else 
                {
                    const message_side = getComputedStyle(node_above.childNodes[1].children[0].children[0]).alignSelf;
                    const message_text = node_above.innerText;

                    if (message_text === '❤️')// Possible "liked" gif
                        continue;

                    console.log({ message_text })
                    console.log({ message_side })

                    messages.push([message_text.replace('\n❤️', ''), message_side])
                }

                count += 1;
            }

            // converting all flex adjustments to left and right
            messages.forEach(element =>
            {
                if (element[1] === 'flex-start')
                    element[1] = 'left'
                else if (element[1] === 'flex-end')
                    element[1] = 'right'
                else if (element[1] === 'flex-start reply')
                    element[1] = 'left reply'
            });

            SendMessageToBackGround(messages)
            console.log("Completed all messages..")
            console.log(messages)

            GenerateChatHTML(messages)
        })
    }

    //
    // HELLOTALK
    //
    function HelloTalkMessages()
    {
        console.log("\n[HelloTalkMessages] Start...")

        const selection = window.getSelection()
        const selected_word = selection.toString()

        const parent_of_selected = selection.anchorNode.parentNode
        let message_current_text = parent_of_selected.innerText
        message_current_text = message_current_text.replace(selected_word, "<b>" + selected_word + "</b>");

        const root_element = parent_of_selected.parentNode.parentElement.parentElement.parentElement;

        let messages = [];
        let node_above = root_element

        const message_side = getComputedStyle(root_element.children[0]).flexDirection;

        messages.push([message_current_text, message_side, selected_word.toLocaleLowerCase()])

        // loop through X number of messages before (up direction in chat)
        chrome.storage.local.get("messagesBefore", (stored) =>
        {
            const number_of_messages_before = Number(stored["messagesBefore"]);

            let count = 0;
            while ((node_above = node_above.previousSibling) !== null && count !== number_of_messages_before)
            {
                const node_with_css = node_above.childNodes[0]
                const chat_side = getComputedStyle(node_with_css).flexDirection;

                var message_text = node_above.innerText;

                messages.push([message_text, chat_side])
                count += 1;
            }
            messages.forEach(e =>
            {
                if (e[1] === 'row')
                    e[1] = 'left'
                else if (e[1] === 'row-reverse')
                    e[1] = 'right'
            })

            console.log(messages)

            GenerateChatHTML(messages)
        })
    }

    //
    // WHATSAPP
    //
    function WhatsAppMessages()
    {
        console.log("\n[WhatsAppMessages] Start...")

        const selection = window.getSelection()
        const selected_word = selection.toString()

        const parent_of_selected = selection.anchorNode.parentNode
        let message_current_text = parent_of_selected.innerText
        message_current_text = message_current_text.replace(selected_word, "<b>" + selected_word + "</b>");

        const root_element = parent_of_selected.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;

        let messages = [];
        let node_above = root_element

        const message_side = getComputedStyle(root_element).alignItems;

        messages.push([message_current_text, message_side, selected_word.toLowerCase()])

        // loop through X number of messages before (up direction in chat)
        chrome.storage.local.get("messagesBefore", (stored) =>
        {
            const number_of_messages_before = Number(stored["messagesBefore"]);

            let count = 0;
            while ((node_above = node_above.previousSibling) !== null && count !== number_of_messages_before)
            {
                // const node_with_css = node_above.childNodes[1].children[0].children[0]
                const chat_side = getComputedStyle(node_above).alignItems;
                const message_text = node_above.getElementsByClassName('copyable-text')[0].innerText;

                // remove the message likes which show a heart
                messages.push([message_text, chat_side])
                count += 1;
            }

            // converting all flex adjustments to left and right
            messages.forEach(element =>
            {
                if (element[1] === 'flex-start')
                    element[1] = 'left'
                else if (element[1] === 'flex-end')
                    element[1] = 'right'
            });
            SendMessageToBackGround(messages)

            GenerateChatHTML(messages)
        })
    }

    function GenerateChatHTML(saved_messages)
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
        .chat .messages .message.left.replymessage {\
            font-size: 0.7rem;\
            box-sizing: border-box;\
            /* padding: top/bottom left/right */\
            padding: 0.1rem 1rem;\
            /* margin: top right bottom left */\
            margin: 1rem 1rem -0.8rem 2.5rem;\
            background: #ffF;\
            border-radius: 1.125rem 1.125rem 1.125rem 1.125rem;\
            min-height: 1.25rem;\
            width: -webkit-fit-content;\
            width: -moz-fit-content;\
            width: fit-content;\
            max-width: 50%;\
            box-shadow: 0 0 2rem rgba(0, 0, 0, 0.075), 0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.1);\
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
        for (var i = saved_messages.length - 1; i >= 0; i--)
        {
            if (saved_messages[i][1] === 'left')
            {
                base_HTML += "<div class=\"message left\">" + saved_messages[i][0] + "</div>"
            }
            else if (saved_messages[i][1] === 'left reply')
            {
                base_HTML += "<div class=\"message left replymessage\">" + saved_messages[i][0] + "</div>"
            }
            else if (saved_messages[i][1] === 'right')
            {
                base_HTML += "<div class=\"message right\">" + saved_messages[i][0] + "</div>"
            }
        }

        base_HTML += "</div>\
            </div>\
        </div>"

        //console.log(base_HTML)

        sendToAnki(saved_messages, base_HTML)
    }


    function sendToAnki(messages, chat_message_HTML)
    {
        console.log("Sending to Anki...")

        chrome.storage.local.get(['ankiDeckNameSelected', 'ankiNoteNameSelected', 'ankiFieldChatImage', 'ankiSelectedMessage', 'ankiSelectedWord', 'ankiConnectUrl'],
            ({ ankiDeckNameSelected, ankiNoteNameSelected, ankiFieldChatImage, ankiSelectedMessage, ankiSelectedWord, ankiConnectUrl }) =>
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
                    [ankiSelectedMessage]: messages[0][0],
                    [ankiSelectedWord]: messages[0][2]
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
                            "tags": ["Translator2Anki"],
                            "options": {
                                "allowDuplicate": true,
                            }
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
                        if (data.error !== null)
                        {
                            console.log("Permission Failed")
                            console.log(data);
                            return
                        }
                        console.log("Permission Granted")
                        console.log(data);

                        fetch(url, {
                            method: "POST",
                            body: JSON.stringify(body),
                        })
                            .then((res) => res.json())
                            .then((data) =>
                            {
                                console.log("Fetch Return:")
                                console.log(data)
                                if (data.result === null)
                                {
                                    // https://jsfiddle.net/2qasgcfd/3/
                                    // https://github.com/apvarun/toastify-js
                                    Toastify({
                                        text: "Error! " + data.error,
                                        duration: 2000,
                                        style: {
                                            background: "red",
                                        }
                                    }).showToast();
                                    SendMessageToBackGround("Error! " + data.error)

                                    return
                                }
                                else
                                {
                                    /* show sucess message */
                                    Toastify({
                                        text: "Sucessfully added to ANKI",
                                        duration: 2000,
                                        style: {
                                            background: "light blue",
                                        }
                                    }).showToast();
                                    SendMessageToBackGround("Sucessfully added to ANKI")

                                }
                            })
                            .catch((error) =>
                            {
                                /* show error message */
                                Toastify({
                                    text: "Error! " + error.error,
                                    duration: 2000,
                                    style: {
                                        background: "red",
                                    }
                                }).showToast();
                                SendMessageToBackGround("Error! " + error.error)
                            })
                    }).catch((error) =>
                    {
                        /* show error message */
                        Toastify({
                            text: "Error! " + error.error,
                            duration: 2000,
                            style: {
                                background: "red",
                            }
                        }).showToast();
                        console.log(error)
                        SendMessageToBackGround(error.error)

                    });
                console.log("Send to ANKI complete!\n");
                SendMessageToBackGround("Send to ANKI complete!")

            }
        );
    }

    function SendMessageToBackGround(text)
    {
        // send sucess message to background
        chrome.runtime.sendMessage({
            message: text
        });
    }

})();