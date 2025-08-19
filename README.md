# 🎼 Spicetify-DownloadAll

> ⚠️ **Please Note:** A **Spotify Premium** subscription is required for this extension to work, as the download feature is a Premium-only benefit.

A [Spicetify](https://spicetify.app/) extension to add an intelligent "Download All" button to your library.

  * 🧠 **Smart Button:** The button only appears if there are playlists in your library that haven't been downloaded yet.
  * 📚 **Complete Coverage:** Downloads **all** visible playlists in your library, including those inside folders and playlists from other users that you've saved.
  * 🔄 **Reactive:** The button automatically appears and disappears as your download status changes (e.g., if you manually remove a download, the button reappears\!).

## ⚙️ Installation

Copy `downloadAll.js` to your [Spicetify](https://spicetify.app/) extensions directory:

| **Platform** 💻 | **Path** 📁 |
| :--------------- | :------------------------------------------------------------------------------------- |
| **Linux** | `~/.config/spicetify/Extensions` or `$XDG_CONFIG_HOME/.config/spicetify/Extensions/` |
| **MacOS** | `~/.config/spicetify/Extensions` or `$SPICETIFY_CONFIG/Extensions`                   |
| **Windows** | `%appdata%/spicetify/Extensions/`                                                  |

After placing the extension file in the correct folder, run the following command to install it:

```bash
spicetify config extensions downloadAll.js
```
```bash
spicetify apply
```

## 👉 Usage

  * ✨ A new download button will appear at the top of "Your Library," to the left of the "Create" (+) button.
  * 👆 **The button is only visible** if the script detects that there are playlists in your library (in any folder, from any owner) that are not yet downloaded.
  * ✅ If all your playlists are already downloaded, **the button will automatically disappear**.
  * 🖱️ When you click the button, all remaining playlists will be added to your download queue.
  * 💬 A "Download All" tooltip will appear when you hover over the button.

## ❤️ Thank You

Thank you for using this extension. Enjoy your music\! 🎶✨
