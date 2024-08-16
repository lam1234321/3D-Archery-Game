window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef, Suspense, useMemo } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;
  const { GLTFLoader } = window.THREE;

  const TargetModel = React.memo(({ url, position = [0, 0, 0] }) => {
    const gltf = useLoader(GLTFLoader, url, (loader) => {
      loader.load(url, 
        () => {}, 
        undefined, 
        (error) => {
          console.error('Error loading model:', error);
        }
      );
    });

    return React.createElement('primitive', { object: gltf.scene.clone(), position });
  });

  function ArrowModel() {
    const arrowRef = useRef();
    const [isFired, setIsFired] = useState(false);
    const [targetPosition, setTargetPosition] = useState([0, 0, 0]);

    useFrame(() => {
      if (isFired && arrowRef.current) {
        arrowRef.current.position.lerp(new THREE.Vector3(...targetPosition), 0.1);
        if (arrowRef.current.position.distanceTo(new THREE.Vector3(...targetPosition)) < 0.1) {
          setIsFired(false);
          arrowRef.current.position.set(0, 0, 0); // Reset position
        }
      }
    });

    const fireArrow = (target) => {
      setTargetPosition(target);
      setIsFired(true);
    };

    return {
      arrowRef,
      fireArrow,
      arrowModel: React.createElement('mesh', { ref: arrowRef, position: [0, 0, 0], geometry: new THREE.CylinderGeometry(0.1, 0.1, 1), material: new THREE.MeshBasicMaterial({ color: 0x000000 }) })
    };
  }

  function Bow() {
    const bowRef = useRef();
    const { camera } = useThree();
    const { arrowRef, fireArrow } = ArrowModel();

    const handleClick = (event) => {
      const target = [event.clientX / window.innerWidth * 4 - 2, 1, -5]; // Example target position based on click
      fireArrow(target);
    };

    return React.createElement('group', { ref: bowRef, onClick: handleClick }, 
      React.createElement('mesh', { /* Bow model here */ })
    );
  }

  function ArcheryGame() {
    const targetPositions = [
      [-2, 1, -5], [0, 1, -5], [2, 1, -5]
    ];
    
    const targets = targetPositions.map((pos, index) =>
      React.createElement(TargetModel, { key: index, url: `${assetsUrl}/target.glb`, position: pos })
    );

    return React.createElement(
      React.Fragment,
      null,
      targets,
      React.createElement(Bow)
    );
  }

  return ArcheryGame;
};

console.log('3D Archery game script loaded');
