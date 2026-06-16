# FAST University Virtual Tour

This is a lightweight Marzipano virtual tour built with plain HTML, CSS, and JavaScript. The project was exported from Marzipano Tool and then cleaned up so future scenes and hotspots can be added mostly from `data.js`.

## Project Structure

- `index.html` creates the viewer container, top title bar, sidebar container, loading screen, and control buttons. It loads vendor scripts, `data.js`, and `index.js`.
- `data.js` is the tour manifest. It stores scene IDs, names, tile levels, face sizes, starting camera views, link hotspots, info hotspots, and UI settings.
- `index.js` initializes Marzipano, creates scenes from `data.js`, builds the sidebar dynamically, creates hotspots, switches scenes, and manages UI state.
- `style.css` controls the professional academic layout, responsive sidebar, top bar, loading screen, hotspots, info hotspot modals, and optional view controls.
- `img/` stores UI and hotspot icons used by the tour.
- `tiles/` stores the panorama tiles. Each scene has a folder named exactly like its `id` in `data.js`.
- `vendor/` stores Marzipano and small helper libraries required by the exported tour.

## Current Tour Summary

The tour contains 9 scenes:

1. `0-dhaba-inside_upscale-1`
2. `1-fitness_upscale-1`
3. `2-football-ground_upscale-1`
4. `3-fsm-2_upscale-1`
5. `4-fsm-2nd-floor-2_upscale-1`
6. `5-fsm-2nd-floor_upscale1`
7. `6-fsm-3_upscale1`
8. `7-tennis-court_upscale1`
9. `8-walkway-between-tennis-n-football-ground_upscale1`

All existing link hotspots point to valid scene IDs. There are currently no informational hotspots.

## How Navigation Works

`index.js` reads `APP_DATA.scenes` from `data.js`. For each scene it creates:

- a Marzipano image source using `tiles/<scene-id>/{z}/{f}/{y}/{x}.jpg`
- a cube geometry using that scene's `levels`
- an initial view from `initialViewParameters`
- link hotspots from `linkHotspots`
- info hotspots from `infoHotspots`

When a user clicks a sidebar item or link hotspot, `switchScene()` resets the camera to the target scene's initial view, switches the Marzipano scene, updates the scene title, and highlights the current sidebar item.

## How To Add A New Panorama

1. Export or generate Marzipano cube tiles for the panorama.
2. Place the new tile folder inside `tiles/`.
3. Make sure the folder contains `preview.jpg` and tile paths in Marzipano's format: `{z}/{f}/{y}/{x}.jpg`.
4. Use a simple lowercase scene ID such as `9-library-entrance`.

## How To Create A New Scene

Add a new object to `APP_DATA.scenes` in `data.js`:

```js
{
  "id": "9-library-entrance",
  "name": "Library Entrance",
  "levels": [
    { "tileSize": 256, "size": 256, "fallbackOnly": true },
    { "tileSize": 512, "size": 512 },
    { "tileSize": 512, "size": 1024 }
  ],
  "faceSize": 1024,
  "initialViewParameters": {
    "yaw": 0,
    "pitch": 0,
    "fov": 1.3
  },
  "linkHotspots": [],
  "infoHotspots": []
}
```

The `id` must exactly match the tile folder name.

## How To Connect Scenes

Add a link hotspot to the source scene's `linkHotspots` array:

```js
{
  "yaw": 0.5,
  "pitch": 0,
  "rotation": 0,
  "target": "9-library-entrance"
}
```

`target` must be the destination scene ID. Use Marzipano Tool or browser console experimentation to find good `yaw` and `pitch` values.

## How To Add Informational Hotspots

Add an info hotspot to a scene's `infoHotspots` array:

```js
{
  "yaw": 1.2,
  "pitch": -0.1,
  "title": "Admissions Office",
  "text": "This office supports student admissions and enrollment guidance."
}
```

Info hotspots are rendered by `createInfoHotspotElement()` in `index.js`.

## Current Marzipano Quality Configuration

Each current scene uses:

- `faceSize`: `1024`
- fallback level: `tileSize 256`, `size 256`
- level 1: `tileSize 512`, `size 512`
- level 2: `tileSize 512`, `size 1024`

This means the maximum cube face resolution is 1024 pixels. For modern screens, that can look soft or pixelated, especially when users zoom in.

Recommended settings for future panoramas:

- Capture/export at higher resolution when possible.
- Prefer `faceSize` values of `2048`, `4096`, or higher for important scenes.
- Keep tile sizes at `512` for broad compatibility.
- Add more levels so Marzipano can load lower resolution first and sharper tiles as needed.
- Avoid heavily compressed JPEG tiles if visual quality is important.
- Keep camera exposure and stitching consistent across scenes.

## How To Run Locally With Live Server

1. Open the `app-files` folder in Visual Studio Code.
2. Install the Live Server extension if it is not already installed.
3. Right-click `index.html`.
4. Choose `Open with Live Server`.

Opening through a local server is better than double-clicking `index.html` because browsers can restrict local file loading.

## How To Deploy

Upload the contents of the `app-files` folder to any static web host. Keep the folder structure unchanged:

- `index.html`
- `data.js`
- `index.js`
- `style.css`
- `img/`
- `tiles/`
- `vendor/`

Static hosts such as GitHub Pages, Netlify, Vercel static output, or a university web server can serve this project without a backend.

