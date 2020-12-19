var globalObj = {
    scene: null,
    camera: null,
    renderer: null,
    light: null,
    mouse: null,
    matCylinder: null, 
    controls: null,
    raycaster: null,
    geoCylinder: null,
    matSphere: null,
    tRoot: null,
    INTERSECTED: null,
    objectsInScene: null,
    pivots: null,
};

Object.defineProperty( globalObj, "MAX_BRANCH", {
    value: 4,
    writable: false,
});

Object.defineProperty( globalObj, "MAX_RECUR", {
    value: 5,
    writable: false,
});


export default globalObj;