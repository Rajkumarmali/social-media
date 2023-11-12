import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';

const Profile = () => {
    const [mypic, setMypic] = useState([])
    const [foll, setFoll] = useState([])
    const [image, setImage] = useState("");
    const { state, dispatch } = useContext(UserContext)
    //console.log(state.name)
    useEffect(() => {
        fetch('http://localhost:3001/post/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json()).then(result => {
            //console.log(result)
            setFoll(result.user)
            setMypic(result.mypost)
        })
    }, [])

    useEffect(() => {
        if (image) {
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
                    //console.log(data);
                    fetch('http://localhost:3001/user/updatepic', {
                        method: 'put',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json()).then(result => {
                        //    console.log(result)
                        localStorage.setItem("users", JSON.stringify({ ...state, pic: result.pic }))
                        dispatch({ type: "UPDATEPIC", payload: result.pic })
                    })
                })
                .catch(error => {
                    console.error('Upload error:', error);
                });
        }
    }, [image])
    const updatePic = (file) => {
        setImage(file)

    }

    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{ margin: "18px 0px", borderBottom: '1px solid grey' }}>
                <div style={{ display: 'flex', justifyContent: "space-around" }}>
                    <div>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={state ? state.pic : "loading.."} alt='' />
                    </div>
                    <div>
                        <h4>{state?.name}</h4>
                        <h5>{state?.email}</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6>{mypic ? mypic.length : 0} posts</h6>
                            <h6>{foll.followers ? foll.followers.length : "0"} followers</h6>
                            <h6>{foll.following ? foll.following.length : "0"} following</h6>
                        </div>
                    </div>
                </div>
                <div className="file-field input-field" style={{ margin: "10px" }}>
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update Pic</span>
                        <input type="file" onChange={(e) => updatePic(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
            <div className='gallery'>
                {
                    mypic.map(item => {
                        return (
                            <img key={item._id} className='item' src={item.photo} alt='' />
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Profile;
