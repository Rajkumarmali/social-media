import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const Home = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('http://localhost:3001/post/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json()).then(result => {
            //  console.log(result);
            setData(result.posts)
        })
    }, [])

    const likePost = (id) => {
        fetch('http://localhost:3001/post/like ', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json()).then(result => {
            // console.log(result)
            const newdata = data.map(item => {
                if (item._id === result._id) {
                    return result
                }
                else
                    return item
            })
            setData(newdata);
        }).catch(err => {
            console.log(err);
        })
    }
    const unlikePost = (id) => {
        fetch('http://localhost:3001/post/unlike ', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json()).then(result => {
            // console.log(result)
            const newdata = data.map(item => {
                if (item._id === result._id)
                    return result
                else
                    return item
            })
            setData(newdata);
        }).catch(err => {
            console.log(err)
        })
    }

    const makeComment = (text, postId) => {
        fetch('http://localhost:3001/post/comment', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json()).then(result => {
            // console.log(result);
            const newData = data.map(item => {
                if (item._id === result._id)
                    return result
                else
                    return item
            })
            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }
    const deletPost = (postId) => {
        fetch(`http://localhost:3001/post/deletpost/${postId}`, {
            method: 'delete',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json()).then(result => {
            // console.log(result)
            const newData = data.filter(item => {
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    return (
        <div className='home'>
            {
                data.map(item => {
                    return (
                        <div className='card home-card' key={item._id}>
                            <h5 style={{ marginLeft: "5px", display: "flex", alignItems: "center" }}>
                                <img style={{ width: "24px", height: "24px", borderRadius: "80px", marginRight: "5px" }} src={item.postedBy.pic} alt='' />
                                <Link style={{ paddingBottom: '6px' }} to={item.postedBy._id !== state._id ? `profile/${item.postedBy._id}` : '/profile'}>  {item.postedBy.name}</Link>
                                {item.postedBy._id === state._id && <i className="material-icons" style={{ marginLeft: "auto" }} onClick={() => deletPost(item._id)}>delete</i>}
                            </h5>
                            <div className='card-image'>
                                <img src={item.photo} alt='NA' />
                            </div>
                            <div className='card-content'>
                                {/* <i className="material-icons" style={{ color: "red" }}>favorite</i> */}
                                {
                                    item.likes.includes(state._id) ?
                                        <i className="material-icons" style={{ color: "red" }} onClick={() => { unlikePost(item._id) }}>favorite</i> :
                                        <i className="material-icons" onClick={() => { likePost(item._id) }}>favorite_border</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy.name}</span>  {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type='text' placeholder='add a comment' />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default Home;
