/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

const sunShader = `#version 300 es
    #define PI 3.1415926538
    in vec4 aPosition;

    uniform float uTheta;
    uniform float uScale;
    uniform float posX;
    uniform float posY;

    void main()
    {
        float angle = uTheta*PI/180.0;
        float c = cos(angle);
        float s = sin(angle);

        mat4 rz = mat4(c, s, 0.0, 0.0,
                        -s,  c, 0.0, 0.0,
                        0.0,  0.0, 1.0, 0.0,
                        posX,  posY, 0.0, 1.0);
        
        mat4 scale = mat4(uScale, 0.0, 0.0, 0.0,
                        0.0,  uScale, 0.0, 0.0,
                        0.0,  0.0, 1.0, 0.0,
                        0.0,  0.0, 0.0, 1.0);
        gl_Position = rz * scale *aPosition;
        
        gl_Position.z = -gl_Position.z;
    }
`;

const earthShader = `#version 300 es
    #define PI 3.1415926538
    in vec4 aPosition;

    uniform float uTheta;
    uniform float uScale;
    uniform float uThetaOrbit;
    uniform float posX;
    uniform float posY;

    void main()
    {
        float angle = uTheta*PI/180.0;
        float angleOrbit = uThetaOrbit*PI/180.0;
        float cOrbit = cos(angleOrbit);
        float sOrbit = sin(angleOrbit);
        float c = cos(angle);
        float s = sin(angle);

        mat4 rz = mat4(c, s, 0.0, 0.0,
                        -s,  c, 0.0, 0.0,
                        0.0,  0.0, 1.0, 0.0,
                        cOrbit/2.0,  sOrbit/2.0, 0.0, 1.0);
        
        mat4 scale = mat4(uScale/1.4, 0.0, 0.0, 0.0,
                        0.0,  uScale/1.4, 0.0, 0.0,
                        0.0,  0.0, 1.0, 0.0,
                        0.0,  0.0, 0.0, 1.0);
        gl_Position = rz * scale *aPosition;
        
        gl_Position.z = -gl_Position.z;
    }
`;

const moonShader = `#version 300 es
    #define PI 3.1415926538
    in vec4 aPosition;

    uniform float uTheta;
    uniform float uScale;
    uniform float uThetaOrbit;
    uniform float uEarthOrbit;
    uniform float posX;
    uniform float posY;

    void main()
    {
        float angle = uTheta*PI/180.0;
        float angleOrbit = uThetaOrbit*PI/180.0;
        float angleEarthOrbit = uEarthOrbit*PI/180.0;
        float cEarthOrbit = cos(angleEarthOrbit);
        float sEarthOrbit = sin(angleEarthOrbit);
        float cOrbit = cos(angleOrbit);
        float sOrbit = sin(angleOrbit);
        float c = cos(angle);
        float s = sin(angle);

        mat4 rz = mat4(c, s, 0.0, 0.0,
                        -s,  c, 0.0, 0.0,
                        0.0,  0.0, 1.0, 0.0,
                        (cEarthOrbit+cOrbit/2.0)/2.0, (sEarthOrbit+sOrbit/2.0)/2.0, 0.0, 1.0);

        mat4 scale = mat4(uScale/3.0, 0.0, 0.0, 0.0,
                        0.0,  uScale/3.0, 0.0, 0.0,
                        0.0,  0.0, 1.0, 0.0,
                        0.0,  0.0, 0.0, 1.0);
        gl_Position = rz * scale *aPosition;
        
        gl_Position.z = -gl_Position.z;

    }   
`;
//vec4(0.5, 0.8, 0.9,1.0);
const fsSource =  `#version 300 es
    precision mediump float;
    uniform vec4 color;
    out vec4 fColor;
    void main(){
        fColor = vec4(color.x, color.y, color.z , color.w);
    }
`;

