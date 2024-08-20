window.initMazeGame = (React, assetsUrl) => {
    const { useState, useEffect, useMemo } = React;
    const { useLoader, useThree } = window.ReactThreeFiber;
    const THREE = window.THREE;
    const { GLTFLoader } = window.THREE;

    const Model = React.memo(({ url, position = [0, 0, 0] }) => {
        const gltf = useLoader(GLTFLoader, url);
        const copiedScene = useMemo(() => gltf.scene.clone(), [gltf]);

        useEffect(() => {
            copiedScene.position.set(...position);
        }, [copiedScene, position]);

        return React.createElement('primitive', { object: copiedScene });
    });

    function Land() {
        const landUrl = `${assetsUrl}/land.glb`;
        return React.createElement(Model, { url: landUrl, position: [0, 0, 0] });
    }

    function GoalModel() {
        const goalUrl = `${assetsUrl}/goal.glb`;
        return React.createElement(Model, { url: goalUrl, position: [2, 0, -2] });
    }

    function BallModel({ position }) {
        const ballUrl = `${assetsUrl}/ball.glb`;
        return React.createElement(Model, { url: ballUrl, position });
    }

    function Camera() {
        const { camera } = useThree();
        useEffect(() => {
            camera.position.set(5, 5, 5);
            camera.lookAt(0, 0, 0);
        }, [camera]);
        return null;
    }

    function EscapeMazeGame() {
        const [ballPosition, setBallPosition] = useState([0, 0.5, 0]);

        const handleKeyPress = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    setBallPosition((pos) => [pos[0], pos[1], pos[2] + 0.1]);
                    break;
                case 'ArrowDown':
                    setBallPosition((pos) => [pos[0], pos[1], pos[2] - 0.1]);
                    break;
                case 'ArrowLeft':
                    setBallPosition((pos) => [pos[0] - 0.1, pos[1], pos[2]]);
                    break;
                case 'ArrowRight':
                    setBallPosition((pos) => [pos[0] + 0.1, pos[1], pos[2]]);
                    break;
                default:
                    break;
            }
        };

        useEffect(() => {
            window.addEventListener('keydown', handleKeyPress);
            return () => {
                window.removeEventListener('keydown', handleKeyPress);
            };
        }, []);

        return React.createElement(
            'group',
            null,
            React.createElement(Camera),
            React.createElement('ambientLight', { intensity: 0.5 }),
            React.createElement('pointLight', { position: [10, 10, 10] }),
            React.createElement(Land),
            React.createElement(GoalModel),
            React.createElement(BallModel, { position: ballPosition })
        );
    }

    return EscapeMazeGame;
};

console.log('Escape the Maze game script loaded');
