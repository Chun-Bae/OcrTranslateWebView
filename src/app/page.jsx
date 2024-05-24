// pages/index.js
"use client";

import React, { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const canvasRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = 800;
    const height = 600;
    const boxSize = 200;
    const wallThickness = 20;
    const ballRadius = 10;
    const gravity = 0.5;
    const friction = 0.8;
    const spring = 0.05;
    const bounce = -0.8; // 반발 계수

    canvas.width = width;
    canvas.height = height;

    let mouseX = width / 2;
    let mouseY = height / 2;

    canvas.addEventListener("mousemove", (event) => {
      mouseX = event.clientX - canvas.offsetLeft;
      mouseY = event.clientY - canvas.offsetTop;
    });

    canvas.addEventListener("mousedown", () => {
      setIsMouseDown(true);
    });

    canvas.addEventListener("mouseup", () => {
      setIsMouseDown(false);
    });

    class Ball {
      constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = 2;
        this.dy = -2;
        this.color = color;
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }

      update(boxX, boxY, boxSize, wallThickness) {
        this.dy += gravity;
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off the walls of the box
        const left = boxX + wallThickness;
        const right = boxX + boxSize - wallThickness;
        const top = boxY + wallThickness;
        const bottom = boxY + boxSize - wallThickness;

        if (this.x + this.radius > right || this.x - this.radius < left) {
          this.dx *= bounce;
          if (this.x + this.radius > right) this.x = right - this.radius;
          if (this.x - this.radius < left) this.x = left + this.radius;
        }

        if (this.y + this.radius > bottom || this.y - this.radius < top) {
          this.dy *= bounce;
          if (this.y + this.radius > bottom) this.y = bottom - this.radius;
          if (this.y - this.radius < top) this.y = top + this.radius;
        }

        this.dx *= friction;
        this.dy *= friction;
      }
    }

    class Box {
      constructor(x, y, size, thickness, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.thickness = thickness;
        this.dx = 0;
        this.dy = 0;
        this.color = color;
      }

      draw(ctx) {
        // Draw the walls of the box
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.thickness); // Top wall
        ctx.fillRect(this.x, this.y, this.thickness, this.size); // Left wall
        ctx.fillRect(this.x, this.y + this.size - this.thickness, this.size, this.thickness); // Bottom wall
        ctx.fillRect(this.x + this.size - this.thickness, this.y, this.thickness, this.size); // Right wall
      }

      update(mouseX, mouseY, isMouseDown) {
        if (!isMouseDown) {
          const targetX = mouseX - this.size / 2;
          const targetY = mouseY - this.size / 2;
          const ax = (targetX - this.x) * spring;
          const ay = (targetY - this.y) * spring;

          this.dx += ax;
          this.dy += ay;
        }

        this.dy += gravity;

        this.x += this.dx;
        this.y += this.dy;

        this.dx *= friction;
        this.dy *= friction;

        // Prevent the box from going out of canvas bounds
        if (this.x < 0) {
          this.x = 0;
          this.dx *= bounce;
        }
        if (this.x + this.size > width) {
          this.x = width - this.size;
          this.dx *= bounce;
        }
        if (this.y < 0) {
          this.y = 0;
          this.dy *= bounce;
        }
        if (this.y + this.size > height) {
          this.y = height - this.size;
          this.dy *= bounce;
        }
      }
    }

    const ball = new Ball(width / 2, height / 2, ballRadius, "#FF6347");
    const box = new Box(width / 2 - boxSize / 2, height / 2 - boxSize / 2, boxSize, wallThickness, "#0095DD");

    function draw() {
      ctx.clearRect(0, 0, width, height);

      box.update(mouseX, mouseY, isMouseDown);
      box.draw(ctx);

      ball.update(box.x, box.y, box.size, wallThickness);
      ball.draw(ctx);

      requestAnimationFrame(draw);
    }

    draw();
  }, [isMouseDown]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: "5px solid #000" }}></canvas>
    </div>
  );
}
