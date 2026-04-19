import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Feed from "../components/Feed"

const App = () => {
  return (
    <div className="wrapper">
      <Header />
      <div className="main-wrapper">
        <Sidebar />
        <Feed />
      </div>
    </div>
  )
}

export default App