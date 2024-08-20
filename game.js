window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;
  
  // Import GLTFLoader
  const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader');

  function Player({ playerRef, walls }) {
    // ... existing player code ...
  }

  function CameraFollow({ playerRef }) {
    // ... existing camera code ...
  }

  function createMaze() {
    // ... existing maze creation code ...
  }

  function RollingBall() {
    const ballRef = useRef();
    const loader = new GLTFLoader();
    
    useEffect(() => {
      loader.load(
        `${assetsUrl}/ball.obj`, // Adjust based on your asset URL
        (gltf) => {
          ballRef.current = gltf.scene;
          scene.add(ballRef.current);
        },
        undefined,
        (error) => {
          console.error('An error occurred while loading the ball:', error);
        }
      );
    }, [loader]);

    useFrame(() => {
      if (ballRef.current) {
        ballRef.current.rotation.x += 0.01; // Rotate for rolling effect
        ballRef.current.rotation.y += 0.01; // Rotate for rolling effect
      }
    });

    return null; // No additional JSX for this component
  }

  function GameScene() {
    const playerRef = useRef();
    const walls = createMaze(); // Generate maze walls

    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Player, { playerRef, walls }),
      React.createElement(CameraFollow, { playerRef }),
      React.createElement(RollingBall), // Include the ball component
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

console.log('Collision detection script loaded');
