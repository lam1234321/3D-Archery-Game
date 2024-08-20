// app.js

const { useRef, useEffect } = React;
const { Canvas } = window.ReactThreeFiber; // Only import Canvas here
const THREE = window.THREE;

// Player component
function Player({ playerRef, walls }) {
    const speed = 0.005;
    const keys = useRef({ w: false, a: false, s: false, d: false });

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
            const wallBox = new THREE.Box3().setFromCenterAndSize(
                wall,
                new THREE.Vector3(1, 1, 1)
            );
            if (playerBox.intersectsBox(wallBox)) {
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        const animate = (state) => {
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
            requestAnimationFrame(() => animate(state));
        };

        animate({ clock: new THREE.Clock() });
    }, [playerRef, walls]);

    return React.createElement('mesh', { ref: playerRef, position: [1, 0.5, -1] },
        React.createElement('boxGeometry', { args: [0.5, 1, 0.5] }),
        React.createElement('meshStandardMaterial', { color: 'blue' })
    );
}

// RollingBall component
function RollingBall() {
    const ballRef = useRef();
    const loader = new THREE.OBJLoader();

    useEffect(() => {
        loader.load(
            'assets/ball.obj',
            (object) => {
                ballRef.current = object;
                ballRef.current.position.set(5, 0.5, -5);
                window.scene.add(ballRef.current);
                animate(); // Start animation loop
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the ball:', error);
            }
        );
    }, [loader]);

    const animate = () => {
        if (ballRef.current) {
            ballRef.current.rotation.x += 0.05;
            ballRef.current.rotation.y += 0.05;
        }
        requestAnimationFrame(animate); // Request next frame
    };

    return null; // No additional JSX for this component
}

// Main Game component
function GameScene() {
    const playerRef = useRef();
    const walls = [/* Define your wall positions here */];

    return React.createElement(
        React.Fragment,
        null,
        React.createElement('ambientLight', { intensity: 0.5 }),
        React.createElement('pointLight', { position: [10, 10, 10] }),
        React.createElement(Player, { playerRef, walls }),
        React.createElement(RollingBall),
        walls.map((position, index) =>
            React.createElement('mesh', { position: position, key: `wall-${index}` },
                React.createElement('boxGeometry', { args: [1, 1, 1] }),
                React.createElement('meshStandardMaterial', { color: 'gray' })
            )
        )
    );
}

// Render the game
ReactDOM.render(
    React.createElement(Canvas, null,
        React.createElement(GameScene)
    ),
    document.getElementById('root')
);
