import React, { useEffect } from "react"
import Header from "./Header"
import Container from "./Container"
import Modal from "./Modal"
import { connect } from "react-redux"
import { goodAlert, errorAlert } from "../Redux"
import "./styles.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function Wrapper(props) {
  useEffect(() => {
    if (props.goodAlertMessage.length != 0) {
      toast.success(props.goodAlertMessage)
      props.goodAlert("")
    }
  }, [props.goodAlertMessage])

  useEffect(() => {
    if (props.errorAlertMessage.length != 0) {
      toast.error(props.errorAlertMessage)
      props.errorAlert("")
    }
  }, [props.errorAlertMessage])

  if (props.isLoading) {
    return <div className="loader">Loading...</div>
  }
  return (
    <div className="wrapper">
      {props.showModal ? <Modal /> : null}
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={true} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <Header />
      <Container />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    showModal: state.showModal,
    isLoading: state.isLoading,
    goodAlertMessage: state.goodAlertMessage,
    errorAlertMessage: state.errorAlertMessage,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    goodAlert: (payload) => dispatch(goodAlert(payload)),
    errorAlert: (payload) => dispatch(errorAlert(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)
