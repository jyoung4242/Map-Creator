import React, { useEffect, useRef } from "react"
import { connect } from "react-redux"
import { SideBarToggle, layerToggle, updateYgrid, updateXgrid, updateZoom } from "../Redux"
import "./styles.css"

function CnvControls(props) {
  /************************************* */
  //useRefs defined for this component
  /************************************* */

  const gridRef = useRef(null)
  const L0Ref = useRef(null)
  const L1Ref = useRef(null)
  const L2Ref = useRef(null)
  const L3Ref = useRef(null)
  const sliderRef = useRef(null)
  const xgRef = useRef(null)
  const ygRef = useRef(null)

  /************************************* */
  //binding functions that tie redux state to
  //controls, zoom, number of grids, and toggle flag
  /************************************* */

  function layerCheckToggle(event) {
    props.layerToggle({ item: event.target.id, status: event.target.checked })
  }

  function handleXgrid(event) {
    props.updateXgrid(parseInt(event.target.value))
  }

  function handleYgrid(event) {
    props.updateYgrid(parseInt(event.target.value))
  }

  function handleZoom(event) {
    props.updateZoom(parseInt(event.target.value))
  }

  /************************************* */
  //useEffect that is tied to chaning zoom levels
  //on the canvas component, the scroll wheel
  //can be used to change zoom, this ties the
  //control in this componetn to that changing value
  /************************************* */

  useEffect(() => {
    sliderRef.current.value = props.zoomLevel
  }, [props.zoomLevel])

  /************************************* */
  //useEffect that is tied to chaning grid viewing
  //this is used when state is loaded from local Storage
  /************************************* */

  useEffect(() => {
    L0Ref.current.checked = props.L0CheckState
    L1Ref.current.checked = props.L1CheckState
    L2Ref.current.checked = props.L2CheckState
    L3Ref.current.checked = props.L3CheckState
    gridRef.current.checked = props.gridCheckState
    xgRef.current.value = props.numXgrid
    ygRef.current.value = props.numYgrid
  }, [props.L0CheckState, props.L1CheckState, props.L2CheckState, props.L3CheckState, props.gridCheckState, props.numXgrid, props.numXgrid])

  /*************************************/
  //Component JSX
  /*************************************/

  return (
    <div className={"controls " + (props.sideBarToggle ? "sidebarhidden" : "")}>
      <span className="FormLabel">Canvas Controls</span>
      <label id="label_inp1" htmlFor="input1">
        X Grid
      </label>
      <input ref={xgRef} onChange={(e) => handleXgrid(e)} id="input1" type="number" defaultValue="20" />
      <label id="label_inp2" htmlFor="input2">
        Y Grid
      </label>
      <input ref={ygRef} onChange={(e) => handleYgrid(e)} id="input2" type="number" defaultValue="20" />
      <label id="label_inp3" htmlFor="input3">
        Zoom
      </label>
      <input
        onInput={(e) => {
          handleZoom(e)
        }}
        ref={sliderRef}
        id="input3"
        type="range"
        min="5"
        max="200"
        defaultValue="25"
      />
      <div className="chkboxs">
        Layers Control - L0
        <input
          ref={L0Ref}
          onChange={(e) => {
            layerCheckToggle(e)
          }}
          id="input4"
          type="checkbox"
          defaultChecked="true"
        />
        L1
        <input
          ref={L1Ref}
          onChange={(e) => {
            layerCheckToggle(e)
          }}
          id="input5"
          type="checkbox"
          defaultChecked="true"
        />
        L2
        <input
          ref={L2Ref}
          onChange={(e) => {
            layerCheckToggle(e)
          }}
          id="input6"
          type="checkbox"
          defaultChecked="true"
        />
        L3
        <input
          ref={L3Ref}
          onChange={(e) => {
            layerCheckToggle(e)
          }}
          id="input7"
          type="checkbox"
          defaultChecked="true"
        />
        G
        <input
          ref={gridRef}
          onChange={(e) => {
            layerCheckToggle(e)
          }}
          id="input8"
          type="checkbox"
          defaultChecked="true"
        />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    zoomLevel: state.zoomLevel,
    numXgrid: state.numXgrid,
    numYgrid: state.numYgrid,
    L0CheckState: state.L0CheckState,
    L1CheckState: state.L1CheckState,
    L2CheckState: state.L2CheckState,
    L3CheckState: state.L3CheckState,
    gridCheckState: state.gridCheckState,
    sideBarToggle: state.sideBarToggle,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    SideBarToggle: (payload) => dispatch(SideBarToggle(payload)),
    layerToggle: (payload) => dispatch(layerToggle(payload)),
    updateXgrid: (payload) => dispatch(updateXgrid(payload)),
    updateYgrid: (payload) => dispatch(updateYgrid(payload)),
    updateZoom: (payload) => dispatch(updateZoom(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CnvControls)
