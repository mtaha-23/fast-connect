/*
 * FAST University Virtual Tour — index.js
 * Built on Marzipano. Enhanced with:
 *   - Loading screen hide logic
 *   - Menu panel toggle
 *   - switchSceneByName() helper
 *   - Scene counter badge
 *   - Fullscreen support
 *   - All original hotspot navigation preserved
 */
'use strict';

(function() {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  // ── DOM References ────────────────────────────────────────
  var panoElement             = document.querySelector('#pano');
  var sceneListElement        = document.querySelector('#sceneList');
  var sceneElements           = document.querySelectorAll('#sceneList .scene');
  var sceneListToggleElement  = document.querySelector('#sceneListToggle');   // hidden legacy
  var autorotateToggleElement = document.querySelector('#autorotateToggle');
  var fullscreenToggleElement = document.querySelector('#fullscreenToggle');
  var loadingScreen           = document.querySelector('#loadingScreen');
  var menuPanel               = document.querySelector('#menuPanel');
  var menuToggleBtn           = document.querySelector('#menuToggleBtn');
  var currentSceneNameEl      = document.querySelector('#currentSceneName');
  var sceneCounterTextEl      = document.querySelector('#sceneCounterText');

  // Friendly display names matching the menu labels
  var SCENE_DISPLAY_NAMES = {
    '0-dhaba-inside_upscale-1':                                    'Dhaba Inside',
    '1-fitness_upscale-1':                                         'Fitness Center',
    '2-football-ground_upscale-1':                                 'Football Ground',
    '3-fsm-2_upscale-1':                                          'FSM Block – Ground Floor',
    '4-fsm-2nd-floor-2_upscale-1':                                'FSM Block – 2nd Floor (B)',
    '5-fsm-2nd-floor_upscale1':                                   'FSM Block – 2nd Floor (A)',
    '6-fsm-3_upscale1':                                           'FSM Block – Entrance',
    '7-tennis-court_upscale1':                                    'Tennis Court',
    '8-walkway-between-tennis-n-football-ground_upscale1':         'Walkway (Sports Area)'
  };

  // ── Detect Desktop / Mobile ───────────────────────────────
  if (window.matchMedia) {
    var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
    var setMode = function() {
      if (mql.matches) {
        document.body.classList.remove('desktop');
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
        document.body.classList.add('desktop');
      }
    };
    setMode();
    mql.addListener(setMode);
  } else {
    document.body.classList.add('desktop');
  }

  // ── Detect touch ─────────────────────────────────────────
  document.body.classList.add('no-touch');
  window.addEventListener('touchstart', function() {
    document.body.classList.remove('no-touch');
    document.body.classList.add('touch');
  });

  // ── IE tooltip fallback ───────────────────────────────────
  if (bowser.msie && parseFloat(bowser.version) < 11) {
    document.body.classList.add('tooltip-fallback');
  }

  // ── Viewer ───────────────────────────────────────────────
  var viewerOpts = {
    controls: {
      mouseViewMode: data.settings.mouseViewMode
    }
  };
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  // ── Build Scenes ─────────────────────────────────────────
  var scenes = data.scenes.map(function(sceneData) {
    var urlPrefix = 'tiles';
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + '/' + sceneData.id + '/{z}/{f}/{y}/{x}.jpg',
      { cubeMapPreviewUrl: urlPrefix + '/' + sceneData.id + '/preview.jpg' }
    );
    var geometry = new Marzipano.CubeGeometry(sceneData.levels);
    var limiter  = Marzipano.RectilinearView.limit.traditional(
      sceneData.faceSize, 100 * Math.PI / 180, 120 * Math.PI / 180
    );
    var view  = new Marzipano.RectilinearView(sceneData.initialViewParameters, limiter);
    var scene = viewer.createScene({
      source:        source,
      geometry:      geometry,
      view:          view,
      pinFirstLevel: true
    });

    // Link hotspots
    sceneData.linkHotspots.forEach(function(hotspot) {
      var element = createLinkHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    // Info hotspots
    sceneData.infoHotspots.forEach(function(hotspot) {
      var element = createInfoHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    return { data: sceneData, scene: scene, view: view };
  });

  // ── Autorotate ───────────────────────────────────────────
  var autorotate = Marzipano.autorotate({
    yawSpeed:    0.03,
    targetPitch: 0,
    targetFov:   Math.PI / 2
  });
  if (data.settings.autorotateEnabled) {
    autorotateToggleElement.classList.add('enabled');
  }
  autorotateToggleElement.addEventListener('click', toggleAutorotate);

  // ── Fullscreen ───────────────────────────────────────────
  if (screenfull.enabled && data.settings.fullscreenButton) {
    document.body.classList.add('fullscreen-enabled');
    fullscreenToggleElement.addEventListener('click', function() {
      screenfull.toggle();
    });
    screenfull.on('change', function() {
      if (screenfull.isFullscreen) {
        fullscreenToggleElement.classList.add('enabled');
      } else {
        fullscreenToggleElement.classList.remove('enabled');
      }
    });
  } else {
    document.body.classList.add('fullscreen-disabled');
  }

  // ── Legacy sceneListToggle (kept for safety, hidden in HTML) ──
  sceneListToggleElement.addEventListener('click', function() {});

  // ── Menu Panel Toggle ─────────────────────────────────────
  menuToggleBtn.addEventListener('click', function() {
    var isOpen = menuPanel.classList.toggle('open');
    menuToggleBtn.classList.toggle('active', isOpen);
  });

  // Close menu when clicking on a scene (mobile)
  sceneElements.forEach(function(el) {
    el.addEventListener('click', function() {
      if (document.body.classList.contains('mobile')) {
        menuPanel.classList.remove('open');
        menuToggleBtn.classList.remove('active');
      }
    });
  });

  // ── Scene Switch Handlers (sidebar) ───────────────────────
  scenes.forEach(function(scene) {
    var el = document.querySelector('#sceneList .scene[data-id="' + scene.data.id + '"]');
    if (el) {
      el.addEventListener('click', function() {
        switchScene(scene);
      });
    }
  });

  // ── View Controls ─────────────────────────────────────────
  var viewUpElement    = document.querySelector('#viewUp');
  var viewDownElement  = document.querySelector('#viewDown');
  var viewLeftElement  = document.querySelector('#viewLeft');
  var viewRightElement = document.querySelector('#viewRight');
  var viewInElement    = document.querySelector('#viewIn');
  var viewOutElement   = document.querySelector('#viewOut');

  var velocity = 0.7;
  var friction = 3;
  var controls = viewer.controls();
  controls.registerMethod('upElement',    new Marzipano.ElementPressControlMethod(viewUpElement,    'y', -velocity, friction), true);
  controls.registerMethod('downElement',  new Marzipano.ElementPressControlMethod(viewDownElement,  'y',  velocity, friction), true);
  controls.registerMethod('leftElement',  new Marzipano.ElementPressControlMethod(viewLeftElement,  'x', -velocity, friction), true);
  controls.registerMethod('rightElement', new Marzipano.ElementPressControlMethod(viewRightElement, 'x',  velocity, friction), true);
  controls.registerMethod('inElement',    new Marzipano.ElementPressControlMethod(viewInElement,    'zoom', -velocity, friction), true);
  controls.registerMethod('outElement',   new Marzipano.ElementPressControlMethod(viewOutElement,   'zoom',  velocity, friction), true);

  // ── Helper: sanitize HTML ─────────────────────────────────
  function sanitize(s) {
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
  }

  // ── switchScene ───────────────────────────────────────────
  function switchScene(scene) {
    stopAutorotate();
    scene.view.setParameters(scene.data.initialViewParameters);
    scene.scene.switchTo();
    startAutorotate();
    updateSceneName(scene);
    updateSceneList(scene);
    updateSceneCounter(scene);
  }

  // ── switchSceneByName ─────────────────────────────────────
  // Public helper — switch scene using its id or display name.
  function switchSceneByName(nameOrId) {
    var target = null;
    for (var i = 0; i < scenes.length; i++) {
      var s = scenes[i];
      var displayName = SCENE_DISPLAY_NAMES[s.data.id] || s.data.name;
      if (
        s.data.id === nameOrId ||
        s.data.name === nameOrId ||
        displayName === nameOrId
      ) {
        target = s;
        break;
      }
    }
    if (target) {
      switchScene(target);
    } else {
      console.warn('[VirtualTour] switchSceneByName: no scene found for "' + nameOrId + '"');
    }
  }

  // Expose globally so it can be called from browser console or embedding page
  window.switchSceneByName = switchSceneByName;

  // ── UI Update Helpers ─────────────────────────────────────
  function updateSceneName(scene) {
    var name = SCENE_DISPLAY_NAMES[scene.data.id] || scene.data.name;
    if (currentSceneNameEl) {
      currentSceneNameEl.textContent = name;
    }
  }

  function updateSceneList(scene) {
    for (var i = 0; i < sceneElements.length; i++) {
      var el = sceneElements[i];
      if (el.getAttribute('data-id') === scene.data.id) {
        el.classList.add('current');
      } else {
        el.classList.remove('current');
      }
    }
  }

  function updateSceneCounter(scene) {
    if (!sceneCounterTextEl) return;
    var idx = 0;
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === scene.data.id) { idx = i; break; }
    }
    sceneCounterTextEl.textContent = (idx + 1) + ' / ' + scenes.length;
  }

  // ── Autorotate Helpers ────────────────────────────────────
  function startAutorotate() {
    if (!autorotateToggleElement.classList.contains('enabled')) return;
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

  // ── Create Link Hotspot Element ───────────────────────────
  function createLinkHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('link-hotspot');

    var icon = document.createElement('img');
    icon.src = 'img/link.png';
    icon.classList.add('link-hotspot-icon');

    // Apply rotation
    var transformProps = ['-ms-transform', '-webkit-transform', 'transform'];
    for (var i = 0; i < transformProps.length; i++) {
      icon.style[transformProps[i]] = 'rotate(' + hotspot.rotation + 'rad)';
    }

    wrapper.addEventListener('click', function() {
      switchScene(findSceneById(hotspot.target));
    });

    stopTouchAndScrollEventPropagation(wrapper);

    var tooltip = document.createElement('div');
    tooltip.classList.add('hotspot-tooltip');
    tooltip.classList.add('link-hotspot-tooltip');
    var targetData = findSceneDataById(hotspot.target);
    tooltip.innerHTML = sanitize(
      SCENE_DISPLAY_NAMES[hotspot.target] || (targetData ? targetData.name : hotspot.target)
    );

    wrapper.appendChild(icon);
    wrapper.appendChild(tooltip);
    return wrapper;
  }

  // ── Create Info Hotspot Element ───────────────────────────
  function createInfoHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('info-hotspot');

    var header = document.createElement('div');
    header.classList.add('info-hotspot-header');

    var iconWrapper = document.createElement('div');
    iconWrapper.classList.add('info-hotspot-icon-wrapper');
    var icon = document.createElement('img');
    icon.src = 'img/info.png';
    icon.classList.add('info-hotspot-icon');
    iconWrapper.appendChild(icon);

    var titleWrapper = document.createElement('div');
    titleWrapper.classList.add('info-hotspot-title-wrapper');
    var title = document.createElement('div');
    title.classList.add('info-hotspot-title');
    title.innerHTML = sanitize(hotspot.title);
    titleWrapper.appendChild(title);

    var closeWrapper = document.createElement('div');
    closeWrapper.classList.add('info-hotspot-close-wrapper');
    var closeIcon = document.createElement('img');
    closeIcon.src = 'img/close.png';
    closeIcon.classList.add('info-hotspot-close-icon');
    closeWrapper.appendChild(closeIcon);

    header.appendChild(iconWrapper);
    header.appendChild(titleWrapper);
    header.appendChild(closeWrapper);

    var text = document.createElement('div');
    text.classList.add('info-hotspot-text');
    text.innerHTML = hotspot.text;

    wrapper.appendChild(header);
    wrapper.appendChild(text);

    // Mobile modal clone
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

  // ── Event propagation stopper ─────────────────────────────
  function stopTouchAndScrollEventPropagation(element) {
    var eventList = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel', 'mousewheel'];
    for (var i = 0; i < eventList.length; i++) {
      element.addEventListener(eventList[i], function(event) {
        event.stopPropagation();
      });
    }
  }

  // ── Scene Lookup Helpers ──────────────────────────────────
  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) return scenes[i];
    }
    return null;
  }

  function findSceneDataById(id) {
    for (var i = 0; i < data.scenes.length; i++) {
      if (data.scenes[i].id === id) return data.scenes[i];
    }
    return null;
  }

  // ── Loading Screen: hide after first scene is ready ───────
  function hideLoadingScreen() {
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
  }

  // ── Boot: display initial scene ───────────────────────────
  switchScene(scenes[0]);

  // Hide loading screen with a short delay to let tiles load
  var _loadTimeout = setTimeout(function() {
    hideLoadingScreen();
  }, 1800);

  // Also hook into Marzipano's stage renderComplete for faster hide
  try {
    viewer.stage().addEventListener('renderComplete', function onFirstRender() {
      clearTimeout(_loadTimeout);
      setTimeout(hideLoadingScreen, 400);
      viewer.stage().removeEventListener('renderComplete', onFirstRender);
    });
  } catch(e) {
    // Fallback already set above
  }

})();
