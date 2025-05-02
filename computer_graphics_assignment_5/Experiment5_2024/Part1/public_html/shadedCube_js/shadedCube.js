

var canvas;
var gl;



var numVertices  = 36;

var pointsArray = [];
var normalsArray = [];

var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 100.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

var thetaLoc;

var flag = true;

function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);


     pointsArray.push(vertices[a]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[b]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[c]); 
     normalsArray.push(normal);   
     pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
     pointsArray.push(vertices[c]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[d]); 
     normalsArray.push(normal);    
}


function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {
   
    canvas = document.getElementById( "gl-canvas" );
    
    //gl = WebGLUtils.setupWebGL( canvas );
    gl = canvas.getContext("webgl2");
    if ( !gl ) { alert( "WebGL isn't available" ); }
    var size = 2; 
   var type = gl.FLOAT;
   var offset = 0;
   var stride = 0; 
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    colorCube();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    var texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");

    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    setTexcoords(gl);
  
    // Turn on the attribute
    gl.enableVertexAttribArray(texcoordAttributeLocation);

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    viewerPos = vec3(0.0, 0.0, -20.0 );

    projection = ortho(-1, 1, -1, 1, -100, 100);
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};
   document.getElementById("LightX+").onclick = function(){lightPosition[0]+=0.1;}
   document.getElementById("LightX-").onclick = function(){lightPosition[0]-=0.1;}
   document.getElementById("LightY+").onclick = function(){lightPosition[1]+=0.1;}
   document.getElementById("LightY-").onclick = function(){lightPosition[1]-=0.1;}
   document.getElementById("LightZ+").onclick = function(){lightPosition[2]+=0.1;}
   document.getElementById("LightZ-").onclick = function(){lightPosition[2]-=0.1;}

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
       flatten(specularProduct) );	

       
    gl.uniform1f(gl.getUniformLocation(program, 
       "shininess"),materialShininess);
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));
       gl.vertexAttribPointer(
         texcoordAttributeLocation, size, type, normalize, stride, offset);
   
       var texture = gl.createTexture();

       // use texture unit 0
       gl.activeTexture(gl.TEXTURE0 + 0);
    
       // bind to the TEXTURE_2D bind point of texture unit 0
       gl.bindTexture(gl.TEXTURE_2D, texture);
       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
             new Uint8Array([0, 0, 255, 255]));
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    
       // Asynchronously load an image
       var image = new Image();
       image.src = "images/snowflake.png";
       image.addEventListener('load', function() {
       // Now that the image has loaded make copy it to the texture.
       gl.bindTexture(gl.TEXTURE_2D, texture);
       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
       gl.generateMipmap(gl.TEXTURE_2D);
       });
    
    render();
}

function setTexcoords(gl) {
   gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 0,
        1, 1,
        0, 1,
      ]),
      gl.STATIC_DRAW);
 }

var render = function(){
            
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
    if(flag) theta[axis] += 2.0;
            
    modelView = mat4();
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
   gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), 
   flatten(lightPosition) );
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
            
            
    requestAnimFrame(render);
}
