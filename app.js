function broswerStart(){
  console.log("browser onload");

  const mainCanvas = document.getElementById('mainCanvas');
  mainCanvas.width = 1920;
  mainCanvas.height = 1080;

  var programReady = false;
  var mainScene = null;
  keyDownCoord : vec2.create();
  var sceneReady = false;
  var rebindingNeeded = true;

  mainCamera = new camera([0,0,-10],[0,0,1],[0,1,0],90,mainCanvas.width,mainCanvas.height,1000,10);
  ghostCamera = new camera([0,0,-10],[0,0,1],[0,1,0],90,mainCanvas.width,mainCanvas.height,1000,10);


  var matrix = new Float32Array(16);
  mat4.identity(matrix);

  const gl = makeContextForCanvas(mainCanvas);





  //--------------------------------------------------------------------loop functions definition------------------------------------

    var beginLoop = function(){
      //render(matrix);
      console.log("should have rendered one time");
      requestAnimationFrame(loop);
    }

    var loop = function(){
      gl.clearColor(0,0,1,1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.clear(gl.DEPTH_BUFFER_BIT);

      gl.renderScene(mainScene,mainCamera,matrix);
      requestAnimationFrame(loop);
    }
//-------------------------------------------------------/loop function definitions-----------------------------------------------

//-----------------------------------------------------main process in order-----------------------------------------------------
    gl.makeProgramFromURI('https://wsxmax.github.io/3dModelBrowser/shaders/defaultShaders/vertexShaderGLSL','https://wsxmax.github.io/3dModelBrowser/shaders/defaultShaders/fragmentShaderGLSL',function(renderProgram){
      gl.defaultProgram = renderProgram;
      programReady = true;
      if (sceneReady) gl.prepareForRender(mainScene,beginLoop);
    });
    loadGltfFile('https://wsxmax.github.io/3dModelBrowser/gltf/suzanne.gltf',function(jsonObject){
      const gltfObject = jsonObject;
      mainScene = gltfObject.scenes[gltfObject.scene];
      console.log('scene loaded:');
      console.log(mainScene);
      gltfObject.loadImagesFromPath(gltfObject.originalPath);
      gltfObject.loadBufferFromPath(gltfObject.originalPath,function(){
        mainScene.skybox = new skybox('https://wsxmax.github.io/3dModelBrowser/skybox/textures.png');
        gl.bufferObject(gltfObject);
        sceneReady = true;
        if (programReady) gl.prepareForRender(mainScene,beginLoop);
      });
    });
  }
