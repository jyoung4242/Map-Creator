import "./App.css"

import Wrapper from "./Components/Wrapper"
import { Provider } from "react-redux"
import store from "./Redux/store"

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Wrapper />
      </div>
    </Provider>
  )
}

export default App
