/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

const vsSource = `#version 300 es
    #define PI 3.1415926538

    in vec4 aPosition;
    in vec2 aTexcoord;
    in vec3 aNormal;

    uniform mat4 projection;
    uniform mat4 view;
    uniform mat4 model;
    out vec2 vTexcoord;
    out float isSea;

    out vec3 vNormal;
    uniform vec3 uLightWorldPosition;
    uniform vec3 viewWorldPosition;
    uniform mat4 uWorldInverseTranspose;
    out vec3 vSurfaceToLight;
    out vec3 vSurfaceToView;

    void main()
    {
        vNormal = - mat3(uWorldInverseTranspose) * aNormal;
        vec3 surfaceWorldPosition = (aPosition).xyz;
        vSurfaceToLight = uLightWorldPosition - surfaceWorldPosition;
        vSurfaceToView = viewWorldPosition - surfaceWorldPosition;
        gl_Position = projection * view * model * aPosition;
        if(aPosition.y <= 0.0){
            isSea = 1.0;
        }
        else{
            isSea = 0.0;
        }
        
        vTexcoord = aTexcoord;
    }
`;

const fsSource =  `#version 300 es
    precision highp float;
    in vec2 vTexcoord;
    in float isSea;

    uniform sampler2D seagullTexture;
    uniform sampler2D seaTexture;
    out vec4 oColor;

    in vec3 vNormal;
    in vec3 vSurfaceToLight;
    in vec3 vSurfaceToView;
    uniform vec4 uColor;
    uniform float uShininess;
    uniform vec3 uLightDirection;
    uniform float uLimit;
    void main(){
        vec3 normal = normalize(vNormal);
        vec3 surfaceToLightDirection = normalize(vSurfaceToLight);
        vec3 surfaceToViewDirection = normalize(vSurfaceToView);
        vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
        float dotFromDirection = dot(surfaceToLightDirection, -uLightDirection);
        float inLight = step(uLimit, dotFromDirection);
        float light = dot(normal, surfaceToLightDirection) * inLight;
        float specular = inLight * pow(dot(normal, halfVector), uShininess);
        if(isSea==1.0){
            oColor = uColor * texture(seaTexture, vTexcoord);
        }
        else{
            oColor = uColor * texture(seagullTexture, vTexcoord);
        }

        oColor.rgb *= light;
        oColor.rgb += specular;

    }
`;

const vsSource1 = `#version 300 es
    #define PI 3.1415926538

    in vec4 aPosition;
    in vec2 aTexcoord;
    in vec3 aNormal;
    uniform float uShininess;
    uniform vec3 uLightDirection;
    uniform float uLimit;
    uniform mat4 projection;
    uniform mat4 view;
    uniform mat4 model;
    out vec2 vTexcoord;
    out float isSea;
    out vec4 vColor;
    out float light;
    out float specular;
    uniform vec3 uLightWorldPosition;
    uniform vec3 viewWorldPosition;
    uniform mat4 uWorldInverseTranspose;

    void main()
    {
        vec3 vNormal = - mat3(uWorldInverseTranspose) * aNormal;
        vec3 surfaceWorldPosition = (aPosition).xyz;
        vec3 vSurfaceToLight = uLightWorldPosition - surfaceWorldPosition;
        vec3 vSurfaceToView = viewWorldPosition - surfaceWorldPosition;
        gl_Position = projection * view * model * aPosition;
        if(aPosition.y <= 0.0){
            isSea = 1.0;
        }
        else{
            isSea = 0.0;
        }
        
        vTexcoord = aTexcoord;
        vec3 normal = normalize(vNormal);
        vec3 surfaceToLightDirection = normalize(vSurfaceToLight);
        vec3 surfaceToViewDirection = normalize(vSurfaceToView);
        vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
        float dotFromDirection = dot(surfaceToLightDirection, -uLightDirection);
        float inLight = step(uLimit, dotFromDirection);
        light = dot(normal, surfaceToLightDirection) * inLight;
        specular = inLight * pow(dot(normal, halfVector), uShininess);
    }
`;

const fsSource1 =  `#version 300 es
    precision highp float;
    in vec2 vTexcoord;
    in float isSea;
    uniform vec4 uColor;
    uniform sampler2D seagullTexture;
    uniform sampler2D seaTexture;
    out vec4 oColor;
    in float light;
    in float specular;
    in vec4 vColor;

    void main(){

        if(isSea==1.0){
            oColor = uColor * texture(seaTexture, vTexcoord);
        }
        else{
            oColor = uColor * texture(seagullTexture, vTexcoord);
        }

        oColor.rgb *= light;
        oColor.rgb += specular;

    }
`;

const vsSourceSkybox = `#version 300 es
    in vec4 a_position;
    out vec4 v_position;
    void main() {
        v_position = a_position;
        gl_Position = a_position;
        gl_Position.z = 1.0;
    }
`;

const fsSourceSkybox = `#version 300 es
    precision highp float;

    uniform samplerCube u_skybox;
    uniform mat4 u_viewDirectionProjectionInverse;

    in vec4 v_position;

    out vec4 outColor;

    void main() {
        vec4 t = u_viewDirectionProjectionInverse * v_position;
        outColor = texture(u_skybox, normalize(t.xyz / t.w));
    }
`;