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
    intersectPoint: null,
    objectsInScene: null,
    pivots: null,
};

Object.defineProperty( globalObj, "MAX_BRANCH", {
    value: 6,
    writable: false,
});

Object.defineProperty( globalObj, "MAX_RECUR", {
    value: 6,
    writable: false,
});


export default globalObj;