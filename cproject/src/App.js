import './App.css';
import Home from './home/Home.js'
import Home2 from './home/Home2.js'
import Login from './container/login/Login.js'
import Select from './select/Select'
import UserHome from './user/UserHome'
import UserMain from './user/userMain/UserMain'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Notice from './user/notice/Notice'
import Project from './user/project/Project'
import Schedule from './user/schedule/Schedule'
import Survety from './user/survery/Survery'
import NoneLogin from './err/errNoneLogin';

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Select />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/home" element={<Home />}></Route>
                    <Route path="/home2" element={<Home2 />}></Route>
                    <Route path="/user" element={<UserHome />}>
                        <Route path="" element={<UserMain />}></Route>
                        <Route path="notice" element={<Notice />}></Route>
                        <Route path="project" element={<Project />}></Route>
                        <Route path="schedule" element={<Schedule />}></Route>
                        <Route path="survety" element={<Survety />}></Route>
                    </Route>

                    <Route path="/errNoneLogin" element={<NoneLogin />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;