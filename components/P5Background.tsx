
import React, { useRef, useEffect } from 'react';

interface P5BackgroundProps {
    intensity?: number; // 0 to 1
}

const P5Background: React.FC<P5BackgroundProps> = ({ intensity = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    interface Shape {
        x: number;
        y: number;
        size: number;
        baseSpeedX: number;
        baseSpeedY: number;
        rotation: number;
        baseRotSpeed: number;
        color: string;
        type: 'star' | 'triangle' | 'shard';
    }

    const shapes: Shape[] = [];
    const colors = ['#ff2a6d', '#05d9e8', '#d300c5', '#304ffe', '#ffffff'];

    const createShape = (): Shape => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 40 + 10,
      baseSpeedX: (Math.random() - 0.5) * 0.8,
      baseSpeedY: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * 360,
      baseRotSpeed: (Math.random() - 0.5) * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: Math.random() > 0.6 ? 'star' : (Math.random() > 0.3 ? 'triangle' : 'shard')
    });

    for (let i = 0; i < 35; i++) {
      shapes.push(createShape());
    }

    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    }

    const animate = () => {
      // Speed multiplier based on intensity (level)
      // Base is 1, max is 3x speed at max intensity
      const speedMult = 1 + (intensity * 3);

      ctx.fillStyle = '#050510'; 
      ctx.fillRect(0, 0, width, height);
      
      shapes.forEach(p => {
        p.x += p.baseSpeedX * speedMult;
        p.y += p.baseSpeedY * speedMult;
        p.rotation += p.baseRotSpeed * speedMult;

        if (p.x < -100) p.x = width + 100;
        if (p.x > width + 100) p.x = -100;
        if (p.y < -100) p.y = height + 100;
        if (p.y > height + 100) p.y = -100;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        
        ctx.fillStyle = p.color;
        // Make shadows more intense with speed
        ctx.shadowBlur = 15 + (intensity * 20);
        ctx.shadowColor = p.color;
        
        ctx.beginPath();
        if (p.type === 'triangle') {
            ctx.moveTo(0, -p.size);
            ctx.lineTo(p.size, p.size);
            ctx.lineTo(-p.size, p.size);
        } else if (p.type === 'shard') {
            ctx.moveTo(-p.size/2, -p.size);
            ctx.lineTo(p.size/2, -p.size/2);
            ctx.lineTo(0, p.size);
            ctx.lineTo(-p.size, 0);
        } else {
            drawStar(0, 0, 5, p.size, p.size/2);
        }
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default P5Background;
