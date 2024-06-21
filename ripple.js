// Basic setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Parameters for the waves
const numWaves = 5;
const k = 0.2;  // Wave number
const omega = 0.7;  // Angular frequency
const amplitude = 1.0;  // Amplitude of the waves

// Create a grid of points
const gridSize = 100;
const spacing = 0.5;
const geometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        vertices.push(i * spacing - (gridSize * spacing) / 2);
        vertices.push(0);
        vertices.push(j * spacing - (gridSize * spacing) / 2);
     }
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 });
const points = new THREE.Points(geometry, material);
scene.add(points);

// Randomly initiate wave centers
const waveCenters = [];
for (let i = 0; i < numWaves; i++) {
    waveCenters.push({
        x: Math.random() * gridSize * spacing - (gridSize * spacing) / 2,
        y: Math.random() * gridSize * spacing - (gridSize * spacing) / 2
    });
}

camera.position.z = 50;

function animate(time) {
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        let x = positions[i];
        let z = positions[i + 2];
        let y = 0;
        for (let center of waveCenters) {
            let dx = x - center.x;
            let dz = z - center.y;
            let r = Math.sqrt(dx * dx + dz * dz);
            y += amplitude * Math.sin(k * r - omega * time * 0.001);
        }
        positions[i + 1] = y;
    }
    geometry.attributes.position.needsUpdate = true;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
