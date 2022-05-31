<p align="center">
    <img src="readmeFiles/document-3503099_960_720.png" alt="drawing" width="30%"/>
</p>

# <p align="center">DocWriter</p>

<p align="center">DocWriter is your Discord bot to help writing documents without needing to leave the app</p>

<hr><br>

# README Translations

<ul>

### <li>[Português Brasileiro/Brazilian Portuguese](README_pt-BR.md)</li>

</ul>

<br><hr><br>

# How does it work?

#### To use DocWriter you need to follow these simple steps:

<ol>
    <li>Invite DocWriter to your server (Currently unavailable, more on: [Self-Hosting DocWriter](#Self-Hosting-DocWriter))</li>
    <li>Write a message that you want to add to your document</li>
    <li>Use the command `doc|addcontent` to include the text on the document</li>
    <li>Finish the document and generate a PDF file using the command `doc|exportpdf <your_file_name>`</li>
</ol>

<p align="center">
    <img src="readmeFiles/demonstration.gif" alt="drawing" width="50%"/>
</p>

<br><hr><br>

# Commands

### DocWriter has two sets of commands: Utility commands and Formatting commands:
<br>

## Utility Commands
**doc|addcontent** -> Adds last message to the document without finishing the mounting

**doc|exportpdf** `<file_name>` -> Finishes mounting the document and export it as PDF

**doc|fonts** -> Show all available fonts

**doc|help** -> Show all available commands for DocWriter

**doc|onepagepdf** `<file_name>` -> Generates a single page PDF file using the user's last text message

**doc|preview** -> Shows the preview of the current document

**doc|redo** -> Redoes the previous undone addition on the file

**doc|undo** -> Undoes the previous addition on the file
<br><br>

## Formatting commands
**doc|align** `<right/left/center/justify>` -> Changes the content's alignment

**doc|bgcolor** `<bg_color>` -> Changes the font background color (`<bg_color>` can be a name or a hex code, ex: #E0E0E0 or lightblue)

**doc|bold** -> Toggles bold on the current font

**doc|dashed** `<double/nothing>` -> Toggles dashed or double dashed on the current font, add "double" as a parameter to toggle double dashed

**doc|firstlineindent** `<line_indent/nothing>` -> Changes/disables the indentation before the first line (measured in centimeters)

**doc|fontcolor** `<font_color>` -> Changes the font color (`<font_color>` can be a name or a hex code, ex: #E0E0E0 or lightblue)

**doc|fontfamily** `<font_family>` -> Changes the current font family

**doc|fontsize** `<font_size>` -> Changes the font's current size (measured in PTs)

**doc|italic** -> Toggles italic on the current font

**doc|lineheight** `<line_height>` -> Changes the lines' height (measured in cm)

**doc|overline** -> Toggles overline on the current font

**doc|setmargins** `<margin_top/.> <margin_right/.> <margin_bottom/.> <margin_left/.>` -> Changes the margin measurements (use `.` if you don't want to change, example: `doc|setmargins . . 3 .` -> will set margin-bottom to 3cm)

**doc|subscript** -> Toggles subscript on the current font

**doc|superscript** -> Toggles superscript on the current font

**doc|underline** -> Toggles underline on the current font

<br><hr><br>

# Self-Hosting DocWriter

### Currently DocWriter isn't available publicly, however you can clone this repository and host your own DocWriter on your machine!

### You can do that by following these steps:

<ol>

### <li>Access the [Discord's Developer Portal](https://discord.com/developers/applications) and log in with your account</li>

### <li>Start a new application and give it a cool name, like: "DocWriter_Jr"</li>

### <li>Go to the "Bot" section and add a new bot to your application</li>

### <li>Clone this repository on your machine, preferably on an empty folder for better organization</li>

### <li>Go back to the "Bot" section on your application and generate a new token</li>

### <li>Create a ".env" file on the root of the repository and add inside it: `BOT_TOKEN="<generated_token>"`</li>

### <li>Now, invite your bot to your server by going to the "OAuth2" section and then "URL Generator", select the "bot" scope and include the following permissions:
<ul>
    <li>Read Messages/View Channels</li>
    <li>Send Messages</li>
    <li>Manage Messages</li>
    <li>Attach Files</li>
    <li>Read Message History</li>
</ul>

### Open the generated URL on your browser and invite your "DocWriter_Jr" to your server</li>

### <li>Make sure to have [Node.js](https://nodejs.org/en/) installed on your machine (you can see which version is installed by running `node --version` on your terminal, in case no version appears you should install it)</li>

### <li>Open a terminal inside the repository directory and run `npm start`</li>

### <li>Enjoy your own DocWriter now functional on your server! :tada: </li>

<br><hr><br>

# License

<ul>

### <li>This project works under the [MIT License](LICENSE)</li>

### <li>All fonts used by DocWriter are available on [Google Fonts](https://fonts.google.com)
