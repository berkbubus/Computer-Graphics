"use strict";


/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
var gl;
const numOfComponents = 3;
const stride = 0;
const offset = 0;
var level = 10;
var catProgram;
var terrainProgram;
var cat;

var terrain;

var catLoaded = false;
var terrainLoaded = false;

var positionAttributeCat;
var projectionCat;
var viewCat;
var modelCat;

var positionAttributeTerrain;
var projectionTerrain;
var viewTerrain;
var modelTerrain;

let cameraPosition = [5.8, 5.1, 3.3, 1.0];
let cameraRotation = [-29, 58, 0.0, 1.0];
let colorCat = [0.2, 0.2, 0.2, 1.0];
let colorTerrain = [0.7, 0.95, 0.45, 1.0];

var colorCatLocation;
var colorTerrainLocation;

var angleX;
var angleY;
var fov;
var f;
var near;
var far;
var aspect;
var topValue;
var bottom;
var right;
var left;
var cosX;
var sinX;
var cosY;
var sinY;
var xaxis;
var yaxis;
var zaxis;
var view;
var projection;
var model;
function dot(a, b){
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function draw(){
    angleX = cameraRotation[0] * Math.PI / 180.0;
    angleY = cameraRotation[1] * Math.PI / 180.0;
    cosX = Math.cos(angleX);
    sinX = Math.sin(angleX);
    cosY = Math.cos(angleY);
    sinY = Math.sin(angleY);
    xaxis = [cosY, 0.0, -sinY];
    yaxis = [sinY * sinX, cosX, cosY * sinX];
    zaxis = [sinY * cosX, -sinX, cosY * cosX];
    view = [
        xaxis[0], yaxis[0], zaxis[0], 0.0,
        xaxis[1], yaxis[1], zaxis[1], 0.0,
        xaxis[2], yaxis[2], zaxis[2], 0.0,
        -dot(xaxis, cameraPosition),-dot(yaxis, cameraPosition), -dot(zaxis, cameraPosition), 1.0
    ];
    projection = [
        2.0*near/(right-left), 0.0, 0.0, 0.0,
        0.0, 2.0*near/(topValue-bottom), 0.0, 0.0,
        (right+left)/(right-left), (topValue+bottom)/(topValue-bottom), -(far+near)/(far-near), -1.0,
        0.0, 0.0, -2.0*far*near/(far-near),0.0
    ];
    gl.clear(gl.COLOR_BUFFER_BIT);
    //draw my cat and terrain objects
    const positionBuffer = initBuffer(gl, cat.position);
    //position, texcoord, normal
    gl.useProgram(catProgram);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionAttributeCat);
    gl.vertexAttribPointer(positionAttributeCat, 3, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv( projectionCat,false, projection );
    gl.uniformMatrix4fv( viewCat,false, view );
    gl.uniformMatrix4fv( modelCat,false, model );
    gl.uniform4fv( colorCatLocation, colorCat );
    // Draw the object
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, cat.position.length/numOfComponents);

    //draw terrain

    const positionBufferTerrain = initBuffer(gl, terrain.position);

    gl.useProgram(terrainProgram);

    const vaoTerrain = gl.createVertexArray();
    gl.bindVertexArray(vaoTerrain);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferTerrain);
    gl.enableVertexAttribArray(positionAttributeTerrain);
    gl.vertexAttribPointer(positionAttributeTerrain, 3, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv( projectionTerrain,false, projection );
    gl.uniformMatrix4fv( viewTerrain,false, view );
    gl.uniformMatrix4fv( modelTerrain,false, model );
    gl.uniform4fv( colorTerrainLocation, colorTerrain );

    gl.bindVertexArray(vaoTerrain);
    gl.drawArrays(gl.TRIANGLES, 0, terrain.position.length/numOfComponents);

    requestAnimationFrame(draw);
}

function calculate(){
        angleX = cameraRotation[0] * Math.PI / 180.0;
        angleY = cameraRotation[1] * Math.PI / 180.0;
        fov = 70.0;
        f = 1.0 / Math.tan(fov * 0.5);
        near = 0.1;
        far = 100.0;
        aspect = 1.0;
        topValue = near * Math.tan(Math.PI/180.0 * fov * 0.5);
        bottom = -topValue;
        right = topValue * aspect;
        left = -right;
        cosX = Math.cos(angleX);
        sinX = Math.sin(angleX);
        cosY = Math.cos(angleY);
        sinY = Math.sin(angleY);
        xaxis = [cosY, 0.0, -sinY];
        yaxis = [sinY * sinX, cosX, cosY * sinX];
        zaxis = [sinY * cosX, -sinX, cosY * cosX];
        view = [
            xaxis[0], yaxis[0], zaxis[0], 0.0,
            xaxis[1], yaxis[1], zaxis[1], 0.0,
            xaxis[2], yaxis[2], zaxis[2], 0.0,
            -dot(xaxis, cameraPosition),-dot(yaxis, cameraPosition), -dot(zaxis, cameraPosition), 1.0
        ];
        projection = [
            2.0*near/(right-left), 0.0, 0.0, 0.0,
            0.0, 2.0*near/(topValue-bottom), 0.0, 0.0,
            (right+left)/(right-left), (topValue+bottom)/(topValue-bottom), -(far+near)/(far-near), -1.0,
            0.0, 0.0, -2.0*far*near/(far-near),0.0
        ];
        model = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ];

        gl.enable(gl.DEPTH_TEST);

        catProgram = initShaderProgram(gl, vsSource, fsSource);
        positionAttributeCat = gl.getAttribLocation(catProgram, 'aPosition');
        projectionCat = gl.getUniformLocation(catProgram, 'projection');
        viewCat = gl.getUniformLocation(catProgram, 'view');
        modelCat = gl.getUniformLocation(catProgram, 'model');


        colorCatLocation = gl.getUniformLocation(catProgram, 'color');


        terrainProgram = initShaderProgram(gl, vsSource, fsSource);
        positionAttributeTerrain = gl.getAttribLocation(terrainProgram, 'aPosition');
        projectionTerrain = gl.getUniformLocation(terrainProgram, 'projection');
        viewTerrain = gl.getUniformLocation(terrainProgram, 'view');
        modelTerrain = gl.getUniformLocation(terrainProgram, 'model');
        colorTerrainLocation = gl.getUniformLocation(terrainProgram, 'color');
        
        draw();
}


window.onload = function init() {
    document.addEventListener("keydown", function(event){
        if(event.key == "ArrowUp"){
            cameraPosition[2] += 0.1;
        }
        if(event.key == "ArrowDown"){
            cameraPosition[2] -= 0.1;
        }
        if(event.key == "ArrowLeft"){
            cameraPosition[0] -= 0.1;
        }
        if(event.key == "ArrowRight"){
            cameraPosition[0] += 0.1;
        }
        if(event.key == "PageUp"){
            cameraPosition[1] += 0.1;
        }
        if(event.key == "PageDown"){
            cameraPosition[1] -= 0.1;
        }
    });

    document.addEventListener("mousemove", function(event){
        cameraRotation[1] -=event.movementX;
        cameraRotation[0] -=event.movementY;
        
    });
    document.addEventListener("click", function () {
        document.body.requestPointerLock({
            unadjustedMovement: true,

        });
    });
    document.addEventListener("escape", function(){
        document.exitPointerLock();
    });
    loadOBJ("objects/cat.obj").then(function(obj){
        cat = obj;
        catLoaded = true;
        if(terrainLoaded){
            const canvas = document.querySelector("#glCanvas");
            gl = canvas.getContext("webgl2");
            if(!gl){
                alert("Unable to initialize WebGL2. Your browser or machine may not support it.");
                return;
            }
            calculate();
        }
    });

    loadOBJ("objects/terrain.obj").then(function(obj){
        terrain = obj;
        terrainLoaded = true;
        if(catLoaded){
            const canvas = document.querySelector("#glCanvas");
            gl = canvas.getContext("webgl2");
            if(!gl){
                alert("Unable to initialize WebGL2. Your browser or machine may not support it.");
                return;
            }
            calculate();
        }
    });
}

