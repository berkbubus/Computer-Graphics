/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

const vsSource = `#version 300 es
    #define PI 3.1415926538
    in vec4 aPosition;

    uniform float uTheta;
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
        

        gl_Position = rz * aPosition;
        
        gl_Position.z = -gl_Position.z;
    }
`;
//vec4(0.5, 0.8, 0.9,1.0);
const fsSource1 =  `#version 300 es
    precision mediump float;
    uniform float absTheta;
    out vec4 fColor;
    void main(){
        fColor = vec4(0.5-absTheta/250.0, 0.8-absTheta/154.0, 0.9-absTheta/138.0,1.0);
    }
`;

const fsSource2 =  `#version 300 es
    precision mediump float;
    out vec4 fColor;
    void main(){
        fColor = vec4(0.9,0.9,0.9,1.0);
    }
`;

