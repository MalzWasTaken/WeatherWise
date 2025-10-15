import { useMemo } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

  import React, { useEffect, useRef } from "react";

export default function RainAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;

    const getRandomFloat = (min, max) => Math.random() * (max - min + 1) + min;
    const getRandomInteger = (min, max) => Math.floor(getRandomFloat(min, max));
    const createVector = (x, y) => ({ x, y });

    const clearCanvas = (x, y, height, width) => {
      const rectHeight = height || canvasHeight;
      const rectWidth = width || canvasWidth;
      context.clearRect(x || 0, y || 0, rectWidth, rectHeight);
      context.beginPath();
    };

    const circle = (x, y, radius, filled) => {
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

    const vectorAddition = (a, b) => typeof b === 'number' ? { x: a.x + b, y: a.y + b } : { x: a.x + b.x, y: a.y + b.y };
    const vectorSubtraction = (a, b) => typeof b === 'number' ? { x: a.x - b, y: a.y - b } : { x: a.x - b.x, y: a.y - b.y };
    const vectorMultiplication = (a, b) => typeof b === 'number' ? { x: a.x * b, y: a.y * b } : { x: a.x * b.x, y: a.y * b.y };
    const vectorDivision = (a, b) => typeof b === 'number' ? { x: a.x / b, y: a.y / b } : { x: a.x / b.x, y: a.y / b.y };

    const checkRaindropCollision = (location, radius) => {
      let rain = { collided: false, location: null };
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

    const raintype = {
      drizzle: { count: 30, speed: 0.27 },
      light: { count: 100, speed: 0.3 },
      medium: { count: 250, speed: 0.4 },
      downpour: { count: 500, speed: 0.5 },
      afteshower: { count: 3, speed: 0.4 }
    };

    const environment = {
      wind: createVector(-0.05, 0),
      raintype: raintype.medium
    };

    class RainParticle {
      constructor(x, accX, accY) {
        this.damping = 0.025;
        this.location = createVector(x, canvasHeight);
        this.radius = 0.4;
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(accX, -(accY * this.damping));
        this.mass = 1;
      }

      draw(particles, index) {
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
      constructor(x, y, radius, accY) {
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

      relive(rain) {
        const { location } = rain;
        this.location = createVector(location.x, location.y);
        this.velocity = createVector(0, 0);
      }
    }

    const particleX = [-0.12, 0.06, 0, 0.06, 0.12];
    const getParticleX = () => particleX[Math.floor(Math.random() * particleX.length)];

    let raindrop = [];
    let particles = [];
    const raindropCount = environment.raintype.count;

    for (let i = 0; i < raindropCount; i++) {
      let x = getRandomInteger(2, canvasWidth - 2);
      let y = getRandomInteger(-2000, 0);
      let accY = environment.raintype.speed;
      raindrop[i] = new Raindrop(x, y, 1.3, accY);
    }

    const setup = () => {
      for (let i = 0; i < raindropCount; i++) {
        raindrop[i].draw();
      }
    };

    const animate = () => {
      clearCanvas();

      for (let i = 0; i < raindropCount; i++) {
        let { location, radius, velocity } = raindrop[i];
        let rain = checkRaindropCollision(location, radius);
        if (rain.collided) {
          let particle1 = new RainParticle(location.x, getParticleX(), velocity.y);
          particles.push(particle1);
          let particle4 = new RainParticle(location.x, getParticleX(), velocity.y);
          particles.push(particle4);

          raindrop[i].relive(rain);
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
  }, []);

  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden pointer-events-none z-[9999] bg-gray-900">
      <div id="sky-top" className="absolute inset-0 bg-gray-800 animate-[lightning_20s_ease-in-out_infinite] z-10"></div>
      <div id="sky-bottom" className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-400 z-20"></div>
      <canvas ref={canvasRef} className="absolute border border-black bg-transparent z-30" />
    </div>
  );
};