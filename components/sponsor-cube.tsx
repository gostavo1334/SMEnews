'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import './sponsor-cube.css';

export function SponsorCube({ ads = [] }: { ads?: any[] }) {
  let sponsors = ads.map(ad => ad.imageUrl);
  if (sponsors.length === 0) {
    sponsors = [
      "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=80&q=80",
    ];
  }
  
  while (sponsors.length < 6) {
    sponsors = sponsors.concat(sponsors);
  }
  sponsors = sponsors.slice(0, 6);

  const cubeRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef({ x: 0, y: 0 });
  const isInteracting = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startRotate = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      
      if (!isInteracting.current) {
        // Auto-spin smoothly when not interacting
        rotateRef.current.y -= 30 * delta; 
        rotateRef.current.x -= 15 * delta;
      }
      
      if (cubeRef.current) {
        cubeRef.current.style.transform = `rotateX(${rotateRef.current.x}deg) rotateY(${rotateRef.current.y}deg)`;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isInteracting.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startRotate.current = { ...rotateRef.current };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isInteracting.current) return;
    const deltaX = e.clientX - startMouse.current.x;
    const deltaY = e.clientY - startMouse.current.y;
    rotateRef.current = {
      x: startRotate.current.x - deltaY * 0.5,
      y: startRotate.current.y + deltaX * 0.5
    };
  };

  const handlePointerUp = () => {
    isInteracting.current = false;
  };

  return (
    <div 
      className="flex flex-col items-center gap-1.5 cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider select-none">Sponsor by:</span>
      <div className="cube-container w-16 h-16">
        <div className="cube" ref={cubeRef}>
          {sponsors.map((src, i) => (
            <div key={i} className={`cube-face face-${i + 1}`}>
              <Image src={src} alt={`Sponsor ${i + 1}`} fill className="object-cover" unoptimized draggable={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
