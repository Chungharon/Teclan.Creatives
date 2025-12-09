<<<<<<< HEAD
# Three.Js
=======
# InboxCleanse AI - Chrome Extension

This is a React-based Chrome Extension. You **cannot** load the source code directly into Chrome. You must build it first.

## 🚀 Installation Instructions

### 1. Build the Project
Open your terminal in this folder and run:

```bash
yarn install
yarn run build
```

This will create a new folder called **`dist`**.

### 2. Load into Chrome
1. Open Chrome and go to `chrome://extensions`.
2. Toggle **Developer mode** (top right corner).
3. Click **Load unpacked**.
4. ⚠️ **Important:** Select the **`dist`** folder inside this project (not the main project folder).

## Troubleshooting
- **"Could not load javascript 'content.js'"**: This means you selected the wrong folder or didn't run `npm run build`. Make sure you load the `dist` folder.
- **"Could not load manifest"**: Ensure `manifest.json` is copied to the dist folder (Vite handles this automatically if configured, otherwise manually copy it to `dist` if it's missing, though the build script should handle imports). 

*Note: Since manifest.json is in the root, our current Vite config focuses on JS/CSS. You may need to manually copy `manifest.json` to the `dist` folder after building if the build tool doesn't move it, OR use a vite plugin like `vite-plugin-static-copy`.*

**Manual Step:** If `manifest.json` is missing from `dist` after build:
Copy `manifest.json` from the root into the `dist` folder.
>>>>>>> main
