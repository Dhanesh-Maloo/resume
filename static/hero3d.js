(function () {
  var canvas = document.getElementById('hero-3d');
  if (!canvas || typeof THREE === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var size = canvas.clientWidth || 240;
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  } catch (e) {
    return;
  }
  renderer.setSize(size, size, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4.4;

  var geometry = new THREE.IcosahedronGeometry(1.7, 0);
  var wireframe = new THREE.WireframeGeometry(geometry);
  var material = new THREE.LineBasicMaterial({ color: 0x5b8dff, transparent: true, opacity: 0.5 });
  var mesh = new THREE.LineSegments(wireframe, material);
  scene.add(mesh);

  var innerGeometry = new THREE.IcosahedronGeometry(1.05, 0);
  var innerWireframe = new THREE.WireframeGeometry(innerGeometry);
  var innerMaterial = new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.4 });
  var innerMesh = new THREE.LineSegments(innerWireframe, innerMaterial);
  scene.add(innerMesh);

  var visible = true;
  document.addEventListener('visibilitychange', function () {
    visible = document.visibilityState === 'visible';
  });

  function render() {
    if (visible) {
      mesh.rotation.x += 0.0022;
      mesh.rotation.y += 0.0032;
      innerMesh.rotation.x -= 0.0016;
      innerMesh.rotation.y -= 0.0026;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(render);
  }
  render();

  window.addEventListener('resize', function () {
    var s = canvas.clientWidth || 240;
    renderer.setSize(s, s, false);
  });
})();
