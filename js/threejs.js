const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

document.getElementById("threejs-container").appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, 500);
camera.position.z = 5;

const geometry = new THREE.BufferGeometry();
const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const line = new THREE.Line(geometry, material);
scene.add(line);

function updateThreeJSWavefunction() {
    let positions = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        positions[i * 3] = (i - N / 2) * dx;
        positions[i * 3 + 1] = psi[i][0] * 5;
        positions[i * 3 + 2] = 0;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    renderer.render(scene, camera);
}

setInterval(() => {
    crankNicolsonStep();
    updateThreeJSWavefunction();
}, 50);
