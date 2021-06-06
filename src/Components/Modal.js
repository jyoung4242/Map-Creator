import React, { useRef } from "react"
import { connect } from "react-redux"
import { showModal, updateTileset, deleteTileset, isLoading, tileSelectEnable } from "../Redux"
import img from "./initimage.png"

function Modal(props) {
  const imgRef = useRef(null)
  const fileRef = useRef(null)
  const inputRef = useRef(null)

  var selectedTset, filename, selectedLayer

  /********************************/
  //handleClick, this is event triggered routine from 'Select' button
  //that takes either launches the file selection routine for updating
  //the tileset, or selects the tileset to be deleted
  /********************************/

  function handleClick() {
    // in state if the Modal is set to update the tileset (true) or
    // to delete the tileset (false)
    if (props.ModalUpdate) {
      //update tileset
      //loads file input dialogue to select new tileset
      fileRef.current.click()
    } else {
      //delete tileset
      //confirmation of desire to delete
      var rslt = window.confirm("Are you sure you wish to delete this item?")
      if (rslt) {
        var tstarray = inputRef.current.value.split(" ")
        selectedTset = parseInt(tstarray[1])
        //get tileset number, and pass to redux action callback
        props.deleteTileset(selectedTset)
        //close the Modal
        props.showModal(false)
        props.tileSelectEnable(false)
      } else {
        //close the modal, do nothing
        props.showModal(false)
      }
    }
  }

  //Cancel Button clicked, do nothing but close the Modal
  function handleCancel() {
    props.showModal(false)
  }

  /***************************** */
  //function that runs after file loads in file
  //input
  /***************************** */
  function handleFile(e) {
    const content = e.target.result
    //need to identify correct index of Tileset selected
    //selectedTset is number of Tset
    var Tileset = {
      Layer: selectedLayer,
      TSet: selectedTset,
      filename: filename,
      imgsrc: content,
    }
    //series of redux action callbacks
    //first pass the Tileset object to the updateTileset callback
    props.updateTileset({ Tileset, selectedTset })
    //enable the tilset to be redrawn
    props.tileSelectEnable(false)
    //close the modal
    props.showModal(false)
    //close the '...' screen
    props.isLoading(false)
  }

  /***************************** */
  //function that runs when file is selected
  //
  /***************************** */

  function handleLoad(e) {
    //get the file information
    let file = e.target.files[0]
    filename = file.name
    //use redux state for showing the '...' loading screen
    props.isLoading(true)
    setTimeout(() => {
      var z //Bogus Delay so you actually see the ...
      z = 1
    }, 250)
    //read the file in, fires off the handlFile when complete
    let fileData = new FileReader()
    fileData.onloadend = handleFile
    fileData.readAsDataURL(file)
  }

  //function that runs when the dropdown control is used
  function handleSelect(event) {
    //parse out the tset number
    var tstarray = event.target.value.split(" ")
    selectedTset = parseInt(tstarray[1])
    //run the .filter against array to grab the tileset to update
    var selectedTileset = props.Tilesets.filter((tileset) => tileset.Tileset.TSet === selectedTset)
    selectedLayer = selectedTileset[0].Tileset.Layer
    //set the image on left to the selected Tset, for coolness factor... flair
    imgRef.current.src = selectedTileset[0].Tileset.imgsrc
  }

  /*************************************/
  //Component JSX
  /*************************************/

  return (
    <div className="modal_background">
      <div className="modal-body">
        <div className="modal_header">{props.ModalUpdate ? "UPDATE TILESET" : "DELETE TILESET"}</div>

        <img ref={imgRef} alt=" " src={img} className="modal-image"></img>
        <div className="modal-content">
          <input onChange={(e) => handleLoad(e)} ref={fileRef} accept=".tset" type="file" style={{ display: "none" }} />
          <label htmlFor="tset">
            Select Tileset
            <input spellCheck="false" ref={inputRef} autoCorrect="off" onChange={(e) => handleSelect(e)} className="modal-input" type="select" list="tsets" name="tset" id="tset" />
            <datalist id="tsets">
              {props.Tilesets.map((Tst, key) => {
                var str = `Tileset: ${Tst.Tileset.TSet} Filename: ${Tst.Tileset.filename}`

                return <option key={Tst.Tileset.TSet} item={key} value={str} />
              })}
            </datalist>
          </label>

          <button className="modal-button" onClick={handleClick}>
            Select
          </button>
          <button className="modal-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    Tilesets: state.Tilesets,
    Layer: state.Layer,
    ModalUpdate: state.ModalUpdate,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (payload) => dispatch(showModal(payload)),
    updateTileset: (payload) => dispatch(updateTileset(payload)),
    deleteTileset: (payload) => dispatch(deleteTileset(payload)),
    isLoading: (payload) => dispatch(isLoading(payload)),
    tileSelectEnable: (payload) => dispatch(tileSelectEnable(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
