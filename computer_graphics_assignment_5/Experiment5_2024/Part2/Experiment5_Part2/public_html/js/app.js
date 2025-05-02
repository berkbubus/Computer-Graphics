"use strict";


var gl;
const numOfComponents = 3;
const stride = 0;
const offset = 0;
const normalize = false;
const a = 5;
const b = 5;
const c = 5;
const rectangleCount = 25;
const betweenX = 10;
const starterX = 0;
const starterY = 0;
const starterZ = 0;

const cameraPosition = [5.8, 51, 3.3, 1.0];
const cameraRotation = [-29, 230, 0.0, 1.0];

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

var viewSkybox;

var viewLocation;
var projectionLocation;
var modelLocation;

var textureSea;
var textureSeagull;

var textureSeaLocation;
var textureSeagullLocation;

var lightAmbient = [0.1, 0.1, 0.1, 1.0];
var lightDiffuse = [1.0, 1.0, 1.0, 1.0];
var lightSpecular = [1.0, 1.0, 1.0, 1.0];

var lightLocation;

var materialAmbient = [1.0, 1.0, 1.0, 1.0];
var materialDiffuse = [1.0, 1.0, 1.0, 1.0];
var materialSpecular = [1.0, 1.0, 1.0, 1.0];
var materialShininess = 150.0;
var program;
var program1;
var programSkybox;

var positionLocationSkybox;
var skyboxLocation;
var viewDirectionProjectionInverseLocation;
var viewDirectionProjectionMatrix;
var viewDirectionProjectionInverse;

var positionAttributeLocation;
var texcoordAttributeLocation;

var imageSea;
var imageSeagull;

var vao;
var vaoSkybox;

var worldInverseTransposeLocation;
var colorLocation;
var shininess;
var lightDirectionLocation;
var limitLocation;
var viewWorldPositionLocation;

var limit = 0.95;

var lightDirectionView;

var current = false;

function dot(a, b){
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function rectanglePrism(a,b,c, rectangleCount,betweenX , starterX,starterY,starterZ){
    let positions = [];
    let indices = [];
    let surfaces = [];
    indices.push([starterX,starterY,starterZ],[starterX+a,starterY,starterZ],[starterX+a,starterY+b,starterZ],
        [starterX,starterY+b,starterZ],[starterX,starterY,starterZ+c],[starterX+a,starterY,starterZ+c],
        [starterX+a,starterY+b,starterZ+c],[starterX,starterY+b,starterZ+c]);
    surfaces.push([[indices[0][0],indices[0][1],indices[0][2]],[indices[1][0],indices[1][1],indices[1][2]],
        [indices[2][0],indices[2][1],indices[2][2]],[indices[2][0],indices[2][1],indices[2][2]],
        [indices[3][0],indices[3][1],indices[3][2]],[indices[0][0],indices[0][1],indices[0][2]]]);
    surfaces.push([[indices[0][0],indices[0][1],indices[0][2]],[indices[1][0],indices[1][1],indices[1][2]],
        [indices[5][0],indices[5][1],indices[5][2]],[indices[5][0],indices[5][1],indices[5][2]],
        [indices[4][0],indices[4][1],indices[4][2]],[indices[0][0],indices[0][1],indices[0][2]]]);
    surfaces.push([[indices[0][0],indices[0][1],indices[0][2]],[indices[3][0],indices[3][1],indices[3][2]],
        [indices[7][0],indices[7][1],indices[7][2]],[indices[7][0],indices[7][1],indices[7][2]],
        [indices[4][0],indices[4][1],indices[4][2]],[indices[0][0],indices[0][1],indices[0][2]]]);
    surfaces.push([[indices[3][0],indices[3][1],indices[3][2]],[indices[2][0],indices[2][1],indices[2][2]],
        [indices[6][0],indices[6][1],indices[6][2]],[indices[6][0],indices[6][1],indices[6][2]],
        [indices[7][0],indices[7][1],indices[7][2]],[indices[3][0],indices[3][1],indices[3][2]]]);
    surfaces.push([[indices[1][0],indices[1][1],indices[1][2]],[indices[5][0],indices[5][1],indices[5][2]],
        [indices[6][0],indices[6][1],indices[6][2]],[indices[6][0],indices[6][1],indices[6][2]],
        [indices[2][0],indices[2][1],indices[2][2]],[indices[1][0],indices[1][1],indices[1][2]]]);
    surfaces.push([[indices[7][0],indices[7][1],indices[7][2]],[indices[6][0],indices[6][1],indices[6][2]],
        [indices[5][0],indices[5][1],indices[5][2]],[indices[5][0],indices[5][1],indices[5][2]],
        [indices[4][0],indices[4][1],indices[4][2]],[indices[7][0],indices[7][1],indices[7][2]]]);
    let adderX = 0;
    let adderZ = 0;
    let toRectangleCount = 0;
    let total = rectangleCount*rectangleCount;
    while(toRectangleCount < total){
        for(let j = 0; j < 6; j++){
            for(let k = 0; k < 6; k++){
                positions.push(surfaces[j][k][0]+adderX);
                positions.push(surfaces[j][k][1]);
                positions.push(surfaces[j][k][2]+adderZ);
            }
        }
        adderX+=betweenX;
        toRectangleCount++;
        if(toRectangleCount%rectangleCount===0){
            adderX=0;
            adderZ+=betweenX;
        }
    }
    return positions;
}

function getNormals(positions) {
    const normals = [];
  
    for (let i = 0; i < positions.length; i += 9) {

      const v1 = [positions[i], positions[i + 1], positions[i + 2]];
      const v2 = [positions[i + 3], positions[i + 4], positions[i + 5]];
      const v3 = [positions[i + 6], positions[i + 7], positions[i + 8]];
  

      const edge1 = [
        v2[0] - v1[0],
        v2[1] - v1[1],
        v2[2] - v1[2],
      ];
      const edge2 = [
        v3[0] - v1[0],
        v3[1] - v1[1],
        v3[2] - v1[2],
      ];
  

      const normal = [
        edge1[1] * edge2[2] - edge1[2] * edge2[1],
        edge1[2] * edge2[0] - edge1[0] * edge2[2],
        edge1[0] * edge2[1] - edge1[1] * edge2[0],
      ];
  

      const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
      normal[0] /= length;
      normal[1] /= length;
      normal[2] /= length;
  

      normals.push(normal[0], normal[1], normal[2]);
      normals.push(normal[0], normal[1], normal[2]);
      normals.push(normal[0], normal[1], normal[2]);
    }
  
    return normals;
  }

function crossProduct(v1,v2){
    let x = v1[1]*v2[2]-v1[2]*v2[1];
    let y = v1[2]*v2[0]-v1[0]*v2[2];
    let z = v1[0]*v2[1]-v1[1]*v2[0];
    return [x,y,z];
}


function setTexcoords(gl) {
    let temp = rectangleCount*rectangleCount;
    const array = new Float32Array((temp+1)*6*12);

    for(let i = 0; i < (temp)*6*12; i+=12){
        array[i] = 0.0;
        array[i+1] = 0.0;
        array[i+2] = 1.0;
        array[i+3] = 0.0;
        array[i+4] = 1.0;
        array[i+5] = 1.0;
        array[i+6] = 1.0;
        array[i+7] = 1.0;
        array[i+8] = 0.0;
        array[i+9] = 1.0;
        array[i+10] = 0.0;
        array[i+11] = 0.0;
    }

    for(let i = (temp)*6*12; i < (temp+1)*6*12; i+=12){
        array[i] = 0.0;
        array[i+1] = 0.0;
        array[i+2] = temp/5;
        array[i+3] = 0.0;
        array[i+4] = temp/5;
        array[i+5] = temp/5;
        array[i+6] = temp/5;
        array[i+7] = temp/5;
        array[i+8] = 0.0;
        array[i+9] = temp/5;
        array[i+10] = 0.0;
        array[i+11] = 0.0;
    }

    gl.bufferData( gl.ARRAY_BUFFER,array,gl.STATIC_DRAW);
 }


function draw(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
    drawSkybox();
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.uniform3fv( viewWorldPositionLocation,[cameraPosition[0],cameraPosition[1],cameraPosition[2]]);
    gl.uniform3fv( lightLocation,[cameraPosition[0],cameraPosition[1],cameraPosition[2]]);

    gl.uniform3fv( lightDirectionLocation,[-zaxis[0], -zaxis[1],-zaxis[2]]);
    gl.uniform1f( limitLocation,limit);
    gl.uniformMatrix4fv( projectionLocation,false, projection );
    gl.uniformMatrix4fv( viewLocation,false, view );
    gl.uniformMatrix4fv( modelLocation,false, model );

    gl.uniformMatrix4fv( worldInverseTransposeLocation,false, transpose(inverse(model)) );
    gl.uniform4fv( colorLocation,[1.0,1.0,1.0,1.0]);
    gl.uniform1f( shininess,materialShininess);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureSeagull);
    gl.drawArrays(gl.TRIANGLES, 0, 36*rectangleCount*rectangleCount);
    
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textureSea);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.drawArrays(gl.TRIANGLES, 36*rectangleCount*rectangleCount,36*rectangleCount*rectangleCount+36);

    requestAnimationFrame(draw);
}

function drawSkybox(){
    gl.useProgram(programSkybox);
    gl.bindVertexArray(vaoSkybox);
    viewSkybox = [...view];
    viewSkybox[12] = 0.0;
    viewSkybox[13] = 0.0;
    viewSkybox[14] = 0.0;
    
    viewDirectionProjectionMatrix = matrixMultiply(viewSkybox, projection);
    viewDirectionProjectionInverse = inverse(viewDirectionProjectionMatrix);

    gl.uniformMatrix4fv(viewDirectionProjectionInverseLocation, false, viewDirectionProjectionInverse);
    gl.uniform1i(skyboxLocation, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function yRotation(angle){
    let cos_angle = Math.cos(angle)
    let sin_angle = Math.sin(angle)

    let rotation_matrix = [
        cos_angle, 0.0, sin_angle, 0.0,
        0.0, 1.0, 0.0, 0.0,
        -sin_angle, 0.0, cos_angle, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]

    return rotation_matrix
}

function xRotation(angle){
    let cos_angle = Math.cos(angle)
    let sin_angle = Math.sin(angle)

    let rotation_matrix = [
        1.0, 0.0, 0.0, 0.0,
        0.0, cos_angle, -sin_angle, 0.0,
        0.0, sin_angle, cos_angle, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]

    return rotation_matrix
}
function inverse(matrix) {
  
    // Reshape the flattened array into a 4x4 matrix
    let originalMatrix = [
      matrix.slice(0, 4),
      matrix.slice(4, 8),
      matrix.slice(8, 12),
      matrix.slice(12, 16)
    ];
  
    // Create an identity matrix to start with
    let identityMatrix = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  
    // Augment the matrix with the identity matrix
    for (let i = 0; i < 4; i++) {
      originalMatrix[i] = originalMatrix[i].concat(identityMatrix[i]);
    }
  
    // Perform Gaussian elimination
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i !== j) {
          let factor = originalMatrix[j][i] / originalMatrix[i][i];
          for (let k = 0; k < 8; k++) {
            originalMatrix[j][k] -= factor * originalMatrix[i][k];
          }
        }
      }
    }
  
    // Scale the rows to make the diagonal elements 1
    for (let i = 0; i < 4; i++) {
      let factor = 1 / originalMatrix[i][i];
      for (let j = 0; j < 8; j++) {
        originalMatrix[i][j] *= factor;
      }
    }
  
    // Extract the inverse matrix
    let inverseMatrix = [];
    for (let i = 0; i < 4; i++) {
      inverseMatrix.push(originalMatrix[i].slice(4));
    }
  
    // Flatten the inverse matrix
    return inverseMatrix.flat();
  }

  function transpose(matrix) {
    // Reshape the flattened array into a 4x4 matrix
    let originalMatrix = [
      matrix.slice(0, 4),
      matrix.slice(4, 8),
      matrix.slice(8, 12),
      matrix.slice(12, 16)
    ];
  
    // Create a new matrix to store the transposed values
    let transposedMatrix = [];
  
    // Populate the transposed matrix
    for (let i = 0; i < 4; i++) {
      let row = [];
      for (let j = 0; j < 4; j++) {
        row.push(originalMatrix[j][i]);
      }
      transposedMatrix.push(row);
    }
  
    // Flatten the transposed matrix
    return transposedMatrix.flat();
  }
function mult(a,b){
    let result = [];

    for ( var i = 0; i < 4; ++i ) {
        result.push( a[i] * b[i] );
    }
    return result;
}

function matrixMultiply(a,b){
    let result = [];
    //its not look like [4][4], its like [16], make it for it
    for(let i = 0; i < 16; i++){
        result.push(0);
    }
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            for(let k = 0; k < 4; k++){
                result[i*4+j] += a[i*4+k] * b[k*4+j];
            }
        }
    }
    return result;
}

function initOther(vsSource,fsSource){
    let type = gl.FLOAT;
    let size = 2;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    program = initShaderProgram(gl, vsSource, fsSource);
    gl.useProgram(program);
    projectionLocation = gl.getUniformLocation(program, 'projection');
    viewLocation = gl.getUniformLocation(program, 'view');
    modelLocation = gl.getUniformLocation(program, 'model');
    texcoordAttributeLocation = gl.getAttribLocation(program, "aTexcoord");
    positionAttributeLocation = gl.getAttribLocation(program, "aPosition");
    const vNormal = gl.getAttribLocation( program, "aNormal" );
    textureSeaLocation = gl.getUniformLocation(program, 'seaTexture');
    textureSeagullLocation = gl.getUniformLocation(program, 'seagullTexture');
    worldInverseTransposeLocation = gl.getUniformLocation(program, "uWorldInverseTranspose");
    colorLocation = gl.getUniformLocation(program, "uColor");
    shininess = gl.getUniformLocation(program, "uShininess");
    lightDirectionLocation = gl.getUniformLocation(program, "uLightDirection");
    limitLocation = gl.getUniformLocation(program, "uLimit");
    lightLocation = gl.getUniformLocation(program, "uLightWorldPosition");
    viewWorldPositionLocation = gl.getUniformLocation(program, "viewWorldPosition");
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let positions = rectanglePrism(a,b,c,rectangleCount,betweenX,starterX,starterY,starterZ);
    positions = positions.concat(rectanglePrism(625,5,625,1,0,-155,-5,-155))
    let normals = getNormals(positions);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, numOfComponents, gl.FLOAT, false, stride, offset);

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    console.log(positions.length*12);
    setTexcoords(gl);
    gl.enableVertexAttribArray(texcoordAttributeLocation);
    gl.vertexAttribPointer(
         texcoordAttributeLocation, size, type, normalize, stride, offset);

    textureSeagull = gl.createTexture();
    
    imageSeagull = new Image();
    imageSeagull.src = "images/seagull.jpg";
    imageSeagull.addEventListener('load', function() {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureSeagull);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageSeagull);
        gl.generateMipmap(gl.TEXTURE_2D);
    });

    textureSea = gl.createTexture();
    
    imageSea = new Image();
    imageSea.src = "images/sea.jpg";
    imageSea.addEventListener('load', function() {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textureSea);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageSea);

        
        gl.generateMipmap(gl.TEXTURE_2D);
    });

    gl.uniform1i(textureSeagullLocation,0);
    gl.uniform1i(textureSeaLocation,1);
    
    gl.uniform1f(gl.getUniformLocation(program, 
    "shininess"),materialShininess);
}

function setGeometry(gl) {
    var positions = new Float32Array(
      [
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }

function initSkybox(){
    programSkybox = initShaderProgram(gl, vsSourceSkybox, fsSourceSkybox);
    positionLocationSkybox = gl.getAttribLocation(programSkybox, "a_position");
    skyboxLocation = gl.getUniformLocation(programSkybox, "u_skybox");
    viewDirectionProjectionInverseLocation = gl.getUniformLocation(programSkybox, "u_viewDirectionProjectionInverse");
    vaoSkybox = gl.createVertexArray();
    gl.bindVertexArray(vaoSkybox);
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);
    gl.enableVertexAttribArray(positionLocationSkybox);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.vertexAttribPointer(
        positionLocationSkybox, 2, gl.FLOAT, false, 0, 0);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    const faceInfos = [
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            url: 'images/right.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            url: 'images/left.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            url: 'images/top.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            url: 'images/bottom.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            url: 'images/front.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            url: 'images/back.jpg',
        },
    ];

    faceInfos.forEach((faceInfo) => {
        const {target, url} = faceInfo;
        gl.texImage2D(target, 0, gl.RGBA, 2048, 2048, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        const image = new Image();
        image.src = url;

        image.addEventListener('load', function() {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            gl.texImage2D(target,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        });
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  
}

function calculate(){

    angleX = cameraRotation[0] * Math.PI / 180.0;
    angleY = cameraRotation[1] * Math.PI / 180.0;
    fov = 70.0;
    f = 1.0 / Math.tan(fov * 0.5);
    near = 0.1;
    far = 1000.0;
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
    gl.depthFunc(gl.LEQUAL);
    initOther(vsSource,fsSource);
    initSkybox();
}


window.onload = function init() {
    const canvas = document.querySelector("#glCanvas");
    gl = canvas.getContext('webgl2');
    if (!gl) {
        alert("WebGL isn't available");
    }

    document.addEventListener("keydown", function(event){
        if(event.key == "ArrowUp"){
            cameraPosition[2] -= zaxis[2];
            cameraPosition[0] -= zaxis[0];
            cameraPosition[1] -= zaxis[1];
            
        }
        if(event.key == "ArrowDown"){
            cameraPosition[2] += zaxis[2];
            cameraPosition[0] += zaxis[0];
            cameraPosition[1] += zaxis[1];
        }
        if(event.key == "ArrowLeft"){
            cameraPosition[0] -= xaxis[0];
            cameraPosition[1] -= xaxis[1];
            cameraPosition[2] -= xaxis[2];
        }
        if(event.key == "ArrowRight"){
            cameraPosition[0] += xaxis[0];
            cameraPosition[1] += xaxis[1];
            cameraPosition[2] += xaxis[2];
        }
        if(event.key == "PageUp"){
            cameraPosition[1] += 1;
        }
        if(event.key == "PageDown"){
            cameraPosition[1] -= 1;
        }
        if(event.key =="o"){
            if(limit==0.95){
                limit = 1;
            }
            else{
                limit = 0.95;
            }
        }
        if(event.key =="p"){
            if(current){
                initOther(vsSource,fsSource);
                current = false;
            }
            else{
                current = true;
                initOther(vsSource1,fsSource1);
            }
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

    calculate();
    draw();
}

