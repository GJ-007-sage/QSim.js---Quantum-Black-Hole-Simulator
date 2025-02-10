// schrodinger.js - Crank-Nicolson Schrödinger Solver

// Constants
const N = 200;  // Number of grid points
const dx = 0.01; // Spatial step size
const dt = 0.002; // Time step
const hbar = 1;  // Reduced Planck's constant (normalized)
const m = 1;  // Particle mass (normalized)

// Arrays for wavefunction and potential
let psi = new Array(N).fill(0).map(() => [0, 0]);  // [Real, Imaginary]
let V = new Array(N).fill(0);  // Potential array

// Initialize Gaussian Wave Packet
function initializeWavefunction(x0, sigma, k) {
    for (let i = 0; i < N; i++) {
        let x = i * dx;
        let gaussian = Math.exp(-Math.pow(x - x0, 2) / (2 * sigma * sigma));
        psi[i] = [gaussian * Math.cos(k * x), gaussian * Math.sin(k * x)];
    }
}

// Initialize Potential Well or Barrier
function setPotential(type) {
    V.fill(0);  // Reset potential

    if (type === "well") {
        // Infinite square well (walls at edges)
        V[0] = V[N - 1] = 1e6;
    } else if (type === "barrier") {
        // Potential barrier in the middle
        for (let i = N / 2 - 10; i < N / 2 + 10; i++) V[i] = 1;
    } else if (type === "harmonic") {
        // Harmonic oscillator potential V(x) = 0.5 * x^2
        for (let i = 0; i < N; i++) {
            let x = (i - N / 2) * dx;
            V[i] = 0.5 * x * x;
        }
    }
}

// Crank-Nicolson Time Evolution Step
function crankNicolsonStep() {
    let A = new Array(N).fill(0).map(() => new Array(N).fill(0));
    let B = new Array(N).fill(0).map(() => new Array(N).fill(0));

    let r = dt / (2 * dx * dx);  // Discretization coefficient

    // Construct matrices A and B
    for (let i = 1; i < N - 1; i++) {
        A[i][i - 1] = -r;
        A[i][i] = 1 + 2 * r + (dt / (2 * hbar)) * V[i];
        A[i][i + 1] = -r;

        B[i][i - 1] = r;
        B[i][i] = 1 - 2 * r - (dt / (2 * hbar)) * V[i];
        B[i][i + 1] = r;
    }

    // Solve A * psi_new = B * psi_old using the Thomas Algorithm
    psi = solveTridiagonal(A, B, psi);
}

// Solve Tridiagonal System using the Thomas Algorithm
function solveTridiagonal(A, B, psi) {
    let N = psi.length;
    let alpha = new Array(N);
    let beta = new Array(N);
    let psi_new = new Array(N).fill(0).map(() => [0, 0]);

    // Forward elimination
    alpha[1] = A[1][1];
    beta[1] = psi[1];
    for (let i = 2; i < N - 1; i++) {
        let m = A[i][i] - A[i][i - 1] * (1 / alpha[i - 1]);
        alpha[i] = m;
        beta[i] = [
            psi[i][0] - A[i][i - 1] * beta[i - 1][0] / alpha[i - 1],
            psi[i][1] - A[i][i - 1] * beta[i - 1][1] / alpha[i - 1]
        ];
    }

    // Backward substitution
    psi_new[N - 2] = [
        beta[N - 2][0] / alpha[N - 2],
        beta[N - 2][1] / alpha[N - 2]
    ];
    for (let i = N - 3; i > 0; i--) {
        psi_new[i] = [
            (beta[i][0] - A[i][i + 1] * psi_new[i + 1][0]) / alpha[i],
            (beta[i][1] - A[i][i + 1] * psi_new[i + 1][1]) / alpha[i]
        ];
    }

    return psi_new;
}
