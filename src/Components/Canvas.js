import React, { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import { addTile, clearedMapFlag, deleteTile, updateZoom, updateStartingPoint, updatePreviewImage } from "../Redux"

function Canvas(props) {
  //Reference for preview canvases
  const consolodateRef = useRef(null)
  const previewRef = useRef(null)
  //context
  const previewContextRef = useRef(null)
  const consCtxRef = useRef(null)

  //Reference for drawing canvases
  const canvasRef = useRef(null)
  const Layer0Ref = useRef(null)
  const Layer1Ref = useRef(null)
  const Layer2Ref = useRef(null)
  const Layer3Ref = useRef(null)
  //context
  const L0ctxRef = useRef(null)
  const L1ctxRef = useRef(null)
  const L2ctxRef = useRef(null)
  const L3ctxRef = useRef(null)
  const contextRef = useRef(null)

  //This is the array of image refs for the tilesets
  const imageRefs = useRef([])

  var mouseXX, mouseYY, dragx, dragy

  const [isDown, setIsDown] = useState(false)
  const [isPan, setPan] = useState(false)

  //*************************************/
  //Topmost function, don't move
  //*************************************/

  useEffect(() => {
    //getting context for preview
    consCtxRef.current = consolodateRef.current.getContext("2d")
    previewContextRef.current = previewRef.current.getContext("2d")

    //getting context for main drawing canvases
    contextRef.current = canvasRef.current.getContext("2d")
    L0ctxRef.current = Layer0Ref.current.getContext("2d")
    L1ctxRef.current = Layer1Ref.current.getContext("2d")
    L2ctxRef.current = Layer2Ref.current.getContext("2d")
    L3ctxRef.current = Layer3Ref.current.getContext("2d")

    //intial draw
    draw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //This useEffect is for loading up the imageRefs for each tileset
  //each time a tileset is added to state from other component
  //this runs
  useEffect(() => {
    imageRefs.current = imageRefs.current.slice(0, props.Tilesets.length)
  }, [props.Tilesets])

  //primary redraw useEffect when something changes that impacts what is
  //visually seen on the screen, do the canvase redraw
  useEffect(() => {
    draw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.numXgrid, props.numYgrid, props.zoomLevel, props.gridCheckState, props.L0CheckState, props.L1CheckState, props.L2CheckState, props.L3CheckState])

  useEffect(() => {
    if (props.loadingFlag) draw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadingFlag])

  //optimization useEffect, so only redraw your active layer
  //if you are drawing tiles and only adding to a certian layer (typical)
  //then DO NOT redraw the whole thing
  useEffect(() => {
    if (!props.clearMapFlag) {
      partial_draw()
      return
    }
    clearRect()
    drawGrid()
    props.clearedMapFlag()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mainTileMap, props.clearMapFlag])

  //this is the partial redraw routine
  //only clears the canvas we are working on, then
  //passes that active layer to the drawLayer routine
  function partial_draw() {
    var lyr = props.Layer
    switch (lyr) {
      case 0:
        L0ctxRef.current.clearRect(0, 0, 4000, 4000)
        break
      case 1:
        L1ctxRef.current.clearRect(0, 0, 4000, 4000)
        break
      case 2:
        L2ctxRef.current.clearRect(0, 0, 4000, 4000)
        break
      case 3:
        L3ctxRef.current.clearRect(0, 0, 4000, 4000)
        break
    }
    drawLayer(lyr)
  }

  //ultimately, this routine is called via mouse events
  //that are handled, the intention of this routine
  //is to add the coordinates of the mouse click or move
  //to state via the dispatch props.addTile
  //passed data is the key(0-0), (x,y) coordinates of
  //the tileset assigned, the tileset, and the active
  //layer, deletes if shift is held as opposite
  function addTile(e) {
    //gaurd function
    if (props.Tilesets.length == 0) return

    if (isDown) {
      //Load up mainTileMap with tileset, layer, and tilereferences
      var lyr = props.Layer
      var tSet = props.selectedTileset
      var coord = props.selectedTile

      //get coords of click
      var clicked = getCoords(e)

      //gaurd conditions for bad coordinates

      if (clicked[0] < 0) return
      if (clicked[1] < 0) return
      if (clicked[0] >= props.numXgrid) return
      if (clicked[1] >= props.numYgrid) return

      var key = clicked[0] + "-" + clicked[1]

      if (e.shiftKey) {
        props.deleteTile({ key, coord, tSet, lyr })
      } else {
        props.addTile({ key, coord, tSet, lyr })
      }
    }
  }

  //Utility for getting coordinates of mouse click
  function getCoords(e) {
    const { x, y } = e.target.getBoundingClientRect()
    var { startx, starty } = props.startingPoint
    var gridSize = props.zoomLevel
    const mouseX = e.clientX - x - startx
    const mouseY = e.clientY - y - starty

    return [Math.floor(mouseX / gridSize), Math.floor(mouseY / gridSize)]
  }

  //this is where tiles are added to screen
  //creates the proper loop to iterate over the "row"
  //in the main tilemap, so this is called for each layer
  //in the tilemap...
  function drawLayer(layerNum) {
    var gridSize = props.zoomLevel
    var { startx, starty } = props.startingPoint

    //grab the active layer from the tilemap
    var rows = props.mainTileMap.filter((row, index) => {
      return index === layerNum
    })

    //create loop for each layer
    rows.forEach((tile) => {
      Object.keys(tile).forEach((key) => {
        //parse out all data needed
        //convert key to x,y system
        var positionX = Number(key.split("-")[0])
        var positionY = Number(key.split("-")[1])

        //find starting pixel of map
        var dx = startx + gridSize * positionX
        var dy = starty + gridSize * positionY

        // parse out which tileset and the coordinates
        var [tileSetNeeded, coords] = tile[key]

        //select canvas to draw to
        var ctx
        switch (layerNum) {
          case 0:
            ctx = L0ctxRef.current
            break
          case 1:
            ctx = L1ctxRef.current
            break
          case 2:
            ctx = L2ctxRef.current
            break
          case 3:
            ctx = L3ctxRef.current
            break
        }

        //This is for tracking the tileset index, it is a
        //seperate loop, because i forgot to capture it earlier
        var tilesetIndex = 0
        props.Tilesets.forEach((tileset, index) => {
          if (tileset.Tileset.TSet === tileSetNeeded) {
            tilesetIndex = index
          }
        })

        //this is where the tile is drawn, and if preview is active, it draws on the consolodate canvas as well
        ctx.drawImage(imageRefs.current[tilesetIndex], 32 * coords[0], 32 * coords[1], 32, 32, dx, dy, gridSize, gridSize)
        if (props.previewToggle) consCtxRef.current.drawImage(imageRefs.current[tilesetIndex], 32 * coords[0], 32 * coords[1], 32, 32, dx, dy, gridSize, gridSize)
      })
    })
  }

  //primary draw routine that creates the grid on the lowest
  //drawing level, draws each grid line and the boundary
  //rectangle
  function drawGrid() {
    //draw grid layer first
    var numGridsX = props.numXgrid
    var numGridsY = props.numYgrid
    var gridSize = props.zoomLevel
    var { startx, starty } = props.startingPoint

    var gridWidth = numGridsX * gridSize
    var gridHeight = numGridsY * gridSize

    //color and thickness of gridlines
    contextRef.current.strokeStyle = "#D3D3D388"
    contextRef.current.lineWidth = 1

    //reset canvas
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    contextRef.current.beginPath()
    var x, y, i

    if (props.gridCheckState) {
      //Drawing vertical lines
      for (i = 1; i <= numGridsX; i++) {
        x = i * gridSize + startx
        contextRef.current.moveTo(x, starty)
        contextRef.current.lineTo(x, gridHeight + starty)
        contextRef.current.stroke()
      }

      //Drawing Horizontal lines
      for (i = 1; i <= numGridsY; i++) {
        y = i * gridSize + starty
        contextRef.current.moveTo(startx, y)
        contextRef.current.lineTo(gridWidth + startx, y)
        contextRef.current.stroke()
      }
    }
    //Draw grid border
    contextRef.current.strokeRect(startx, starty, gridWidth, gridHeight)

    contextRef.current.closePath()
  }

  //bulk routine to clear all the rectangles
  function clearRect() {
    previewContextRef.current.clearRect(0, 0, 4000, 4000)
    consCtxRef.current.clearRect(0, 0, 200, 125)

    contextRef.current.clearRect(0, 0, 4000, 4000)
    L0ctxRef.current.clearRect(0, 0, 4000, 4000)
    L1ctxRef.current.clearRect(0, 0, 4000, 4000)
    L2ctxRef.current.clearRect(0, 0, 4000, 4000)
    L3ctxRef.current.clearRect(0, 0, 4000, 4000)
  }

  //this is the routine that gets called the most on each render
  //clears the canvases, draws the grid, then draws each layer
  //of tiles in the tilemap, IF the layer is enabled from the UI
  function draw() {
    //draw grid layer first

    clearRect()
    drawGrid()
    //then loop through mainTileMap, and draw each tile at each coordinate
    if (props.L0CheckState) {
      drawLayer(0)
    }
    if (props.L1CheckState) {
      console.log("here")
      drawLayer(1)
    }
    if (props.L2CheckState) {
      drawLayer(2)
    }
    if (props.L3CheckState) {
      drawLayer(3)
    }
  }

  //routine that is called only if the preview
  //pane is enabled in state, this is supposed
  //to take the consolodated canvas, capture
  //the small portion that is being drawn to
  //and send the URL data to state for display
  //in another component

  function updatePreview() {
    //step one - capture "map" from consolodated canvas and draw
    //onto preview canvas
    var gridSize = props.zoomLevel
    var { startx, starty } = props.startingPoint
    var numX = props.numXgrid
    var numY = props.numYgrid

    var gridW = numX * gridSize
    var gridY = numY * gridSize
    console.log(startx, starty, numX, numY, gridSize)
    previewContextRef.current.drawImage(consolodateRef.current, startx, starty, gridW, gridY, 0, 0, 200, 125)

    //step two - output preview canvas toDataURL
    var data = previewRef.current.toDataURL()
    var previewImage = new Image()

    previewImage.onload = function () {
      //send image to state
      //step three - send image to state
      props.updatePreviewImage(previewImage.src)
    }
    previewImage.src = data
  }

  /*************************************
  MOUSE EVENTS 
  **************************************/

  //Mouse Event, onclick
  //passes which mouse button is pressed to the
  //addTile
  function handleClick(e) {
    e.preventDefault()
    setIsDown(true)
    addTile(e)
    setIsDown(false)
  }

  //Mouse Event, onMouseUp
  //passes which mouse button is pressed to the
  //determine if done drawing, or done panning
  function hanldeMouseUp(e) {
    e.preventDefault()

    switch (e.button) {
      case 0: //left button
        setIsDown(false)
        if (props.previewToggle) updatePreview()
        break
      case 1: //middle button
        setPan(false)
        break
      case 2: //right button
        break
      default:
        break
    }
  }

  //Mouse Event, onMouseLeave
  //clears all flags as mouse leaves control
  function handleMouseLeave(e) {
    e.preventDefault()
    setIsDown(false)
    if (props.previewToggle) updatePreview()
  }

  //Mouse Event, onMouseDown
  //if left button, this sets the drawing flag
  //if middle button, this set's the panning flag
  function hanldeMouseDown(e) {
    e.preventDefault()

    switch (e.button) {
      case 0: //left button
        setIsDown(true)
        break
      case 1: //middle button
        setPan(true)
        break
      case 2: //right button
        break
      default:
        break
    }
  }

  //Mouse Event, onMouseMove
  //if left button, this sends the mouse coordinates to the addTile function
  //if middle button, this calcualtes the canvas panning function and redraws
  function onMove(e) {
    if (!isDown && !isPan) {
      //do nothing
      return
    }

    if (isDown && !isPan) {
      //run the addTile routine
      addTile(e)
    }

    if (!isDown && isPan) {
      var { startx, starty } = props.startingPoint
      //run PAN routine
      e.stopPropagation()
      // get the current mouse position
      mouseXX = parseInt(e.clientX)
      mouseYY = parseInt(e.clientY)

      // dx & dy are the distance the mouse has moved since
      // the last mousemove event
      var deltax = mouseXX - dragx
      var deltay = mouseYY - dragy
      // reset the vars for next mousemove
      dragx = mouseXX
      dragy = mouseYY
      startx = startx + deltax //netPanningX
      starty = starty + deltay //netPanningY

      if (startx && starty) {
        props.updateStartingPoint({ startx, starty })
      }

      draw()
    }
  }

  //Mouse Wheel event for scrolling
  //which is bound to the zoom level state
  //this takes the place of moving the zoom slider
  function handleWheel(e) {
    var zoom = props.zoomLevel
    if (e.deltaY === -125 && zoom < 195) {
      zoom = zoom + 5
      props.updateZoom(zoom)
    }

    if (e.deltaY === 125 && zoom > 5) {
      zoom = zoom - 5
      props.updateZoom(zoom)
      return
    }
  }

  /*************************************/
  //Component JSX
  /*************************************/

  return (
    <div className="CanvasDiv">
      {/*This creates and image for each tileset in state, so that you can quickly load the tileset image*/}
      {props.Tilesets.map((layer, index) => {
        var imageID = "img_" + layer.Tileset.Layer + "_" + layer.Tileset.TSet
        return <img id={imageID} width="320" height="320" ref={(el) => (imageRefs.current[index] = el)} src={layer.Tileset.imgsrc} key={index} style={{ display: "none" }} alt="" />
      })}
      {/* first group of canvas is for the preview, its a consolidation canvas and the "preview canvas" */}
      <canvas ref={previewRef} style={{ zIndex: -3, display: "none" }}></canvas>
      <canvas ref={consolodateRef} width="4000" height="4000" className="cnv" style={{ zIndex: -2, display: "none" }}></canvas>

      {/*The next bunch of canvas is the grid, plus the 4 layers for drawing */}
      <canvas ref={canvasRef} width="4000" height="4000" className="cnv" style={{ zIndex: -1 }}></canvas>
      <canvas ref={Layer0Ref} width="4000" height="4000" className="cnv" style={{ zIndex: 2 }}></canvas>
      <canvas ref={Layer1Ref} width="4000" height="4000" className="cnv" style={{ zIndex: 3 }}></canvas>
      <canvas ref={Layer2Ref} width="4000" height="4000" className="cnv" style={{ zIndex: 4 }}></canvas>
      <canvas ref={Layer3Ref} width="4000" height="4000" className="cnv" style={{ zIndex: 5 }} onWheel={(e) => handleWheel(e)} onMouseMove={(e) => onMove(e)} onMouseLeave={(e) => handleMouseLeave(e)} onClick={(e) => handleClick(e)} onMouseDown={(e) => hanldeMouseDown(e)} onMouseUp={(e) => hanldeMouseUp(e)}></canvas>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    numXgrid: state.numXgrid,
    numYgrid: state.numYgrid,
    zoomLevel: state.zoomLevel,
    startingPoint: state.startingPoint,
    Layer: state.Layer,
    Tilesets: state.Tilesets,
    selectedTileset: state.selectedTileset,
    selectedTile: state.selectedTile,
    gridCheckState: state.gridCheckState,
    mainTileMap: state.mainTileMap,
    L0CheckState: state.L0CheckState,
    L1CheckState: state.L1CheckState,
    L2CheckState: state.L2CheckState,
    L3CheckState: state.L03heckState,
    previewToggle: state.previewToggle,
    loadingFlag: state.loadingFlag,
    clearMapFlag: state.clearMapFlag,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTile: (payload) => dispatch(addTile(payload)),
    deleteTile: (payload) => dispatch(deleteTile(payload)),
    updateStartingPoint: (payload) => dispatch(updateStartingPoint(payload)),
    updateZoom: (payload) => dispatch(updateZoom(payload)),
    updatePreviewImage: (payload) => dispatch(updatePreviewImage(payload)),
    clearedMapFlag: (payload) => dispatch(clearedMapFlag(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
