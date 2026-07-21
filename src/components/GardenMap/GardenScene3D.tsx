import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { GardenMarkerPosition } from '../../constants/gardenMapScene';
import useReducedMotion from '../../hooks/useReducedMotion';
import './GardenScene3D.scss';

interface GardenScene3DProps {
  activeZone?: string | null;
  onMarkerPositionsChange?: (positions: Record<string, GardenMarkerPosition>) => void;
}

/** Palette mirrors the original hand-illustrated garden map for visual continuity */
const PALETTE = {
  grass: 0x8fbf8f,
  grassDark: 0x4a7349,
  hedge: 0x6b9b5e,
  wood: 0x8b6f47,
  woodLight: 0xc49a6c,
  woodDark: 0xa67b5b,
  roof: 0x8b6f47,
  window: 0xffe9a8,
  book: 0x8b4545,
  page: 0xf5edd6,
  clayA: 0xb87a50,
  clayB: 0xc49a6c,
  clayC: 0xa67b5b,
  sage: 0x7a8b72,
  sageLight: 0x9aa892,
  sageDark: 0x6b7b62,
  pond: 0x7eb8c9,
  lotus: 0xe8a0bf,
  lotusCenter: 0xf0b8cc,
  stone: 0xcfc2a8,
};

/** World-space (x, z) for each garden zone — mirrors GARDEN_SCENE layout (house at back, gate up front) */
const ZONE_POSITIONS: Record<string, [number, number]> = {
  'tu-chiem-nghiem': [-3.6, -2.6],
  'sang-tao': [-3.6, 2.4],
  'ket-noi': [3.6, -2.6],
  'cam-xuc': [3.6, 2.4],
  'tam-tri': [0, -1.6],
  'bo-loc': [0, 3.2],
};

/** Marker anchor height (world-space y) — roughly the visual center of each zone's props */
const ZONE_ANCHOR_HEIGHT: Record<string, number> = {
  'tu-chiem-nghiem': 0.4,
  'sang-tao': 0.28,
  'ket-noi': 0.6,
  'cam-xuc': 0.12,
  'tam-tri': 0.85,
  'bo-loc': 0.45,
};

/** 3D garden scene — replaces the flat SVG/PNG map art with a small living diorama */
const GardenScene3D = ({ activeZone = null, onMarkerPositionsChange }: GardenScene3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeZoneRef = useRef(activeZone);
  const reducedMotion = useReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  const onMarkerPositionsChangeRef = useRef(onMarkerPositionsChange);

  useEffect(() => {
    onMarkerPositionsChangeRef.current = onMarkerPositionsChange;
  }, [onMarkerPositionsChange]);

  useEffect(() => {
    activeZoneRef.current = activeZone;
  }, [activeZone]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, 800 / 520, 0.1, 100);
    camera.position.set(0, 6.4, 8.6);
    camera.lookAt(0, 0, 0.3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // --- Lighting ---
    scene.add(new THREE.HemisphereLight(0xeaf6e3, 0x6b9b5e, 0.9));
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    const sun = new THREE.DirectionalLight(0xfff3d6, 1.1);
    sun.position.set(4, 8, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -8;
    sun.shadow.camera.right = 8;
    sun.shadow.camera.top = 8;
    sun.shadow.camera.bottom = -8;
    scene.add(sun);

    // --- Garden root (gently sways) ---
    const gardenGroup = new THREE.Group();
    scene.add(gardenGroup);

    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(5.6, 5.6, 0.2, 48),
      new THREE.MeshStandardMaterial({ color: PALETTE.grass, roughness: 0.9 })
    );
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    gardenGroup.add(ground);

    const hedgeRing = new THREE.Mesh(
      new THREE.TorusGeometry(5.5, 0.18, 12, 48),
      new THREE.MeshStandardMaterial({ color: PALETTE.hedge, roughness: 0.85 })
    );
    hedgeRing.rotation.x = Math.PI / 2;
    hedgeRing.position.y = 0.05;
    gardenGroup.add(hedgeRing);

    const zoneGroups: Record<string, THREE.Group> = {};

    const addPath = (toX: number, toZ: number, count = 4) => {
      for (let i = 1; i < count; i++) {
        const t = i / count;
        const stone = new THREE.Mesh(
          new THREE.CylinderGeometry(0.16, 0.18, 0.05, 10),
          new THREE.MeshStandardMaterial({ color: PALETTE.stone, roughness: 1 })
        );
        stone.position.set(toX * t, 0.02, toZ * t);
        stone.receiveShadow = true;
        gardenGroup.add(stone);
      }
    };

    // --- House (tam-tri) ---
    const [houseX, houseZ] = ZONE_POSITIONS['tam-tri'];
    const houseGroup = new THREE.Group();
    houseGroup.position.set(houseX, 0, houseZ);

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 1, 1.4),
      new THREE.MeshStandardMaterial({ color: PALETTE.woodLight, roughness: 0.8 })
    );
    base.position.y = 0.5;
    base.castShadow = true;
    base.receiveShadow = true;
    houseGroup.add(base);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(1.35, 0.9, 4),
      new THREE.MeshStandardMaterial({ color: PALETTE.roof, roughness: 0.7 })
    );
    roof.position.y = 1.45;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseGroup.add(roof);

    const windowMat = new THREE.MeshStandardMaterial({
      color: PALETTE.window,
      emissive: PALETTE.window,
      emissiveIntensity: 0.6,
      roughness: 0.5,
    });
    [-0.5, 0.5].forEach((offset) => {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.28), windowMat);
      win.position.set(offset, 0.55, 0.71);
      houseGroup.add(win);
    });

    const treeTrunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: PALETTE.wood })
    );
    treeTrunk.position.set(1.15, 0.25, -0.3);
    houseGroup.add(treeTrunk);

    const foliageMat = new THREE.MeshStandardMaterial({ color: PALETTE.hedge, roughness: 0.9 });
    const foliageDarkMat = new THREE.MeshStandardMaterial({ color: PALETTE.grassDark, roughness: 0.9 });
    const foliageBlobs: Array<[number, number, number, number, THREE.MeshStandardMaterial]> = [
      [1.15, 0.75, -0.3, 0.32, foliageMat],
      [0.95, 0.68, -0.15, 0.24, foliageMat],
      [1.35, 0.62, -0.15, 0.22, foliageDarkMat],
    ];
    foliageBlobs.forEach(([x, y, z, r, mat]) => {
      const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), mat);
      blob.position.set(x, y, z);
      blob.castShadow = true;
      houseGroup.add(blob);
    });

    gardenGroup.add(houseGroup);
    zoneGroups['tam-tri'] = houseGroup;
    addPath(houseX, houseZ);

    // --- Reflection nook (tu-chiem-nghiem) ---
    const [reflX, reflZ] = ZONE_POSITIONS['tu-chiem-nghiem'];
    const reflGroup = new THREE.Group();
    reflGroup.position.set(reflX, 0, reflZ);

    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.12, 0.4),
      new THREE.MeshStandardMaterial({ color: PALETTE.woodDark })
    );
    bench.position.y = 0.32;
    bench.castShadow = true;
    reflGroup.add(bench);
    [-0.35, 0.35].forEach((x) => {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.32, 0.08),
        new THREE.MeshStandardMaterial({ color: PALETTE.wood })
      );
      leg.position.set(x, 0.16, 0);
      reflGroup.add(leg);
    });

    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.05, 0.3),
      new THREE.MeshStandardMaterial({ color: PALETTE.book })
    );
    book.position.set(0, 0.4, 0);
    book.rotation.y = 0.3;
    reflGroup.add(book);
    const pages = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.03, 0.26),
      new THREE.MeshStandardMaterial({ color: PALETTE.page })
    );
    pages.position.set(0, 0.43, 0);
    pages.rotation.y = 0.3;
    reflGroup.add(pages);

    gardenGroup.add(reflGroup);
    zoneGroups['tu-chiem-nghiem'] = reflGroup;
    addPath(reflX, reflZ);

    // --- Creativity corner (sang-tao) ---
    const [creaX, creaZ] = ZONE_POSITIONS['sang-tao'];
    const creaGroup = new THREE.Group();
    creaGroup.position.set(creaX, 0, creaZ);

    const potColors = [PALETTE.clayA, PALETTE.clayB, PALETTE.clayC];
    [-0.35, 0, 0.35].forEach((x, i) => {
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.12, 0.36 + i * 0.05, 12),
        new THREE.MeshStandardMaterial({ color: potColors[i], roughness: 0.7 })
      );
      pot.position.set(x, 0.18 + i * 0.02, 0);
      pot.castShadow = true;
      creaGroup.add(pot);
    });
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: PALETTE.wood })
    );
    wheel.position.set(0, 0.04, 0.4);
    creaGroup.add(wheel);

    gardenGroup.add(creaGroup);
    zoneGroups['sang-tao'] = creaGroup;
    addPath(creaX, creaZ);

    // --- Connection gate (ket-noi) ---
    const [gateX, gateZ] = ZONE_POSITIONS['ket-noi'];
    const gateGroup = new THREE.Group();
    gateGroup.position.set(gateX, 0, gateZ);

    const postMat = new THREE.MeshStandardMaterial({ color: PALETTE.sage, roughness: 0.8 });
    [-0.4, 0.4].forEach((x) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.1), postMat);
      post.position.set(x, 0.45, 0);
      post.castShadow = true;
      gateGroup.add(post);
    });
    const topBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.1, 0.1),
      new THREE.MeshStandardMaterial({ color: PALETTE.sageLight })
    );
    topBar.position.set(0, 0.9, 0);
    gateGroup.add(topBar);
    const finial = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 12, 12),
      new THREE.MeshStandardMaterial({ color: PALETTE.sageDark })
    );
    finial.position.set(0, 1.0, 0);
    gateGroup.add(finial);

    gardenGroup.add(gateGroup);
    zoneGroups['ket-noi'] = gateGroup;
    addPath(gateX, gateZ);

    // --- Emotion pond (cam-xuc) ---
    const [pondX, pondZ] = ZONE_POSITIONS['cam-xuc'];
    const pondGroup = new THREE.Group();
    pondGroup.position.set(pondX, 0, pondZ);

    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.06, 24),
      new THREE.MeshStandardMaterial({ color: PALETTE.pond, roughness: 0.3, metalness: 0.1 })
    );
    water.position.y = 0.03;
    pondGroup.add(water);
    const lotus = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 12),
      new THREE.MeshStandardMaterial({ color: PALETTE.lotus })
    );
    lotus.position.set(0.1, 0.09, 0.1);
    lotus.scale.set(1, 0.6, 1);
    pondGroup.add(lotus);
    const lotusCenter = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 10, 10),
      new THREE.MeshStandardMaterial({ color: PALETTE.lotusCenter })
    );
    lotusCenter.position.set(0.1, 0.14, 0.1);
    pondGroup.add(lotusCenter);

    gardenGroup.add(pondGroup);
    zoneGroups['cam-xuc'] = pondGroup;
    addPath(pondX, pondZ);

    // --- Filter marker (bo-loc) ---
    const [filterX, filterZ] = ZONE_POSITIONS['bo-loc'];
    const filterGroup = new THREE.Group();
    filterGroup.position.set(filterX, 0, filterZ);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.05, 0.7, 8),
      new THREE.MeshStandardMaterial({ color: PALETTE.wood })
    );
    pole.position.y = 0.35;
    filterGroup.add(pole);
    const plaque = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.3, 0.04),
      new THREE.MeshStandardMaterial({ color: PALETTE.page })
    );
    plaque.position.set(0, 0.55, 0.03);
    filterGroup.add(plaque);

    gardenGroup.add(filterGroup);
    zoneGroups['bo-loc'] = filterGroup;
    addPath(filterX, filterZ, 3);

    // --- Resize handling ---
    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    // --- Report actual on-screen marker positions (projected from 3D, not the old flat-art layout) ---
    camera.updateMatrixWorld();
    const projected: Record<string, GardenMarkerPosition> = {};
    Object.entries(ZONE_POSITIONS).forEach(([id, [x, z]]) => {
      const anchor = new THREE.Vector3(x, ZONE_ANCHOR_HEIGHT[id] ?? 0.4, z);
      anchor.project(camera);
      projected[id] = {
        x: (anchor.x * 0.5 + 0.5) * 100,
        y: (1 - (anchor.y * 0.5 + 0.5)) * 100,
      };
    });
    onMarkerPositionsChangeRef.current?.(projected);

    // --- Animation loop ---
    let frameId = 0;
    const scales: Record<string, number> = {};
    Object.keys(zoneGroups).forEach((id) => {
      scales[id] = 1;
    });

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!reducedMotionRef.current) {
        gardenGroup.rotation.y = Math.sin(Date.now() * 0.00015) * 0.12;
      }

      Object.entries(zoneGroups).forEach(([id, group]) => {
        const target = activeZoneRef.current === id ? 1.15 : 1;
        scales[id] += (target - scales[id]) * 0.15;
        group.scale.setScalar(scales[id]);
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      mount.removeChild(renderer.domElement);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="garden-scene-3d" aria-hidden="true" />;
};

export default GardenScene3D;
