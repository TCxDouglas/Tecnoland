AFRAME.registerShader('shaderPrueba', {
    schema: {
        active: {
            type: 'number',
            is: 'uniform',
            default: 0
        },
        brightness: {
            type: 'number',
            is: 'uniform',
            default: 0.3
        },
        borderWidth: {
            type: 'number',
            is: 'uniform',
            default: 0.004
        },
        borderRadius: {
            type: 'number',
            is: 'uniform',
            default: 0.15
        },
        colorPrimary: {
            type: 'color',
            is: 'uniform',
            default: '#0470C5'
        },
        colorSecondary: {
            type: 'color',
            is: 'uniform',
            default: '#04487E'
        },
        midSection: {
            type: 'number',
            is: 'uniform',
            default: 0
        },
        opacity: {
            type: 'number',
            is: 'uniform',
            default: 1
        },
        ratio: {
            type: 'number',
            is: 'uniform',
            default: 0.5
        },
        transparent: {
            default: true
        }
    },

    vertexShader: '../shaders/panel.vert.glsl',

    fragmentShader:'../shaders/panel.frag.glsl'

    
});