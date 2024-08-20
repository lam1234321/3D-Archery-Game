window.initMazeGame = (React, assetsUrl) => {
    const { useState, useEffect, useRef, useMemo } = React;
    const { useLoader, useThree, useFrame } = window.ReactThreeFiber;
    const THREE = window.THREE;
    const { GLTFLoader } = window.THREE;

    const BlockModel = React.memo(({ url, position = [0, 0, 0] }) => {
        const gltf = useLoader(GLTFLoader, url);
        const copiedScene = useMemo(() => gltf.scene.clone(), [gltf]);

        useEffect(() => {
            copiedScene.position.set(...position);
        }, [copiedScene, position]);

        return React.createElement('primitive', { object: copiedScene });
    });

    function Maze() {
        const wallUrl = `${assetsUrl}/wall.glb`;
        const blocks = [
            [0, 0, 0], [1, 0, 0], [0, 0, -1], [1, 0, -1], // Sample maze positions
            // Add more positions here for walls
        ];

        return (
            React.createElement(
                'group',
                null,
                blocks.map((pos) => React.createElement(BlockModel, { key: `${pos}`, url: wallUrl, position: pos }))
            )
        );
    }

    function GoalModel() {
        const goalUrl = `${assetsUrl}/goal.glb`;
        return React.createElement(BlockModel, { url: goalUrl, position: [2, 0, -2] });
    }

    function PlayerModel({ position }) {
        const playerUrl = `${assetsUrl}/player.glb`;
        return React.createElement(BlockModel, { url: playerUrl, position });
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
        const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);

        const handleKeyPress = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    setPlayerPosition((pos) => [pos[0], pos[1], pos[2] + 1]);
                    break;
                case 'ArrowDown':
                    setPlayerPosition((pos) => [pos[0], pos[1], pos[2] - 1]);
                    break;
                case 'ArrowLeft':
                    setPlayerPosition((pos) => [pos[0] - 1, pos[1], pos[2]]);
                    break;
                case 'ArrowRight':
                    setPlayerPosition((pos) => [pos[0] + 1, pos[1], pos[2]]);
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
            React.createElement(Maze),
            React.createElement(GoalModel),
            React.createElement(PlayerModel, { position: playerPosition })
        );
    }

    return EscapeMazeGame;
};

console.log('Escape the Maze game script loaded');
