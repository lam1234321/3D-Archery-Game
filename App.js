window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef, Suspense, useMemo } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;
  const { OBJLoader } = window.THREE;

  const BoardModel = React.memo(function BoardModel({ url, scale = [1, 1, 1], position = [0, 0, 0] }) {
    const obj = useLoader(OBJLoader, url);
    const copiedScene = useMemo(() => obj.scene.clone(), [obj]);
    
    useEffect(() => {
      copiedScene.scale.set(...scale);
      copiedScene.position.set(...position);
    }, [copiedScene, scale, position]);

    return React.createElement('primitive', { object: copiedScene });
  });

  const PieceModel = React.memo(function PieceModel({ url, scale = [1, 1, 1], position = [0, 0, 0] }) {
    const obj = useLoader(OBJLoader, url);
    const copiedScene = useMemo(() => obj.scene.clone(), [obj]);
    
    useEffect(() => {
      copiedScene.scale.set(...scale);
      copiedScene.position.set(...position);
    }, [copiedScene, scale, position]);

    return React.createElement('primitive', { object: copiedScene });
  });

  function Piece({ position, type }) {
    return React.createElement(
      'group',
      { 
        position: position
      },
      React.createElement(PieceModel, { 
        url: type === 'X' ? `${assetsUrl}/x.obj` : `${assetsUrl}/o.obj`,
        scale: [2, 2, 2],
        position: [0, 0.5, 0]
      })
    );
  }

  function TicTacToe() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [winner, setWinner] = useState(null);

    const handleClick = (index) => {
      // The rest of the TicTacToe function remains the same
    };

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(BoardModel, { 
        url: `${assetsUrl}/board.obj`,
        scale: [5, 5, 5],
        position: [0, 0, 0]
      }),
      board.map((piece, index) => piece && 
        React.createElement(Piece, {
          key: index,
          position: [
            (index % 3 - 1) * 2,
            0.5,
            (Math.floor(index / 3) - 1) * 2
          ],
          type: piece
        })
      ),
      winner && React.createElement('textGeometry', {
        text: `Winner: ${winner}`,
        parameters: {
          size: 1,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelSegments: 5
        },
        position: [0, 3, 0]
      })
    );
  }

  function Camera() {
    const { camera } = useThree();
    
    useEffect(() => {
      camera.position.set(0, 10, 15);
      camera.lookAt(0, 0, 0);
    }, [camera]);

    return null;
  }

  return TicTacToe;
};

console.log('3D Tic-Tac-Toe game script loaded');
