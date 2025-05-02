"use strict";


/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
var gl;
const numOfComponents = 2;
const normalize =false;
const stride = 0;
const offset = 0;
var level = 10;

var sunScale = 1.0;
var earthScale = 0.5;
var moonScale = 0.25;

var sunRotationSpeed = 1;
var earthRotationSpeed = 1;
var moonRotationSpeed = 1;

var sunRotationDirection = false;
var earthRotationDirection = false;
var moonRotationDirection = false;

var earthOrbitRotationSpeed = 1;
var moonOrbitRotationSpeed = 1;

var earthOrbitRotationDirection = false;
var moonOrbitRotationDirection = false;

var sun;
var earth;
var moon;

var sunRotationLoc;
var earthRotationLoc;
var moonRotationLoc;

var sunRotationDirectionLoc;
var earthRotationDirectionLoc;
var moonRotationDirectionLoc;

var earthOrbitRotationLoc;
var moonOrbitRotationLoc;
var moonOrbitEarthLoc;

var earthOrbitRotationDirectionLoc;
var moonOrbitRotationDirectionLoc;

var earthOrbitXLoc;
var earthOrbitYLoc;
var moonOrbitXLoc;
var moonOrbitYLoc;

var sunScaleLoc;
var earthScaleLoc;
var moonScaleLoc;

var sunColorLoc;
var earthColorLoc;
var moonColorLoc;

var sunColor = [0.91,0.84,0.29,1.0];
var earthColor = [0.72, 0.8, 0.89, 1.0];
var moonColor = [0.9, 0.9, 0.9, 1.0];

var sunPositionXLoc;
var sunPositionYLoc;
var earthPositionXLoc;
var earthPositionYLoc;
var moonPositionXLoc;
var moonPositionYLoc;

var sunPositionX = 0.0;
var sunPositionY = 0.0;
var earthPositionX = 0.0;
var earthPositionY = -0.2;
var moonPositionX = -0;
var moonPositionY = -0.2;

var earthOrbitRotation = 0.0;
var moonOrbitRotation = 0.0;

var sunRotation = 0.0;
var earthRotation = 0.0;
var moonRotation = 0.0;

var sunScale;
var earthScale;
var moonScale;

var positionsSun;
var positionsEarth;
var positionsMoon;

function drawStar(originX, originY, radiusOut, radiusIn, level){
    var positions = [];
    positions.push(originX);
    positions.push(originY);
    var angle = 2*Math.PI/level;
    for(var i = 0; i<level; i++){
        positions.push(originX + radiusOut*Math.cos(angle*i));
        positions.push(originY + radiusOut*Math.sin(angle*i));
        positions.push(originX + radiusIn*Math.cos(angle*(i+0.5)));
        positions.push(originY + radiusIn*Math.sin(angle*(i+0.5)));
    }
    positions.push(originX + radiusOut*Math.cos(angle*0));
    positions.push(originY + radiusOut*Math.sin(angle*0));
    console.log(positions);
    return positions;
}

function calculate(){
    gl.clearColor(0.0,0.0,0.0,1.0);

    sun = initShaderProgram(gl, sunShader, fsSource);
    earth = initShaderProgram(gl, earthShader, fsSource);
    moon = initShaderProgram(gl, moonShader, fsSource);

    sunColorLoc = gl.getUniformLocation(sun, "color");
    sunPositionXLoc = gl.getUniformLocation(sun, "posX");
    sunPositionYLoc = gl.getUniformLocation(sun, "posY");
    sunScaleLoc = gl.getUniformLocation(sun, "uScale");
    sunRotationLoc = gl.getUniformLocation(sun, "uTheta");

    earthColorLoc = gl.getUniformLocation(earth, "color");
    earthPositionXLoc = gl.getUniformLocation(earth, "posX");
    earthPositionYLoc = gl.getUniformLocation(earth, "posY");
    earthScaleLoc = gl.getUniformLocation(earth, "uScale");
    earthRotationLoc = gl.getUniformLocation(earth, "uTheta");
    earthOrbitRotationLoc = gl.getUniformLocation(earth, "uThetaOrbit");

    moonColorLoc = gl.getUniformLocation(moon, "color");
    moonPositionXLoc = gl.getUniformLocation(moon, "posX");
    moonPositionYLoc = gl.getUniformLocation(moon, "posY");
    moonScaleLoc = gl.getUniformLocation(moon, "uScale");
    moonRotationLoc = gl.getUniformLocation(moon, "uTheta");
    moonOrbitRotationLoc = gl.getUniformLocation(moon, "uThetaOrbit");
    moonOrbitEarthLoc = gl.getUniformLocation(moon, "uEarthOrbit");

    positionsSun = drawStar(0, 0, 0.25, 0.1, level);
    positionsEarth = drawStar(0, 0, 0.25, 0.1, level);
    positionsMoon = drawStar(0, 0, 0.25, 0.1, level);

    
    
}

function draw(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    const buffer = initBuffer(gl, positionsSun);

    gl.useProgram(sun);
    gl.uniform1f(sunPositionXLoc, sunPositionX);
    gl.uniform1f(sunPositionYLoc, sunPositionY);
    gl.uniform1f(sunRotationLoc, sunRotation);
    gl.uniform1f(sunScaleLoc, sunScale.value);
    gl.uniform4fv(sunColorLoc, sunColor);

    gl.enableVertexAttribArray(gl.getAttribLocation(sun, "aPosition"));
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.vertexAttribPointer(gl.getAttribLocation(sun, "aPosition"), numOfComponents,gl.FLOAT,normalize,stride,offset);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, positionsSun.length/numOfComponents);
    const buffer2 = initBuffer(gl, positionsEarth);

    gl.useProgram(earth);
    gl.uniform1f(earthPositionXLoc, earthPositionX);
    gl.uniform1f(earthPositionYLoc, earthPositionY);
    gl.uniform1f(earthScaleLoc, earthScale.value);
    gl.uniform1f(earthRotationLoc, earthRotation);
    gl.uniform4fv(earthColorLoc, earthColor);
    gl.uniform1f(earthOrbitRotationLoc, earthOrbitRotation);

    gl.enableVertexAttribArray(gl.getAttribLocation(earth, "aPosition"));

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2.position);

    gl.vertexAttribPointer(gl.getAttribLocation(earth, "aPosition"), numOfComponents,gl.FLOAT,normalize,stride,offset);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, positionsEarth.length/numOfComponents);
    const buffer3 = initBuffer(gl, positionsMoon);

    gl.useProgram(moon);
    gl.uniform1f(moonPositionXLoc, moonPositionX);
    gl.uniform1f(moonPositionYLoc, moonPositionY);
    gl.uniform1f(moonScaleLoc, moonScale.value);
    gl.uniform1f(moonRotationLoc, moonRotation);
    gl.uniform4fv(moonColorLoc, moonColor);
    gl.uniform1f(moonOrbitRotationLoc, moonOrbitRotation);
    gl.uniform1f(moonOrbitEarthLoc, earthOrbitRotation);

    gl.enableVertexAttribArray(gl.getAttribLocation(moon, "aPosition"));

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer3.position);

    gl.vertexAttribPointer(gl.getAttribLocation(moon, "aPosition"), numOfComponents,gl.FLOAT,normalize,stride,offset);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, positionsMoon.length/numOfComponents);
        
    if(sunRotationDirection.checked){
        sunRotation -= 100 * sunRotationSpeed.value;
    }
    else{
        sunRotation += 100 * sunRotationSpeed.value;
    }
    if(earthRotationDirection.checked){
        earthRotation -= 100 * earthRotationSpeed.value;
    }
    else{
        earthRotation += 100 * earthRotationSpeed.value;
    }
    if(moonRotationDirection.checked){
        moonRotation -= 100 * moonRotationSpeed.value;
    }
    else{
        moonRotation += 100 * moonRotationSpeed.value;
    }
    if(moonOrbitRotationDirection.checked){
        moonOrbitRotation -= 100 * moonOrbitRotationSpeed.value;
    }
    else{
        moonOrbitRotation += 100 * moonOrbitRotationSpeed.value;
    }
    if(earthOrbitRotationDirection.checked){
        earthOrbitRotation -= 100 * earthOrbitRotationSpeed.value;
    }
    else{
        earthOrbitRotation += 100 * earthOrbitRotationSpeed.value;
    }

    requestAnimationFrame(draw);
}

window.onload = function init() {

    sunRotationSpeed = document.getElementById("sunRotationSpeed");
    earthRotationSpeed = document.getElementById("earthRotationSpeed");
    moonRotationSpeed = document.getElementById("moonRotationSpeed");
    moonScale = document.getElementById("moonScale");
    sunScale = document.getElementById("sunScale");
    earthScale = document.getElementById("earthScale");
    sunRotationDirection = document.getElementById("sunRotationDirection");
    earthRotationDirection = document.getElementById("earthRotationDirection");
    moonRotationDirection = document.getElementById("moonRotationDirection");
    moonOrbitRotationSpeed = document.getElementById("moonOrbitRotation");
    earthOrbitRotationSpeed = document.getElementById("earthOrbitRotation");
    moonOrbitRotationDirection = document.getElementById("moonOrbitRotationDirection");
    earthOrbitRotationDirection = document.getElementById("earthOrbitRotationDirection");

    const canvas = document.querySelector("#glCanvas");
    gl = canvas.getContext("webgl2");
    if(!gl){
        alert("Unable to initialize WebGL2. Your browser or machine may not support it.");
        return;
    }

    calculate();
    draw();
}

