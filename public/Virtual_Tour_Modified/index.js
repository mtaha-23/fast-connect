/*
 * FAST University Virtual Tour
 *
 * This file keeps Marzipano Tool's runtime model, but organizes the app so
 * future scenes and hotspots can be added from data.js without editing HTML.
 */
'use strict';

(function() {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;
  var DEFAULT_SCENE_ID = data.defaultScene || (data.scenes[0] && data.scenes[0].id);

  // Core DOM references used by the viewer and custom UI.
  var panoElement = document.querySelector('#pano');
  var loadingScreenElement = document.querySelector('#loadingScreen');
  var sceneNameElement = document.querySelector('#titleBar .sceneName');
  var sceneListElement = document.querySelector('#sceneList');
  var sceneListItemsElement = document.querySelector('#sceneList .scenes');
  var sceneListToggleElement = document.querySelector('#sceneListToggle');
  var autorotateToggleElement = document.querySelector('#autorotateToggle');
  var fullscreenToggleElement = document.querySelector('#fullscreenToggle');
  var homeButtonElement = document.querySelector('#homeButton');

  // Detect desktop or mobile mode so CSS can adjust controls and overlays.
  if (window.matchMedia) {
    var setMode = function() {
      if (mql.matches) {
        document.body.classList.remove('desktop');
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
        document.body.classList.add('desktop');
      }
    };
    var mql = matchMedia('(max-width: 700px), (max-height: 520px)');
    setMode();
    if (mql.addEventListener) {
      mql.addEventListener('change', setMode);
    } else {
      mql.addListener(setMode);
    }
  } else {
    document.body.classList.add('desktop');
  }

  // Detect touch devices to avoid hover-only UI behavior where it does not fit.
  document.body.classList.add('no-touch');
  window.addEventListener('touchstart', function() {
    document.body.classList.remove('no-touch');
    document.body.classList.add('touch');
  }, { once: true });

  // Use tooltip fallback mode on IE < 11.
  if (bowser.msie && parseFloat(bowser.version) < 11) {
    document.body.classList.add('tooltip-fallback');
  }

  // Viewer options read from data.js to stay compatible with Marzipano exports.
  var viewerOpts = {
    controls: {
      mouseViewMode: data.settings.mouseViewMode
    }
  };

  // Initialize the Marzipano viewer in the full-screen pano element.
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  // Build the sidebar from data.js so adding a scene only changes the manifest.
  renderSceneList(data.scenes);
  var sceneElements = document.querySelectorAll('#sceneList .scene');

  // Create Marzipano scenes and attach all link/info hotspots declared in data.js.
  var scenes = data.scenes.map(function(sceneData) {
    var urlPrefix = 'tiles';
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + '/' + sceneData.id + '/{z}/{f}/{y}/{x}.jpg',
      { cubeMapPreviewUrl: urlPrefix + '/' + sceneData.id + '/preview.jpg' });
    var geometry = new Marzipano.CubeGeometry(sceneData.levels);

    var limiter = Marzipano.RectilinearView.limit.traditional(
      sceneData.faceSize,
      100 * Math.PI / 180,
      120 * Math.PI / 180
    );
    var view = new Marzipano.RectilinearView(sceneData.initialViewParameters, limiter);

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // Link hotspots switch to another scene by target scene id.
    sceneData.linkHotspots.forEach(function(hotspot) {
      var element = createLinkHotspotElement(hotspot);
      if (element) {
        scene.hotspotContainer().createHotspot(element, {
          yaw: hotspot.yaw,
          pitch: hotspot.pitch
        });
      }
    });

    // Info hotspots show descriptive text in-place or as a modal on mobile.
    sceneData.infoHotspots.forEach(function(hotspot) {
      var element = createInfoHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, {
        yaw: hotspot.yaw,
        pitch: hotspot.pitch
      });
    });

    return {
      data: sceneData,
      scene: scene,
      view: view
    };
  });

  if (scenes.length > 1) {
    document.body.classList.add('multiple-scenes');
    document.body.classList.remove('single-scene');
  } else {
    document.body.classList.add('single-scene');
    document.body.classList.remove('multiple-scenes');
  }

  // Set up autorotate, if enabled in data.js.
  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI / 2
  });
  if (data.settings.autorotateEnabled) {
    autorotateToggleElement.classList.add('enabled');
  }
  autorotateToggleElement.addEventListener('click', toggleAutorotate);

  // Set up fullscreen mode. The button remains visible but disables gracefully.
  if (screenfull.enabled && data.settings.fullscreenButton) {
    document.body.classList.add('fullscreen-enabled');
    fullscreenToggleElement.addEventListener('click', function() {
      screenfull.toggle();
    });
    screenfull.on('change', function() {
      fullscreenToggleElement.classList.toggle('enabled', screenfull.isFullscreen);
    });
  } else {
    document.body.classList.add('fullscreen-disabled');
    fullscreenToggleElement.setAttribute('disabled', 'disabled');
    fullscreenToggleElement.setAttribute('title', 'Fullscreen unavailable');
  }

  // UI initialization for sidebar, home, and generated scene buttons.
  sceneListToggleElement.addEventListener('click', toggleSceneList);
  homeButtonElement.addEventListener('click', function() {
    switchScene(findSceneById(DEFAULT_SCENE_ID) || scenes[0]);
  });
  sceneElements.forEach(function(el) {
    el.addEventListener('click', function() {
      switchScene(findSceneById(el.getAttribute('data-id')));
      if (document.body.classList.contains('mobile')) {
        hideSceneList();
      }
    });
  });

  // Start with the scene list open on desktop for easier orientation.
  if (!document.body.classList.contains('mobile')) {
    showSceneList();
  }

  // DOM elements for optional Marzipano view controls.
  var viewUpElement = document.querySelector('#viewUp');
  var viewDownElement = document.querySelector('#viewDown');
  var viewLeftElement = document.querySelector('#viewLeft');
  var viewRightElement = document.querySelector('#viewRight');
  var viewInElement = document.querySelector('#viewIn');
  var viewOutElement = document.querySelector('#viewOut');

  if (data.settings.viewControlButtons) {
    document.body.classList.add('view-control-buttons');
  }

  // Dynamic parameters for keyboard-like view controls.
  var velocity = 0.7;
  var friction = 3;

  var controls = viewer.controls();
  controls.registerMethod('upElement', new Marzipano.ElementPressControlMethod(viewUpElement, 'y', -velocity, friction), true);
  controls.registerMethod('downElement', new Marzipano.ElementPressControlMethod(viewDownElement, 'y', velocity, friction), true);
  controls.registerMethod('leftElement', new Marzipano.ElementPressControlMethod(viewLeftElement, 'x', -velocity, friction), true);
  controls.registerMethod('rightElement', new Marzipano.ElementPressControlMethod(viewRightElement, 'x', velocity, friction), true);
  controls.registerMethod('inElement', new Marzipano.ElementPressControlMethod(viewInElement, 'zoom', -velocity, friction), true);
  controls.registerMethod('outElement', new Marzipano.ElementPressControlMethod(viewOutElement, 'zoom', velocity, friction), true);

  function renderSceneList(sceneDataList) {
    sceneListItemsElement.innerHTML = '';
    sceneDataList.forEach(function(sceneData, index) {
      var item = document.createElement('li');
      var button = document.createElement('button');
      var number = document.createElement('span');
      var label = document.createElement('span');

      item.classList.add('scene-item');
      button.classList.add('scene');
      button.type = 'button';
      button.setAttribute('data-id', sceneData.id);
      button.setAttribute('aria-label', 'Open ' + sceneData.name);
      number.classList.add('scene-number');
      number.textContent = String(index + 1).padStart(2, '0');
      label.classList.add('text');
      label.textContent = sceneData.name;

      button.appendChild(number);
      button.appendChild(label);
      item.appendChild(button);
      sceneListItemsElement.appendChild(item);
    });
  }

  function sanitize(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Scene switching resets the view, activates the Marzipano scene, and syncs UI.
  function switchScene(scene) {
    if (!scene) {
      return;
    }
    showLoading();
    stopAutorotate();
    scene.view.setParameters(scene.data.initialViewParameters);
    scene.scene.switchTo({ transitionDuration: 700 }, function() {
      hideLoading();
    });
    startAutorotate();
    updateSceneName(scene);
    updateSceneList(scene);
  }

  function updateSceneName(scene) {
    sceneNameElement.innerHTML = sanitize(scene.data.name);
  }

  function updateSceneList(scene) {
    for (var i = 0; i < sceneElements.length; i++) {
      var el = sceneElements[i];
      var isCurrent = el.getAttribute('data-id') === scene.data.id;
      el.classList.toggle('current', isCurrent);
      el.setAttribute('aria-current', isCurrent ? 'page' : 'false');
    }
  }

  function showSceneList() {
    sceneListElement.classList.add('enabled');
    sceneListToggleElement.classList.add('enabled');
    sceneListToggleElement.setAttribute('aria-expanded', 'true');
  }

  function hideSceneList() {
    sceneListElement.classList.remove('enabled');
    sceneListToggleElement.classList.remove('enabled');
    sceneListToggleElement.setAttribute('aria-expanded', 'false');
  }

  function toggleSceneList() {
    if (sceneListElement.classList.contains('enabled')) {
      hideSceneList();
    } else {
      showSceneList();
    }
  }

  function showLoading() {
    loadingScreenElement.classList.remove('hidden');
  }

  function hideLoading() {
    loadingScreenElement.classList.add('hidden');
  }

  function startAutorotate() {
    if (!autorotateToggleElement.classList.contains('enabled')) {
      return;
    }
    viewer.startMovement(autorotate);
    viewer.setIdleMovement(3000, autorotate);
  }

  function stopAutorotate() {
    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
  }

  function toggleAutorotate() {
    if (autorotateToggleElement.classList.contains('enabled')) {
      autorotateToggleElement.classList.remove('enabled');
      stopAutorotate();
    } else {
      autorotateToggleElement.classList.add('enabled');
      startAutorotate();
    }
  }

  function createLinkHotspotElement(hotspot) {
    var targetSceneData = findSceneDataById(hotspot.target);
    if (!targetSceneData) {
      console.warn('Skipping hotspot with missing target:', hotspot.target);
      return null;
    }

    var wrapper = document.createElement('button');
    var icon = document.createElement('img');
    var tooltip = document.createElement('span');
    var transformProperties = ['-ms-transform', '-webkit-transform', 'transform'];

    wrapper.type = 'button';
    wrapper.classList.add('hotspot', 'link-hotspot');
    wrapper.setAttribute('aria-label', 'Go to ' + targetSceneData.name);

    icon.src = 'img/link.png';
    icon.alt = '';
    icon.classList.add('link-hotspot-icon');

    // Preserve Marzipano Tool's per-hotspot rotation value.
    for (var i = 0; i < transformProperties.length; i++) {
      icon.style[transformProperties[i]] = 'rotate(' + hotspot.rotation + 'rad)';
    }

    // Clicking a link hotspot switches to the target scene from data.js.
    wrapper.addEventListener('click', function() {
      switchScene(findSceneById(hotspot.target));
    });

    stopTouchAndScrollEventPropagation(wrapper);

    tooltip.classList.add('hotspot-tooltip', 'link-hotspot-tooltip');
    tooltip.textContent = targetSceneData.name;

    wrapper.appendChild(icon);
    wrapper.appendChild(tooltip);

    return wrapper;
  }

  function createInfoHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot', 'info-hotspot');

    var header = document.createElement('div');
    header.classList.add('info-hotspot-header');

    var iconWrapper = document.createElement('div');
    iconWrapper.classList.add('info-hotspot-icon-wrapper');
    var icon = document.createElement('img');
    icon.src = 'img/info.png';
    icon.alt = '';
    icon.classList.add('info-hotspot-icon');
    iconWrapper.appendChild(icon);

    var titleWrapper = document.createElement('div');
    titleWrapper.classList.add('info-hotspot-title-wrapper');
    var title = document.createElement('div');
    title.classList.add('info-hotspot-title');
    title.textContent = hotspot.title;
    titleWrapper.appendChild(title);

    var closeWrapper = document.createElement('div');
    closeWrapper.classList.add('info-hotspot-close-wrapper');
    var closeIcon = document.createElement('img');
    closeIcon.src = 'img/close.png';
    closeIcon.alt = '';
    closeIcon.classList.add('info-hotspot-close-icon');
    closeWrapper.appendChild(closeIcon);

    header.appendChild(iconWrapper);
    header.appendChild(titleWrapper);
    header.appendChild(closeWrapper);

    var text = document.createElement('div');
    text.classList.add('info-hotspot-text');
    text.textContent = hotspot.text;

    wrapper.appendChild(header);
    wrapper.appendChild(text);

    var modal = document.createElement('div');
    modal.innerHTML = wrapper.innerHTML;
    modal.classList.add('info-hotspot-modal');
    document.body.appendChild(modal);

    var toggle = function() {
      wrapper.classList.toggle('visible');
      modal.classList.toggle('visible');
    };

    wrapper.querySelector('.info-hotspot-header').addEventListener('click', toggle);
    modal.querySelector('.info-hotspot-close-wrapper').addEventListener('click', toggle);

    stopTouchAndScrollEventPropagation(wrapper);

    return wrapper;
  }

  // Prevent hotspot interaction from dragging or zooming the panorama behind it.
  function stopTouchAndScrollEventPropagation(element) {
    var eventList = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel', 'mousewheel'];
    for (var i = 0; i < eventList.length; i++) {
      element.addEventListener(eventList[i], function(event) {
        event.stopPropagation();
      });
    }
  }

  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) {
        return scenes[i];
      }
    }
    return null;
  }

  function findSceneDataById(id) {
    for (var i = 0; i < data.scenes.length; i++) {
      if (data.scenes[i].id === id) {
        return data.scenes[i];
      }
    }
    return null;
  }

  // Display the initial scene after all UI and scene objects are ready.
  switchScene(findSceneById(DEFAULT_SCENE_ID) || scenes[0]);
})();
