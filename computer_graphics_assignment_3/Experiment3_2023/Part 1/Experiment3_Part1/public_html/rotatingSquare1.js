"use strict";

var canvas;
var gl;

var theta = 0.0;
var direction = 0.01;
var colors;
var thetaLoc;

function generateRandomNumber() {
    var min = 0.0,
        max = 1.0,
        highlightedNumber = (Math.random() * (max - min) + min).toFixed(3);
    return highlightedNumber;
};

window.onload = function init()
{
    document.getElementById("toggle").onclick = function() {
        direction = -direction;
    }
    document.getElementById("speed-up").onclick = function() {
        direction *= 2.0;
    }
    document.getElementById("slow-down").onclick = function() {
        direction *= 0.5;
    }
    document.getElementById("color").onclick = function() {
        colors = [vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
            vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
            vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
            vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
            vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
            vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
            vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
            vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
            vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
            vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber())
        ];
        var cBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
        var vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );
    }
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vertices = [
        vec2( 0.06, -0.48),
        vec2( 0.16, -0.17),
        vec2( 0.48, -0.17),
        vec2( 0.22, 0.02),
        vec2( 0.33, 0.33),
        vec2( 0.06, 0.14),
        vec2( -0.2, 0.33),
        vec2( -0.1, 0.02),
        vec2( -0.36, -0.17),
        vec2( -0.04, -0.17)
        
    ];

    colors = [vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
        vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
        vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
        vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
        vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
        vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
        vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
        vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
        vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber()),
        vec3( generateRandomNumber(), generateRandomNumber(), generateRandomNumber())
    ];
    // Load the data into the GPU

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );

    render();
};

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += direction;
    gl.uniform1f( thetaLoc, theta );

    gl.drawArrays( gl.LINE_LOOP, 0, 10 );
    
    window.requestAnimFrame(render);
}
