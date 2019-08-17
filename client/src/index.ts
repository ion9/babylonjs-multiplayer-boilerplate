import "./index.css";

import * as CCPWGL2 from "ccpwgl2";

// Other files i think we need
// <script type="text/javascript" src="../dist/ccpwgl2_int.js"></script>
// <script type="text/javascript" src="../dist/ccpwgl.js"></script>

import * as BABYLON from "babylonjs";
import Keycode from "keycode.js";

import { client } from "./game/network";

// Re-using server-side types for networking
// This is optional, but highly recommended
import { StateHandler } from "../../server/src/rooms/StateHandler";
import { PressedKeys } from "../../server/src/entities/Player";
import { Z_NEED_DICT } from "zlib";

const canvas = document.getElementById('game') as HTMLCanvasElement;

// Old
const engine = new BABYLON.Engine(canvas, true);
// New
// ccpwgl.initialize(canvas, demos.options);

// This creates a basic Babylon Scene object (non-mesh)
var scene = new BABYLON.Scene(engine);
// scene = ccpwgl.loadScene('res:/dx9/scene/wormholes/wormhole_class_01.red');

// This creates and positions a free camera (non-mesh)
var camera = new BABYLON.FollowCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

// OLD This targets the camera to scene origin
camera.setTarget(BABYLON.Vector3.Zero());

// OLD This attaches the camera to the canvas
camera.attachControl(canvas, true);

// NEW 
// var camera = new ccpwgl.createCamera(canvas);
//                 camera.minDistance = 0.0;
//                 camera.maxDistance = 9007199254740990;
//                 camera.fov = 60;
//                 camera.distance = 1000000;
//                 camera.farPlane = 9007199254740990;
//                 camera.nearPlane = 0.00000001;
//                 camera.minPitch = -0.5;
//                 camera.maxPitch = 0.35;
//                 ccpwgl.setCamera(camera);

// NO NEED This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

// NO NEED Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

// NO MEED Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

// Attach default camera mouse navigation
// camera.attachControl(canvas);

// Colyseus / Join Room
const room = client.join<StateHandler>("game");
room.onJoin.add(() => {
    const playerViews: {[id: string]: BABYLON.Mesh} = {};  // ??????

    room.state.players.onAdd = function(player, key) {
        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        playerViews[key] = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
        // PlayerViews[key] = scene.loadShip('rdh3_t1:roguebase:rogue');

        // NO NEED Move the sphere upward 1/2 its height
        playerViews[key].position.set(player.position.x, player.position.y, player.position.z);

        // Set camera to follow current player
        if (key === room.sessionId) {
            camera.setTarget(playerViews[key].position);
        }
    };

    room.state.players.onChange = function(player, key) {
        playerViews[key].position.set(player.position.x, player.position.y, player.position.z);
    };

    room.state.players.onRemove = function(player, key) {
        scene.removeMesh(playerViews[key]);
        // scene.removeObject(playerViews[key]);
        delete playerViews[key];
    };

})

room.onStateChange.add((state) => {
    console.log("New room state:", state.toJSON());
})

// Scene render loop
engine.runRenderLoop(function() {
    scene.render();
});

// Keyboard listeners
const keyboard: PressedKeys = { x: 0, y: 0 };
window.addEventListener("keydown", function(e) {
    if (e.which === Keycode.LEFT) {
        keyboard.x = -1;
    } else if (e.which === Keycode.RIGHT) {
        keyboard.x = 1;
    } else if (e.which === Keycode.UP) {
        keyboard.y = -1;
    } else if (e.which === Keycode.DOWN) {
        keyboard.y = 1;
    }
    room.send(['key', keyboard]);
});

window.addEventListener("keyup", function(e) {
    if (e.which === Keycode.LEFT) {
        keyboard.x = 0;
    } else if (e.which === Keycode.RIGHT) {
        keyboard.x = 0;
    } else if (e.which === Keycode.UP) {
        keyboard.y = 0;
    } else if (e.which === Keycode.DOWN) {
        keyboard.y = 0;
    }
    room.send(['key', keyboard]);
});

// Resize the engine on window resize
window.addEventListener('resize', function() {
    engine.resize();
});
