window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect } = React;
  const { Canvas, useFrame, useThree } = window.ReactThreeFiber;
  const { useGLTF } = window.Drei; // Import useGLTF from @react-three/drei
  const THREE = window.THREE;

  function Player({ playerRef, walls }) {
    const speed = 0.005;
    const keys = useRef({ w: false, a: false, s: false, d: false });
    const { scene } = useGLTF(`${assetsUrl}/ball.glb`); // Load ball model

    const handleKeyDown = (event) => {
      if (keys.current.hasOwnProperty(event.key)) {
        keys.current[event.key] = true;
      }
    };

    const handleKeyUp = (event) => {
      if (keys.current.hasOwnProperty(event.key)) {
        keys.current[event.key] = false;
      }
    };

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);

    const checkCollision = (nextPosition) => {
      const playerBox = new THREE.Box3().setFromCenterAndSize(
        nextPosition,
        new THREE.Vector3(0.5, 1, 0.5)
      );

      for (let wall of walls) {
        if (wall) {
          const wallBox = new THREE.Box3().setFromCenterAndSize(
            wall,
            new THREE.Vector3(1, 1, 1)
          );
          if (playerBox.intersectsBox(wallBox)) {
            return true;
          }
        }
      }
      return false;
    };

    useFrame((state) => {
      if (playerRef.current) {
        const direction = new THREE.Vector3();
        const delta = state.clock.getDelta();

        if (keys.current.w) direction.z -= speed * delta;
        if (keys.current.s) direction.z += speed * delta;
        if (keys.current.a) direction.x -= speed * delta;
        if (keys.current.d) direction.x += speed * delta;

        direction.normalize();
        const nextPosition = playerRef.current.position.clone().add(direction);

        if (!checkCollision(nextPosition)) {
          playerRef.current.position.copy(nextPosition);
        }
      }
    });

    return React.createElement('primitive', { object: scene, ref: playerRef });
  }

  function CameraFollow({ playerRef }) {
    const { camera } = useThree();
    const offset = new THREE.Vector3(0, 30, 10);
    const targetPosition = new THREE.Vector3();

    useFrame(() => {
      if (playerRef.current) {
        targetPosition.copy(playerRef.current.position).add(offset);
        camera.position.lerp(targetPosition, 0.1);
        camera.lookAt(playerRef.current.position);
      }
    });

    return null;
  }

  function createMaze() {
    const mazeLayout = [
      // Define your maze layout here as a 2D array
      // Example: [ [0, 1], [1, 0] ]
    ];

    const walls = [];
    const wallHeight = 1;
    const wallThickness = 1;

    mazeLayout.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) {
          const wallPosition = new THREE.Vector3(colIndex, wallHeight / 2, -rowIndex);
          walls.push(wallPosition);
        }
      });
    });

    return walls;
  }

  function GameScene() {
    const playerRef = useRef();
    const walls = createMaze();
    const { scene: landScene } = useGLTF(`${assetsUrl}/land.glb`); // Load land model

    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Player, { playerRef, walls }),
      React.createElement(CameraFollow, { playerRef }),
      React.createElement('primitive', { object: landScene, position: [0, 0, 0] }),
      ...walls.map((position, index) => (
        React.createElement('mesh', { position: position.toArray(), key: `wall-${index}` },
          React.createElement('boxGeometry', { args: [1, 1, 1] }),
          React.createElement('meshStandardMaterial', { color: 'gray' })
        )
      ))
    );
  }

  return GameScene;
};

console.log('Game initialized.');
