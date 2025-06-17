// Infinity Runner Game using Babylon.js
// Run this in an HTML environment with Babylon.js included

import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = async () => {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.Black();

    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 200 }, scene);
    ground.position.z = 90;

    const player = BABYLON.MeshBuilder.CreateBox("player", { height: 2, width: 1, depth: 1 }, scene);
    player.position.y = 1;

    let speed = 0.1;
    let score = 0;
    let gameOver = false;

    // Input control
    let input = { left: false, right: false, up: false, down: false };
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") input.left = true;
        if (e.key === "ArrowRight") input.right = true;
        if (e.key === "ArrowUp") input.up = true;
        if (e.key === "ArrowDown") input.down = true;
    });
    window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft") input.left = false;
        if (e.key === "ArrowRight") input.right = false;
        if (e.key === "ArrowUp") input.up = false;
        if (e.key === "ArrowDown") input.down = false;
    });

    // Obstacles
    const obstacles = [];
    function spawnObstacle() {
        const obs = BABYLON.MeshBuilder.CreateBox("obstacle", { height: 2, width: 1, depth: 1 }, scene);
        obs.position.z = player.position.z + 60 + Math.random() * 40;
        obs.position.x = [-2, 0, 2][Math.floor(Math.random() * 3)];
        obs.position.y = 1;
        obstacles.push(obs);
    }
    setInterval(spawnObstacle, 1000);

    // Score Display
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const scoreText = new BABYLON.GUI.TextBlock();
    scoreText.text = "Score: 0";
    scoreText.color = "white";
    scoreText.fontSize = 24;
    scoreText.top = "-45%";
    scoreText.left = "40%";
    scoreText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    scoreText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(scoreText);

    // Game Loop
    scene.onBeforeRenderObservable.add(() => {
        if (gameOver) return;

        // Move player
        if (input.left && player.position.x > -2) player.position.x -= 0.2;
        if (input.right && player.position.x < 2) player.position.x += 0.2;
        if (input.up) player.position.y = 2.5;
        else if (input.down) player.position.y = 0.5;
        else player.position.y = 1;

        // Move world
        obstacles.forEach((obs, i) => {
            obs.position.z -= speed;
            if (obs.position.z < -10) {
                obs.dispose();
                obstacles.splice(i, 1);
            }
            // Collision check
            if (Math.abs(obs.position.z - player.position.z) < 1.5 &&
                Math.abs(obs.position.x - player.position.x) < 1.0 &&
                Math.abs(obs.position.y - player.position.y) < 1.5) {
                gameOver = true;
                scoreText.text = "Game Over! Final Score: " + Math.floor(score);
            }
        });

        // Update score and speed
        score += engine.getDeltaTime() * 0.001;
        speed += 0.00005;
        scoreText.text = "Score: " + Math.floor(score);
    });

    return scene;
};

createScene().then((scene) => {
    engine.runRenderLoop(() => {
        scene.render();
    });
});

window.addEventListener("resize", () => {
    engine.resize();
});
