import * as THREE from './node_modules/three/build/three.module.js'

let scene, camera, renderer, lightning, rain, rainGeometry, rainMaterial, rainDrop
let cloudParticles = []
let rainVertices = []
let rainCount = 15

function init() {
    /* create a universe for your objects, camera, light */
    scene = new THREE.Scene()

    /* create a camera & position it to capture the scene */
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.z = 1
    camera.rotation.set(1.16, -0.12, 0.27)

    /* and the dev said, 'let there be ambient light' */
    let ambient = new THREE.AmbientLight(0x555555)
    scene.add(ambient)

    /* add directional light */
    let directionalLight = new THREE.DirectionalLight(0xffeedd)
    directionalLight.position.set(0, 0, 1)
    scene.add(directionalLight)

    /* add blue point lighting to simulate lightning flash */
    lightning = new THREE.PointLight(0x175ab1, 50, 450, 1.7)
    lightning.position.set(200, 300, 100)
    scene.add(lightning)

    /* build the engine */
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)

    /* add fog for aurora effect */
    scene.fog = new THREE.FogExp2(0x000000, 0.001)
    renderer.setClearColor(scene.fog.color)

    /* add scene to the page as a canvas element */
    document.body.appendChild(renderer.domElement)

    /* create plane geometry for cloud */
    const cloudGeometry = new THREE.PlaneGeometry(500, 500)

    /* load image to serve as texture for material */
    const cloudTexture = new THREE.TextureLoader().load('smoke.png')

    /* map over loaded texture to create material */
    const cloudMaterial = new THREE.MeshLambertMaterial({ map: cloudTexture, transparent: true, opacity: 0.55 })

    /* set cloud animation loop and push into array to be repositioned in render() */
    for (let p = 0; p < 25; p++) {
        let cloud = new THREE.Mesh(cloudGeometry, cloudMaterial)
        cloud.position.set(
            Math.random() * 800 - 400,
            500,
            Math.random() * 500 - 500
        )
        cloud.rotation.set(
            1.16,
            -0.12,
            Math.random() * 2 * Math.PI
        )
        cloudParticles.push(cloud)
        scene.add(cloud)
    }


    /* create a loop to create each vertex */
    for (let i = 0; i < rainCount; i++) {
        rainDrop = new THREE.Vector3(
            Math.random() * 400 - 200,
            Math.random() * 500 - 250,
            Math.random() * 400 - 200
        )

        // animate rain by adding velocity
        rainDrop.velocity = {}
        rainDrop.velocity = 1
        console.log(rainDrop)
        // push vertices into array
        rainVertices.push(rainDrop)

    }

    /* create rain geometry as one object with multiple vertices */
    rainGeometry = new THREE.BufferGeometry().setFromPoints(rainVertices)
    rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rainVertices));
    console.log(rainGeometry)
    /* custom vertices in buffer geometry: https://threejsfundamentals.org/threejs/lessons/threejs-custom-buffergeometry.html
        - BufferGeometry: collection of BufferAttributes
        - BufferAttribute: array of one data type (positions, normals, colors, uvs, etc.)
            * parallel arrays at same index represent data for each vertex
        - Vertex: combination of all its parts
    */

    /* create rain material */
    rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true
    })

    /* make it raaaaiiiiin */
    rain = new THREE.Points(rainGeometry, rainMaterial)
    scene.add(rain)

    /* start the engine */
    render()
}

function rainVariation() {
    // randomize velocity of rain drops 
    var rainPosition = rain.geometry.getAttribute('position')
    console.log(rainPosition)
    for (var i = 0; i < rainPosition.count; i++) {
        rainDrop.fromBufferAttribute(rainPosition, i)
        rainDrop.y -= 1
        if (rainDrop.y < - 60) {
            rainDrop.y = 90
        }
        rainPosition.setXYZ(i, rainDrop.x, rainDrop.y, rainDrop.z)
    }
    rainPosition.needsUpdate = true
}


// function lightningVariation() {
//     // set blue point light to flash at random intervals and intensities
//     if (Math.random() > 0.93 || lightning.power > 100) {
//         if (lightning.power < 100) 
//             lightning.position.set(
//                 Math.random() * 400,
//                 300 + Math.random() * 200, 
//                 100
//             )
//         lightning.power = 50 + Math.random() * 500
//     }
// }


/* set up render loop */
function render() {
    // rotate each cloud particle
    cloudParticles.forEach(p => {
        p.rotation.z -= 0.002
    })

    rainVariation()
    // lightningVariation()

    // rainVertices.forEach(p => {
    //     p.velocity -= 0.1 + Math.random() * 0.1
    //     p.y += p.velocity
    //     if (p.y < -200) {
    //         p.y = 200
    //         p.velocity = 0
    //     }
    // })


    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

init()