import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load textures
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('earth.jpg');      // Replace with the actual Earth texture path
const moonTexture = textureLoader.load('moon.jpg');        // Replace with the actual Moon texture path
const sunTexture = textureLoader.load('sun.jpg');          // Replace with the actual Sun texture path
const mercuryTexture = textureLoader.load('mer.jpg');  // Replace with the actual Mercury texture path
const venusTexture = textureLoader.load('ven.jpg');      // Replace with the actual Venus texture path
const marsTexture = textureLoader.load('mars.jpg');
const starfieldTexture = textureLoader.load('starfield.jpg'); // Load starfield texture

// Create Sun with texture
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create Planets
const planetData = [
    { name: 'Mercury', texture: mercuryTexture, distance: 3, size: 0.5 },
    { name: 'Venus', texture: venusTexture, distance: 5, size: 0.7 },
    { name: 'Earth', texture: earthTexture, distance: 7, size: 0.8 },
    { name: 'Mars', texture: marsTexture, distance: 9, size: 0.6 },
];

const planets = [];
planetData.forEach((data) => {
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: data.texture });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = data.distance;
    planets.push({ planet, distance: data.distance });
    scene.add(planet);
});

// Add Moon to Earth
const moonGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
const moonDistance = 1.5;
moon.position.x = planetData[2].distance + moonDistance;
scene.add(moon);

// Create starfield background
const starfieldGeometry = new THREE.SphereGeometry(1000, 32, 32); // Large sphere
const starfieldMaterial = new THREE.MeshBasicMaterial({
    map: starfieldTexture,
    side: THREE.BackSide // Render the inside of the sphere
});
const starfield = new THREE.Mesh(starfieldGeometry, starfieldMaterial);
scene.add(starfield);

// Set camera position
camera.position.z = 15;

// Add OrbitControls for zoom and rotation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enablePan = false;
controls.enableRotate = true;
controls.maxDistance = 50;
controls.minDistance = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the sun
    sun.rotation.y += 0.01;

    // Move planets in orbit
    planets.forEach((p, i) => {
        const angle = Date.now() * 0.0001 * (i + 1);
        p.planet.position.x = Math.cos(angle) * p.distance;
        p.planet.position.z = Math.sin(angle) * p.distance;
    });

    // Move moon in orbit around Earth
    const earthPosition = planets[2].planet.position;
    const moonAngle = Date.now() * 0.001;
    moon.position.x = earthPosition.x + Math.cos(moonAngle) * moonDistance;
    moon.position.z = earthPosition.z + Math.sin(moonAngle) * moonDistance;

    controls.update();  // Update controls on every frame
    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
