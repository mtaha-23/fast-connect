/*
 * FAST University Virtual Tour
 *
 * The tour remains a plain Marzipano export. Scenes, navigation links, and
 * info hotspots are still managed from data.js; this file builds the viewer
 * and the dashboard UI around that data.
 */
'use strict';

(function() {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;
  var DEFAULT_SCENE_ID = data.defaultScene || (data.scenes[0] && data.scenes[0].id);
  var activeCategory = 'All';
  var activeSearch = '';

  var panoElement = document.querySelector('#pano');
  var loadingScreenElement = document.querySelector('#loadingScreen');
  var sceneNameElement = document.querySelector('#titleBar .sceneName');
  var dashboardElement = document.querySelector('#dashboard');
  var dashboardToggleElement = document.querySelector('#dashboardToggle');
  var sceneListItemsElement = document.querySelector('#sceneList .scenes');
  var categoryFiltersElement = document.querySelector('#categoryFilters');
  var sceneSearchElement = document.querySelector('#sceneSearch');
  var currentSceneTitleElement = document.querySelector('#currentSceneTitle');
  var currentSceneMetaElement = document.querySelector('#currentSceneMeta');
  var sceneCountElement = document.querySelector('#sceneCount');
  var hotspotCountElement = document.querySelector('#hotspotCount');
  var infoCountElement = document.querySelector('#infoCount');
  var autorotateToggleElement = document.querySelector('#autorotateToggle');
  var fullscreenToggleElement = document.querySelector('#fullscreenToggle');
  var homeButtonElement = document.querySelector('#homeButton');

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
    var mql = matchMedia('(max-width: 760px), (max-height: 520px)');
    setMode();
    if (mql.addEventListener) {
      mql.addEventListener('change', setMode);
    } else {
      mql.addListener(setMode);
    }
  } else {
    document.body.classList.add('desktop');
  }

  document.body.classList.add('no-touch');
  window.addEventListener('touchstart', function() {
    document.body.classList.remove('no-touch');
    document.body.classList.add('touch');
  }, { once: true });

  if (bowser.msie && parseFloat(bowser.version) < 11) {
    document.body.classList.add('tooltip-fallback');
  }

  var viewerOpts = {
    controls: {
      mouseViewMode: data.settings.mouseViewMode
    }
  };

  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  prepareSceneMetadata();
  renderDashboardSummary();
  renderCategoryFilters();
  renderSceneList();

  // Create each Marzipano scene from data.js and attach its hotspots.
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

    // Link hotspots are scene-to-scene navigation points.
    sceneData.linkHotspots.forEach(function(hotspot) {
      var element = createLinkHotspotElement(hotspot);
      if (element) {
        scene.hotspotContainer().createHotspot(element, {
          yaw: hotspot.yaw,
          pitch: hotspot.pitch
        });
      }
    });

    // Info hotspots show contextual notes without changing scene.
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

  document.body.classList.toggle('single-scene', scenes.length <= 1);
  document.body.classList.toggle('multiple-scenes', scenes.length > 1);

  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI / 2
  });
  if (data.settings.autorotateEnabled) {
    autorotateToggleElement.classList.add('enabled');
  }
  autorotateToggleElement.addEventListener('click', toggleAutorotate);

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

  dashboardToggleElement.addEventListener('click', toggleDashboard);
  homeButtonElement.addEventListener('click', function() {
    switchScene(findSceneById(DEFAULT_SCENE_ID) || scenes[0]);
  });
  sceneSearchElement.addEventListener('input', function(event) {
    activeSearch = event.target.value.toLowerCase().trim();
    renderSceneList();
  });

  if (!document.body.classList.contains('mobile')) {
    showDashboard();
  } else {
    hideDashboard();
  }

  var viewUpElement = document.querySelector('#viewUp');
  var viewDownElement = document.querySelector('#viewDown');
  var viewLeftElement = document.querySelector('#viewLeft');
  var viewRightElement = document.querySelector('#viewRight');
  var viewInElement = document.querySelector('#viewIn');
  var viewOutElement = document.querySelector('#viewOut');

  if (data.settings.viewControlButtons) {
    document.body.classList.add('view-control-buttons');
  }

  var velocity = 0.7;
  var friction = 3;
  var controls = viewer.controls();
  controls.registerMethod('upElement', new Marzipano.ElementPressControlMethod(viewUpElement, 'y', -velocity, friction), true);
  controls.registerMethod('downElement', new Marzipano.ElementPressControlMethod(viewDownElement, 'y', velocity, friction), true);
  controls.registerMethod('leftElement', new Marzipano.ElementPressControlMethod(viewLeftElement, 'x', -velocity, friction), true);
  controls.registerMethod('rightElement', new Marzipano.ElementPressControlMethod(viewRightElement, 'x', velocity, friction), true);
  controls.registerMethod('inElement', new Marzipano.ElementPressControlMethod(viewInElement, 'zoom', -velocity, friction), true);
  controls.registerMethod('outElement', new Marzipano.ElementPressControlMethod(viewOutElement, 'zoom', velocity, friction), true);

  function prepareSceneMetadata() {
    data.scenes.forEach(function(sceneData) {
      sceneData.displayName = cleanSceneName(sceneData.name);
      sceneData.category = getSceneCategory(sceneData.name);
    });
  }

  function renderDashboardSummary() {
    sceneCountElement.textContent = data.scenes.length;
    hotspotCountElement.textContent = data.scenes.reduce(function(total, sceneData) {
      return total + sceneData.linkHotspots.length;
    }, 0);
    infoCountElement.textContent = data.scenes.reduce(function(total, sceneData) {
      return total + sceneData.infoHotspots.length;
    }, 0);
  }

  function renderCategoryFilters() {
    var categories = ['All'];
    data.scenes.forEach(function(sceneData) {
      if (categories.indexOf(sceneData.category) === -1) {
        categories.push(sceneData.category);
      }
    });
    categoryFiltersElement.innerHTML = '';
    categories.forEach(function(category) {
      var button = document.createElement('button');
      button.type = 'button';
      button.classList.add('category-chip');
      button.textContent = category;
      button.classList.toggle('active', category === activeCategory);
      button.addEventListener('click', function() {
        activeCategory = category;
        renderCategoryFilters();
        renderSceneList();
      });
      categoryFiltersElement.appendChild(button);
    });
  }

  function renderSceneList() {
    sceneListItemsElement.innerHTML = '';
    data.scenes.forEach(function(sceneData, index) {
      var matchesCategory = activeCategory === 'All' || sceneData.category === activeCategory;
      var matchesSearch = !activeSearch || sceneData.displayName.toLowerCase().indexOf(activeSearch) !== -1;
      if (!matchesCategory || !matchesSearch) {
        return;
      }

      var item = document.createElement('li');
      var button = document.createElement('button');
      var number = document.createElement('span');
      var text = document.createElement('span');
      var meta = document.createElement('span');

      item.classList.add('scene-item');
      button.classList.add('scene');
      button.type = 'button';
      button.setAttribute('data-id', sceneData.id);
      button.setAttribute('aria-label', 'Open ' + sceneData.displayName);
      button.addEventListener('click', function() {
        switchScene(findSceneById(sceneData.id));
        if (document.body.classList.contains('mobile')) {
          hideDashboard();
        }
      });

      number.classList.add('scene-number');
      number.textContent = String(index + 1).padStart(2, '0');
      text.classList.add('scene-title');
      text.textContent = sceneData.displayName;
      meta.classList.add('scene-meta');
      meta.textContent = sceneData.category + ' - ' + sceneData.linkHotspots.length + ' links';

      button.appendChild(number);
      button.appendChild(text);
      button.appendChild(meta);
      item.appendChild(button);
      sceneListItemsElement.appendChild(item);
    });
    updateSceneList(findCurrentScene());
  }

  function cleanSceneName(name) {
    return String(name)
      .replace(/_LE_upscale_prime/g, '')
      .replace(/_upscale\s*\(1\)/g, '')
      .replace(/_upscale\(1\)/g, '')
      .replace(/_upscale1/g, '')
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getSceneCategory(name) {
    var lower = name.toLowerCase();
    if (lower.indexOf('library') !== -1) return 'Library';
    if (lower.indexOf('cs') !== -1 || lower.indexOf('fsm') !== -1) return 'Academic';
    if (lower.indexOf('football') !== -1 || lower.indexOf('cricket') !== -1 || lower.indexOf('tennis') !== -1 || lower.indexOf('fitness') !== -1 || lower.indexOf('court') !== -1) return 'Sports';
    if (lower.indexOf('cafe') !== -1 || lower.indexOf('dhaba') !== -1) return 'Student Life';
    if (lower.indexOf('walkway') !== -1) return 'Walkways';
    return 'Campus';
  }

  function sanitize(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Scene switching is the central navigation action for dashboard and hotspots.
  function switchScene(scene) {
    if (!scene) {
      return;
    }
    showLoading();
    stopAutorotate();
    scene.view.setParameters(scene.data.initialViewParameters);
    scene.scene.switchTo({ transitionDuration: 650 });
    window.setTimeout(hideLoading, 700);
    startAutorotate();
    updateSceneName(scene);
    updateSceneList(scene);
    updateCurrentPanel(scene);
  }

  function updateSceneName(scene) {
    sceneNameElement.innerHTML = sanitize(scene.data.displayName);
  }

  function updateCurrentPanel(scene) {
    currentSceneTitleElement.textContent = scene.data.displayName;
    currentSceneMetaElement.textContent = scene.data.category + ' - ' + scene.data.linkHotspots.length + ' connected scenes';
  }

  function updateSceneList(scene) {
    if (!scene) return;
    var sceneElements = document.querySelectorAll('#sceneList .scene');
    for (var i = 0; i < sceneElements.length; i++) {
      var el = sceneElements[i];
      var isCurrent = el.getAttribute('data-id') === scene.data.id;
      el.classList.toggle('current', isCurrent);
      el.setAttribute('aria-current', isCurrent ? 'page' : 'false');
    }
  }

  function showDashboard() {
    dashboardElement.classList.add('enabled');
    dashboardToggleElement.classList.add('enabled');
    dashboardToggleElement.setAttribute('aria-expanded', 'true');
  }

  function hideDashboard() {
    dashboardElement.classList.remove('enabled');
    dashboardToggleElement.classList.remove('enabled');
    dashboardToggleElement.setAttribute('aria-expanded', 'false');
  }

  function toggleDashboard() {
    if (dashboardElement.classList.contains('enabled')) {
      hideDashboard();
    } else {
      showDashboard();
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
    wrapper.setAttribute('aria-label', 'Go to ' + targetSceneData.displayName);

    icon.src = 'img/link.png';
    icon.alt = '';
    icon.classList.add('link-hotspot-icon');
    for (var i = 0; i < transformProperties.length; i++) {
      icon.style[transformProperties[i]] = 'rotate(' + hotspot.rotation + 'rad)';
    }

    wrapper.addEventListener('click', function() {
      switchScene(findSceneById(hotspot.target));
    });
    stopTouchAndScrollEventPropagation(wrapper);

    tooltip.classList.add('hotspot-tooltip', 'link-hotspot-tooltip');
    tooltip.textContent = targetSceneData.displayName;

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

  function findCurrentScene() {
    var current = document.querySelector('#sceneList .scene.current');
    return current ? findSceneById(current.getAttribute('data-id')) : null;
  }

  switchScene(findSceneById(DEFAULT_SCENE_ID) || scenes[0]);
})();
