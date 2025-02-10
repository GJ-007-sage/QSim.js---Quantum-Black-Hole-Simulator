const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");

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

setInterval(() => {
    crankNicolsonStep();  // Update wavefunction
    drawWavefunction();   // Visualize
}, 50);