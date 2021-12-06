# Messages to Anki

Learn words in context by making flash cards from chat messages. 

Current works with:
>HelloTalk<br>
>Instagram<br>
>WhatsApp<br>
>VK

Make Anki flash cards with context from chat messages. 

## Setup

1) Must install [AnkiConnect](https://ankiweb.net/shared/info/2055492159) plugin.
2) Must leave the Anki desktop application open in order to connect to it.
3) Install unpacked extension in Chrome
4) Set settings: Deck, Fields, URL - to connect to Anki (default is `http://localhost:8765`)

## Usage

Highlight a word that you wish to save. Righcliking the highligted word and choosing the option "ANKI" will send the current message to Anki. A flash card will be made with the selected amount of messages before and after the message with the selected word.

![example-chat-screenshot](https://raw.githubusercontent.com/ClearlyKyle/Messages_to_Anki/master/Example_chat.PNG)

## Settings

Configure:
1) `Localhost` - Url to connect with Ankiconnect
1) `Deck` - Which deck to put flash card in
1) `Card` - Note type to use

Exported data fields:

 1) `Chat Image` - image showing chat context 
 3) `Selected Word` - highlighted word to save
 2) `Selected Message` - the text from the message with the selected word
 4) `Messages Before` - number of messages before(above) message with selected word
 5) `Messages After` - number of messages after(bellow) message with selected word

Settings allow you to choose which fields get which big of data. A blank options means that data is skipped

![options-screenshot](https://raw.githubusercontent.com/ClearlyKyle/Messages_to_Anki/master/settings.PNG)