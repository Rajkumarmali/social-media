import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css'

const Signup = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);

    useEffect(() => {
        if (url)
            uploadField()
    }, [url])
    const uploadPic = () => {
        const uploadPreset = 'social-media';
        const formData = new FormData();
        formData.append('file', image);
        formData.append("cloud_name", "dvx7ayyya")
        formData.append('upload_preset', uploadPreset);
        fetch('https://api.cloudinary.com/v1_1/dvx7ayyya/image/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                //  console.log(data);
                setUrl(data.url);
            })
            .catch(error => {
                console.error('Upload error:', error);
            });
    }

    const uploadField = () => {
        fetch("http://localhost:3001/auth/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic: url
            })
        }).then(res => res.json()).then(data => {
            if (data.error) M.toast({ html: data.error, classes: "#c62828 red darken-3" })
            else {
                M.toast({ html: data.message, classes: "#388e3c green darken-2" })
                navigate('/signin')
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const postData = () => {
        if (image)
            uploadPic();
        else
            uploadField();
    }

    return (
        <div className='mycard'>
            <div className="card auth-card input-field">
                <h2>SocialMedia</h2>
                <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                <input type='text' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload pic</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => postData()}>Sign Up </button>
                <h5>
                    <Link to='/signin'>Already have an account ?</Link>
                </h5>
            </div>
        </div>
    );
}

export default Signup;
