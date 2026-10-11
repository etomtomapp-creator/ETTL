import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sun, Eye, ZoomIn, ZoomOut } from 'lucide-react';
import { VehicleAsset } from '../../types';
import { audioEngine } from '../../services/audioService';

interface VehicleShowroomCanvasProps {
  activeVehicle: VehicleAsset;
  selectedColorIndex: number;
}

export const VehicleShowroomCanvas: React.FC<VehicleShowroomCanvasProps> = ({
  activeVehicle,
  selectedColorIndex,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(true);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const vehicleGroupRef = useRef<THREE.Group | null>(null);
  const carPaintMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);

  // Mouse interaction state
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraDistance = useRef<number>(7.2);
  const cameraAngle = useRef<{ theta: number; phi: number }>({ theta: 0.6, phi: 0.35 });

  // Update paint material when active vehicle or selected color changes
  useEffect(() => {
    if (!carPaintMatRef.current) return;
    const colorOpt = activeVehicle.colorOptions[selectedColorIndex] || activeVehicle.colorOptions[0];
    carPaintMatRef.current.color.set(colorOpt.hex);
    carPaintMatRef.current.roughness = colorOpt.roughness;
    carPaintMatRef.current.metalness = colorOpt.metalness;
    carPaintMatRef.current.clearcoat = colorOpt.clearcoat ?? 0.9;
  }, [activeVehicle, selectedColorIndex]);

  // Update headlights emissive state
  useEffect(() => {
    if (!lightsGroupRef.current) return;
    lightsGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.color.set(headlightsOn ? 0xd0e8ff : 0x475569);
      }
    });
  }, [headlightsOn]);

  // Initialize and reconstruct vehicle on activeVehicle change
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer with white/light showroom atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf6f7fa); // Clean modern studio white/light gray

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting Setup (Crisp White + Foodpanda Pink Accent Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Crisp overhead daylight softbox
    const overheadLight = new THREE.DirectionalLight(0xffffff, 2.6);
    overheadLight.position.set(0, 10, 0);
    overheadLight.castShadow = true;
    overheadLight.shadow.mapSize.width = 2048;
    overheadLight.shadow.mapSize.height = 2048;
    overheadLight.shadow.bias = -0.0001;
    scene.add(overheadLight);

    // Key front light
    const keyLight = new THREE.DirectionalLight(0xfff0f5, 1.8);
    keyLight.position.set(6, 4, 8);
    scene.add(keyLight);

    // Rim backlight with subtle Foodpanda pink tone
    const rimLight = new THREE.DirectionalLight(0xd70f64, 1.4);
    rimLight.position.set(-8, 5, -8);
    scene.add(rimLight);

    // 3. Showroom Stage Floor (Glossy white travertine pedestal with Foodpanda Pink Ring)
    const stageGeo = new THREE.CylinderGeometry(5.2, 5.4, 0.25, 48);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.1,
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -0.125;
    stage.receiveShadow = true;
    scene.add(stage);

    // Outer stage ring in Foodpanda Pink (#D70F64)
    const ringGeo = new THREE.RingGeometry(4.8, 5.0, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd70f64, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    scene.add(ring);

    // 4. Vehicle Construction
    const vehicleGroup = new THREE.Group();
    vehicleGroupRef.current = vehicleGroup;
    scene.add(vehicleGroup);

    // Selected initial color
    const initialColor = activeVehicle.colorOptions[selectedColorIndex] || activeVehicle.colorOptions[0];

    // Paint material
    const paintMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(initialColor.hex),
      roughness: initialColor.roughness,
      metalness: initialColor.metalness,
      clearcoat: initialColor.clearcoat ?? 0.9,
      clearcoatRoughness: 0.1,
    });
    carPaintMatRef.current = paintMat;

    // Secondary Materials
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.8,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95,
    });

    const blackTrimMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.5,
      metalness: 0.3,
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.1,
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.9,
    });

    const caliperMat = new THREE.MeshStandardMaterial({
      color: 0xd70f64, // Foodpanda pink brake calipers
      roughness: 0.2,
      metalness: 0.8,
    });

    // Vehicle Type Differentiations
    const isSUV = activeVehicle.category === 'Grand Tourer SUV';
    const isEV = activeVehicle.category === 'Performance EV';

    const bodyLength = isSUV ? 4.6 : (isEV ? 4.4 : 4.8);
    const bodyWidth = isSUV ? 2.1 : (isEV ? 2.05 : 2.0);
    const bodyHeight = isSUV ? 1.05 : (isEV ? 0.75 : 0.8);
    const cabinHeight = isSUV ? 0.85 : (isEV ? 0.6 : 0.65);
    const wheelRadius = isSUV ? 0.44 : 0.38;

    // Lower Main Chassis Body
    const lowerBodyGeo = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyLength);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, paintMat);
    lowerBody.position.y = wheelRadius + bodyHeight * 0.4;
    lowerBody.castShadow = true;
    lowerBody.receiveShadow = true;
    vehicleGroup.add(lowerBody);

    // Aerodynamic Nose / Hood taper
    const hoodGeo = new THREE.BoxGeometry(bodyWidth * 0.96, bodyHeight * 0.7, bodyLength * 0.35);
    const hood = new THREE.Mesh(hoodGeo, paintMat);
    hood.position.set(0, wheelRadius + bodyHeight * 0.3, bodyLength * 0.35);
    hood.castShadow = true;
    vehicleGroup.add(hood);

    // Upper Cabin Glass & Pillars
    const cabinGeo = new THREE.BoxGeometry(bodyWidth * 0.86, cabinHeight, bodyLength * 0.5);
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.position.set(0, lowerBody.position.y + bodyHeight * 0.5 + cabinHeight * 0.45, isSUV ? 0.1 : -0.2);
    cabin.castShadow = true;
    vehicleGroup.add(cabin);

    // Cabin Roof in car paint
    const roofGeo = new THREE.BoxGeometry(bodyWidth * 0.88, 0.08, bodyLength * 0.48);
    const roof = new THREE.Mesh(roofGeo, paintMat);
    roof.position.set(0, cabin.position.y + cabinHeight * 0.5, cabin.position.z);
    vehicleGroup.add(roof);

    // Front Grille
    const grilleGeo = new THREE.BoxGeometry(bodyWidth * 0.7, bodyHeight * 0.45, 0.1);
    const grille = new THREE.Mesh(grilleGeo, isEV ? blackTrimMat : chromeMat);
    grille.position.set(0, lowerBody.position.y, bodyLength * 0.5 + 0.05);
    vehicleGroup.add(grille);

    // Front ETTL Crest in Foodpanda Pink
    const emblem = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.05), new THREE.MeshBasicMaterial({ color: 0xd70f64 }));
    emblem.position.set(0, lowerBody.position.y + 0.1, bodyLength * 0.5 + 0.11);
    vehicleGroup.add(emblem);

    // Headlights and Taillights Group
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;

    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xd0e8ff });
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xd70f64 });

    // Dual front headlights
    const hlGeo = new THREE.BoxGeometry(0.35, 0.14, 0.12);
    const hlLeft = new THREE.Mesh(hlGeo, headlightMat);
    hlLeft.position.set(-bodyWidth * 0.38, lowerBody.position.y + 0.15, bodyLength * 0.5);
    lightsGroup.add(hlLeft);

    const hlRight = new THREE.Mesh(hlGeo, headlightMat);
    hlRight.position.set(bodyWidth * 0.38, lowerBody.position.y + 0.15, bodyLength * 0.5);
    lightsGroup.add(hlRight);

    // Rear light bar
    const rlGeo = new THREE.BoxGeometry(bodyWidth * 0.85, 0.1, 0.1);
    const rl = new THREE.Mesh(rlGeo, taillightMat);
    rl.position.set(0, lowerBody.position.y + 0.2, -bodyLength * 0.5);
    lightsGroup.add(rl);

    vehicleGroup.add(lightsGroup);

    // Wheels & Brake Calipers
    const wheelPositions = [
      [-bodyWidth * 0.52, wheelRadius, bodyLength * 0.3], // Front Left
      [bodyWidth * 0.52, wheelRadius, bodyLength * 0.3],  // Front Right
      [-bodyWidth * 0.52, wheelRadius, -bodyLength * 0.3],// Rear Left
      [bodyWidth * 0.52, wheelRadius, -bodyLength * 0.3], // Rear Right
    ];

    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wx, wy, wz);

      // Rubber Tire
      const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.32, 24);
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Alloy Rim
      const rimGeo = new THREE.CylinderGeometry(wheelRadius * 0.72, wheelRadius * 0.72, 0.34, 16);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      // Pink Caliper
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.12, wheelRadius * 0.45, 0.2), caliperMat);
      caliper.position.set(0, wheelRadius * 0.2, 0);
      wheelGroup.add(caliper);

      vehicleGroup.add(wheelGroup);
    });

    // Rear Aero Diffuser / Spoiler for EV
    if (isEV) {
      const spoiler = new THREE.Mesh(new THREE.BoxGeometry(bodyWidth * 0.85, 0.05, 0.35), blackTrimMat);
      spoiler.position.set(0, roof.position.y + 0.12, -bodyLength * 0.42);
      vehicleGroup.add(spoiler);
    }

    // 5. Interactive Animation Loop
    let frameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (autoRotate && !isDragging.current && vehicleGroupRef.current) {
        vehicleGroupRef.current.rotation.y += delta * 0.35;
      }

      // Update camera spherical coordinates
      const dist = cameraDistance.current;
      const phi = cameraAngle.current.phi;
      const theta = cameraAngle.current.theta;

      const x = dist * Math.sin(phi) * Math.sin(theta);
      const y = dist * Math.cos(phi);
      const z = dist * Math.sin(phi) * Math.cos(theta);

      if (cameraRef.current) {
        cameraRef.current.position.set(x, Math.max(y, 1.2), z);
        cameraRef.current.lookAt(0, 0.8, 0);
      }

      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    // Mouse / Touch Event Handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      cameraAngle.current.theta += deltaX * 0.008;
      cameraAngle.current.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, cameraAngle.current.phi - deltaY * 0.008));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraDistance.current = Math.max(4.5, Math.min(10.5, cameraDistance.current + e.deltaY * 0.005));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Window Resize
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('mousedown', handleMouseDown);
      domElement.removeEventListener('wheel', handleWheel);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.innerHTML = '';
        rendererRef.current.dispose();
      }
    };
  }, [activeVehicle]);

  // Quick preset angle buttons
  const setPresetAngle = (preset: 'front' | 'side' | 'rear' | 'top') => {
    audioEngine.playClick();
    if (preset === 'front') {
      cameraAngle.current = { theta: 0.6, phi: 0.4 };
      cameraDistance.current = 7.0;
    } else if (preset === 'side') {
      cameraAngle.current = { theta: Math.PI / 2, phi: 0.45 };
      cameraDistance.current = 6.8;
    } else if (preset === 'rear') {
      cameraAngle.current = { theta: 2.5, phi: 0.4 };
      cameraDistance.current = 7.2;
    } else if (preset === 'top') {
      cameraAngle.current = { theta: 0.5, phi: 0.2 };
      cameraDistance.current = 8.5;
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    audioEngine.playClick();
    const step = direction === 'in' ? -1.0 : 1.0;
    cameraDistance.current = Math.max(4.5, Math.min(10.5, cameraDistance.current + step));
  };

  return (
    <div className="relative w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#f8f9fb] to-[#edf0f5] border border-pink-100 shadow-xl">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Showroom HUD in Bangla */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none font-sans">
        <div className="px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-pink-100 text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-sm">
          <Eye className="w-3.5 h-3.5 text-[#D70F64]" />
          <span>ইন্টারেক্টিভ ৩৬০° স্টুডিও</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-[#D70F64] font-bold">ঘুরিয়ে দেখুন</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Turntable Auto-Rotate Toggle */}
          <button
            onClick={() => {
              setAutoRotate(!autoRotate);
              audioEngine.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              autoRotate
                ? 'bg-[#D70F64] border-[#D70F64] text-white'
                : 'bg-white/90 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">স্বয়ংক্রিয় ঘূর্ণন</span>
          </button>

          {/* Headlights Toggle */}
          <button
            onClick={() => {
              setHeadlightsOn(!headlightsOn);
              audioEngine.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              headlightsOn
                ? 'bg-pink-100 border-[#D70F64] text-[#D70F64]'
                : 'bg-white/90 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">হেডলাইট</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Control Bar (Camera Presets & Zoom in Bangla) */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none font-sans">
        {/* Preset Angle Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/90 backdrop-blur-md border border-pink-100 shadow-sm pointer-events-auto">
          <button
            onClick={() => setPresetAngle('front')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 hover:text-[#D70F64] hover:bg-pink-50 transition-colors cursor-pointer"
          >
            সামনে
          </button>
          <button
            onClick={() => setPresetAngle('side')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 hover:text-[#D70F64] hover:bg-pink-50 transition-colors cursor-pointer"
          >
            পাশে
          </button>
          <button
            onClick={() => setPresetAngle('rear')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 hover:text-[#D70F64] hover:bg-pink-50 transition-colors cursor-pointer"
          >
            পেছনে
          </button>
          <button
            onClick={() => setPresetAngle('top')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 hover:text-[#D70F64] hover:bg-pink-50 transition-colors cursor-pointer"
          >
            উপর থেকে
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/90 backdrop-blur-md border border-pink-100 shadow-sm pointer-events-auto">
          <button
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded-lg text-slate-700 hover:text-[#D70F64] hover:bg-pink-50 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded-lg text-slate-700 hover:text-[#D70F64] hover:bg-pink-50 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
