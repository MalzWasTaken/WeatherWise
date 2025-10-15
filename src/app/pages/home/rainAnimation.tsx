import { useMemo } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

  import React, { useEffect, useRef } from "react";

  type RainType = "drizzle" | "light" | "medium" | "downpour" | "afteshower";

  interface RainAnimationProps {
    type?: RainType;
  }

  export default function RainAnimation({type = "medium"}: RainAnimationProps) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Function to resize canvas to window size
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Listen for window resize events
    window.addEventListener('resize', resizeCanvas);

    let canvasHeight = canvas.height;
    let canvasWidth = canvas.width;

  const getRandomFloat = (min: number, max: number): number => Math.random() * (max - min + 1) + min;
  const getRandomInteger = (min: number, max: number): number => Math.floor(getRandomFloat(min, max));
  const createVector = (x: number, y: number) => ({ x, y });

    const clearCanvas = (x?: number, y?: number, height?: number, width?: number) => {
      if (!canvas || !context) return;
      // Always get latest canvas size
      canvasHeight = canvas.height;
      canvasWidth = canvas.width;
      const rectHeight = height || canvasHeight;
      const rectWidth = width || canvasWidth;
      context.clearRect(x || 0, y || 0, rectWidth, rectHeight);
      context.beginPath();
    };

    const circle = (x: number, y: number, radius: number, filled: boolean) => {
      if (!context) return;
      const offset = radius / 2;
      x -= offset;
      y -= offset;
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      if (filled) {
        context.stroke();
      }
      context.strokeStyle = '#fff';
      context.closePath();
    };

  const vectorAddition = (a: {x: number, y: number}, b: {x: number, y: number} | number) => typeof b === 'number' ? { x: a.x + b, y: a.y + b } : { x: a.x + b.x, y: a.y + b.y };
  const vectorSubtraction = (a: {x: number, y: number}, b: {x: number, y: number} | number) => typeof b === 'number' ? { x: a.x - b, y: a.y - b } : { x: a.x - b.x, y: a.y - b.y };
  const vectorMultiplication = (a: {x: number, y: number}, b: {x: number, y: number} | number) => typeof b === 'number' ? { x: a.x * b, y: a.y * b } : { x: a.x * b.x, y: a.y * b.y };
  const vectorDivision = (a: {x: number, y: number}, b: {x: number, y: number} | number) => typeof b === 'number' ? { x: a.x / b, y: a.y / b } : { x: a.x / b.x, y: a.y / b.y };

    const checkRaindropCollision = (location: {x: number, y: number}, radius: number) => {
      let rain: { collided: boolean, location: {x: number, y: number} | null } = { collided: false, location: null };
      if ((location.y - canvasHeight) >= radius) {
        rain.collided = true;
        rain.location = createVector(getRandomInteger(radius, canvasWidth - radius), radius - 10);
      } else if ((location.x + radius) <= 0) {
        rain.collided = true;
        rain.location = createVector(canvasWidth - radius, location.y);
      } else if ((location.x + radius) >= canvasWidth) {
        rain.collided = true;
        rain.location = createVector(radius, location.y);
      }
      return rain;
    };


    const raintype: Record<RainType, { count: number; speed: number }> = {
      drizzle: { count: 30, speed: 0.27 },
      light: { count: 100, speed: 0.3 },
      medium: { count: 250, speed: 0.4 },
      downpour: { count: 500, speed: 0.5 },
      afteshower: { count: 3, speed: 0.4 }
    };

    const environment = {
      wind: createVector(-0.05, 0),
      raintype: raintype[type as RainType] || raintype.medium
    };

    class RainParticle {
      damping: number;
      location: { x: number; y: number };
      radius: number;
      velocity: { x: number; y: number };
      acceleration: { x: number; y: number };
      mass: number;

      constructor(x: number, accX: number, accY: number) {
        this.damping = 0.025;
        this.location = createVector(x, canvasHeight);
        this.radius = 0.4;
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(accX, -(accY * this.damping));
        this.mass = 1;
      }

      draw(particles: RainParticle[], index: number) {
        const { x, y } = this.location;
        if (this.acceleration.y >= 0.3) {
          delete particles[index];
          return particles.splice(index, 1);
        }
        return circle(x, y, this.radius, true);
      }

      splash() {
        this.velocity = vectorAddition(this.velocity, this.acceleration);
        this.location = vectorAddition(this.location, this.velocity);
        this.acceleration = vectorAddition(this.acceleration, { x: 0, y: 0.12 });
      }
    }

    class Raindrop {
      location: { x: number; y: number };
      radius: number;
      velocity: { x: number; y: number };
      acceleration: { x: number; y: number };
      mass: number;
      wind: { x: number; y: number };

      constructor(x: number, y: number, radius: number, accY: number) {
        this.location = createVector(x, y);
        this.radius = radius;
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, accY);
        this.mass = 1;
        this.wind = environment.wind;
        this.acceleration = vectorAddition(this.acceleration, this.wind);
      }

      draw() {
        const { x, y } = this.location;
        return circle(x, y, this.radius, true);
      }

      fall() {
        if (this.velocity.y <= (environment.raintype.speed * 50)) {
          this.velocity = vectorAddition(this.velocity, this.acceleration);
        }
        this.location = vectorAddition(this.location, this.velocity);
      }

      relive(rain: { location: { x: number; y: number } }) {
        const { location } = rain;
        this.location = createVector(location.x, location.y);
        this.velocity = createVector(0, 0);
      }
    }

  const particleX = [-0.12, 0.06, 0, 0.06, 0.12];
  const getParticleX = (): number => particleX[Math.floor(Math.random() * particleX.length)];

  let raindrop: Raindrop[] = [];
  const particles: RainParticle[] = [];
    const raindropCount = environment.raintype.count;

    const initRaindrops = () => {
      if (!canvas) return;
      raindrop = [];
      for (let i = 0; i < raindropCount; i++) {
        const x = getRandomInteger(2, canvas.width - 2);
        const y = getRandomInteger(-2000, 0);
        const accY = environment.raintype.speed;
        raindrop[i] = new Raindrop(x, y, 1.3, accY);
      }
    };
    initRaindrops();

    const setup = () => {
      for (let i = 0; i < raindropCount; i++) {
        raindrop[i].draw();
      }
    };

    const animate = () => {
      clearCanvas();

      for (let i = 0; i < raindropCount; i++) {
        const { location, radius, velocity } = raindrop[i];
        const rain = checkRaindropCollision(location, radius);
        if (rain.collided && rain.location) {
          const particle1 = new RainParticle(location.x, getParticleX(), velocity.y);
          particles.push(particle1);
          const particle4 = new RainParticle(location.x, getParticleX(), velocity.y);
          particles.push(particle4);

          raindrop[i].relive({ location: rain.location });
        }
        raindrop[i].fall();
        raindrop[i].draw();
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].splash();
        particles[i].draw(particles, i);
      }
      requestAnimationFrame(animate);
    };

    setup();
    requestAnimationFrame(animate);

    // Re-initialize raindrops on resize
    const handleResize = () => {
      resizeCanvas();
      initRaindrops();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', handleResize);
    };
  }, [type]);

  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden pointer-events-none z-[9999] bg-gray-900">
      <div id="sky-top" className="absolute inset-0 bg-gray-800 animate-[lightning_20s_ease-in-out_infinite] z-10"></div>
      <div id="sky-bottom" className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-400 z-20"></div>
      <canvas ref={canvasRef} className="absolute border border-black bg-transparent z-30" />
    </div>
  );
};