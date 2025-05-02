"use strict";


/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
var gl;
var uTheta = 0;
var absTheta;
var thetaSpeed = 1;
var swingMode = false;
var colorSwingMode = false;
var swingDirection = 1;
var basePositionX = 0.0;
var basePositionY = 0.0;
var angle = 0;
var colorSwingColor = [0.5, 0.8, 0.9,1.0];
const numOfComponents = 2;
const normalize =false;
const stride = 0;
const offset = 0;
var level = 4;
function rotateTriangle(x1,y1,x2,y2,x3,y3,angle,originX,originY){

    var x1 = x1-originX;
    var y1 = y1-originY;
    var x2 = x2-originX;
    var y2 = y2-originY;
    var x3 = x3-originX;
    var y3 = y3-originY;

    var x1_ = x1*Math.cos(angle)-y1*Math.sin(angle);
    var y1_ = x1*Math.sin(angle)+y1*Math.cos(angle);
    var x2_ = x2*Math.cos(angle)-y2*Math.sin(angle);
    var y2_ = x2*Math.sin(angle)+y2*Math.cos(angle);
    var x3_ = x3*Math.cos(angle)-y3*Math.sin(angle);
    var y3_ = x3*Math.sin(angle)+y3*Math.cos(angle);

    x1 = x1_+originX;
    y1 = y1_+originY;
    x2 = x2_+originX;
    y2 = y2_+originY;
    x3 = x3_+originX;
    y3 = y3_+originY;

    return [x1,y1,x2,y2,x3,y3];
}

function makeSnowflake(level, basePositionX, basePositionY, size, angle){
    var positions = [];
    const sqrtThree = Math.sqrt(3) * size;
    positions.push(basePositionX);
    positions.push(basePositionY);
    positions.push(basePositionX+size);
    positions.push(basePositionY+sqrtThree);
    positions.push(basePositionX+2*size);
    positions.push(basePositionY);
    if(angle !== 0){
        positions = rotateTriangle(basePositionX,basePositionY,basePositionX+size,basePositionY+sqrtThree,basePositionX+2*size,basePositionY,Math.PI*angle/180,basePositionX+size,(3*basePositionY+sqrtThree)/3);
    }
    var positionAdder = rotateTriangle(basePositionX,basePositionY,basePositionX+size,basePositionY+sqrtThree,basePositionX+2*size,basePositionY,Math.PI+(Math.PI*angle/180),basePositionX+size,(3*basePositionY+sqrtThree)/3);
    positions = positions.concat(positionAdder);

    for(var i=0;i<level-1;i++){
        var len = positions.length;
        for(var j=len;j>0;j-=6){

            var x1 = positions[j-6];
            var y1 = positions[j-5];
            var x2 = positions[j-4];
            var y2 = positions[j-3];
            var x3 = positions[j-2];
            var y3 = positions[j-1];

            var x12 = x1+((x2-x1)/3);
            var y12 = y1+((y2-y1)/3);
            var x13 = x1+((x3-x1)/3);
            var y13 = y1+((y3-y1)/3);

            positions = positions.concat(rotateTriangle(x1,y1,x12,y12,x13,y13,Math.PI,(x1+x12+x13)/3,(y1+y12+y13)/3));

            var x21 = x2+((x1-x2)/3);
            var y21 = y2+((y1-y2)/3);
            var x23 = x2+((x3-x2)/3);
            var y23 = y2+((y3-y2)/3);

            positions = positions.concat(rotateTriangle(x2,y2,x21,y21,x23,y23,Math.PI,(x2+x21+x23)/3,(y2+y21+y23)/3));

            var x31 = x3+((x1-x3)/3);
            var y31 = y3+((y1-y3)/3);
            var x32 = x3+((x2-x3)/3);
            var y32 = y3+((y2-y3)/3);

            positions = positions.concat(rotateTriangle(x3,y3,x31,y31,x32,y32,Math.PI,(x3+x31+x32)/3,(y3+y31+y32)/3));
        }
    }     
    
    return positions;
}

function draw(){
    gl.clearColor(0.9,0.9,0.9,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const program1 = initShaderProgram(gl, vsSource, fsSource1);
    const program2 = initShaderProgram(gl, vsSource, fsSource2);

    var thetaLoc1 = gl.getUniformLocation(program1, "uTheta");
    var thetaLoc2 = gl.getUniformLocation(program2, "uTheta");
    var posXLoc1 = gl.getUniformLocation(program1, "posX");
    var posXLoc2 = gl.getUniformLocation(program2, "posX");
    var posYLoc1 = gl.getUniformLocation(program1, "posY");
    var posYLoc2 = gl.getUniformLocation(program2, "posY");
    var colorLoc = gl.getUniformLocation(program1, "absTheta");

    var positions = makeSnowflake(level,-0.15,-0.075,0.15,angle);
    const buffer = initBuffer(gl, positions);
    gl.useProgram(program1);
    gl.uniform1f(posXLoc1, basePositionX);
    gl.uniform1f(posYLoc1, basePositionY);
    gl.uniform1f(thetaLoc1, uTheta);
    if(colorSwingMode){
        gl.uniform1f(colorLoc, Math.abs(uTheta));
    }
    else{
        gl.uniform1f(colorLoc, 0);
    }

    gl.enableVertexAttribArray(gl.getAttribLocation(program1, "aPosition"));
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.vertexAttribPointer(gl.getAttribLocation(program1, "aPosition"), numOfComponents,gl.FLOAT,normalize,stride,offset);
    gl.drawArrays(gl.TRIANGLES, offset, positions.length/2);

    var positions2 = makeSnowflake(level,-0.10,-0.05,0.10,angle);
    const buffer2 = initBuffer(gl, positions2);
    gl.useProgram(program2);
    gl.uniform1f(posXLoc2, basePositionX);
    gl.uniform1f(posYLoc2, basePositionY);
    gl.uniform1f(thetaLoc2, uTheta);
    gl.enableVertexAttribArray(gl.getAttribLocation(program2, "aPosition"));
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2.position);
    gl.vertexAttribPointer(gl.getAttribLocation(program2, "aPosition"), numOfComponents,gl.FLOAT,normalize,stride,offset);
    gl.drawArrays(gl.TRIANGLES, offset, positions2.length/2);

    if(swingMode || colorSwingMode){
        if(swingMode){
            document.addEventListener("keydown", function (event) {
                if (event.key !== "2") {
                    swingMode = false;
                    uTheta = 0;
                }
            });
        }
        else{
            document.addEventListener("keydown", function (event) {
                if (event.key !== "3") {
                    colorSwingMode = false;
                    uTheta = 0;
                }
            });
        }
        if(uTheta >= 80){
            swingDirection = -1;
        }
        else if(uTheta <= -80){
            swingDirection = 1;
        }
        uTheta += swingDirection*thetaSpeed;
    }
    requestAnimationFrame(draw);
}

window.onload = function init() {

    const canvas = document.querySelector("#glCanvas");
    gl = canvas.getContext("webgl2");
    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") {
            basePositionX += 0.01;
        } else if (event.key === "ArrowLeft") {
            basePositionX -= 0.01;
        } else if (event.key === "ArrowUp") {
            basePositionY += 0.01;
        } else if (event.key === "ArrowDown") {
            basePositionY -= 0.01;
        } else if (event.key === "-") {
            angle += 1;
        } else if (event.key === "+") {
            angle -= 1;
        } else if (event.key === "1") {
            basePositionX = 0.0;
            basePositionY = 0.0;
            angle = 0;
            uTheta = 0;
        } else if (event.key === "2") {
            swingMode = true;
        } else if (event.key === "3") {
            colorSwingMode = true;
        }
    });
    if(!gl){
        alert("Unable to initialize WebGL2. Your browser or machine may not support it.");
        return;
    }
    draw();
}

