var program;
var canvas;
var gl;

var animateObject = false;
var jumpCount =0;
var direction =-1;

var zoomFactor = .8;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

var numTimesToSubdivide = 5;

var pointsArray = [];
var normalsArray = [];
//var colorsArray = [];
var texCoordsArray = [];
var soundsArray = [];

//projection variables
var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var Radius=1.5;  // radius of the sphere
var phi=30;  // camera rotating angles
var theta=20;
var deg=5;
var eye;
//=[.3, .6, .6];
var at=[.1, .1, 0];
var up=[0, 1, 0];


var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ), //0
        vec4( -0.5,  0.5,  0.5, 1.0 ), //1
        vec4( 0.5,  0.5,  0.5, 1.0 ), //2
        vec4( 0.5, -0.5,  0.5, 1.0 ), //3
        vec4( -0.5, -0.5, -0.5, 1.0 ),//4
        vec4( -0.5,  0.5, -0.5, 1.0 ),//5
        vec4( 0.5,  0.5, -0.5, 1.0 ),//6
        vec4( 0.5, -0.5, -0.5, 1.0 ),//7
        vec4(0.5,.75, -3,1),   // A(0)
        vec4(0.5,.75,0.85,1),   // B(1)
        vec4(1, 1, -3, 1),   // C(2)
        vec4(0.5, 1.25, -3, 1), // D(3)
        vec4(0, 1, -3, 1),    // E(4)
        vec4(.5,1,1.75,1),    // F(5)
        vec4(0, 0, 0, 0),    // TEST G(6)
        vec4(1, 1, 1, 1),    // H(7)
        vec4(0.5, 1.25, 0.85, 1),  // I(8)
        vec4(0, 1, 1, 1),    // J(9)
    ];

  var vertices1 =[];

  var vertexColors = [
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6)
    ];

var cupPoints = [
      [0, -.325, 0.0],
      [.052, -.332, 0.0],
      [.052, -.512, 0.0],
      [.070, -.512, 0.0],
      [.062, -.328, 0.0],
      [.020, -.301, 0.0],
      [.020, -.150, 0.0],
      [.068, -.104, 0.0],
      [0,    -.104, 0.0],
    ];

var N;
var N_Triangle;
var N_Circle;

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

//light & material properties
var lightPosition = vec4(0.0, 1.0, -1.0, 0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );
var materialAmbient = vec4( .2, .2, .2, 1.0);
var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
var materialSpecular = vec4( 1, 1, 1, 1.0 );
var materialShininess = 50.0;
var ambientColor, diffuseColor, specularColor;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

var preCylCount=0; //tracks vertices gen'd before cylinders are gen'd
var cylinderCount=0;

// texture coordinates
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)];

var texture1, texture2, texture3, texture4, texture5, texture6;

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( .0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // generate the points/normals
  //  colorCube();
	//cogPoints();
  //  LightBox();
  //  CoverPoints();
  //  CylinderPoints();
	//SurfaceRevPoints();
	colorCube();
	Blade();
	SurfaceRevPointsCup();
	//tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	CandleGen();
	Cylinder(0.5,0.3); //sword pommel
	Cylinder(1.0,0.05); //wheel handles
	Cylinder(0.15,0.7)

	soundsArray.push(new Audio("door.wav"));

    // pass data onto GPU
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTexCoord );

    Initialize_Textures();

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setLightingAndMaterials();

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    // support user interface
    document.getElementById("phiPlus").onclick=function(){phi += deg;};
    document.getElementById("phiMinus").onclick=function(){phi-= deg;};
    document.getElementById("thetaPlus").onclick=function(){theta+= deg;};
    document.getElementById("thetaMinus").onclick=function(){theta-= deg;};
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
}

function setLightingAndMaterials() {

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

function HandleKeyboard(event)
{
    switch (event.keyCode)
    {
    case 37:  // left cursor key //mess w/ camera later
              phi -= deg;
              break;
    case 39:   // right cursor key
              phi += deg;
              break;
    case 38:   // up cursor key
              theta -= deg;
              break;
    case 40:    // down cursor key
              theta += deg;
              break;
    case 65: // key 'a' key to start/stop animation with shelf
            if (animateObject){
                animateObject=false;//}
                soundsArray[0].pause(); }
            else{
                soundsArray[0].play();
                animateObject=true;}
                jumpCount = 0;
                direction = (-1)*direction;
                break;
    case 66: //key 'b' to reset camera
                phi=30;  // camera movement angles
                theta=20;
                zoomFactor = .8;
                translateFactorX = 0.2;
                translateFactorY = 0.2;
                break;
    }
}

//6 pts
function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given width/height/depth
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays( gl.TRIANGLES, 0, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawPartCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given width/height/depth
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays( gl.TRIANGLES, 0, 30);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawDoor(thickness) //Draw Door
{
	var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);
  //r=rotate(90.0, 45.0, 45.0, 0.0);  // ??
  //modelViewMatrix=mult(modelViewMatrix, r);
	t=translate(0.5, 0.5*thickness, 0.5);
	//s=scale4(1.0, thickness, 1.0);
  s=scale4(thickness, 1, 0.5);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
	DrawPartCube(1);
  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);  // fragment shader to use gl.TEXTURE5
  gl.drawArrays( gl.TRIANGLES, 30, 6);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawShelf(thickness) //Draw bookshelf
{
	var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);
  //r=rotate(90.0, 45.0, 45.0, 0.0);  // ??
  //modelViewMatrix=mult(modelViewMatrix, r);
	t=translate(0.5, 0.5*thickness, 0.5);
	//s=scale4(1.0, thickness, 1.0);
  s=scale4(thickness, 1, 1);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);  // fragment shader to use gl.TEXTURE3

	DrawPartCube(1);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);  // fragment shader to use gl.TEXTURE5
  gl.drawArrays( gl.TRIANGLES, 30, 6);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawWall(thickness) //Draw Wall
{
	var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);

	t=translate(0.5, 0.5*thickness, 0.5);
	s=scale4(1.0, thickness, 1.0);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawHandles(){ //draw turning wheel handles
  var r;
  mvMatrixStack.push(modelViewMatrix);
  for (var i=0; i<8; i++)
  {
       r = rotate(45*i, 0, 0, 1);
       modelViewMatrix = mult(modelViewMatrix, r) ;
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
       gl.drawArrays( gl.TRIANGLES, preCylCount+((6*N+(N-2)*2*3)*5), 6*N+(N-2)*2*3);
  }
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawWheel(){ //draw turning wheel... wheel
  var s=scale4(0.25, 0.25, 0.25);
  var t=translate(0, 0.2, 0);
  mvMatrixStack.push(modelViewMatrix);
  var r = rotate(90.0, 180.0, 0.0, 1.0);
    modelViewMatrix=mult(modelViewMatrix, r);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, preCylCount+((6*N+(N-2)*2*3)*6), 6*N+(N-2)*2*3);
  modelViewMatrix=mult(modelViewMatrix, t);
  modelViewMatrix=mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, preCylCount+((6*N+(N-2)*2*3)*6), 6*N+(N-2)*2*3);
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawTableLeg(thick, len)
{
	var s, t;

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, len/2, 0);
	var s=scale4(thick, len, thick);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

// ******************************************
// Draw composite objects
// ******************************************
function CandleGen(){ // generate points for candle
  Cylinder(0.5,0.1);
  Cylinder(0.1,0.01);
  Cylinder(0.05,0.2);
  Cylinder(0.06,0.21);
}

function DrawCandle(){ //draw a candle/candlestick
    var s, t;
    mvMatrixStack.push(modelViewMatrix);
    N=N_Circle;
    materialAmbient = vec4( .2, .2, .2, 1.0);
    materialDiffuse = vec4( 1.0, 1.0, 1, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShininess = 50.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    setLightingAndMaterials();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, preCylCount, 6*N+(N-2)*2*3); //draw candle proper
    //s=scale4(0.5, 0.5,0.5);
    //modelViewMatrix = mult(modelViewMatrix, s);
    t=translate(0, 0.5,0);
  	modelViewMatrix=mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    //draw candle wick
    materialAmbient = vec4( .2, .2, .2, 1.0);
    materialDiffuse = vec4( 0.0, 0.0, 0, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShininess = 50.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    setLightingAndMaterials();
    gl.drawArrays( gl.TRIANGLES, preCylCount+(6*N+(N-2)*2*3), 6*N+(N-2)*2*3);
    t=translate(0, -0.55,0);
  	modelViewMatrix=mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    //draw candlestick top
    materialAmbient = vec4( .2, .2, .2, 1.0);
    materialDiffuse = vec4( 1.0, 1.0, 0, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShininess = 10.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    setLightingAndMaterials();
    gl.drawArrays( gl.TRIANGLES, preCylCount+((6*N+(N-2)*2*3)*2), 6*N+(N-2)*2*3);
    t=translate(0, -.25,0);
    modelViewMatrix=mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    //draw candlestick base
    gl.drawArrays( gl.TRIANGLES, preCylCount+((6*N+(N-2)*2*3)*3), 6*N+(N-2)*2*3);
    t=translate(0, 0.1, 0);
  	s=scale4(0.14, 0.25, 0.14);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  	DrawSolidCube(1); //draw candlestick
    modelViewMatrix=mvMatrixStack.pop();
  }

  function DrawChair(){ //draw a heavy chair
    var s,t;
    mvMatrixStack.push(modelViewMatrix);
    s=scale4(0.5, 0.3, 0.5); // w, h, d
    //modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    modelViewMatrix=mult(modelViewMatrix,s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  	DrawSolidCube(1);
    DrawChairArm();
    t=translate(-1.2,0.0,0);
    modelViewMatrix=mult(modelViewMatrix,t);
    DrawChairArm();
    s=scale4(1, 3.0, 0.3);
    t=translate(1.2,1.0,-0.5);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  	DrawSolidCube(1);

    modelViewMatrix=mvMatrixStack.pop();
  }

  function DrawChairArm(){ //draw the chairs arm
    var t,s;
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.6,0.4,0);
    s=scale4(0.1, 0.9, 0.6); // w, h, d
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    //modelViewMatrix=mult(modelViewMatrix,s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  	DrawSolidCube(2);
    modelViewMatrix=mvMatrixStack.pop();
  }

  function DrawSword(){ //draw complete sword
    var s, t;
    mvMatrixStack.push(modelViewMatrix);
    N=N_Circle;
    materialAmbient = vec4( .2, .2, .2, 1.0);
    materialDiffuse = vec4( 1.0, 1.0, 0, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShininess = 10.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    setLightingAndMaterials();
    t=translate(-1.5,0,0);
    modelViewMatrix=mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    //draw pommel
    gl.drawArrays( gl.TRIANGLES, preCylCount+((6*N+(N-2)*2*3)*4), 6*N+(N-2)*2*3);
    materialAmbient = vec4( .2, .2, .2, 1.0);
    materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShininess = 50.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    setLightingAndMaterials();
    t=translate(-.5,-.75,4);
    modelViewMatrix=mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 36, 36 ); //draw blade
    materialAmbient = vec4( .2, .2, .2, 1.0);
    materialDiffuse = vec4( 1.0, 1.0, 0, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShininess = 20.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    setLightingAndMaterials();
    t=translate(0.5, 1, -3);
    s=scale4(1.5, 0.75, 0.25);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1); //draw hilt, maybe replace with trapezoidal prism later
    t=translate(0, 0, -2);
    s=scale4(0.25, 0.5, 5);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1); //draw Handle
    modelViewMatrix=mvMatrixStack.pop();
  }

function DrawApparatus(){ //draw turning wheel
  mvMatrixStack.push(modelViewMatrix);
  DrawHandles();
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, 0, -0.05);
  modelViewMatrix=mult(modelViewMatrix, t);
  DrawWheel();
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawCup(){ //draw cup
  mvMatrixStack.push(modelViewMatrix);
  var r = rotate(180, 180.0, 0.0, 1.0);
  s=scale4(0.25,0.25,0.25);
  modelViewMatrix=mult(mult(modelViewMatrix, r),s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, 72, 381);
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawTable(topWid, topThick, legThick, legLen)
{
	var s, t;
  // draw the table top
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, legLen, 0.2);
  s=scale4(topWid, topThick, topWid);
      modelViewMatrix=mult(mult(modelViewMatrix, t), s);
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();
  t= translate(0, 0, 0.2);
        modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
  // place the four table legs
  var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
  mvMatrixStack.push(modelViewMatrix);
  t= translate(dist, 0, dist);
        modelViewMatrix = mult(modelViewMatrix, t);
  DrawTableLeg(legThick, legLen);

        // no push and pop between leg placements
  t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
  DrawTableLeg(legThick, legLen);

  t=translate(-2*dist, 0, 2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
  DrawTableLeg(legThick, legLen);

  t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
  DrawTableLeg(legThick, legLen);

  modelViewMatrix=mvMatrixStack.pop();
}

/****************************************************************************/

function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   	// set up view and projection
    projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-
      translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
      eye=vec3(
               Radius*Math.cos(theta*Math.PI/180.0)*Math.cos(phi*Math.PI/180.0),
               Radius*Math.sin(theta*Math.PI/180.0),
               Radius*Math.cos(theta*Math.PI/180.0)*Math.sin(phi*Math.PI/180.0)
              );
    modelViewMatrix=lookAt(eye, at, up);
 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);

  //draw a Candle
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(0.1,0.1,0.1);
  t=translate(0.5, 0.34, 0.6);
  modelViewMatrix=mult(mult(modelViewMatrix, t),s);
  DrawCandle();
  modelViewMatrix=mvMatrixStack.pop();

  materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
  materialDiffuse = vec4( 0.65, 0.165, 0.165, 1.0);
  materialSpecular = vec4( 0.3, 0.3, 0.3, 1.0 );
  materialShininess = 100.0;

  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  setLightingAndMaterials();
  mvMatrixStack.push(modelViewMatrix);
  r=rotate(270.0, 0.0, 90.0, 1.0);
  s=scale4(0.5,0.5,0.5);
  t=translate(0.6, 0.1, -1);
  modelViewMatrix=mult(modelViewMatrix,r);
  modelViewMatrix=mult(mult(modelViewMatrix, t),s);
  DrawChair();
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  r=rotate(15.0, 0.0, 45.0, 1.0);
  t=translate(0.5, 0.3, 0.6);
  s=scale4(0.05,0.05,0.05);
  modelViewMatrix=mult(modelViewMatrix,r);
  modelViewMatrix=mult(mult(modelViewMatrix, t),s);
  DrawSword();
  modelViewMatrix=mvMatrixStack.pop();

  /*if (animateObject) { //animation likely to change in future
      var steps = 20;
      var stepSize = 0.3/steps;   // 20 steps up and 20 steps down
      if (jumpCount <= steps)
      {
     // draw the cup
   mvMatrixStack.push(modelViewMatrix);
         if (direction > 0)
            t=translate(0.4, 0.4+stepSize*jumpCount,0.65);
         else
            t=translate(0.4, 0.4+stepSize*(40-jumpCount),0.65);
         modelViewMatrix=mult(modelViewMatrix, t);
         gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
         DrawCup();
   modelViewMatrix=mvMatrixStack.pop();

         jumpCount++;
      }
      else
      {
          jumpCount = 0;
          direction = (-1)*direction;
      }
  }*/
  //else {

  // draw the cup
  materialAmbient = vec4( .2, .2, .2, 1.0);
  materialDiffuse = vec4( 1.0, 1.0, 0, 1.0);
  materialSpecular = vec4( 1, 1, 1, 1.0 );
  materialShininess = 10.0;

  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);
  setLightingAndMaterials();
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.3, 0.29,0.65);
  modelViewMatrix=mult(modelViewMatrix, t);
  DrawCup();
  modelViewMatrix=mvMatrixStack.pop();
  //}

  // draw the other cup
  materialAmbient = vec4( .2, .2, .2, 1.0);
  materialDiffuse = vec4( 1.0, 1.0, 0, 1.0);
  materialSpecular = vec4( 1, 1, 1, 1.0 );
  materialShininess = 10.0;

  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);
  setLightingAndMaterials();
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.67, 0.29,0.4);
  modelViewMatrix=mult(modelViewMatrix, t);
  DrawCup();
  modelViewMatrix=mvMatrixStack.pop();

  materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
  materialDiffuse = vec4( 0.65, 0.165, 0.165, 1.0);
  materialSpecular = vec4( 0.3, 0.3, 0.3, 1.0 );
  materialShininess = 100.0;

  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  setLightingAndMaterials();
  mvMatrixStack.push(modelViewMatrix);
  r=rotate(90.0, 0.0, 90.0, 1.0);
  s=scale4(0.15,0.15,0.15);
  t=translate(-4, 2, 0.05);
  //modelViewMatrix=mult(modelViewMatrix,r);
  modelViewMatrix=mult(mult(mult(modelViewMatrix,r), s),t);
  DrawApparatus();
  modelViewMatrix=mvMatrixStack.pop();

  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);
  // start using gl.TEXTURE2
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);  // fragment shader to use gl.TEXTURE2
  // draw the table
  materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
  materialDiffuse = vec4( 0.65, 0.165, 0.165, 1.0);
  materialSpecular = vec4( 0.3, 0.3, 0.3, 1.0 );
  materialShininess = 100.0;

  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  setLightingAndMaterials();
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.5, 0, 0.4);
  modelViewMatrix=mult(modelViewMatrix, t);
  DrawTable(0.6, 0.02, 0.03, 0.3);
  modelViewMatrix=mvMatrixStack.pop();


    //Draw the secret door
    mvMatrixStack.push(modelViewMatrix);
    r=rotate(-90, -0.0, -180.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    s=scale4(0.65, 0.65, 0.65);
    t=translate(-0.32, 0.32, 0.75);
    modelViewMatrix=mult(mult(modelViewMatrix, t),s);
    DrawDoor(0.03);
    modelViewMatrix=mvMatrixStack.pop();

  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);
  // start using gl.TEXTURE0
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);  // fragment shader to use gl.TEXTURE0

  // wall # 1: in xz-plane
  materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0);
  materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0);
  materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
  materialShininess = 100.0;

  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  setLightingAndMaterials();

  mvMatrixStack.push(modelViewMatrix);
  s=scale4(1.5, 1.0, 1.0);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawWall(0.02);
  modelViewMatrix=mvMatrixStack.pop();

  // start using gl.TEXTURE1
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);  // fragment shader to use gl.TEXTURE1

  // wall #2: in yz-plane
  materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0);
  materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0);
  materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
  materialShininess = 100.0;

  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  setLightingAndMaterials();

  mvMatrixStack.push(modelViewMatrix);
  r=rotate(90.0, 0.0, 0.0, 1.0);
  modelViewMatrix=mult(modelViewMatrix, r);
  DrawWall(0.02);
  modelViewMatrix=mvMatrixStack.pop();

  // wall #3: in xy-plane
  materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0);
  materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0);
  materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
  materialShininess = 100.0;

  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  setLightingAndMaterials();

  mvMatrixStack.push(modelViewMatrix);
  r=rotate(-90, 1.0, 0.0, 0.0);
  modelViewMatrix=mult(modelViewMatrix, r);
  s=scale4(1.5, 1.0, 1.0);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawWall(0.02);
  modelViewMatrix=mvMatrixStack.pop();

  if (animateObject) { //animation
      var steps = 25;
      var stepSize = 0.3/steps;
      if (jumpCount <= steps)
      {
     // draw the shelf
   mvMatrixStack.push(modelViewMatrix);
   r=rotate(-90, -0.0, -180.0, 0.0);
   modelViewMatrix=mult(modelViewMatrix, r);
   s=scale4(0.65, 0.65, 0.65);
         if (direction > 0)
            t=translate(-0.45, 0.23,0.67-stepSize*jumpCount);
         else
            t=translate(-0.45, 0.23,0.67-stepSize*jumpCount);//-stepSize*(40-jumpCount));
            //t=translate(-0.45, 0.23, 0.67);
           modelViewMatrix=mult(mult(modelViewMatrix, t),s);
         gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
         DrawShelf(0.3);
   modelViewMatrix=mvMatrixStack.pop();

         jumpCount++;
      }
      else
      {
        r=rotate(-90, -0.0, -180.0, 0.0);
        modelViewMatrix=mult(modelViewMatrix, r);
        s=scale4(0.65, 0.65, 0.65);
          t=translate(-0.45, 0.23,0.67-stepSize*jumpCount);
          modelViewMatrix=mult(mult(modelViewMatrix, t),s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawShelf(0.3);
      }
  }
  else {
  //Draw the shelf
  mvMatrixStack.push(modelViewMatrix);
  r=rotate(-90, -0.0, -180.0, 0.0);
  modelViewMatrix=mult(modelViewMatrix, r);
  s=scale4(0.65, 0.65, 0.65);
  t=translate(-0.45, 0.23, 0.67);
  modelViewMatrix=mult(mult(modelViewMatrix, t),s);
  //modelViewMatrix=mult(modelViewMatrix, s);
  DrawShelf(0.3);
  modelViewMatrix=mvMatrixStack.pop();}

  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);

  requestAnimFrame(render);
}

// ******************************************
// supporting functions below this:
// ******************************************
//function circle(r)
//{}

function triangle(a, b, c)
{
     normalsArray.push(vec3(a[0], a[1], a[2]));
     normalsArray.push(vec3(b[0], b[1], b[2]));
     normalsArray.push(vec3(c[0], c[1], c[2]));

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

     sphereCount += 3;
}

function divideTriangle(a, b, c, count)
{
    if ( count > 0 )
    {
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}

function tetrahedron(a, b, c, d, n)
{
    	divideTriangle(a, b, c, n);
    	divideTriangle(d, c, b, n);
    	divideTriangle(a, d, b, n);
    	divideTriangle(a, c, d, n);
}

function quad(a, b, c, d)
{
     	var t1 = subtract(vertices[b], vertices[a]);
     	var t2 = subtract(vertices[c], vertices[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

      // triangle a-b-c
      pointsArray.push(vertices[a]);
      normalsArray.push(normal);
      texCoordsArray.push(texCoord[0]);

      pointsArray.push(vertices[b]);
      normalsArray.push(normal);
      texCoordsArray.push(texCoord[1]);

      pointsArray.push(vertices[c]);
      normalsArray.push(normal);
      texCoordsArray.push(texCoord[2]);

      // triangle a-c-d
      pointsArray.push(vertices[a]);
      normalsArray.push(normal);
      texCoordsArray.push(texCoord[0]);

      pointsArray.push(vertices[c]);
      normalsArray.push(normal);
      texCoordsArray.push(texCoord[2]);

      pointsArray.push(vertices[d]);
      normalsArray.push(normal);
      texCoordsArray.push(texCoord[3]);

      preCylCount +=6
}

function quad2(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = Newell(indices);

     // triangle a-b-c
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);

     // triangle a-c-d
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
}

function quad3(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = Newell1(indices);

     // triangle a-b-c
     pointsArray.push(vertices1[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices1[b]);
     normalsArray.push(normal);

     pointsArray.push(vertices1[c]);
     normalsArray.push(normal);

     // triangle a-c-d
     pointsArray.push(vertices1[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices1[c]);
     normalsArray.push(normal);

     pointsArray.push(vertices1[d]);
     normalsArray.push(normal);

     preCylCount +=6
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

function Blade(){
  quad(11, 12, 17, 16);   //top left side deji
  quad(10, 11, 16, 15); //top right side cdih
  quad(10,8,9,15);
  quad(8,12,17,9);
  quad(16,17,13,15); //point pt 1
  quad(9,17,13,15); //point pt 2
}

function Cylinder(len,r) //creates a solid cylinder via extrusion
{
    var height=len;
    var radius=r;
    var num=20;
    var alpha=2*Math.PI/num;

    vertices = [vec4(0, 0, 0, 1)];
    for (var i=num; i>=0; i--)
    {
        vertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
        cylinderCount+=1;
    }

    N=N_Circle=vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
        cylinderCount+=1;
    }

    ExtrudedShape();
}

function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];

    // create the face list
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad2(j, j+N, (j+1)%N+N, (j+1)%N);
    }

    // the first N vertices come from the base
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints);

    // the next N vertices come from the top
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(topPoints);
}

function SurfaceRevPointsCup()
{
	//Setup initial points matrix
	for (var i = 0; i<9; i++)
	{
		vertices1.push(vec4(cupPoints[i][0], cupPoints[i][1],
                                   cupPoints[i][2], 1));
	}

	var r;
        var t=Math.PI/4;

        // sweep the original curve another "angle" degree
	for (var j = 0; j < 8; j++)
	{
                var angle = (j+1)*t;

                // for each sweeping step, generate 25 new points corresponding to the original points
		for(var i = 0; i <9 ; i++ )
		{
		        r = vertices1[i][0];
                        vertices1.push(vec4(r*Math.cos(angle), vertices1[i][1], -r*Math.sin(angle), 1));
		}
	}

       var N=9;
       // quad strips are formed slice by slice (not layer by layer)
       //          ith slice      (i+1)th slice
       //            i*N+(j+1)-----(i+1)*N+(j+1)
       //               |              |
       //               |              |
       //            i*N+j --------(i+1)*N+j
       // define each quad in counter-clockwise rotation of the vertices
       for (var i=0; i<8; i++) // slices
       {
           for (var j=0; j<8; j++)  // layers
           {
				quad3(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1));
           }
       }
}

function polygon(indices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell(indices);

    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(vertices[indices[0]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);

        prev=next;
        next=next+1;
    }
}

function Newell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];

       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

function Newell1(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];

       x += (vertices1[index][1] - vertices1[nextIndex][1])*
            (vertices1[index][2] + vertices1[nextIndex][2]);
       y += (vertices1[index][2] - vertices1[nextIndex][2])*
            (vertices1[index][0] + vertices1[nextIndex][0]);
       z += (vertices1[index][0] - vertices1[nextIndex][0])*
            (vertices1[index][1] + vertices1[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

function Initialize_Textures()
{
        // ------------ Setup Texture 1 -----------
        texture1 = gl.createTexture();

        // create the image object
        texture1.image = new Image();

        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE0);

        //loadTexture
        texture1.image.src='floor.png';

        // register the event handler to be called on loading an image
        texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

        // ------------ Setup Texture 2 -----------
        texture2 = gl.createTexture();

        // create the image object
        texture2.image = new Image();

        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE1);

        //loadTexture
        texture2.image.src='wall.png';

        // register the event handler to be called on loading an image
        texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }

        // ------------ Setup Texture 3 -----------
        texture3 = gl.createTexture();

        // create the image object
        texture3.image = new Image();

        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE2);

        //loadTexture
        texture3.image.src='table.png';

        // register the event handler to be called on loading an image
        texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }

        // ------------ Setup Texture 4 -----------
        texture4 = gl.createTexture();

        // create the image object
        texture4.image = new Image();

        // Enable texture unit
        gl.activeTexture(gl.TEXTURE3);

        //loadTexture
        texture4.image.src='shelf1.png';

        // register the event handler to be called on loading an image
        texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3); }

        // ------------ Setup Texture 5 -----------
        texture5 = gl.createTexture();

        // create the image object
        texture5.image = new Image();

        // Enable texture unit
        gl.activeTexture(gl.TEXTURE4);

        //loadTexture
        texture5.image.src='shelf2.png';

        // register the event handler to be called on loading an image
        texture5.image.onload = function() {  loadTexture(texture5, gl.TEXTURE4); }

        // ------------ Setup Texture 6 -----------
        texture6 = gl.createTexture();

        // create the image object
        texture6.image = new Image();

        // Enable texture unit
        gl.activeTexture(gl.TEXTURE5);

        //loadTexture
        texture6.image.src='door.png';

        // register the event handler to be called on loading an image
        texture6.image.onload = function() {  loadTexture(texture6, gl.TEXTURE5); }
}

function loadTexture(texture, whichTexture)
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 1
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // v1 (combination needed for images that are not powers of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // v2
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);

    // set the texture parameters
    //gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
};

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}
