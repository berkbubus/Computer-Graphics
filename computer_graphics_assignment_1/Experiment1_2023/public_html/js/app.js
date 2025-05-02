"use strict";

/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

main();

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

function makeSnowflake(level, basePositionX, basePositionY, size){
    var positions = [];
    const sqrtThree = Math.sqrt(3) * size;
    positions.push(basePositionX);
    positions.push(basePositionY);
    positions.push(basePositionX+size);
    positions.push(basePositionY+sqrtThree);
    positions.push(basePositionX+2*size);
    positions.push(basePositionY);
    var positionAdder = rotateTriangle(basePositionX,basePositionY,basePositionX+size,basePositionY+sqrtThree,basePositionX+2*size,basePositionY,Math.PI,basePositionX+size,(3*basePositionY+sqrtThree)/3);
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
function main() {
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl2");
    
    if(!gl){
        alert("Unable to initialize WebGL2. Your browser or machine may not support it.");
        return;
    }
    
    gl.clearColor(1.0,1.0,1.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    const program1 = initShaderProgram(gl, vsSource, fsSource1);
    const program2 = initShaderProgram(gl, vsSource, fsSource2);
    const numOfComponents = 2;
    const type = gl.FLOAT;
    const normalize =false;
    const stride = 0;
    const offset = 0;
    var level = 4;
    var positions = makeSnowflake(level,-0.75,-0.375,0.75);
    const buffer = initBuffer(gl, positions);
    gl.useProgram(program1);
    gl.enableVertexAttribArray(gl.getAttribLocation(program1, "a_position"));
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.vertexAttribPointer(gl.getAttribLocation(program1, "a_position"), numOfComponents,type,normalize,stride,offset);
    gl.drawArrays(gl.TRIANGLES, offset, positions.length/2);

    var positions2 = makeSnowflake(level,-0.5,-0.25,0.5);
    const buffer2 = initBuffer(gl, positions2);
    gl.useProgram(program2);
    gl.enableVertexAttribArray(gl.getAttribLocation(program2, "a_position"));
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2.position);
    gl.vertexAttribPointer(gl.getAttribLocation(program2, "a_position"), numOfComponents,type,normalize,stride,offset);
    gl.drawArrays(gl.TRIANGLES, offset, positions2.length/2);

    
}

