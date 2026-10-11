import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Volume2, VolumeX, FastForward, ArrowRight, ShieldCheck, DollarSign, Info } from 'lucide-react';
import { audioEngine } from '../../services/audioService';

interface CinematicIntroProps {
  onComplete: () => void;
}

type IntroPhase = 
  | 'approaching'      // Scene 1: Client walks outside towards building
  | 'entering'         // Scene 2: Doors open, enters grand atrium
  | 'at_desk'          // Scene 3: Reaches receptionist desk, dialogue
  | 'choosing'         // Scene 4: Floating 3D decision gate
  | 'walking_corridor' // Scene 5: Receptionist stands up & escorts down corridor
  | 'at_manager'       // Scene 6: Executive suite briefing
  | 'transitioning';   // Scene 7: Cinematic push-through into website

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<IntroPhase>('approaching');
  const [userChoice, setUserChoice] = useState<'prices' | 'details' | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(audioEngine.getMuted());
  
  // Dialogue state
  const [dialogueSpeaker, setDialogueSpeaker] = useState<string>('ETTL Concierge');
  const [dialogueText, setDialogueText] = useState<string>('Approaching ETTL Investment Zone headquarters at twilight...');
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

  // Door opening progress timer
  const doorOpenProgress = useRef<number>(0);

  // Frame-rate independent cinematic camera targets
  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(0.6, 2.2, 20));
  const cameraTargetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.75, 12));
  const cameraCurrentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.75, 12));

  // Audio footstep throttle
  const lastFootstepTime = useRef<number>(0);

  // Progressive subtitle typewriter reveal
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      index++;
      setDisplayedText(dialogueText.slice(0, index));
      if (index >= dialogueText.length) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [dialogueText]);

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

    setDialogueSpeaker('Receptionist');
    setDialogueText(
      choice === 'prices'
        ? '“Right this way, Sir. I will escort you to our Managing Partner to review portfolio yields and vehicle pricing.”'
        : '“Right this way, Sir. I will escort you to our Managing Partner to examine the fleet expansion model and security covenants.”'
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

  // Build the 3D scene & high-fidelity rigging
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    audioEngine.startAmbient();

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0e0814); // Twilight dusk with deep pink atmospheric horizon
    scene.fog = new THREE.FogExp2(0x130a1c, 0.02);

    const camera = new THREE.PerspectiveCamera(
      46,
      container.clientWidth / container.clientHeight,
      0.1,
      150
    );
    camera.position.set(0.6, 2.2, 21);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 2. Lighting System
    const ambientLight = new THREE.AmbientLight(0x351d38, 1.4);
    scene.add(ambientLight);

    // Moonlight / Dusk Key Light
    const skyLight = new THREE.DirectionalLight(0xffe6f2, 2.0);
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

    // Foodpanda Pink Architectural Glow (#D70F64)
    const pinkPendant = new THREE.PointLight(0xd70f64, 3.4, 16);
    pinkPendant.position.set(0, 4.8, 2);
    scene.add(pinkPendant);

    // Executive Office Pendant
    const officeSpot = new THREE.SpotLight(0xfff0f5, 3.4, 28, Math.PI / 4, 0.45, 1.1);
    officeSpot.position.set(0, 7.5, -26);
    officeSpot.target.position.set(0, 1, -28);
    scene.add(officeSpot);
    scene.add(officeSpot.target);

    // 3. Atmospheric Floating Dust/Sparkle Particles
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 26;
      particlePositions[i + 1] = Math.random() * 8.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 48;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf472b6,
      size: 0.075,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // 4. Architecture Construction
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

    // Walkway path in pure white travertine
    const walkwayGeo = new THREE.BoxGeometry(7, 0.16, 24);
    const walkwayMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
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

    // Illuminated Neon "ETTL INVESTMENT ZONE" Brand Header
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(13, 1.4, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    signBoard.position.set(0, 6.8, 3.0);
    scene.add(signBoard);

    const neonSign = new THREE.Mesh(
      new THREE.BoxGeometry(9.2, 0.35, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xd70f64 })
    );
    neonSign.position.set(0, 6.8, 3.14);
    scene.add(neonSign);

    // Glass Canopy
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
      metalness: 0.3,
    });
    const lobbyFloor = new THREE.Mesh(lobbyFloorGeo, lobbyFloorMat);
    lobbyFloor.rotation.x = -Math.PI / 2;
    lobbyFloor.position.set(0, 0, -14);
    lobbyFloor.receiveShadow = true;
    scene.add(lobbyFloor);

    // Lobby Walls with Fluted Sconces
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8f9fa, roughness: 0.5 });
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, 10, 40), wallMat);
    leftWall.position.set(-11, 5, -14);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, 10, 40), wallMat);
    rightWall.position.set(11, 5, -14);
    scene.add(rightWall);

    for (let z = 0; z >= -26; z -= 6.5) {
      const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.0, 0.2), new THREE.MeshStandardMaterial({ color: 0xd70f64, metalness: 0.8 }));
      sconce.position.set(-10.5, 4.8, z);
      scene.add(sconce);

      const sconceR = sconce.clone();
      sconceR.position.set(10.5, 4.8, z);
      scene.add(sconceR);
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

    // Foodpanda Pink illuminated logo plate
    const deskLogo = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.35, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xd70f64 })
    );
    deskLogo.position.set(0, 0.65, -5.28);
    deskGroup.add(deskLogo);
    scene.add(deskGroup);

    // Decorative luxury planters
    const planterMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const plantMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 });

    const createPlanter = (x: number, z: number) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.5, 1.3, 16), planterMat);
      p.position.set(x, 0.65, z);
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 8), plantMat);
      bush.position.set(x, 1.6, z);
      scene.add(p);
      scene.add(bush);
    };
    createPlanter(-5.0, -5.5);
    createPlanter(5.0, -5.5);

    // Executive Director Suite
    const officeDesk = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 0.25, 2.6),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 })
    );
    officeDesk.position.set(0, 1.1, -29);
    scene.add(officeDesk);

    // Panoramic Skyline Glass Window behind Director
    const windowGeo = new THREE.PlaneGeometry(20, 8.5);
    const windowMat = new THREE.MeshBasicMaterial({ color: 0x180b20 });
    const backWindow = new THREE.Mesh(windowGeo, windowMat);
    backWindow.position.set(0, 5, -34.5);
    scene.add(backWindow);

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

    // 5. Realistic Human Biomechanical Character Rig
    const createArticulatedCharacter = (suitColor: number, shirtColor: number, hairColor: number) => {
      const root = new THREE.Group();

      const suitMat = new THREE.MeshStandardMaterial({ color: suitColor, roughness: 0.55, metalness: 0.1 });
      const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.35 });
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xf6c8b0, roughness: 0.65 });
      const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 });
      const shoeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });

      // Contact Shadow Disc (Anchors character realistically to the ground)
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

      // Pelvis / Hips
      const pelvis = new THREE.Group();
      pelvis.position.y = 1.15;
      root.add(pelvis);

      // Spine & Torso
      const torso = new THREE.Group();
      torso.position.y = 0.45;
      pelvis.add(torso);

      const chestMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.95, 0.4), suitMat);
      chestMesh.position.y = 0;
      chestMesh.castShadow = true;
      torso.add(chestMesh);

      // Foodpanda Pink Necktie
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.65, 0.06), shirtMat);
      tie.position.set(0, 0.08, 0.22);
      torso.add(tie);

      // Head & Neck
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.72, 0);
      torso.add(headGroup);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.2, 12), skinMat);
      neck.position.y = 0;
      headGroup.add(neck);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), skinMat);
      head.position.y = 0.22;
      headGroup.add(head);

      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 14), hairMat);
      hair.position.set(0, 0.28, -0.04);
      headGroup.add(hair);

      // Left Arm with Shoulder, Elbow, and Wrist articulation
      const leftShoulder = new THREE.Group();
      leftShoulder.position.set(-0.46, 0.38, 0);
      torso.add(leftShoulder);

      const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.42, 12), suitMat);
      upperArmL.position.y = -0.21;
      leftShoulder.add(upperArmL);

      const leftElbow = new THREE.Group();
      leftElbow.position.set(0, -0.42, 0);
      leftShoulder.add(leftElbow);

      const foreArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.4, 12), suitMat);
      foreArmL.position.y = -0.2;
      leftElbow.add(foreArmL);

      const handL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), skinMat);
      handL.position.y = -0.42;
      leftElbow.add(handL);

      // Right Arm
      const rightShoulder = new THREE.Group();
      rightShoulder.position.set(0.46, 0.38, 0);
      torso.add(rightShoulder);

      const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.42, 12), suitMat);
      upperArmR.position.y = -0.21;
      rightShoulder.add(upperArmR);

      const rightElbow = new THREE.Group();
      rightElbow.position.set(0, -0.42, 0);
      rightShoulder.add(rightElbow);

      const foreArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.4, 12), suitMat);
      foreArmR.position.y = -0.2;
      rightElbow.add(foreArmR);

      const handR = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), skinMat);
      handR.position.y = -0.42;
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

      const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.36), shoeMat);
      shoeL.position.set(0, -0.06, 0.08);
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

      const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.36), shoeMat);
      shoeR.position.set(0, -0.06, 0.08);
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

    // Client ("You")
    const client = createArticulatedCharacter(0x0f172a, 0xd70f64, 0x241710);
    client.root.position.set(0, 0, 16);
    scene.add(client.root);
    clientRef.current = client;

    // Receptionist in white with Foodpanda Pink scarf
    const receptionist = createArticulatedCharacter(0xffffff, 0xd70f64, 0x3d2015);
    receptionist.root.position.set(0.3, 0, -7.5);
    scene.add(receptionist.root);
    receptionistRef.current = receptionist;

    // Managing Partner in Director Navy
    const manager = createArticulatedCharacter(0x1e293b, 0xd70f64, 0x222222);
    manager.root.position.set(0, 0, -29.8);
    scene.add(manager.root);
    managerRef.current = manager;

    // 6. Cinematic Master Animation Loop with Frame-Rate Independent Physics
    let clock = new THREE.Clock();

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1); // Cap delta to prevent frame spikes
      const elapsed = clock.getElapsedTime();

      // Atmospheric particle gentle swirl
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.02;
      }

      // Realistic Biomechanical Walking Gait with Foot Roll & Forward Lean
      const applyRealisticWalk = (char: any, speed: number, moveDelta: number) => {
        const cycle = elapsed * speed;
        const strideAngle = Math.sin(cycle) * 0.44;

        // 1. Natural forward torso lean during walking momentum
        char.torso.rotation.x = 0.06;

        // 2. Hip and thigh swing
        char.leftHip.rotation.x = strideAngle;
        char.rightHip.rotation.x = -strideAngle;

        // 3. Knee articulation with natural flexion and extension
        // Forward swinging leg bends knee; weight-bearing stance leg straightens
        char.leftKnee.rotation.x = strideAngle > 0 ? Math.sin(cycle) * 0.6 : 0.04;
        char.rightKnee.rotation.x = strideAngle < 0 ? Math.abs(Math.sin(cycle)) * 0.6 : 0.04;

        // 4. Foot ankle roll (Heel strike -> Flat -> Toe push-off)
        char.leftAnkle.rotation.x = strideAngle > 0.2 ? -0.22 : (strideAngle < -0.2 ? 0.28 : 0);
        char.rightAnkle.rotation.x = strideAngle < -0.2 ? -0.22 : (strideAngle > 0.2 ? 0.28 : 0);

        // 5. Counter-rotating upper body (Shoulders swing in opposition to hips)
        char.torso.rotation.y = -Math.sin(cycle) * 0.08;
        char.leftShoulder.rotation.x = -strideAngle * 0.68;
        char.rightShoulder.rotation.x = strideAngle * 0.68;

        // 6. Arm elbow natural flexion
        char.leftElbow.rotation.x = -0.22 - Math.max(0, -strideAngle * 0.45);
        char.rightElbow.rotation.x = -0.22 - Math.max(0, strideAngle * 0.45);

        // 7. Pelvis vertical bounce and weight transfer (Smooth dual-frequency sinusoid)
        char.pelvis.position.y = 1.15 + Math.abs(Math.sin(cycle)) * 0.045;
        char.torso.rotation.z = Math.sin(cycle) * 0.025; // Lateral hip sway
      };

      // Smooth decay to relaxed resting standing posture
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

      // PHASE 1: Exterior Approach
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
          setDialogueSpeaker('ETTL Concierge');
          setDialogueText('Automatic biometric security clearance verified. Entering executive lobby.');
        }

        // Steadicam tracking shot behind client with gentle organic breathing
        const camZ = client.root.position.z + 5.2;
        cameraTargetPos.current.set(
          1.2 + Math.sin(elapsed * 0.8) * 0.05,
          2.3 + Math.cos(elapsed * 1.1) * 0.03,
          camZ
        );
        cameraTargetLookAt.current.set(0, 1.9, client.root.position.z - 3);
      } 
      // PHASE 2: Atrium Entry & Smooth Sliding Doors
      else if (currentPhase === 'entering') {
        doorOpenProgress.current = Math.min(1.0, doorOpenProgress.current + delta * 1.8);
        // Smooth easeOutCubic curve for sliding doors
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
          setDialogueSpeaker('Receptionist');
          setDialogueText('“Sir, how may I help you?”');
          audioEngine.playDialogueChime('receptionist');

          setTimeout(() => {
            setDialogueSpeaker('Client (You)');
            setDialogueText('“I want to know more about the ETTL Investment.”');
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

        // Receptionist welcoming gestures (Fluid organic wrist & head tilt)
        const breathe = Math.sin(elapsed * 1.6);
        receptionist.headGroup.rotation.y = Math.sin(elapsed * 1.4) * 0.12;
        receptionist.headGroup.rotation.z = Math.sin(elapsed * 1.8) * 0.04;
        receptionist.rightShoulder.rotation.x = -0.48 + breathe * 0.06;
        receptionist.rightElbow.rotation.x = -0.75 + Math.cos(elapsed * 1.6) * 0.05;

        // Client attentive breathing posture
        client.torso.position.y = 0.45 + breathe * 0.015;

        // Cinematic over-the-shoulder conversation camera angle
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
          setDialogueSpeaker('Managing Partner');
          setDialogueText(
            isPrices
              ? '“Welcome to ETTL. Our vehicle rental investment models yield 19.8% to 24.2% annualized cashflow, fully collateralized by physical luxury fleet assets.”'
              : '“Welcome to ETTL. We operate institutional corporate leasing contracts with an average 88.5% fleet utilization across tech firms and luxury concierge networks.”'
          );
          audioEngine.playDialogueChime('manager');
        }

        // Smooth side-by-side tracking dolly shot
        cameraTargetPos.current.set(0, 2.35, client.root.position.z + 5.6);
        cameraTargetLookAt.current.set(0, 1.8, client.root.position.z - 4);
      } 
      // PHASE 6: Executive Director Briefing
      else if (currentPhase === 'at_manager') {
        blendToIdle(client);
        blendToIdle(receptionist);

        // Manager greeting gestures
        const managerBreathe = Math.sin(elapsed * 1.8);
        manager.torso.position.y = 0.45 + managerBreathe * 0.018;
        manager.leftShoulder.rotation.x = -0.42 + managerBreathe * 0.08;
        manager.leftElbow.rotation.x = -0.65;
        manager.headGroup.rotation.y = Math.sin(elapsed * 1.5) * 0.07;

        cameraTargetPos.current.set(1.35, 2.05, -25.2);
        cameraTargetLookAt.current.set(0, 1.65, -29.2);
      } 
      // PHASE 7: Push-through Zoom Dissolve
      else if (currentPhase === 'transitioning') {
        cameraTargetPos.current.set(0, 2.2, -34);
        cameraTargetLookAt.current.set(0, 2.2, -48);
      }

      // Frame-rate independent exponential smoothing for buttery cinematic camera
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
    <div className="relative w-full h-screen overflow-hidden bg-white select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Top HUD Controls: Chapter Indicators, Sound & Skip Button */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-pink-200 text-slate-900 text-xs font-bold tracking-wider shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D70F64] animate-pulse" />
            <span>ETTL CINEMATIC INTRO</span>
          </div>

          <button
            onClick={handleToggleSound}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-pink-200 text-slate-700 hover:text-[#D70F64] transition-all text-xs cursor-pointer shadow-sm"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#D70F64]" />}
            <span>{isMuted ? 'Audio Off' : 'Soundscape On'}</span>
          </button>
        </div>

        {/* Narrative Chapter Timeline Scrubber */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-white/95 backdrop-blur-md border border-pink-200 shadow-sm text-[11px] font-semibold text-slate-600">
          <button
            onClick={() => jumpToPhase('approaching')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              phase === 'approaching' ? 'bg-[#D70F64] text-white' : 'hover:text-[#D70F64]'
            }`}
          >
            01 Approach
          </button>
          <button
            onClick={() => jumpToPhase('entering')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              phase === 'entering' ? 'bg-[#D70F64] text-white' : 'hover:text-[#D70F64]'
            }`}
          >
            02 Atrium
          </button>
          <button
            onClick={() => jumpToPhase('at_desk')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              phase === 'at_desk' || phase === 'choosing' ? 'bg-[#D70F64] text-white' : 'hover:text-[#D70F64]'
            }`}
          >
            03 Reception
          </button>
          <button
            onClick={() => jumpToPhase('at_manager')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              phase === 'at_manager' ? 'bg-[#D70F64] text-white' : 'hover:text-[#D70F64]'
            }`}
          >
            04 Executive Suite
          </button>
        </div>

        {/* Prominent, Clearly Visible Skip Intro Button */}
        <button
          onClick={handleSkip}
          className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/95 hover:bg-[#D70F64] text-slate-900 hover:text-white font-bold text-xs tracking-wide uppercase backdrop-blur-md border border-pink-200 hover:border-[#D70F64] transition-all shadow-md hover:shadow-lg hover:shadow-[#D70F64]/25 cursor-pointer"
        >
          <span>Skip Intro</span>
          <FastForward className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Interactive Choice Overlay (Phase: 'choosing') */}
      {phase === 'choosing' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-white/45 backdrop-blur-sm transition-all">
          <div className="max-w-xl w-full text-center mb-8 animate-fade-in">
            <p className="text-xs uppercase tracking-widest text-[#D70F64] font-bold mb-2">
              Reception Desk Concierge
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 drop-shadow-sm">
              How would you like to explore ETTL?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full">
            {/* Button 1: See Prices */}
            <button
              onClick={() => handleSelectChoice('prices')}
              onMouseEnter={() => audioEngine.playHover()}
              className="group relative p-6 rounded-3xl bg-white hover:bg-pink-50/50 border-2 border-pink-200 hover:border-[#D70F64] transition-all duration-300 shadow-xl hover:scale-[1.03] text-left cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center border border-pink-200 text-[#D70F64]">
                  <DollarSign className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#D70F64] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-[#D70F64] transition-colors mb-1">
                See Prices & Yields
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review capital allocation tiers ($25k–$1M+), vehicle unit costs, and projected 19.8%–24.2% annualized cash yields.
              </p>
            </button>

            {/* Button 2: See Details */}
            <button
              onClick={() => handleSelectChoice('details')}
              onMouseEnter={() => audioEngine.playHover()}
              className="group relative p-6 rounded-3xl bg-white hover:bg-pink-50/50 border-2 border-pink-200 hover:border-[#D70F64] transition-all duration-300 shadow-xl hover:scale-[1.03] text-left cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center border border-pink-200 text-[#D70F64]">
                  <Info className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#D70F64] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-[#D70F64] transition-colors mb-1">
                See Details & Model
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Understand the asset-backed vehicle rental expansion, corporate lease client base, and telematics asset custody.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Manager's Office Final Option (Phase: 'at_manager') */}
      {phase === 'at_manager' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-32 p-6 bg-gradient-to-t from-white/95 via-transparent to-transparent pointer-events-none">
          <div className="pointer-events-auto max-w-md w-full text-center animate-fade-in">
            <button
              onClick={handleExploreProject}
              onMouseEnter={() => audioEngine.playHover()}
              className="w-full py-4 px-6 rounded-2xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-display font-bold text-base tracking-wide uppercase transition-all shadow-xl shadow-[#D70F64]/30 hover:scale-[1.02] flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Explore Full Project Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="mt-3 text-xs text-slate-600 font-medium">
              Access 3D fleet showroom, interactive ROI calculator, and investor dossier
            </p>
          </div>
        </div>
      )}

      {/* Bottom Subtitle / Dialogue HUD with progressive typewriter reveal */}
      <div className="absolute bottom-8 left-6 right-6 z-20 flex justify-center pointer-events-none">
        <div className="max-w-2xl w-full px-6 py-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-pink-200 shadow-xl pointer-events-auto transition-all">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D70F64]" />
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
