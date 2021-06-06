import React, { useEffect, useRef } from "react"
import { connect } from "react-redux"
import { SideBarToggle, goodAlert, setModalState, isLoading, showModal, appendTileset, updateSelectedLayer, updateSelectedTileset, updateSelectedTile } from "../Redux"
import { BiImageAdd, BiEdit, BiXCircle } from "react-icons/bi"
import ReactTooltip from "react-tooltip"
import "./styles.css"

function TSelect(props) {
  const dropDownRef = useRef()
  const fileRef = useRef()
  var filename

  useEffect(() => {
    var toggler = document.getElementsByClassName("caret")
    var i

    for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function () {
        this.parentElement.querySelector(".nested").classList.toggle("active")
        this.classList.toggle("caret-down")
      })
    }
  }, [])

  function handleLayerSelect(event) {
    //alert(event.target.id)
    var layer = event.target.id.split("Layer")
    //alert(layer[1])
    props.updateSelectedLayer(parseInt(layer[1]))
  }

  function handleUpdate() {
    if (props.Tilesets.length) {
      props.setModalState(true) //true = update false = delete
      props.showModal(true)
    }
  }

  function handleDelete() {
    if (props.Tilesets.length) {
      props.setModalState(false) //true = update false = delete
      props.showModal(true)
    }
  }

  function handleFile(e) {
    const content = e.target.result

    var Tileset = {
      Layer: props.Layer,
      filename: filename,
      TSet: props.tsetIndex,
      imgsrc: content,
    }
    //console.log(Tileset)
    props.appendTileset({ Tileset })
    props.isLoading(false)
    props.goodAlert("Success, Tileset Loaded")
  }

  function handleLoad(e) {
    let file = e.target.files[0]
    filename = file.name
    props.isLoading(true)
    setTimeout(() => {
      let fileData = new FileReader()
      fileData.onloadend = handleFile
      fileData.readAsDataURL(file)
    }, 500)
  }

  function handleTsetSelection(event) {
    var target = event.target.id
    const newLayer = event.target.parentNode.getAttribute("data-value")
    props.updateSelectedLayer(parseInt(newLayer))
    props.updateSelectedTileset(parseInt(target))
  }

  function triggerClick() {
    fileRef.current.click()
  }

  return (
    <div className={"selectTset " + (props.sideBarToggle ? "sidebarhidden" : "")}>
      <div className="selectTsetTitle">
        <div> Load Tilesets</div>
        <div>
          <span className="Layertitle">{props.Tilesets ? `Active Layer - ${props.Layer}` : ""}</span>
          <input ref={fileRef} onChange={(e) => handleLoad(e)} type="file" accept=".tset" style={{ display: "none" }} />
        </div>

        <div className="iconDiv">
          <a data-for="Import" data-tip="Import Tileset" href="/#" onClick={triggerClick}>
            <BiImageAdd className="contro_icon HoverIcon " />
          </a>
          <ReactTooltip place="top" id="Import" effect="solid" />

          <a data-for="Update" data-tip="Update Tileset" href="/#" onClick={handleUpdate}>
            <BiEdit className="contro_icon HoverIcon " />
          </a>
          <ReactTooltip place="top" id="Update" effect="solid" />

          <a data-for="Delete" data-tip="Delete Tileset" href="/#" onClick={handleDelete}>
            <BiXCircle className="contro_icon HoverIcon " />
          </a>
          <ReactTooltip place="top" id="Delete" effect="solid" />
        </div>
      </div>

      <div className="selectMenu">
        <ul id="myUL">
          <li>
            <span id="Layer0" onClick={(e) => handleLayerSelect(e)} ref={dropDownRef} className="caret HoverIcon">
              Layer 0 - Floor
            </span>
            <ul className="nested HoverIcon">
              {props.Tilesets.filter((tileset) => tileset.Tileset.Layer === 0).map((filteredTileset) => {
                return (
                  <a data-value={0} onClick={(e) => handleTsetSelection(e)}>
                    <li id={filteredTileset.Tileset.TSet} key={filteredTileset.Tileset.TSet}>
                      {filteredTileset.Tileset.filename} : TSet ID {filteredTileset.Tileset.TSet}
                    </li>
                  </a>
                )
              })}
            </ul>
          </li>
          <li>
            <span id="Layer1" onClick={(e) => handleLayerSelect(e)} ref={dropDownRef} className="caret HoverIcon">
              Layer 1 - Walls
            </span>
            <ul className="nested HoverIcon">
              {props.Tilesets.filter((tileset) => tileset.Tileset.Layer === 1).map((filteredTileset) => {
                return (
                  <a data-value={1} onClick={(e) => handleTsetSelection(e)}>
                    <li id={filteredTileset.Tileset.TSet} key={filteredTileset.Tileset.TSet}>
                      {filteredTileset.Tileset.filename} : TSet ID {filteredTileset.Tileset.TSet}
                    </li>
                  </a>
                )
              })}
            </ul>
          </li>
          <li>
            <span id="Layer2" onClick={(e) => handleLayerSelect(e)} ref={dropDownRef} className="caret HoverIcon">
              Layer 2 - Objects
            </span>
            <ul className="nested HoverIcon ">
              {props.Tilesets.filter((tileset) => tileset.Tileset.Layer === 2).map((filteredTileset) => {
                return (
                  <a data-value={2} onClick={(e) => handleTsetSelection(e)}>
                    <li id={filteredTileset.Tileset.TSet} key={filteredTileset.Tileset.TSet}>
                      {filteredTileset.Tileset.filename} : TSet ID {filteredTileset.Tileset.TSet}
                    </li>
                  </a>
                )
              })}
            </ul>
          </li>
          <li>
            <span id="Layer3" onClick={(e) => handleLayerSelect(e)} ref={dropDownRef} className="caret HoverIcon">
              Layer 3 - Canopy
            </span>
            <ul className="nested HoverIcon">
              {props.Tilesets.filter((tileset) => tileset.Tileset.Layer === 3).map((filteredTileset) => {
                return (
                  <a data-value={3} onClick={(e) => handleTsetSelection(e)}>
                    <li id={filteredTileset.Tileset.TSet} key={filteredTileset.Tileset.TSet}>
                      {filteredTileset.Tileset.filename} : TSet ID {filteredTileset.Tileset.TSet}
                    </li>
                  </a>
                )
              })}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    sideBarToggle: state.sideBarToggle,
    Tilesets: state.Tilesets,
    Layer: state.Layer,
    tsetIndex: state.tsetIndex,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    SideBarToggle: (payload) => dispatch(SideBarToggle(payload)),
    appendTileset: (payload) => dispatch(appendTileset(payload)),
    updateSelectedLayer: (payload) => dispatch(updateSelectedLayer(payload)),
    updateSelectedTileset: (payload) => dispatch(updateSelectedTileset(payload)),
    updateSelectedTile: (payload) => dispatch(updateSelectedTile(payload)),
    showModal: (payload) => dispatch(showModal(payload)),
    setModalState: (payload) => dispatch(setModalState(payload)),
    isLoading: (payload) => dispatch(isLoading(payload)),
    goodAlert: (payload) => dispatch(goodAlert(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TSelect)
