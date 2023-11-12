import M from 'materialize-css';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';

const Singin = () => {
    const { state, dispatch } = useContext(UserContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const postData = () => {
        fetch("http://localhost:3001/auth/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json()).then(data => {
            //console.log(data)
            if (data.error) M.toast({ html: data.error, classes: "#c62828 red darken-3" })
            else {
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("users", JSON.stringify(data.users))
                dispatch({ type: "USER", payload: data.users })
                M.toast({ html: "Signed in success", classes: "#388e3c green darken-2" })
                navigate('/')
            }
        }).catch(err => {
            console.log(err);
        })
    }
    return (
        <div className='mycard'>
            <div className="card auth-card input-field">
                <h2>SocialMedia</h2>
                <input type='text' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => postData()}>Sign In </button>
                <h5>
                    <Link to='/signup'>Dont have an account ?</Link>
                </h5>
            </div>
        </div>
    );
}

export default Singin;
