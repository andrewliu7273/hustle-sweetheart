# Hustle Sweetheart

A minimal baby-pink GitHub Pages website for one anniversary voice recording.

## Add The Voice Recording

When the recording is ready:

1. Create a folder named `media` beside `index.html`.
2. Put the audio file in that folder.
3. Rename the audio file to:

```text
voice-recording.mp3
```

The final path should be:

```text
media/voice-recording.mp3
```

The homepage already looks for that exact file. Once the file is in place, the play, stop, and drag bar controls will work.

## Quiz Gate

The homepage now asks five Adri-specific questions before revealing the player. This is a casual privacy gate for people opening the QR code, not true server-side password protection. On GitHub Pages, the audio file is still public if someone knows the direct file URL.

After editing the quiz or player, upload/replace these files on GitHub:

```text
index.html
styles.css
app.js
```

If your file is `.m4a`, either convert it to `.mp3` or update this line in `index.html`:

```html
<audio id="voicePlayer" controls preload="metadata" src="media/voice-recording.mp3">
```

## GitHub Pages Setup

1. Create a GitHub repository.
2. Upload:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `media/voice-recording.mp3` after you have it
3. In GitHub, open **Settings > Pages**.
4. Choose **Deploy from a branch**.
5. Select the `main` branch and `/root`.
6. Use the GitHub Pages URL for your QR code.

Example URL:

```text
https://your-username.github.io/hustle-sweetheart/
```

## QR Charm

Point the QR code to the GitHub Pages URL, not directly to the audio file. That way the carrot charm opens the polished page first.

The ready-to-import 3D QR plate is:

```text
qr/tinyurl-20mm-compact-border1-raised.stl
```

It is 20 mm x 20 mm, with a 0.6 mm base and 0.45 mm raised QR modules. In SolidWorks, use **Insert > Part** or open the STL and import it as a solid/graphics body depending on your version, then position it on the charm.

To generate a heart QR code after you have the final GitHub Pages URL:

```powershell
& 'C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' tools/create_heart_qr.py "https://your-username.github.io/hustle-sweetheart/"
```

The script writes:

```text
qr/hustle-sweetheart-heart-qr.png
qr/hustle-sweetheart-heart-qr.svg
```

Use the SVG for SolidWorks/vector work when possible. Keep the heart small so the QR remains easy to scan.

## Privacy

GitHub Pages sites are public to anyone with the link. Use a hard-to-guess repository name and avoid private information you would not want someone else to see.
