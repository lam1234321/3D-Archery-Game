window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  // Define the new game scene
  function NewGameScene() {
    const playerRef = useRef();
    const enemyRefs = useRef([]);
    const [enemyPositions, setEnemyPositions] = React.useState([]);

    // Generate the game environment
    const walls = createMaze();

    // Define the player movement and collision detection
    function Player({ playerRef, walls }) {
      // Similar to the provided Player component
      // ...
    }

    // Define the enemy behavior
    function Enemy({ enemyRef, playerRef }) {
      const speed = 0.003; // Enemy movement speed
      const lookRadius = 10; // Distance at which the enemy can see the player

      useFrame((state) => {
        if (enemyRef.current && playerRef.current) {
          const playerPosition = playerRef.current.position;
          const enemyPosition = enemyRef.current.position;
          const distance = playerPosition.distanceTo(enemyPosition);

          // Check if the player is within the enemy's line of sight
          if (distance <= lookRadius) {
            // Move the enemy towards the player
            const direction = playerPosition.clone().sub(enemyPosition).normalize();
            enemyRef.current.position.add(direction.multiplyScalar(speed * state.delta));
          }
        }
      });

      return React.createElement('mesh', { ref: enemyRef, position: [0, 1, 0] },
        React.createElement('boxGeometry', { args: [1, 1, 1] }),
        React.createElement('meshStandardMaterial', { color: 'red' })
      );
    }

    // Update the enemy positions periodically
    useEffect(() => {
      const interval = setInterval(() => {
        const newEnemyPositions = [
          // Generate new enemy positions
          new THREE.Vector3(2, 1, 2),
          new THREE.Vector3(-3, 1, -3),
          // Add more enemy positions as needed
        ];
        setEnemyPositions(newEnemyPositions);
      }, 5000); // Update enemy positions every 5 seconds

      return () => clearInterval(interval);
    }, []);

    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Player, { playerRef, walls }),
      React.createElement(CameraFollow, { playerRef }),
      ...enemyPositions.map((position, index) => (
        React.createElement(Enemy, { enemyRef: enemyRefs.current[index], playerRef, key: `enemy-${index}` })
      )),
      ...walls.map((position, index) => (
        React.createElement('mesh', { position: position.toArray(), key: `wall-${index}` },
          React.createElement('boxGeometry', { args: [1, 1, 1] }),
          React.createElement('meshStandardMaterial', { color: 'gray' })
        )
      ))
    );
  }

  return NewGameScene;
};

console.log('New game scene loaded');
