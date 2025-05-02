/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

const vsSource = `
    attribute vec4 a_position;
    void main(){
        gl_Position = a_position;
    }
`;

const fsSource1 =  `
    void main(){
        gl_FragColor = vec4(0.0,0.0,1.0,1.0);
    }
`;

const fsSource2 =  `
    void main(){
        gl_FragColor = vec4(1.0,1.0,1.0,1.0);
    }
`;

