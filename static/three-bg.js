document.addEventListener('DOMContentLoaded', function () {
  if (typeof THREE === 'undefined') return;

  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var COLOR_A = new THREE.Color('#00ff9d');
  var COLOR_B = new THREE.Color('#00e5ff');
  var POINT_COUNT = 500;
  var SPREAD_XY = 40;
  var SPREAD_Z = 20;
  var LINK_DISTANCE = 6;
  var MAX_LINE_SEGMENTS = 800;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 30;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var group = new THREE.Group();
  scene.add(group);

  var positions = new Float32Array(POINT_COUNT * 3);
  var colors = new Float32Array(POINT_COUNT * 3);
  var pts = [];

  for (var i = 0; i < POINT_COUNT; i++) {
    var x = (Math.random() * 2 - 1) * SPREAD_XY;
    var y = (Math.random() * 2 - 1) * SPREAD_XY;
    var z = (Math.random() * 2 - 1) * SPREAD_Z;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    pts.push(new THREE.Vector3(x, y, z));

    var c = COLOR_A.clone().lerp(COLOR_B, Math.random());
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  var pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  var pointsMaterial = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true
  });

  var pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
  group.add(pointCloud);

  var linePositions = [];
  outer:
  for (var a = 0; a < pts.length; a++) {
    for (var b = a + 1; b < pts.length; b++) {
      if (pts[a].distanceTo(pts[b]) < LINK_DISTANCE) {
        linePositions.push(pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z);
        if (linePositions.length / 6 >= MAX_LINE_SEGMENTS) break outer;
      }
    }
  }

  var lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));

  var lineMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color('#00e5ff'),
    transparent: true,
    opacity: 0.2
  });

  var lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
  group.add(lineSegments);

  var mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  function render() {
    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    render();
    return;
  }

  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.0006;
    group.rotation.x += 0.0002;
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    render();
  }
  animate();
});
