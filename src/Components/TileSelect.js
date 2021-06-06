import React, { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import { SideBarToggle, updateSelectedTile } from "../Redux"
import blank from "./blank.png"

function TileSelect(props) {
  const cnvRef = useRef(null)
  const ctxRef = useRef(null)
  const imageRef = useRef(null)
  const blankRef = useRef(null)

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  })

  /************************************* */
  //useEffect that is onload
  //and establishes the canvas context
  //also. loads the blank image for the tileset
  //at app startup
  /************************************* */

  useEffect(() => {
    ctxRef.current = cnvRef.current.getContext("2d")

    blankRef.current.onload = () => {
      console.log("") //do something
    }
    blankRef.current.src = blank
  }, [])

  /************************************* */
  //useEffect that is tied to changing window
  //dimensions, tileset being added, and the
  //tiles being clicked on
  //if no tilesets available, display blank
  //filter out the selected tileset
  //and draw it to the canvas
  /************************************* */

  useEffect(() => {
    if (props.Tilesets.length) {
      props.Tilesets.filter((tileset) => tileset.Tileset.TSet === props.selectedTileset).forEach((filteredTileset) => {
        imageRef.current.onload = () => {
          if (ctxRef.current !== null && imageRef.current !== null) {
            ctxRef.current.clearRect(0, 0, cnvRef.current.width, cnvRef.current.height)
            ctxRef.current.drawImage(imageRef.current, 0, 0, imageRef.current.width, imageRef.current.height, 0, 0, cnvRef.current.width, cnvRef.current.height)
          }
        }
        imageRef.current.src = filteredTileset.Tileset.imgsrc
      })
      return
    } else {
      if (ctxRef.current !== null && blankRef.current !== null) {
        ctxRef.current.drawImage(blankRef.current, 0, 0, imageRef.current.width, imageRef.current.height, 0, 0, cnvRef.current.width, cnvRef.current.height)
      }
    }
  }, [dimensions, props.Tilesets, props.selectedTileset])

  /************************************* */
  //onClick event from the canvas
  //that establishes which part of canvas
  //is clicked via getCoords, then updates
  //redux store
  /************************************* */

  function handleTileSelection(event) {
    var selection = getCoords(event)

    props.updateSelectedTile(selection)
  }

  /************************************* */
  //debouncing routine that sets proper
  //dimensions of the app after 250ms
  //throught the resizing EventListener
  /************************************* */

  function debounce(fn, ms) {
    let timer
    return (_) => {
      clearTimeout(timer)
      timer = setTimeout((_) => {
        timer = null
        fn.apply(this, arguments)
      }, ms)
    }
  }

  /************************************* */
  //useEffect routine that sets proper
  //dimensions of the app after 250ms
  //throught the resizing EventListener, which then
  //is coupled to the debounce function
  /************************************* */

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      })
    }, 250)
    window.addEventListener("resize", debouncedHandleResize)
    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize)
    }
  })

  /************************************* */
  //function that takes in mouse events and returns
  //the x,y coordinates of where the mouse click occurred
  /************************************* */

  function getCoords(e) {
    const { x, y } = e.target.getBoundingClientRect()
    const mouseX = e.clientX - x
    const mouseY = e.clientY - y

    return [Math.floor(mouseX / (cnvRef.current.width / 10)), Math.floor(mouseY / (cnvRef.current.height / 10))]
  }

  /*************************************/
  //Component JSX
  /*************************************/

  return (
    <div className={"selectTile " + (props.sideBarToggle ? "sidebarhidden" : "")}>
      <canvas onClick={(e) => handleTileSelection(e)} ref={cnvRef} id="cnvTileset" width={0.36 * dimensions.height} height={0.36 * dimensions.height}></canvas>
      <img ref={imageRef} src="" alt="" style={{ display: "none" }}></img>
      <img ref={blankRef} src="" alt="" style={{ display: "none" }}></img>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    sideBarToggle: state.sideBarToggle,
    selectedTileset: state.selectedTileset,
    Tilesets: state.Tilesets,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    SideBarToggle: (payload) => dispatch(SideBarToggle(payload)),
    updateSelectedTile: (payload) => dispatch(updateSelectedTile(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TileSelect)
