// This file, app.js, should be placed in your project's wwwroot/js/ folder.
// It handles the creation of the Babylon.js 3D scene and smooth scrolling.

window.portfolioApp = {
    // Initializes the Babylon.js 3D scene
    initBabylon: function (canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error("Babylon.js Error: Canvas element not found!");
            return;
        }
        const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

        const createScene = function () {
            const scene = new BABYLON.Scene(engine);
            scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.03, 1); // A deep, dark blue for the background

            // Set up camera with user controls
            const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 20, BABYLON.Vector3.Zero(), scene);
            camera.attachControl(canvas, true);
            camera.lowerRadiusLimit = 10; // Prevent zooming in too close
            camera.upperRadiusLimit = 40; // Prevent zooming out too far

            // Set up lighting for the scene
            const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
            light1.intensity = 0.7;
            const light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 5, -5), scene);
            light2.intensity = 0.5;

            // Create skill "orbs" that orbit a central point
            const skills = ["Industrial Metaverse", "AI/Simulation", "AR/VR", "Digital Twins", "IoT"];
            const orbitRadius = 7;
            skills.forEach((skill, index) => {
                const angle = (index / skills.length) * 2 * Math.PI;
                const x = orbitRadius * Math.cos(angle);
                const z = orbitRadius * Math.sin(angle);

                // Create the sphere for the skill
                const skillOrb = BABYLON.MeshBuilder.CreateSphere(skill, { diameter: 1.2 }, scene);
                skillOrb.position = new BABYLON.Vector3(x, 0, z);

                // Create a glowing material for the orb
                const skillMaterial = new BABYLON.StandardMaterial(skill + "Mat", scene);
                skillMaterial.emissiveColor = BABYLON.Color3.FromHexString("#4a90e2"); // A nice tech blue
                skillMaterial.alpha = 0.8;
                skillOrb.material = skillMaterial;

                // Animation to make the orbs float up and down
                const animation = new BABYLON.Animation("float", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                const keys = [];
                keys.push({ frame: 0, value: 0 });
                keys.push({ frame: 30, value: 0.5 });
                keys.push({ frame: 60, value: 0 });
                animation.setKeys(keys);
                skillOrb.animations.push(animation);
                scene.beginAnimation(skillOrb, 0, 60, true, Math.random() + 0.5); // Randomize start for variety

                // Add text label above the orb
                const textPlane = BABYLON.MeshBuilder.CreatePlane("textPlane_" + skill, { size: 4 }, scene);
                textPlane.parent = skillOrb;
                textPlane.position.y = 1.5; // Position above the orb
                textPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL; // Always face the camera

                const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(textPlane);
                const textLabel = BABYLON.GUI.Button.CreateSimpleButton("btn_" + skill, skill);
                textLabel.width = 1;
                textLabel.height = 0.4;
                textLabel.color = "white";
                textLabel.fontSize = 100;
                textLabel.background = "transparent";
                textLabel.thickness = 0; // No border
                advancedTexture.addControl(textLabel);
            });

            // Create a particle system for a dynamic background effect
            const particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
            particleSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", scene);
            particleSystem.emitter = BABYLON.Vector3.Zero(); // Center of the scene
            particleSystem.minEmitBox = new BABYLON.Vector3(-10, -10, -10);
            particleSystem.maxEmitBox = new BABYLON.Vector3(10, 10, 10);
            particleSystem.color1 = new BABYLON.Color4(0.2, 0.4, 1.0, 1.0);
            particleSystem.color2 = new BABYLON.Color4(0.5, 0.7, 1.0, 1.0);
            particleSystem.minSize = 0.05;
            particleSystem.maxSize = 0.15;
            particleSystem.minLifeTime = 1;
            particleSystem.maxLifeTime = 3.5;
            particleSystem.emitRate = 200;
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            particleSystem.direction1 = new BABYLON.Vector3(-0.5, -0.5, -0.5);
            particleSystem.direction2 = new BABYLON.Vector3(0.5, 0.5, 0.5);
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;
            particleSystem.start();

            return scene;
        };

        const scene = createScene();

        // Run the render loop to continuously update the scene
        engine.runRenderLoop(() => {
            scene.render();
        });

        // Handle window resizing
        window.addEventListener("resize", () => {
            engine.resize();
        });
    },

    // Handles smooth scrolling to different sections of the page
    scrollToSection: function (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
};
