import {Route, Routes } from "react-router";
import { MainPage } from "./components/pages/MainPage/MainPage";



function App() {
  return (
    <div className="wrapper">
      <Routes>
        <Route path='/' element = {<MainPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
