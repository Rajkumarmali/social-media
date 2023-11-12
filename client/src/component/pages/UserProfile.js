import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null)

    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [showfollow, setShowfollow] = useState(state && state.following ? !state.following.includes(userid) : true)
    //console.log(userid)
    useEffect(() => {
        fetch(`http://localhost:3001/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                //console.log(result)
                setUserProfile(result);
            })
            .catch(error => {
                console.error("Error fetching user profile:", error);
            });
    }, [userid]);

    const followUser = () => {
        fetch('http://localhost:3001/user/follow', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json()).then(data => {
            //  console.log(data.followedUserResult.followers)
            dispatch({
                type: "UPDATE",
                payload: {
                    following: data.currentUserResult.following,
                    followers: data.currentUserResult.followers
                }
            });
            localStorage.setItem("user", JSON.stringify(data))
            setUserProfile((preState) => {
                return {
                    ...preState,
                    user: {
                        ...preState.user,
                        followers: [...preState.user.followers, data._id]
                    }
                }
            })
            setShowfollow(false)
        })
    }
    const unfollowUser = () => {
        fetch('http://localhost:3001/user/unfollow', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json()).then(data => {
            // console.log(data)
            dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
            localStorage.setItem("user", JSON.stringify(data))
            setUserProfile((preState) => {
                const newFollower = preState.user.followers.filter(item => item !== data._id)
                return {
                    ...preState,
                    user: {
                        ...preState.user,
                        followers: newFollower
                    }
                }
            })
            setShowfollow(true)
        })
    }

    return (
        <>
            {userProfile ? <div style={{ maxWidth: "550px", margin: "0px auto" }}>
                <div style={{ display: 'flex', justifyContent: "space-around", margin: "18px 0px", borderBottom: '1px solid grey' }}>
                    <div>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={userProfile.user.pic} alt='' />
                    </div>
                    <div>
                        <h4>{userProfile.user.name}</h4>
                        <h5>{userProfile.user.email}</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6>{userProfile.posts.length} posts</h6>
                            <h6>{userProfile.user.followers.length} followers</h6>
                            <h6>{userProfile.user.following.length} following</h6>
                        </div>
                        {showfollow ?
                            <button style={{ margin: "10px" }} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => followUser()}>Follow </button> :
                            <button style={{ margin: "10px" }} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => unfollowUser()}>UnFollow </button>
                        }
                    </div>
                </div>
                {<div className='gallery'>
                    {
                        userProfile.posts.map(item => {
                            return (
                                <img key={item._id} className='item' src={item.photo} alt='NA' />
                            )
                        })
                    }
                </div>}
            </div> : <h1>Loading...</h1>}
        </>
    );
}

export default UserProfile;
