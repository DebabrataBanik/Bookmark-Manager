import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

const App = () => {
  return (
    <div className="wrapper">
      <Header />
      <div className="main-wrapper">
        <Sidebar />
      </div>
    </div>
  )
}

export default App