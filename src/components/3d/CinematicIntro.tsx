import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Volume2, VolumeX, FastForward, ArrowRight, ShieldCheck, DollarSign, Info, User, Sparkles } from 'lucide-react';
import { audioEngine } from '../../services/audioService';

interface CinematicIntroProps {
  onComplete: () => void;
}

type IntroPhase = 
  | 'approaching'      // Scene 1: Client walks outside towards building
  | 'entering'         // Scene 2: Glass doors slide open, enters atrium
  | 'at_desk'          // Scene 3: Reaches receptionist desk, dialogue exchange
  | 'choosing'         // Scene 4: Floating 3D decision gate
  | 'walking_corridor' // Scene 5: Receptionist escorts client down luxury corridor
  | 'at_manager'       // Scene 6: Executive suite briefing with managing partner
  | 'transitioning';   // Scene 7: Cinematic push-through into main platform

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<IntroPhase>('approaching');
  const [userChoice, setUserChoice] = useState<'prices' | 'details' | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(audioEngine.getMuted());
  
  // Bengali dialogue state in Hind Siliguri
  const [dialogueSpeaker, setDialogueSpeaker] = useState<string>('ইটিটিএল কনসিয়ার্জ');
  const [dialogueRole, setDialogueRole] = useState<'concierge' | 'receptionist' | 'client' | 'manager'>('concierge');
  const [dialogueText, setDialogueText] = useState<string>('গোধূলিলগ্নে ইটিটিএল ইনভেস্টমেন্ট জোন সদর দফতরে আগমন...');
  const [displayedText, setDisplayedText] = useState<string>('');

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);

  // Character and object refs
  const clientRef = useRef<any>(null);
  const receptionistRef = useRef<any>(null);
  const managerRef = useRef<any>(null);
  const leftDoorRef = useRef<THREE.Mesh | null>(null);
  const rightDoorRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const holoPlaneRef = useRef<THREE.Mesh | null>(null);

  // Door opening progress timer
  const doorOpenProgress = useRef<number>(0);

  // Smooth cinematic camera damping targets
  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(0.6, 2.2, 20));
  const cameraTargetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.75, 12));
  const cameraCurrentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.75, 12));

  // Audio footstep and vocal throttle
  const lastFootstepTime = useRef<number>(0);
  const lastVoiceTime = useRef<number>(0);

  // Progressive Bengali typewriter text reveal with vocal cadence
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      index++;
      setDisplayedText(dialogueText.slice(0, index));

      // Play soft speech formant for dialogue when characters speak
      if (index % 3 === 0 && dialogueRole !== 'concierge') {
        const now = Date.now();
        if (now - lastVoiceTime.current > 140) {
          lastVoiceTime.current = now;
          audioEngine.playSpeechVoice(
            dialogueRole === 'receptionist'
              ? 'receptionist'
              : dialogueRole === 'manager'
              ? 'manager'
              : 'client'
          );
        }
      }

      if (index >= dialogueText.length) {
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [dialogueText, dialogueRole]);

  const handleToggleSound = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      audioEngine.startAmbient();
      audioEngine.playClick();
    }
  };

  const handleSkip = useCallback(() => {
    audioEngine.playClick();
    setPhase('transitioning');
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [onComplete]);

  const handleSelectChoice = (choice: 'prices' | 'details') => {
    setUserChoice(choice);
    audioEngine.playClick();
    setPhase('walking_corridor');

    setDialogueSpeaker('অভ্যর্থনাকারী');
    setDialogueRole('receptionist');
    setDialogueText(
      choice === 'prices'
        ? '“এই দিক দিয়ে আসুন, স্যার। আমি আপনাকে আমাদের ম্যানেজিং পার্টনারের কাছে নিয়ে যাচ্ছি পোর্টফোলিও লাভ ও যানবাহনের মূল্য পর্যালোচনার জন্য।”'
        : '“এই দিক দিয়ে আসুন, স্যার। আমি আপনাকে আমাদের ম্যানেজিং পার্টনারের কাছে নিয়ে যাচ্ছি ফ্লিট সম্প্রসারণ মডেল ও নিরাপত্তা চুক্তি সম্পর্কে আলোচনার জন্য।”'
    );

    audioEngine.playDialogueChime('receptionist');
  };

  const handleExploreProject = () => {
    audioEngine.playClick();
    setPhase('transitioning');
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  const jumpToPhase = (targetPhase: IntroPhase) => {
    audioEngine.playClick();
    if (targetPhase === 'walking_corridor' || targetPhase === 'at_manager') {
      setUserChoice('prices');
    }
    setPhase(targetPhase);
  };

  // Build the enhanced 3D scene, realistic characters, and architectural environment
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    audioEngine.startAmbient();

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0e0814); // Twilight dusk with deep magenta atmospheric horizon
    scene.fog = new THREE.FogExp2(0x130a1c, 0.018);

    const camera = new THREE.PerspectiveCamera(
      46,
      container.clientWidth / container.clientHeight,
      0.1,
      160
    );
    camera.position.set(0.6, 2.2, 21);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 2. Comprehensive Architectural Lighting System
    const ambientLight = new THREE.AmbientLight(0x381f3b, 1.4);
    scene.add(ambientLight);

    // Moonlight / Dusk Key Light
    const skyLight = new THREE.DirectionalLight(0xffe6f2, 2.2);
    skyLight.position.set(-18, 25, 20);
    skyLight.castShadow = true;
    skyLight.shadow.mapSize.width = 2048;
    skyLight.shadow.mapSize.height = 2048;
    skyLight.shadow.bias = -0.0001;
    scene.add(skyLight);

    // Grand Atrium warm downlights
    const atriumSpot = new THREE.SpotLight(0xfff5f8, 3.8, 35, Math.PI / 4, 0.4, 1.2);
    atriumSpot.position.set(0, 8.5, -4);
    atriumSpot.target.position.set(0, 0, -6);
    scene.add(atriumSpot);
    scene.add(atriumSpot.target);

    // Signature Foodpanda Pink Architectural Glow (#D70F64)
    const pinkPendant = new THREE.PointLight(0xd70f64, 4.0, 18);
    pinkPendant.position.set(0, 4.8, 2);
    scene.add(pinkPendant);

    const entranceGlow = new THREE.PointLight(0xd70f64, 3.2, 14);
    entranceGlow.position.set(0, 3.0, 8);
    scene.add(entranceGlow);

    // Executive Office Pendant
    const officeSpot = new THREE.SpotLight(0xfff0f5, 3.6, 28, Math.PI / 4, 0.45, 1.1);
    officeSpot.position.set(0, 7.5, -26);
    officeSpot.target.position.set(0, 1, -28);
    scene.add(officeSpot);
    scene.add(officeSpot.target);

    // 3. Atmospheric Floating Dust/Sparkle Particles
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 28;
      particlePositions[i + 1] = Math.random() * 8.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 52;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf472b6,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // 4. Exterior Architecture & Walkway
    // Wet Exterior Asphalt
    const pavementGeo = new THREE.PlaneGeometry(60, 45);
    const pavementMat = new THREE.MeshStandardMaterial({
      color: 0x140e1b,
      roughness: 0.18,
      metalness: 0.7,
    });
    const pavement = new THREE.Mesh(pavementGeo, pavementMat);
    pavement.rotation.x = -Math.PI / 2;
    pavement.position.set(0, 0, 22);
    pavement.receiveShadow = true;
    scene.add(pavement);

    // Walkway path in pure white Italian travertine
    const walkwayGeo = new THREE.BoxGeometry(7, 0.16, 24);
    const walkwayMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.22,
      metalness: 0.1,
    });
    const walkway = new THREE.Mesh(walkwayGeo, walkwayMat);
    walkway.position.set(0, 0.08, 12);
    walkway.receiveShadow = true;
    scene.add(walkway);

    // Foodpanda Pink LED pathway borders
    const stripMat = new THREE.MeshBasicMaterial({ color: 0xd70f64 });
    const leftStrip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 22), stripMat);
    leftStrip.position.set(-3.4, 0.18, 12);
    const rightStrip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 22), stripMat);
    rightStrip.position.set(3.4, 0.18, 12);
    scene.add(leftStrip);
    scene.add(rightStrip);

    // Exterior Architectural Building Facade (Pure White)
    const facadeGeo = new THREE.BoxGeometry(40, 18, 1.8);
    const facadeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.1,
    });
    const facade = new THREE.Mesh(facadeGeo, facadeMat);
    facade.position.set(0, 9, 2);
    scene.add(facade);

    // Exterior Glass Panels with Pink Neon mullions
    for (let x = -18; x <= 18; x += 6) {
      if (Math.abs(x) < 4) continue; // Entrance clearance
      const windowMesh = new THREE.Mesh(
        new THREE.BoxGeometry(4.8, 12, 0.2),
        new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.85,
          roughness: 0.1,
          transparent: true,
          opacity: 0.7,
        })
      );
      windowMesh.position.set(x, 7, 2.8);
      scene.add(windowMesh);

      const neonPillar = new THREE.Mesh(new THREE.BoxGeometry(0.15, 12, 0.25), stripMat);
      neonPillar.position.set(x + 2.5, 7, 2.9);
      scene.add(neonPillar);
    }

    // High-Resolution Canvas Texture Signboard: "ETTL INVESTMENT ZONE / ইটিটিএল ইনভেস্টমেন্ট জোন"
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 1200;
    signCanvas.height = 300;
    const signCtx = signCanvas.getContext('2d');
    if (signCtx) {
      signCtx.fillStyle = '#FFFFFF';
      signCtx.fillRect(0, 0, 1200, 300);
      signCtx.lineWidth = 14;
      signCtx.strokeStyle = '#D70F64';
      signCtx.strokeRect(10, 10, 1180, 280);

      signCtx.fillStyle = '#D70F64';
      signCtx.font = 'bold 68px "Hind Siliguri", sans-serif';
      signCtx.textAlign = 'center';
      signCtx.textBaseline = 'middle';
      signCtx.fillText('ETTL INVESTMENT ZONE', 600, 105);

      signCtx.fillStyle = '#0F172A';
      signCtx.font = '600 50px "Hind Siliguri", sans-serif';
      signCtx.fillText('ইটিটিএল ইনভেস্টমেন্ট জোন', 600, 205);
    }
    const signTexture = new THREE.CanvasTexture(signCanvas);
    const signBoardMat = new THREE.MeshBasicMaterial({ map: signTexture });
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(13.5, 2.2, 0.2), signBoardMat);
    signBoard.position.set(0, 7.0, 3.0);
    scene.add(signBoard);

    // Glass Entrance Canopy with Steel Tie Rods
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(11, 0.25, 5.5),
      new THREE.MeshPhysicalMaterial({
        color: 0xfff0f5,
        transmission: 0.88,
        roughness: 0.1,
        transparent: true,
        opacity: 0.75,
      })
    );
    canopy.position.set(0, 5.4, 4.2);
    scene.add(canopy);

    // Automatic Sliding Glass Doors
    const doorGeo = new THREE.BoxGeometry(2.5, 4.4, 0.15);
    const doorMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      roughness: 0.08,
      transparent: true,
      opacity: 0.7,
    });

    const leftDoor = new THREE.Mesh(doorGeo, doorMat);
    leftDoor.position.set(-1.3, 2.2, 2);
    leftDoorRef.current = leftDoor;
    scene.add(leftDoor);

    const rightDoor = new THREE.Mesh(doorGeo, doorMat);
    rightDoor.position.set(1.3, 2.2, 2);
    rightDoorRef.current = rightDoor;
    scene.add(rightDoor);

    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 0.25, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xd70f64, roughness: 0.2, metalness: 0.8 })
    );
    doorFrame.position.set(0, 4.45, 2);
    scene.add(doorFrame);

    // Grand Lobby Atrium (White Italian Marble Terrazzo with Mirror Gloss)
    const lobbyFloorGeo = new THREE.PlaneGeometry(30, 40);
    const lobbyFloorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.35,
    });
    const lobbyFloor = new THREE.Mesh(lobbyFloorGeo, lobbyFloorMat);
    lobbyFloor.rotation.x = -Math.PI / 2;
    lobbyFloor.position.set(0, 0, -14);
    lobbyFloor.receiveShadow = true;
    scene.add(lobbyFloor);

    // Lobby Marble Floor Grid Accent Lines (Subtle Pink Inlays)
    for (let gz = 2; gz >= -32; gz -= 4) {
      const lineMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 0.04),
        new THREE.MeshBasicMaterial({ color: 0xfce7f3 })
      );
      lineMesh.rotation.x = -Math.PI / 2;
      lineMesh.position.set(0, 0.01, gz);
      scene.add(lineMesh);
    }

    // Lobby Walls with Fluted Sconces
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8f9fa, roughness: 0.5 });
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, 10, 40), wallMat);
    leftWall.position.set(-11, 5, -14);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, 10, 40), wallMat);
    rightWall.position.set(11, 5, -14);
    scene.add(rightWall);

    // Architectural Sconces with Foodpanda Pink Accent Lighting
    for (let z = 0; z >= -26; z -= 6.5) {
      const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.0, 0.2), new THREE.MeshStandardMaterial({ color: 0xd70f64, metalness: 0.8 }));
      sconce.position.set(-10.5, 4.8, z);
      scene.add(sconce);

      const sconceLight = new THREE.PointLight(0xd70f64, 1.2, 5);
      sconceLight.position.set(-10.2, 4.8, z);
      scene.add(sconceLight);

      const sconceR = sconce.clone();
      sconceR.position.set(10.5, 4.8, z);
      scene.add(sconceR);

      const sconceLightR = new THREE.PointLight(0xd70f64, 1.2, 5);
      sconceLightR.position.set(10.2, 4.8, z);
      scene.add(sconceLightR);
    }

    // Modern Curved Reception Desk
    const deskGroup = new THREE.Group();
    const deskCounter = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 0.22, 2.4),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.1 })
    );
    deskCounter.position.set(0, 1.25, -6.5);
    deskGroup.add(deskCounter);

    const deskFront = new THREE.Mesh(
      new THREE.BoxGeometry(6.6, 1.15, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xffeef5, roughness: 0.2, metalness: 0.2 })
    );
    deskFront.position.set(0, 0.6, -5.4);
    deskGroup.add(deskFront);

    // Foodpanda Pink illuminated logo plate on Reception Desk
    const deskLogo = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.4, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xd70f64 })
    );
    deskLogo.position.set(0, 0.65, -5.28);
    deskGroup.add(deskLogo);

    // Holographic Desktop Terminal Screen
    const holoGeo = new THREE.PlaneGeometry(1.6, 0.9);
    const holoCanvas = document.createElement('canvas');
    holoCanvas.width = 512;
    holoCanvas.height = 256;
    const holoCtx = holoCanvas.getContext('2d');
    if (holoCtx) {
      holoCtx.fillStyle = 'rgba(215, 15, 100, 0.15)';
      holoCtx.fillRect(0, 0, 512, 256);
      holoCtx.strokeStyle = '#D70F64';
      holoCtx.lineWidth = 4;
      holoCtx.strokeRect(4, 4, 504, 248);
      holoCtx.fillStyle = '#D70F64';
      holoCtx.font = 'bold 28px sans-serif';
      holoCtx.fillText('ETTL FLEET ACTIVE', 30, 50);
      holoCtx.fillStyle = '#0F172A';
      holoCtx.font = '22px sans-serif';
      holoCtx.fillText('UTILIZATION: 88.5%', 30, 100);
      holoCtx.fillText('ANNUAL YIELD: 22.4%', 30, 145);
      holoCtx.fillText('SECURED TITLES: 100%', 30, 190);
    }
    const holoTex = new THREE.CanvasTexture(holoCanvas);
    const holoMat = new THREE.MeshBasicMaterial({
      map: holoTex,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    });
    const holoPlane = new THREE.Mesh(holoGeo, holoMat);
    holoPlane.position.set(0, 1.9, -6.4);
    holoPlane.rotation.x = -0.15;
    deskGroup.add(holoPlane);
    holoPlaneRef.current = holoPlane;

    scene.add(deskGroup);

    // Decorative luxury planters with lush indoor foliage
    const planterMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const plantMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });

    const createPlanter = (x: number, z: number) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.5, 1.3, 16), planterMat);
      p.position.set(x, 0.65, z);
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 12), plantMat);
      bush.position.set(x, 1.6, z);
      scene.add(p);
      scene.add(bush);
    };
    createPlanter(-5.0, -5.5);
    createPlanter(5.0, -5.5);

    // Executive Director Suite Office
    const officeDesk = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 0.25, 2.6),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 })
    );
    officeDesk.position.set(0, 1.1, -29);
    scene.add(officeDesk);

    // Trophy on Director Desk
    const trophy = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.2, 0.5, 12),
      new THREE.MeshStandardMaterial({ color: 0xd70f64, metalness: 0.9, roughness: 0.15 })
    );
    trophy.position.set(1.8, 1.45, -29);
    scene.add(trophy);

    // Panoramic Skyline Glass Window behind Director
    const windowGeo = new THREE.PlaneGeometry(20, 8.5);
    const windowMat = new THREE.MeshBasicMaterial({ color: 0x180b20 });
    const backWindow = new THREE.Mesh(windowGeo, windowMat);
    backWindow.position.set(0, 5, -34.5);
    scene.add(backWindow);

    // Twilight Skyscraper Horizon with Foodpanda Pink glowing windows
    for (let x = -9; x <= 9; x += 1.8) {
      const h = 3.5 + Math.sin(x * 1.8) * 2.2;
      const bldg = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, h, 0.5),
        new THREE.MeshBasicMaterial({ color: 0x100615 })
      );
      bldg.position.set(x, h / 2, -34);
      scene.add(bldg);

      const winDots = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, h * 0.75, 0.1),
        new THREE.MeshBasicMaterial({ color: 0xd70f64 })
      );
      winDots.position.set(x, h / 2, -33.7);
      scene.add(winDots);
    }

    // 5. Realistic Human Biomechanical Character Rigging with Anatomy & Styling
    const createArticulatedCharacter = (
      type: 'client' | 'receptionist' | 'manager',
      suitColor: number,
      shirtColor: number,
      hairColor: number
    ) => {
      const root = new THREE.Group();

      const suitMat = new THREE.MeshStandardMaterial({ color: suitColor, roughness: 0.55, metalness: 0.1 });
      const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.35 });
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5cfb8, roughness: 0.65 });
      const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 });
      const shoeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
      const accentMat = new THREE.MeshStandardMaterial({ color: 0xd70f64, roughness: 0.3 }); // Foodpanda Pink

      // Ground Contact Shadow Disc
      const shadowGeo = new THREE.RingGeometry(0, 0.52, 24);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
      });
      const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
      contactShadow.rotation.x = -Math.PI / 2;
      contactShadow.position.y = 0.02;
      root.add(contactShadow);

      // Pelvis / Hips Center
      const pelvis = new THREE.Group();
      pelvis.position.y = 1.15;
      root.add(pelvis);

      // Spine & Torso Group
      const torso = new THREE.Group();
      torso.position.y = 0.45;
      pelvis.add(torso);

      // Chest & Waist Mesh
      const chestWidth = type === 'receptionist' ? 0.62 : 0.74;
      const chestDepth = type === 'receptionist' ? 0.34 : 0.42;
      const chestMesh = new THREE.Mesh(new THREE.BoxGeometry(chestWidth, 0.95, chestDepth), suitMat);
      chestMesh.position.y = 0;
      chestMesh.castShadow = true;
      torso.add(chestMesh);

      // Necktie / Scarf in Foodpanda Pink (#D70F64)
      if (type === 'receptionist') {
        // Elegant Silk Scarf draped over collar
        const scarf = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.32, 0.1), accentMat);
        scarf.position.set(0, 0.35, 0.2);
        torso.add(scarf);
      } else {
        // Executive Pink Necktie
        const tie = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.65, 0.06), accentMat);
        tie.position.set(0, 0.08, 0.23);
        torso.add(tie);
      }

      // Head & Neck
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.72, 0);
      torso.add(headGroup);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.2, 12), skinMat);
      neck.position.y = 0;
      headGroup.add(neck);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), skinMat);
      head.position.y = 0.22;
      headGroup.add(head);

      // Facial features: Eyes & Eyebrows
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeMat);
      eyeL.position.set(-0.08, 0.24, 0.22);
      headGroup.add(eyeL);

      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeMat);
      eyeR.position.set(0.08, 0.24, 0.22);
      headGroup.add(eyeR);

      // Manager executive glasses
      if (type === 'manager') {
        const glassesFrame = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 0.08, 0.05),
          new THREE.MeshStandardMaterial({ color: 0xd70f64, metalness: 0.9 })
        );
        glassesFrame.position.set(0, 0.24, 0.24);
        headGroup.add(glassesFrame);
      }

      // Styled Haircut
      if (type === 'receptionist') {
        // Elegant corporate updo bun with hair volume
        const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), hairMat);
        hairBase.position.set(0, 0.28, -0.04);
        headGroup.add(hairBase);

        const hairBun = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), hairMat);
        hairBun.position.set(0, 0.38, -0.2);
        headGroup.add(hairBun);
      } else {
        // Modern executive haircut with side volume
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), hairMat);
        hair.position.set(0, 0.29, -0.04);
        headGroup.add(hair);
      }

      // Left Arm with Shoulder, Elbow, and Wrist articulation
      const leftShoulder = new THREE.Group();
      leftShoulder.position.set(-chestWidth / 2 - 0.1, 0.38, 0);
      torso.add(leftShoulder);

      const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.42, 12), suitMat);
      upperArmL.position.y = -0.21;
      leftShoulder.add(upperArmL);

      const leftElbow = new THREE.Group();
      leftElbow.position.set(0, -0.42, 0);
      leftShoulder.add(leftElbow);

      const foreArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.4, 12), suitMat);
      foreArmL.position.y = -0.2;
      leftElbow.add(foreArmL);

      // Wristwatch on client
      if (type === 'client') {
        const watch = new THREE.Mesh(
          new THREE.CylinderGeometry(0.085, 0.085, 0.06, 12),
          new THREE.MeshStandardMaterial({ color: 0xd70f64, metalness: 0.85 })
        );
        watch.position.y = -0.38;
        leftElbow.add(watch);
      }

      const handL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), skinMat);
      handL.position.y = -0.43;
      leftElbow.add(handL);

      // Right Arm
      const rightShoulder = new THREE.Group();
      rightShoulder.position.set(chestWidth / 2 + 0.1, 0.38, 0);
      torso.add(rightShoulder);

      const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.42, 12), suitMat);
      upperArmR.position.y = -0.21;
      rightShoulder.add(upperArmR);

      const rightElbow = new THREE.Group();
      rightElbow.position.set(0, -0.42, 0);
      rightShoulder.add(rightElbow);

      const foreArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.4, 12), suitMat);
      foreArmR.position.y = -0.2;
      rightElbow.add(foreArmR);

      const handR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), skinMat);
      handR.position.y = -0.43;
      rightElbow.add(handR);

      // Left Leg with Hip, Knee, and Ankle articulation
      const leftHip = new THREE.Group();
      leftHip.position.set(-0.2, 0, 0);
      pelvis.add(leftHip);

      const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.52, 12), suitMat);
      thighL.position.y = -0.26;
      leftHip.add(thighL);

      const leftKnee = new THREE.Group();
      leftKnee.position.set(0, -0.52, 0);
      leftHip.add(leftKnee);

      const calfL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.52, 12), suitMat);
      calfL.position.y = -0.26;
      leftKnee.add(calfL);

      const leftAnkle = new THREE.Group();
      leftAnkle.position.set(0, -0.52, 0);
      leftKnee.add(leftAnkle);

      const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.38), shoeMat);
      shoeL.position.set(0, -0.06, 0.09);
      leftAnkle.add(shoeL);

      // Right Leg with Hip, Knee, and Ankle articulation
      const rightHip = new THREE.Group();
      rightHip.position.set(0.2, 0, 0);
      pelvis.add(rightHip);

      const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.52, 12), suitMat);
      thighR.position.y = -0.26;
      rightHip.add(thighR);

      const rightKnee = new THREE.Group();
      rightKnee.position.set(0, -0.52, 0);
      rightHip.add(rightKnee);

      const calfR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.52, 12), suitMat);
      calfR.position.y = -0.26;
      rightKnee.add(calfR);

      const rightAnkle = new THREE.Group();
      rightAnkle.position.set(0, -0.52, 0);
      rightKnee.add(rightAnkle);

      const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.38), shoeMat);
      shoeR.position.set(0, -0.06, 0.09);
      rightAnkle.add(shoeR);

      return {
        root,
        pelvis,
        torso,
        headGroup,
        leftShoulder,
        rightShoulder,
        leftElbow,
        rightElbow,
        leftHip,
        rightHip,
        leftKnee,
        rightKnee,
        leftAnkle,
        rightAnkle,
      };
    };

    // Client ("You" / বিনিয়োগকারী)
    const client = createArticulatedCharacter('client', 0x0f172a, 0xd70f64, 0x241710);
    client.root.position.set(0, 0, 16);
    scene.add(client.root);
    clientRef.current = client;

    // Receptionist in crisp white blazer with Foodpanda Pink scarf
    const receptionist = createArticulatedCharacter('receptionist', 0xffffff, 0xd70f64, 0x3d2015);
    receptionist.root.position.set(0.3, 0, -7.5);
    scene.add(receptionist.root);
    receptionistRef.current = receptionist;

    // Managing Partner in Director Navy with Pink Pocket Square
    const manager = createArticulatedCharacter('manager', 0x1e293b, 0xd70f64, 0x222222);
    manager.root.position.set(0, 0, -29.8);
    scene.add(manager.root);
    managerRef.current = manager;

    // 6. Master Animation Loop with Biomechanical Kinematics & Smooth Camera Lerp
    let clock = new THREE.Clock();

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Atmospheric particle gentle swirl
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.02;
      }

      // Holographic terminal subtle floating pulse
      if (holoPlaneRef.current) {
        holoPlaneRef.current.position.y = 1.9 + Math.sin(elapsed * 2.0) * 0.015;
      }

      // Biomechanical Harmonic Walking Engine:
      // Includes pelvic bounce, lateral weight shift, realistic foot-roll & arm counter-swing
      const applyRealisticWalk = (char: any, speed: number, moveDelta: number) => {
        const cycle = elapsed * speed;
        const strideAngle = Math.sin(cycle) * 0.44;

        // Spine forward dynamic lean
        char.torso.rotation.x = 0.06;

        // Hip flexion and extension
        char.leftHip.rotation.x = strideAngle;
        char.rightHip.rotation.x = -strideAngle;

        // Knee kinematics: bends during swing phase
        char.leftKnee.rotation.x = strideAngle > 0 ? Math.sin(cycle) * 0.6 : 0.04;
        char.rightKnee.rotation.x = strideAngle < 0 ? Math.abs(Math.sin(cycle)) * 0.6 : 0.04;

        // Ankle roll: heel-strike to toe-off
        char.leftAnkle.rotation.x = strideAngle > 0.2 ? -0.22 : (strideAngle < -0.2 ? 0.28 : 0);
        char.rightAnkle.rotation.x = strideAngle < -0.2 ? -0.22 : (strideAngle > 0.2 ? 0.28 : 0);

        // Pelvic sway & double-frequency vertical bounce (human locomotion signature)
        char.torso.rotation.y = -Math.sin(cycle) * 0.08;
        char.pelvis.position.y = 1.15 + Math.cos(cycle * 2.0) * 0.035;
        char.torso.rotation.z = Math.sin(cycle) * 0.025;

        // Anti-phase natural arm swing with elbow flex
        char.leftShoulder.rotation.x = -strideAngle * 0.68;
        char.rightShoulder.rotation.x = strideAngle * 0.68;

        char.leftElbow.rotation.x = -0.22 - Math.max(0, -strideAngle * 0.45);
        char.rightElbow.rotation.x = -0.22 - Math.max(0, strideAngle * 0.45);
      };

      // Smoothly blend character back to natural idle posture
      const blendToIdle = (char: any) => {
        const decay = Math.min(1.0, delta * 5.0);
        char.leftHip.rotation.x = THREE.MathUtils.lerp(char.leftHip.rotation.x, 0, decay);
        char.rightHip.rotation.x = THREE.MathUtils.lerp(char.rightHip.rotation.x, 0, decay);
        char.leftKnee.rotation.x = THREE.MathUtils.lerp(char.leftKnee.rotation.x, 0.04, decay);
        char.rightKnee.rotation.x = THREE.MathUtils.lerp(char.rightKnee.rotation.x, 0.04, decay);
        char.leftAnkle.rotation.x = THREE.MathUtils.lerp(char.leftAnkle.rotation.x, 0, decay);
        char.rightAnkle.rotation.x = THREE.MathUtils.lerp(char.rightAnkle.rotation.x, 0, decay);
        char.leftShoulder.rotation.x = THREE.MathUtils.lerp(char.leftShoulder.rotation.x, 0, decay);
        char.rightShoulder.rotation.x = THREE.MathUtils.lerp(char.rightShoulder.rotation.x, 0, decay);
        char.leftElbow.rotation.x = THREE.MathUtils.lerp(char.leftElbow.rotation.x, -0.15, decay);
        char.rightElbow.rotation.x = THREE.MathUtils.lerp(char.rightElbow.rotation.x, -0.15, decay);
        char.torso.rotation.x = THREE.MathUtils.lerp(char.torso.rotation.x, 0, decay);
        char.torso.rotation.y = THREE.MathUtils.lerp(char.torso.rotation.y, 0, decay);
        char.torso.rotation.z = THREE.MathUtils.lerp(char.torso.rotation.z, 0, decay);
        char.pelvis.position.y = THREE.MathUtils.lerp(char.pelvis.position.y, 1.15, decay);
      };

      const currentPhase = phase;

      // PHASE 1: Exterior Approach towards Grand Entrance
      if (currentPhase === 'approaching') {
        if (client.root.position.z > 3.6) {
          const move = delta * 3.4;
          client.root.position.z -= move;
          applyRealisticWalk(client, 6.8, move);

          if (elapsed - lastFootstepTime.current > 0.44) {
            audioEngine.playFootstep();
            lastFootstepTime.current = elapsed;
          }
        } else {
          setPhase('entering');
          setDialogueSpeaker('ইটিটিএল কনসিয়ার্জ');
          setDialogueRole('concierge');
          setDialogueText('বায়োমেট্রিক নিরাপত্তা নিশ্চিতকরণ সম্পন্ন। প্রধান লবিতে প্রবেশ করছেন।');
        }

        const camZ = client.root.position.z + 5.2;
        cameraTargetPos.current.set(
          1.2 + Math.sin(elapsed * 0.8) * 0.05,
          2.3 + Math.cos(elapsed * 1.1) * 0.03,
          camZ
        );
        cameraTargetLookAt.current.set(0, 1.9, client.root.position.z - 3);
      } 
      // PHASE 2: Atrium Entry & Smooth Sliding Glass Doors
      else if (currentPhase === 'entering') {
        doorOpenProgress.current = Math.min(1.0, doorOpenProgress.current + delta * 1.8);
        const doorEase = 1.0 - Math.pow(1.0 - doorOpenProgress.current, 3);
        if (leftDoorRef.current) leftDoorRef.current.position.x = -1.3 - doorEase * 1.6;
        if (rightDoorRef.current) rightDoorRef.current.position.x = 1.3 + doorEase * 1.6;

        if (client.root.position.z > -3.6) {
          const move = delta * 3.2;
          client.root.position.z -= move;
          applyRealisticWalk(client, 6.6, move);

          if (elapsed - lastFootstepTime.current > 0.45) {
            audioEngine.playFootstep();
            lastFootstepTime.current = elapsed;
          }
        } else {
          blendToIdle(client);
          setPhase('at_desk');
          setDialogueSpeaker('অভ্যর্থনাকারী');
          setDialogueRole('receptionist');
          setDialogueText('“স্যার, আপনাকে কীভাবে সাহায্য করতে পারি?”');
          audioEngine.playDialogueChime('receptionist');

          setTimeout(() => {
            setDialogueSpeaker('গ্রাহক (আপনি)');
            setDialogueRole('client');
            setDialogueText('“আমি ইটিটিএল ইনভেস্টমেন্ট সম্পর্কে বিস্তারিত জানতে চাই।”');
            audioEngine.playDialogueChime('manager');
            setTimeout(() => {
              setPhase('choosing');
            }, 1900);
          }, 2400);
        }

        cameraTargetPos.current.set(0.85, 2.15, client.root.position.z + 4.2);
        cameraTargetLookAt.current.set(0, 1.8, -6.5);
      } 
      // PHASE 3 & 4: At Desk & Floating Choice Gate
      else if (currentPhase === 'at_desk' || currentPhase === 'choosing') {
        blendToIdle(client);

        const breathe = Math.sin(elapsed * 1.6);
        receptionist.headGroup.rotation.y = Math.sin(elapsed * 1.4) * 0.12;
        receptionist.headGroup.rotation.z = Math.sin(elapsed * 1.8) * 0.04;
        receptionist.rightShoulder.rotation.x = -0.48 + breathe * 0.06;
        receptionist.rightElbow.rotation.x = -0.75 + Math.cos(elapsed * 1.6) * 0.05;

        client.torso.position.y = 0.45 + breathe * 0.015;

        cameraTargetPos.current.set(1.55 + Math.sin(elapsed * 0.7) * 0.03, 2.05, -2.1);
        cameraTargetLookAt.current.set(0.1, 1.72, -6.5);
      } 
      // PHASE 5: Walking down corridor together
      else if (currentPhase === 'walking_corridor') {
        if (client.root.position.z > -23) {
          const move = delta * 3.8;
          client.root.position.z -= move;
          client.root.position.x = -0.85;
          receptionist.root.position.z -= move;
          receptionist.root.position.x = 0.85;

          applyRealisticWalk(client, 7.4, move);
          applyRealisticWalk(receptionist, 7.4, move);

          if (elapsed - lastFootstepTime.current > 0.4) {
            audioEngine.playFootstep();
            lastFootstepTime.current = elapsed;
          }
        } else {
          blendToIdle(client);
          blendToIdle(receptionist);
          setPhase('at_manager');

          const isPrices = userChoice === 'prices';
          setDialogueSpeaker('ম্যানেজিং পার্টনার');
          setDialogueRole('manager');
          setDialogueText(
            isPrices
              ? '“ইটিটিএল ইনভেস্টমেন্টে স্বাগতম। আমাদের যানবাহন ভাড়ার বিনিয়োগ মডেলটি বার্ষিক ১৯.৮% থেকে ২৪.২% পর্যন্ত নিশ্চিত ক্যাশফ্লো ডিভিডেন্ড প্রদান করে, যা সরাসরি শারীরিক ফ্লিট সম্পদের মালিকানা দ্বারা সুরক্ষিত।”'
              : '“ইটিটিএল ইনভেস্টমেন্টে স্বাগতম। আমরা বিভিন্ন শীর্ষস্থানীয় টেক প্রতিষ্ঠান ও ফাইভ-স্টার কনসিয়ার্জ নেটওয়ার্কে ৮৮.৫% কর্পোরেট ফ্লিট ইউটিলাইজেশন সহ দীর্ঘমেয়াদী লিজ চুক্তি পরিচালনা করি।”'
          );
          audioEngine.playDialogueChime('manager');
        }

        cameraTargetPos.current.set(0, 2.35, client.root.position.z + 5.6);
        cameraTargetLookAt.current.set(0, 1.8, client.root.position.z - 4);
      } 
      // PHASE 6: Executive Director Briefing
      else if (currentPhase === 'at_manager') {
        blendToIdle(client);
        blendToIdle(receptionist);

        const managerBreathe = Math.sin(elapsed * 1.8);
        manager.torso.position.y = 0.45 + managerBreathe * 0.018;
        manager.leftShoulder.rotation.x = -0.42 + managerBreathe * 0.08;
        manager.leftElbow.rotation.x = -0.65;
        manager.headGroup.rotation.y = Math.sin(elapsed * 1.5) * 0.07;

        cameraTargetPos.current.set(1.35, 2.05, -25.2);
        cameraTargetLookAt.current.set(0, 1.65, -29.2);
      } 
      // PHASE 7: Push-through Zoom Dissolve into website
      else if (currentPhase === 'transitioning') {
        cameraTargetPos.current.set(0, 2.2, -34);
        cameraTargetLookAt.current.set(0, 2.2, -48);
      }

      if (cameraRef.current) {
        const camDamping = 1.0 - Math.exp(-6.8 * delta);
        cameraRef.current.position.lerp(cameraTargetPos.current, camDamping);
        cameraCurrentLookAt.current.lerp(cameraTargetLookAt.current, camDamping * 1.05);
        cameraRef.current.lookAt(cameraCurrentLookAt.current);
      }

      renderer.render(scene, camera);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [phase, userChoice]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white select-none font-sans">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Cinematic Anamorphic Aspect Ratio Framing Bars (Subtle 2.39:1 letterbox) */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-black/60 pointer-events-none z-20 backdrop-blur-[1px]" />
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/60 pointer-events-none z-20 backdrop-blur-[1px]" />

      {/* Top HUD Controls: Chapter Indicators in Bengali, Sound & Prominent Skip Button */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-pink-200 text-slate-900 text-xs font-bold tracking-wider shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D70F64] animate-pulse" />
            <span>ইটিটিএল সিনেম্যাটিক ইন্ট্রো</span>
          </div>

          <button
            onClick={handleToggleSound}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-pink-200 text-slate-700 hover:text-[#D70F64] transition-all text-xs font-semibold cursor-pointer shadow-sm hover:scale-105"
            title={isMuted ? 'শব্দ চালু করুন' : 'শব্দ বন্ধ করুন'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#D70F64]" />}
            <span>{isMuted ? 'শব্দ বন্ধ' : 'শব্দ চালু'}</span>
          </button>
        </div>

        {/* Narrative Chapter Timeline Scrubber in Bengali */}
        <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-pink-200 shadow-sm text-xs font-semibold text-slate-600">
          <button
            onClick={() => jumpToPhase('approaching')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              phase === 'approaching' ? 'bg-[#D70F64] text-white shadow-sm' : 'hover:text-[#D70F64]'
            }`}
          >
            ০১ প্রবেশপথ
          </button>
          <button
            onClick={() => jumpToPhase('entering')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              phase === 'entering' ? 'bg-[#D70F64] text-white shadow-sm' : 'hover:text-[#D70F64]'
            }`}
          >
            ০২ প্রধান লবি
          </button>
          <button
            onClick={() => jumpToPhase('at_desk')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              phase === 'at_desk' || phase === 'choosing' ? 'bg-[#D70F64] text-white shadow-sm' : 'hover:text-[#D70F64]'
            }`}
          >
            ০৩ অভ্যর্থনা
          </button>
          <button
            onClick={() => jumpToPhase('at_manager')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              phase === 'at_manager' ? 'bg-[#D70F64] text-white shadow-sm' : 'hover:text-[#D70F64]'
            }`}
          >
            ০৪ ডিরেক্টর স্যুট
          </button>
        </div>

        {/* Prominent Skip Intro Button in Bengali */}
        <button
          onClick={handleSkip}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/95 hover:bg-[#D70F64] text-slate-900 hover:text-white font-bold text-xs tracking-wide backdrop-blur-md border border-pink-200 hover:border-[#D70F64] transition-all shadow-md hover:shadow-lg hover:shadow-[#D70F64]/25 cursor-pointer hover:scale-105"
        >
          <span>ইন্ট্রো স্কিপ করুন</span>
          <FastForward className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Interactive Floating Choice Overlay in Bengali (Phase: 'choosing') */}
      {phase === 'choosing' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-white/45 backdrop-blur-sm transition-all animate-fade-in">
          <div className="max-w-xl w-full text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-xs font-bold text-[#D70F64] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>অভ্যর্থনা ডেস্ক কনসিয়ার্জ</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 drop-shadow-sm">
              ইটিটিএল সম্পর্কে আপনি কীভাবে জানতে চান?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg w-full">
            {/* Button 1: See Prices & Returns in Bengali */}
            <button
              onClick={() => handleSelectChoice('prices')}
              onMouseEnter={() => audioEngine.playHover()}
              className="group relative p-6 rounded-3xl bg-white hover:bg-pink-50/70 border-2 border-pink-200 hover:border-[#D70F64] transition-all duration-300 shadow-xl hover:scale-[1.03] text-left cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center border border-pink-200 text-[#D70F64] group-hover:bg-[#D70F64] group-hover:text-white transition-all shadow-sm">
                  <DollarSign className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#D70F64] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-[#D70F64] transition-colors mb-1.5">
                মূল্য ও রিটার্ন দেখুন
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                বিনিয়োগের পরিমাণ ($৫০ হাজার–$১০ লাখ+), গাড়ির ইউনিট খরচ এবং বার্ষিক ১৯.৮%–২৪.২% নিশ্চিত ক্যাশ ডিভিডেন্ড রিটার্ন দেখুন।
              </p>
            </button>

            {/* Button 2: See Details & Model in Bengali */}
            <button
              onClick={() => handleSelectChoice('details')}
              onMouseEnter={() => audioEngine.playHover()}
              className="group relative p-6 rounded-3xl bg-white hover:bg-pink-50/70 border-2 border-pink-200 hover:border-[#D70F64] transition-all duration-300 shadow-xl hover:scale-[1.03] text-left cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center border border-pink-200 text-[#D70F64] group-hover:bg-[#D70F64] group-hover:text-white transition-all shadow-sm">
                  <Info className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#D70F64] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-[#D70F64] transition-colors mb-1.5">
                মডেল ও বিবরণ দেখুন
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                আসল গাড়িভিত্তিক রিটেইল ও কর্পোরেট লিজ নেটওয়ার্ক, টেলিমেটিক্স সিকিউরিটি ও আইনি সুরক্ষা কাঠামো জানুন।
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Manager's Office Final Option in Bengali (Phase: 'at_manager') */}
      {phase === 'at_manager' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-32 p-6 bg-gradient-to-t from-white/95 via-transparent to-transparent pointer-events-none">
          <div className="pointer-events-auto max-w-md w-full text-center animate-fade-in">
            <button
              onClick={handleExploreProject}
              onMouseEnter={() => audioEngine.playHover()}
              className="w-full py-4 px-6 rounded-2xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-display font-bold text-base tracking-wide transition-all shadow-xl shadow-[#D70F64]/30 hover:scale-[1.02] flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>সম্পূর্ণ প্রজেক্টের বিস্তারিত দেখুন</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-3 text-xs text-slate-600 font-medium">
              ৩ডি গাড়ির শোরুম, ইন্টারেক্টিভ আরওআই ক্যালকুলেটর এবং বিনিয়োগ ডসিয়ার খুলুন
            </p>
          </div>
        </div>
      )}

      {/* Bottom Subtitle / Dialogue HUD with Hind Siliguri Typography & Speaker Badges */}
      <div className="absolute bottom-8 left-6 right-6 z-20 flex justify-center pointer-events-none">
        <div className="max-w-2xl w-full px-6 py-4.5 rounded-3xl bg-white/95 backdrop-blur-xl border border-pink-200 shadow-xl pointer-events-auto transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-[#D70F64]">
              {dialogueRole === 'client' ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D70F64]">
              {dialogueSpeaker}
            </span>
          </div>
          <p className="text-sm md:text-base text-slate-800 font-medium leading-relaxed min-h-[48px]">
            {displayedText}
            {displayedText.length < dialogueText.length && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-[#D70F64] animate-pulse align-middle" />
            )}
          </p>
        </div>
      </div>

      {/* Smooth Transition Fade Overlay */}
      <div
        className={`absolute inset-0 z-40 bg-white transition-opacity duration-700 pointer-events-none ${
          phase === 'transitioning' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
