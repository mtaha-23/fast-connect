# FAST University Virtual Tour

This is a plain HTML, CSS, JavaScript, and Marzipano virtual tour. The current tour contains 21 scenes and uses `data.js` as the main place for scenes, hotspots, and tour settings.

## How To Run

Open the `app-files` folder in VS Code and run `index.html` with Live Server. A local server is recommended because browsers can restrict tile loading when files are opened directly.

## Main Files

- `index.html` contains the viewer, dashboard, title bar, loading screen, and control buttons.
- `data.js` contains the tour manifest: scenes, panorama tile settings, link hotspots, info hotspots, and app settings.
- `index.js` initializes Marzipano, creates scenes and hotspots, builds the dashboard from `data.js`, and handles navigation.
- `style.css` contains the dashboard, responsive layout, loading screen, and hotspot styling.
- `tiles/` contains one folder per panorama scene.
- `img/` contains icons for controls and hotspots.
- `vendor/` contains Marzipano and helper libraries.

## Adding More Scenes

1. Generate Marzipano tiles for the new panorama.
2. Copy the new tile folder into `tiles/`.
3. Add a scene object to the `scenes` array in `data.js`.
4. Make sure the scene `id` exactly matches the tile folder name.

## Adding Link Hotspots

Add a hotspot object to the source scene's `linkHotspots` array:

```js
{
  "yaw": 0.5,
  "pitch": 0,
  "rotation": 0,
  "target": "target-scene-id"
}
```

`target` must match another scene's `id`.

## Adding Info Hotspots

Add an object to a scene's `infoHotspots` array:

```js
{
  "yaw": -0.85,
  "pitch": -0.08,
  "title": "Central Library",
  "text": "Helpful information shown when the user clicks the info hotspot."
}
```

Info hotspots are best for labels, instructions, department notes, and short descriptions.

## Current Quality Notes

This tour uses mixed `faceSize` values: `500` for several new low-resolution scenes and `1024` for older/upscaled scenes. Scenes with `faceSize: 500` may look noticeably softer. For future panoramas, export tiles at `faceSize` 2048 or higher when possible, with 512px tiles and multiple resolution levels.

