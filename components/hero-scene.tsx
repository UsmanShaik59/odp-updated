"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Sparkles, Text } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Plant({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Planter */}
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.12, 0.26, 16]} />
        <meshStandardMaterial color="#d8e2eb" roughness={0.65} />
      </mesh>

      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.045, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Stem */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.018, 0.025, 0.55, 8]} />
        <meshStandardMaterial color="#47844b" />
      </mesh>

      {/* Leaves */}
      {[
        [-0.13, 0.48, 0],
        [0.13, 0.56, 0],
        [-0.09, 0.7, 0.03],
        [0.09, 0.77, -0.02],
        [0, 0.88, 0],
        [0, 0.58, 0.12],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p as [number, number, number]}
          rotation={[0.2, 0, (i % 2 === 0 ? -1 : 1) * 0.55]}
          scale={[0.8, 1.1, 0.45]}
        >
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#39834b" : "#68aa62"}
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent() {
  const house = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (house.current) house.current.rotation.y += delta * 0.12;
    if (ring.current) ring.current.rotation.z += delta * 0.12;
    if (orbit.current) orbit.current.rotation.y += delta * 0.08;

    state.camera.lookAt(0, 0.25, 0);
  });

  return (
    <>
      <ambientLight intensity={1.6} />

      <directionalLight
        position={[4, 7, 5]}
        intensity={2.8}
        color="#ffffff"
        castShadow
      />

      <directionalLight
        position={[-4, 3, -3]}
        intensity={1.3}
        color="#a9dcff"
      />

      <Sparkles
        count={36}
        scale={[6, 3.8, 3.5]}
        size={2}
        speed={0.2}
        color="#0874d1"
        opacity={0.35}
      />

      <group ref={house} position={[0, 0.15, 0]}>
        {/* Complete rectangular foundation */}
        <RoundedBox
          args={[3.65, 0.2, 3.15]}
          radius={0.09}
          smoothness={5}
          position={[0, -0.96, 0.18]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#dce8e2" roughness={0.85} />
        </RoundedBox>

        {/* Lawn fitted over the foundation */}
        <mesh
          position={[0, -0.855, 0.18]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[3.48, 2.98]} />
          <meshStandardMaterial
            color="#66ad6b"
            roughness={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* House body */}
        <RoundedBox
          args={[2.9, 1.75, 1.8]}
          radius={0.1}
          smoothness={5}
          castShadow
          receiveShadow
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.38}
            metalness={0.02}
          />
        </RoundedBox>

        {/* Blue roof */}
        <mesh
          position={[0, 1.05, 0]}
          rotation={[0, 0, Math.PI / 4]}
          scale={[1.1, 1.1, 1.1]}
          castShadow
        >
          <coneGeometry args={[1.85, 1.35, 4]} />
          <meshStandardMaterial
            color="#0874d1"
            roughness={0.3}
            metalness={0.12}
          />
        </mesh>

        {/* Roof trim */}
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[3.02, 0.09, 1.92]} />
          <meshStandardMaterial color="#dceeff" roughness={0.4} />
        </mesh>

        {/* ODP logo */}
        <group position={[0.42, 1.63, 0.76]} rotation={[-0.48, 0, 0]}>
          <Text
            position={[0.012, -0.015, -0.012]}
            fontSize={0.46}
            maxWidth={1.5}
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            letterSpacing={0.045}
            fontWeight={700}
            color="#06477e"
            depthOffset={-1}
          >
            ODP
          </Text>

          <Text
            position={[0, 0, 0.012]}
            fontSize={0.46}
            maxWidth={1.5}
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            letterSpacing={0.045}
            fontWeight={700}
            color="#ffffff"
            depthOffset={-2}
          >
            ODP
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.25}
              metalness={0.12}
            />
          </Text>
        </group>

        {/* Main entrance */}
        <RoundedBox
          args={[0.68, 1.12, 0.12]}
          radius={0.045}
          smoothness={5}
          position={[0, -0.3, 0.94]}
        >
          <meshStandardMaterial
            color="#123957"
            roughness={0.28}
            metalness={0.12}
          />
        </RoundedBox>

        {/* Door handle */}
        <mesh position={[0.23, -0.28, 1.02]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial
            color="#d9e4ed"
            metalness={0.65}
            roughness={0.25}
          />
        </mesh>

        {/* Front windows */}
        {[-0.94, 0.94].map((x) => (
          <group key={x} position={[x, 0.28, 0.94]}>
            <RoundedBox args={[0.7, 0.62, 0.1]} radius={0.035} smoothness={4}>
              <meshStandardMaterial
                color="#8fd4ff"
                roughness={0.15}
                metalness={0.12}
                emissive="#58b8f0"
                emissiveIntensity={0.12}
              />
            </RoundedBox>

            <mesh position={[0, 0, 0.06]}>
              <boxGeometry args={[0.035, 0.62, 0.025]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}

        {/* Verandah floor — aligned with the foundation */}
        <RoundedBox
          args={[2.5, 0.13, 0.75]}
          radius={0.06}
          smoothness={4}
          position={[0, -0.845, 1.18]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#dce5ec" roughness={0.55} />
        </RoundedBox>

        {/* Verandah canopy */}
        <RoundedBox
          args={[2.55, 0.12, 0.85]}
          radius={0.05}
          smoothness={4}
          position={[0, 0.72, 1.23]}
          castShadow
        >
          <meshStandardMaterial
            color="#0874d1"
            roughness={0.3}
            metalness={0.1}
          />
        </RoundedBox>

        {/* White support pillars */}
        {[-1.08, 1.08].map((x) => (
          <RoundedBox
            key={x}
            args={[0.11, 1.48, 0.12]}
            radius={0.025}
            smoothness={4}
            position={[x, -0.03, 1.48]}
            castShadow
          >
            <meshStandardMaterial color="#ffffff" roughness={0.35} />
          </RoundedBox>
        ))}

        {/* Flower pots on the verandah floor */}
        <Plant position={[-0.78, -0.91, 1.48]} scale={0.58} />
        <Plant position={[0.78, -0.91, 1.48]} scale={0.58} />

        {/* Additional garden plants */}
        <Plant position={[-1.65, -0.87, 0.65]} scale={0.62} />
        <Plant position={[1.65, -0.87, 0.65]} scale={0.62} />

        {/* Stepping stones placed in front of the foundation */}
        {[-0.48, 0, 0.48].map((x, i) => (
          <mesh
            key={i}
            position={[x, -0.85, 1.92 + i * 0.02]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <circleGeometry args={[0.13, 20]} />
            <meshStandardMaterial color="#c9d5df" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Decorative orbit */}
      <group ref={orbit}>
        <mesh
          ref={ring}
          position={[0, 0.3, 0]}
          rotation={[Math.PI / 2.4, 0.3, 0]}
        >
          <torusGeometry args={[2.25, 0.016, 10, 100]} />
          <meshBasicMaterial color="#0874d1" transparent opacity={0.32} />
        </mesh>

        <mesh position={[1.5, 0.65, 0.35]}>
          <sphereGeometry args={[0.1, 20, 20]} />
          <meshStandardMaterial
            color="#f5c62d"
            emissive="#f5c62d"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </>
  );
}

export function HeroScene({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      className="hero-3d"
      aria-label="Interactive 3D ODP house. Drag to rotate."
      style={{
        width: "100%",
        height: "100%",
        minHeight: mobile ? "0" : "420px",
        touchAction: "pan-y",
        border: "none",
        outline: "none",
        boxShadow: "none",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 1.25, 8.2], fov: 35 }}
        dpr={mobile ? [1, 1.25] : [1, 1.6]}
        gl={{ antialias: true, alpha: true }}
        shadows={!mobile}
      >
        <SceneContent />

        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
}

export default HeroScene;
