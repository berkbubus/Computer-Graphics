/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

const vsSource = `#version 300 es
    #define PI 3.1415926538

    in vec4 aPosition;
    uniform mat4 projection;
    uniform mat4 view;
    uniform mat4 model;

    void main()
    {

        gl_Position = projection * view * model * aPosition;

    }
`;

//vec4(0.5, 0.8, 0.9,1.0);
const fsSource =  `#version 300 es
    precision mediump float;
    uniform vec4 color;
    out vec4 fColor;
    void main(){
        fColor = color;
    }
`;

