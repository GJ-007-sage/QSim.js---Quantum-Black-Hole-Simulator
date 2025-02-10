// schrodinger.js - Wavefunction Simulator

// Constants
const N = 200; // Number of grid points
const dx = 0.01; // Spatial step size
const dt = 0.002; // Time step
const hbar = 1; // Reduced Planck's constant (normalized)
const m = 1; // Particle mass (normalized)

// Arrays for wavefunction and potential
let psi = new Array(N).fill(0).map(() => [0, 0]); // [Real, Imaginary]
let V = new Array(N).fill(0); // Potential array

// Initialize Gaussian Wave Packet
function initializeWavefunction(x0, sigma, k) {
    for (let i = 0; i < N; i++) {
        let x = i * dx;
        let gaussian = Math.exp(-Math.pow(x - x0, 2) / (2 * sigma * sigma));
        psi[i] = [gaussian * Math.cos(k * x), gaussian * Math.sin(k * x)];
    }
}

// Initialize Potential Well
function setPotential(type) {
    V.fill(0); // Reset potential

    if (type === "well") {
        V[0] = V[N - 1] = 1e6; // Infinite square well
    } else if (type === "barrier") {
        for (let i = N / 2 - 10; i < N / 2 + 10; i++) V[i] = 1; // Barrier
    } else if (type === "harmonic") {
        for (let i = 0; i < N; i++) {
            let x = (i - N / 2) * dx;
            V[i] = 0.5 * x * x; // Harmonic Oscillator
        }
    }
}
