    /* create a loop to create each vertex */
    for (let i = 0; i < 15; i++) {
        rainDrop = new THREE.Vector3(
            Math.random() * 400 - 200,
            Math.random() * 500 - 250,
            Math.random() * 400 - 200
        )

        // animate rain by adding velocity
        rainDrop.velocity = {}
        rainDrop.velocity = 0

        // push vertices into array
        rainVertices.push(rainDrop)
    }

    /* create rain geometry as one object with multiple vertices */
    rainGeometry = new THREE.BufferGeometry()/*.setFromPoints(rainVertices)*/
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

    // in render():
    rainVertices.forEach(p => {
        p.velocity -= 0.1 + Math.random() * 0.1
        p.y += p.velocity
        if (p.y < -200) {
            p.y = 200
            p.velocity = 0
        }
    })