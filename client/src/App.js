import Navbar from "./component/Navbar";
import "./App.css"
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Home from "./component/pages/Home";
import Singin from "./component/pages/Singin";
import Signup from "./component/pages/Signup";
import Profile from "./component/pages/Profile";
import CreatePost from "./component/pages/CreatePost";
import { createContext, useContext, useEffect, useReducer } from "react";
import { initialState, reducer } from "./reducer/userReducer";
import UserProfile from "./component/pages/UserProfile";
import SubUserPost from "./component/pages/SubUserPost";

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("users"))
    // console.log(typeof (user), user)
    if (user) {
      dispatch({ type: "USER", payload: user })
      //  navigate('/')
    } else {
      navigate('/signin')
    }
  }, [])
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Singin />} />
      <Route path="/signup" element={<Signup />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/myfollowingpost" element={<SubUserPost />} />
    </Routes>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
