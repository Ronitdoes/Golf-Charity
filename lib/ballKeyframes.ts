// Scroll-based 3D transform keyframes for the hero ball visual
// progress (0-1) maps to { ry: rotationY, rx: rotationX, x: positionX, y: positionY, scale: scale }

interface BallState {
  ry: number;
  rx: number;
  x: number;
  y: number;
  scale: number;
}

const BALL_KEYFRAMES = [
  { progress: 0.00, ry: 0, rx: 0, x: 0, y: 0, scale: 1.0 }, // Hero (Centered)
  { progress: 0.10, ry: 0.2, rx: 0.1, x: 0, y: -0.2, scale: 1.05 }, // Transitioning
  { progress: 0.25, ry: 1.2, rx: 0.3, x: 1.8, y: -0.5, scale: 1.1 }, // How It Works (Content Left, Ball Right)
  { progress: 0.40, ry: 2.5, rx: 0.2, x: 1.6, y: -0.3, scale: 1.05 }, // Continuing
  { progress: 0.55, ry: 4.8, rx: 0.4, x: -1.8, y: -0.2, scale: 1.15 }, // Charity Impact (Content Right, Ball Left)
  { progress: 0.70, ry: 6.2, rx: 0.5, x: 0, y: 0.2, scale: 1.3 }, // Draw Mechanics (Big & Centered)
  { progress: 0.85, ry: 7.8, rx: 0.3, x: 0.5, y: -0.1, scale: 1.15 }, // Transitioning back
  { progress: 1.00, ry: 9.5, rx: 0, x: 0, y: 0, scale: 1.0 }, // Subscribe CTA (Centered)
];

// Linear interpolation with eased output for smooth scroll intersection logic
export function interpolateBall(progress: number): BallState {
  const p = Math.min(Math.max(progress, 0), 1);
  
  // Find neighboring keyframes
  let i = 0;
  while (i < BALL_KEYFRAMES.length - 2 && p > BALL_KEYFRAMES[i+1].progress) {
    i++;
  }
  
  const start = BALL_KEYFRAMES[i];
  const end = BALL_KEYFRAMES[i+1];
  
  // Normalize progress between these two keyframes
  const range = (end.progress - start.progress) || 0.0001;
  const t = (p - start.progress) / range;
  
  // Apply ease-in-out cubic for smoother transitions
  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  return {
    ry: start.ry + (end.ry - start.ry) * eased,
    rx: start.rx + (end.rx - start.rx) * eased,
    x: start.x + (end.x - start.x) * eased,
    y: start.y + (end.y - start.y) * eased,
    scale: start.scale + (end.scale - start.scale) * eased,
  };
}
