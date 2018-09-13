export const AsteroidExplosion = {
    "alpha": {
        "start": 0.2,
        "end": 0
    },
    "scale": {
        "start": 1,
        "end": 0.3,
        "minimumScaleMultiplier": 1
    },
    "color": {
        "start": "#ffffff",
        "end": "#ffffff"
    },
    "speed": {
        "start": 200,
        "end": 100,
        "minimumSpeedMultiplier": 1
    },
    "acceleration": {
        "x": 0,
        "y": 0
    },
    "maxSpeed": 0,
    "startRotation": {
        "min": 0,
        "max": 360
    },
    "noRotation": false,
    "rotationSpeed": {
        "min": 0,
        "max": 0
    },
    "lifetime": {
        "min": 0.2,
        "max": 0.5
    },
    "blendMode": "normal",
    "frequency": 0.01,
    "emitterLifetime": 0.1,
    "maxParticles": 1000,
    "pos": {
        "x": 0,
        "y": 0
    },
    "addAtBack": false,
    "spawnType": "circle",
    "spawnCircle": {
        "x": 0,
        "y": 0,
        "r": 10
    }
}

export const Explosion = {
    "alpha": {
        "start": 0.8,
        "end": 0
    },
    "scale": {
        "start": 0.05,
        "end": 0.5,
        "minimumScaleMultiplier": 1.5
    },
    "color": {
        "start": "#ffc400",
        "end": "#2e1515"
    },
    "speed": {
        "start": 200,
        "end": 50,
        "minimumSpeedMultiplier": 1
    },
    "acceleration": {
        "x": 0,
        "y": 0
    },
    "maxSpeed": 0,
    "startRotation": {
        "min": 0,
        "max": 90
    },
    "noRotation": false,
    "rotationSpeed": {
        "min": 0.1,
        "max": 1
    },
    "lifetime": {
        "min": 0.3,
        "max": 1
    },
    "blendMode": "normal",
    "frequency": 0.35,
    "emitterLifetime": 0.4,
    "maxParticles": 1000,
    "pos": {
        "x": 0,
        "y": 0
    },
    "addAtBack": false,
    "spawnType": "burst",
    "particlesPerWave": 80,
    "particleSpacing": 0,
    "angleStart": 90
}

export const Fire = {
    "alpha": {
        "start": 1,
        "end": 0
    },
    "scale": {
        "start": 0.05,
        "end": 0.2,
        "minimumScaleMultiplier": 1
    },
    "color": {
        "start": "#ffea73",
        "end": "#ff0000"
        // end: "#0000ff"
    },
    "speed": {
        "start": 100,
        "end": 200,
        "minimumSpeedMultiplier": 1
    },
    "acceleration": {
        "x": 0,
        "y": 0
    },
    "maxSpeed": 0,
    "startRotation": {
        "min": 80,
        "max": 100
    },
    "noRotation": false,
    "rotationSpeed": {
        "min": 50,
        "max": 50
    },
    "lifetime": {
        "min": 0.05,
        "max": 0.2
    },
    "blendMode": "normal",
    "frequency": 0.005,
    "emitterLifetime": -1,
    "maxParticles": 1000,
    "pos": {
        "x": 0,
        "y": 0
    },
    "addAtBack": false,
    "spawnType": "point"
}