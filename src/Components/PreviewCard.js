import React, { useEffect, useRef } from "react"
import { BiHide, BiShow } from "react-icons/bi"
import { connect } from "react-redux"
import { previewTog } from "../Redux"
import "./styles.css"

function PreviewCard(props) {
  const ImageRef = useRef(null)
  const prevRef = useRef(null)
  const ctxRef = useRef(null)

  /************************************* */
  //Initializing useEffect, don't move
  /************************************* */
  useEffect(() => {
    ctxRef.current = prevRef.current.getContext("2d")
  }, [])

  /************************************* */
  //toggle routine that's tied to the clicking
  //the icon, toggles redux state flag
  /************************************* */

  function toggle() {
    if (props.previewToggle) {
      props.previewTog(false)
    } else {
      props.previewTog(true)
    }
  }

  /************************************* */
  //useEffect routine that's the updating of the
  //redux state value previewImage, which is
  //updated from the canvas component...
  /************************************* */

  useEffect(() => {
    //when preview image updated, clear preview canvas
    ctxRef.current.clearRect(0, 0, 300, 175)
    //canvas is "showing" redraw preview canvas
    if (props.previewToggle) {
      //load image, then draw to canvas on load
      ImageRef.current.onload = function () {
        ctxRef.current.drawImage(ImageRef.current, 0, 0, 300, 175)
      }
      ImageRef.current.src = props.previewImage
    }
  }, [props.previewImage])

  /*************************************/
  //Component JSX
  /*************************************/

  return (
    <div className={"card " + (props.previewToggle ? "" : "card-hid")}>
      <div className="card-controls">
        {props.previewToggle ? "Preview" : ""}
        {props.previewToggle ? <BiHide onClick={toggle} className="PreviewIcon HoverIcon" /> : <BiShow onClick={toggle} className="PreviewIcon HoverIcon" />}
      </div>
      <div className={"prvCanvDiv " + (props.previewToggle ? "" : "prvCanvDivhidden")}>
        <img ref={ImageRef} src="" style={{ display: "none" }} />
        <canvas ref={prevRef}></canvas>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    previewToggle: state.previewToggle,
    previewImage: state.previewImage,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    previewTog: (payload) => dispatch(previewTog(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewCard)
