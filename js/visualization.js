const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");
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
