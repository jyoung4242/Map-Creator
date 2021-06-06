import React, { useEffect, useRef } from "react"
import CnvControls from "./CnvControls"
import TileSelect from "./TileSelect"
import TSelect from "./TSelect"
import { GiHamburgerMenu } from "react-icons/gi"
import { connect } from "react-redux"
import { SideBarToggle, updateSelectedTile, goodAlert, tileSelectEnable } from "../Redux"
import img from "./blanktile.png"

function Sidebar(props) {
  const cnvRef = useRef(null)
  const ctxRef = useRef(null)
  const imgRef = useRef(null)
  var parseSize = 32

  /************************************* */
  //useEffect that is onload
  //and establishes the canvas context
  /************************************* */

  useEffect(() => {
    ctxRef.current = cnvRef.current.getContext("2d")
  }, [])

  /************************************* */
  //onclick event function that sets redux
  //state for the collapsing sidebar
  /************************************* */

  function toggle() {
    if (props.sideBarToggle) {
      props.SideBarToggle(false)
    } else {
      props.SideBarToggle(true)
    }
  }

  /************************************* */
  //useEffect event function that responds
  //to the changing selected Tile to draw
  //the preview tile into the selected tile
  //preview canvas, tile selection is done
  //in the TileSelect component
  /************************************* */

  useEffect(() => {
    if (props.tileSelectEnabled) {
      var start_x = props.selectedTile[0] * parseSize
      var start_y = props.selectedTile[1] * parseSize

      if (ctxRef.current !== null && imgRef.current !== null) {
        ctxRef.current.clearRect(0, 0, parseSize, parseSize)
        ctxRef.current.drawImage(imgRef.current, start_x, start_y, parseSize, parseSize, 0, 0, 32, 32)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedTile, parseSize])

  /************************************* */
  //useEffect event function that responds
  //to the changing selected tileset from the
  //tselect component, if no tilesets are loaded
  //then the blank image is prepared, if
  //tilesets are present and clicked on, this loads
  //the tileset image into the image element, and processes
  //setting the enable flag, which is used in the TileSelect component
  /************************************* */

  useEffect(() => {
    props.tileSelectEnable(false)
    if (props.Tilesets.length == 0) {
      imgRef.current.onload = () => {
        props.tileSelectEnable(true)
        props.updateSelectedTile((0, 0))
      }
      imgRef.current.src = img
    }
    props.Tilesets.filter((tileset) => tileset.Tileset.TSet === props.selectedTileset).forEach((filteredTileset) => {
      imgRef.current.onload = () => {
        props.tileSelectEnable(true)
      }

      imgRef.current.src = filteredTileset.Tileset.imgsrc
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedTileset, props.Tilesets])

  /*************************************/
  //Component JSX
  /*************************************/

  return (
    <div className={"Sidebar " + (props.sideBarToggle ? "collapsed" : "")}>
      <GiHamburgerMenu onClick={toggle} className="Icon HoverIcon" />
      <CnvControls />
      <TSelect />
      <TileSelect parseSize={32} />
      <label className="labelSelTile rotateSelTitle" htmlFor="selTile">
        Selected Tile
      </label>

      <canvas ref={cnvRef} id="selTile" className="selectedTilePreview" width={32} height={32}></canvas>
      <img ref={imgRef} src="" alt="" style={{ display: "none" }}></img>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    sideBarToggle: state.sideBarToggle,
    selectedTile: state.selectedTile,
    selectedTileset: state.selectedTileset,
    Tilesets: state.Tilesets,
    tileSelectEnabled: state.tileSelectEnabled,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    SideBarToggle: (payload) => dispatch(SideBarToggle(payload)),
    tileSelectEnable: (payload) => dispatch(tileSelectEnable(payload)),
    goodAlert: (payload) => dispatch(goodAlert(payload)),
    updateSelectedTile: (payload) => dispatch(updateSelectedTile(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
