import React from "react"
import "./styles.css"
import { connect } from "react-redux"
import { resetState, goodAlert, errorAlert, clearMap, loadState, triggerDraw } from "../Redux"
import exportFromJSON from "export-from-json"

function Header(props) {
  /********************************/
  //handleSave, this is event triggered routine
  //that takes the entire redux state and writes it to localStorage
  /********************************/
  function handleSave() {
    localStorage.setItem("reactState", JSON.stringify(props.myState))
    props.goodAlert("Success saving project to Local Storage")
  }

  /********************************/
  //handleOpen, this is event triggered routine
  //that takes the localStorage and through props
  //updates redux state with stored values
  /********************************/
  function handleOpen() {
    //attempt to read item from localStorage, bail if nothing there
    try {
      var stateObject = localStorage.getItem("reactState")
      if (stateObject === null) {
        props.errorAlert("Error: Saved state not found")
        return
      }

      //send toast message to screen
      props.goodAlert("LocalStorage Retrieved")

      //push stateObject to state
      props.loadState(stateObject)

      //cleanup
      stateObject = null

      //this is state controlled flag to trigger a redraw of the
      //canvas in the canvas component
      props.triggerDraw(true)
      //this is a pulse, so clear flag shortly after
      setTimeout(() => {
        props.triggerDraw(false)
      }, 100)
    } catch (err) {
      props.errorAlert("Error in retrieving LocalStorage")
    }
  }

  /********************************/
  //handleMapClear, this is event triggered routine
  //that triggers action call back in redux
  //that empties the mainTileMap array, clearing
  //the map
  /********************************/

  function handleMapClear() {
    props.clearMap()
  }

  /********************************/
  //handleExport, this is event triggered routine
  //that creates a filename by Date stamp
  //using the exportFromJSON npm library
  //writes the key state items identified into
  //a JSON string and writes to file
  /********************************/

  function handleExport() {
    const data = [{ numXgrid: props.numXgrid }, { numYgrid: props.numYgrid }, { Tilesets: props.Tilesets }, { mainTileMap: props.mainTileMap }]
    const fileName = `MAP_${Date.now()}.json`
    const exportType = "json"
    exportFromJSON({ data, fileName, exportType })
  }

  /********************************/
  //handleReset, this is event triggered routine
  //sends redux action callback that resets all
  //state values back to initial ones
  /********************************/
  function handleReset() {
    props.resetState()
    props.goodAlert("Project Successfully Reset")
  }

  /*************************************/
  //Component JSX
  /*************************************/

  return (
    <div className="Header">
      <div className="Header_Title">
        <h1>Map Generator 2.0</h1>
      </div>

      <div className="Header_Links">
        <a onClick={handleMapClear} href="/#">
          <span>Clear Map</span>
        </a>
        <a onClick={handleSave} href="/#">
          <span>Save Project</span>
        </a>
        <a onClick={handleOpen} href="/#">
          <span>Open Project</span>
        </a>
        <a onClick={handleReset} href="/#">
          <span>Reset Project</span>
        </a>
        <a onClick={handleExport} href="/#">
          <span>Export Map</span>
        </a>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    myState: state,
    numXgrid: state.numXgrid,
    numYgrid: state.numYgrid,
    Tilesets: state.Tilesets,
    mainTileMap: state.mainTileMap,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetState: (payload) => dispatch(resetState(payload)),
    goodAlert: (payload) => dispatch(goodAlert(payload)),
    errorAlert: (payload) => dispatch(errorAlert(payload)),
    clearMap: (payload) => dispatch(clearMap(payload)),
    loadState: (payload) => dispatch(loadState(payload)),
    triggerDraw: (payload) => dispatch(triggerDraw(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
