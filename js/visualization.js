var canvas = document.getElementById("waveCanvas");
var ctx = canvas.getContext("2d");

const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const potentialSelect = document.getElementById("potential");
const speedSlider = document.getElementById("speed");

let animationRunning = false;
let animationSpeed = 50;

// Draw Wavefunction
function drawWavefunction() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < psi.length; i++) {
        let x = i * (canvas.width / psi.length);
        let y = canvas.height / 2 - psi[i][0] * 100;
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Animation Loop
let animationInterval;
function startAnimation() {
    if (!animationRunning) {
        animationRunning = true;
        animationInterval = setInterval(() => {
            crankNicolsonStep();
            drawWavefunction();
        }, 100 - animationSpeed);
    }
}

function stopAnimation() {
    animationRunning = false;
    clearInterval(animationInterval);
}

function resetSimulation() {
    stopAnimation();
    initializeWavefunction(50, 10, 5);
    drawWavefunction();
}

// Event Listeners
startButton.addEventListener("click", startAnimation);
pauseButton.addEventListener("click", stopAnimation);
resetButton.addEventListener("click", resetSimulation);
speedSlider.addEventListener("input", (e) => {
    animationSpeed = e.target.value;
    if (animationRunning) {
        stopAnimation();
        startAnimation();
    }
});


let mouseDown = false;

// Function to set a wavepacket at the clicked position
canvas.addEventListener("mousedown", (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let gridIndex = Math.floor((x / canvas.width) * psi.length);

    // Create a Gaussian wave packet at the clicked position
    let sigma = 5;  // Width of wavepacket
    let k = 5;  // Momentum
    for (let i = 0; i < psi.length; i++) {
        let xPos = i - gridIndex;
        let gaussian = Math.exp(-Math.pow(xPos, 2) / (2 * sigma * sigma));
        psi[i] = [gaussian * Math.cos(k * xPos), gaussian * Math.sin(k * xPos)];
    }

    drawWavefunction();
});

// Function to allow dragging and modifying the wavefunction
canvas.addEventListener("mousemove", (event) => {
    if (mouseDown) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let gridIndex = Math.floor((x / canvas.width) * psi.length);

        psi[gridIndex] = [0.5, 0];  // Set amplitude interactively
        drawWavefunction();
    }
});

canvas.addEventListener("mousedown", () => { mouseDown = true; });
canvas.addEventListener("mouseup", () => { mouseDown = false; });

function drawWavefunction() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < psi.length; i++) {
        let x = i * (canvas.width / psi.length);
        let probabilityDensity = psi[i][0] ** 2 + psi[i][1] ** 2;
        let intensity = Math.min(255, Math.floor(probabilityDensity * 5000));
        ctx.fillStyle = `rgb(${intensity}, ${intensity}, 255)`;
        ctx.fillRect(x, canvas.height / 2, 2, -probabilityDensity * 300);
    }
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 2;
    ctx.stroke();
}
// Initialize wavefunction on page load
window.onload = function () {
    initializeWavefunction(50, 10, 5);  // Start with a Gaussian wavepacket
    drawWavefunction();
};
