import './app.css';
import caution from '../src/img/cricketaddictor.png';
import ReactMapGL, { Marker, Popup, GeolocateControl } from 'react-map-gl';
import { useEffect, useState } from 'react';
import { Room, Star } from '@material-ui/icons';

import axios from 'axios';
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';
import Red from './components/Red';
import Yellow from './components/Yellow';
import Green from './components/Green';
import Chat from './img/chat.png';
import Send from './img/send.svg';
// import getSentiment from './components/nlp';

import bot from './img/bot.svg';
import user from './img/user.svg';

function App() {
    const myStorage = window.localStorage;
    const [currentUid, setCurrentUid] = useState(myStorage.getItem('userid'));
    const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'));
    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [image, setImage] = useState(null);
    const [desc, setDesc] = useState(null);
    const [star, setStar] = useState(0);
    const [viewport1, setViewport1] = useState({});
    const [viewport, setViewport] = useState({
        latitude: 47.040182,
        longitude: 17.071727,
        zoom: 4,
    });
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [toggleS, setToggleS] = useState(false);

    const [sentimentData, setSentimentData] = useState({
        index: 0,
        ss: 0,
    });
    // const sentimentData = 0;

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
                Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewport({ ...viewport, latitude: lat, longitude: long });
    };

    const handleAddClick = (e) => {
        const [long, lat] = e.lngLat;
        var dist = getDistanceFromLatLonInKm(
            long,
            lat,
            viewport1.longitude,
            viewport1.latitude
        );
        console.log(dist);
        if (dist <= 2) {
            setNewPlace({
                lat,
                long,
            });
        } else {
            alert("You can't tweet out of your range!");
            setNewPlace(null);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        console.log(base64);
        setImage({ base64 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPin = {
            username: currentUser,
            title,
            desc,
            rating: star,
            lat: newPlace.lat,
            long: newPlace.long,
            image: image.base64,
        };

        try {
            const res = await axios.post('/pins', newPin);
            setPins([...pins, res.data]);
            setNewPlace(null);
        } catch (err) {
            console.log(err);
        }
        try {
            const sentiment_response_obj = await axios.post(
                'http://localhost:4000/api/sentiment',
                {
                    data: desc,
                }
            );
            setSentimentData({
                index: 1,
                ss: sentiment_response_obj.data.sentiment,
            });
            // sentimentData = sentiment_response_obj.data.sentiment;
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const getPins = async () => {
            try {
                const allPins = await axios.get('/pins');
                setPins(allPins.data);
            } catch (err) {
                console.log(err);
            }
        };
        getPins();
    }, []);

    const handleDelete = async (e) => {
        e.preventDefault();
        console.log(e.currentTarget.getAttribute('data-column'));

        let id = e.currentTarget.getAttribute('data-column');
        try {
            const res = await axios.delete('/pins/' + id);
            console.log(res.data);
            setPins(res.data);
            setNewPlace(null);
        } catch (err) {
            console.log(err);
        }
    };

    const handleLike = async (e) => {
        e.preventDefault();
        //try to use full paths because simple delete isnt working
        console.log(e.currentTarget.getAttribute('data-column'));

        let id = e.currentTarget.getAttribute('data-column');
        let uid = currentUid;
        try {
            const res = await axios.put('/pins/like/' + id + '/' + uid);
            console.log(res.data);
            setPins(res.data);
            setNewPlace(null);
        } catch (err) {
            console.log(err);
        }
    };
    const handleDislike = async (e) => {
        e.preventDefault();
        //try to use full paths because simple delete isnt working
        console.log(e.currentTarget.getAttribute('data-column'));

        let id = e.currentTarget.getAttribute('data-column');
        let uid = currentUid;
        try {
            const res = await axios.put('/pins/dislike/' + id + '/' + uid);
            console.log(res.data);
            setPins(res.data);
            setNewPlace(null);
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        myStorage.removeItem('user');
    };

    navigator.geolocation.getCurrentPosition((pos) => {
        setViewport1({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
        });
        setViewport({
            ...viewport,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            zoom: 15,
        });
    });

    navigator.geolocation.getCurrentPosition((pos) => {
        setViewport1({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
        });
        setViewport({
            ...viewport,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            zoom: 15,
        });
    });

    /* CHAT GPT SCRIPT */

    const form = document.querySelector('form');
    const chatContainer = document.querySelector('#chat_container');

    let loadInterval;

    function loader(element) {
        element.textContent = '';

        loadInterval = setInterval(() => {
            element.textContent += '.';

            if (element.textContent === '....') {
                element.textContent = '';
            }
        }, 300);
    }

    function typeText(element, text) {
        let index = 0;

        let interval = setInterval(() => {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 20);
    }

    function generateUniqueId() {
        const timestamp = Date.now();
        const randomNumber = Math.random();
        const hexadecimalString = randomNumber.toString(16);

        return `id-${timestamp}-${hexadecimalString}`;
    }

    function chatStripe(isAi, value, uniqueId) {
        return `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `;
    }

    const handleSubmitGPT = async (e) => {
        e.preventDefault();

        const data = new FormData(form);

        chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

        form.reset();

        const uniqueId = generateUniqueId();
        chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);

        chatContainer.scrollTop = chatContainer.scrollHeight;

        const messageDiv = document.getElementById(uniqueId);

        loader(messageDiv);

        const response = await fetch('http://localhost:5000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: data.get('prompt'),
            }),
        });

        clearInterval(loadInterval);
        messageDiv.innerHTML = ' ';

        if (response.ok) {
            const data = await response.json();
            const parsedData = data.bot.trim();

            typeText(messageDiv, parsedData);
        } else {
            const err = await response.text();

            messageDiv.innerHTML = 'Something went wrong';
            alert(err);
        }
    };
    function onKeyGPT(e) {
        if (e.keyCode === 13) {
            handleSubmitGPT(e);
        }
    }
    /* CHAT GPT END SCRIPT */

    function toggleChatbox() {
        toggleS ? setToggleS(false) : setToggleS(true);
    }

    return (
        <div className="parent" style={{ height: '100vh', width: '100%' }}>
            <div className="find-location">
                <img alt="caution" src={caution} style={{ width: '20px' }} />
                <p>Please press this button for accurate position.</p>
            </div>
            <div className="floating-chat" onClick={toggleChatbox}>
                <img src={Chat} alt="Chat" />
            </div>
            <div
                className={toggleS ? 'Chat show-chatbox' : 'Chat hide-chatbox'}
            >
                <div id="chat_container"></div>

                <form
                    onSubmit={handleSubmitGPT}
                    onKeyUp={onKeyGPT}
                    className="formGPT"
                >
                    <textarea
                        name="prompt"
                        rows="1"
                        cols="1"
                        placeholder="Ask a question"
                    ></textarea>
                    <button type="submit" className="submitGPT">
                        Send
                        <img src={Send} alt="send" style={{ width: '10px' }} />
                    </button>
                </form>
            </div>

            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken="pk.eyJ1IjoiYXl1c2gtMTMzNyIsImEiOiJjbGc2eGdreTYwMHllM3VtY3M3d3ZoN2JlIn0.sBPWse3g5A047ZmXJ_a1sg"
                width="100%"
                height="100%"
                transitionDuration="200"
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onViewportChange={(viewport) => setViewport(viewport)}
                onDblClick={currentUser && handleAddClick}
            >
                <GeolocateControl
                    positionOptions={{ enableHighAccuracy: true }}
                    trackUserLocation={true}
                    showUserHeading={true}
                />

                {pins.map((p, index) => (
                    <>
                        <Marker
                            latitude={p.lat}
                            longitude={p.long}
                            offsetLeft={-3.5 * viewport.zoom}
                            offsetTop={-7 * viewport.zoom}
                            key={index}
                        >
                            <div className="sentiment-box">
                                {sentimentData.ss === 1 ? (
                                    <Green />
                                ) : sentimentData.ss === 0 ? (
                                    <Yellow />
                                ) : (
                                    <Red />
                                )}
                            </div>
                            <Room
                                style={{
                                    fontSize: 7 * viewport.zoom,
                                    color:
                                        currentUser === p.username
                                            ? 'tomato'
                                            : 'slateblue',
                                    cursor: 'pointer',
                                }}
                                onClick={() =>
                                    handleMarkerClick(p._id, p.lat, p.long)
                                }
                            />
                        </Marker>
                        {p._id === currentPlaceId && (
                            <Popup
                                key={p._id}
                                latitude={p.lat}
                                longitude={p.long}
                                closeButton={true}
                                closeOnClick={false}
                                onClose={() => setCurrentPlaceId(null)}
                                anchor="left"
                            >
                                <div className="card">
                                    <label>Image</label>
                                    <img
                                        style={{ width: 150 }}
                                        src={p.image}
                                        alt={'hi'}
                                    />
                                    <div className="line"></div>
                                    <label>Place</label>
                                    <h4 className="place">{p.title}</h4>
                                    <label>Review</label>
                                    <p className="desc">{p.desc}</p>
                                    <label>Rating</label>
                                    <div className="stars">
                                        {Array(p.rating).fill(
                                            <Star className="star" />
                                        )}
                                    </div>
                                    <label>Information</label>
                                    <span className="username">
                                        Created by <b>{p.username}</b>
                                    </span>
                                    <span>{p.likes.length} Likes</span>
                                    {p.username === currentUser && (
                                        <button
                                            type="submit"
                                            className="submitButton"
                                            onClick={handleDelete}
                                            data-column={p._id}
                                        >
                                            Delete
                                        </button>
                                    )}

                                    <span className="likeunlike">
                                        {!p.likes.includes(currentUid) && (
                                            <div>
                                                <button
                                                    className="likeButton"
                                                    data-column={p._id}
                                                    onClick={handleLike}
                                                >
                                                    Like
                                                </button>
                                                <button
                                                    className="DislikeButton1"
                                                    data-column={p._id}
                                                >
                                                    Dislike
                                                </button>
                                            </div>
                                        )}

                                        {p.likes.includes(currentUid) && (
                                            <div>
                                                <button
                                                    className="LikeButton1"
                                                    data-column={p._id}
                                                    onClick={handleLike}
                                                >
                                                    Like
                                                </button>

                                                <button
                                                    className="DislikeButton"
                                                    data-column={p._id}
                                                    onClick={handleDislike}
                                                >
                                                    Dislike
                                                </button>
                                            </div>
                                        )}
                                    </span>

                                    <span className="date">
                                        {format(p.createdAt)}
                                    </span>
                                </div>
                            </Popup>
                        )}
                    </>
                ))}
                {newPlace && (
                    <>
                        <Marker
                            latitude={newPlace.lat}
                            longitude={newPlace.long}
                            offsetLeft={-3.5 * viewport.zoom}
                            offsetTop={-7 * viewport.zoom}
                        >
                            <Room
                                style={{
                                    fontSize: 7 * viewport.zoom,
                                    color: 'tomato',
                                    cursor: 'pointer',
                                }}
                            />
                        </Marker>
                        <Popup
                            latitude={newPlace.lat}
                            longitude={newPlace.long}
                            closeButton={true}
                            closeOnClick={false}
                            onClose={() => setNewPlace(null)}
                            anchor="left"
                        >
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="file"
                                        lable="Image"
                                        name="myFile"
                                        id="file-upload"
                                        accept=".jpeg, .png, .jpg"
                                        onChange={(e) => handleFileUpload(e)}
                                    />
                                    <label>Title</label>
                                    <input
                                        placeholder="Enter a title"
                                        autoFocus
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />
                                    <label>Description</label>
                                    <textarea
                                        placeholder="Say us something about this place."
                                        onChange={(e) =>
                                            setDesc(e.target.value)
                                        }
                                    />
                                    <label>Rating</label>
                                    <select
                                        onChange={(e) =>
                                            setStar(e.target.value)
                                        }
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                    <button
                                        type="submit"
                                        className="submitButton"
                                    >
                                        Add Pin
                                    </button>
                                </form>
                            </div>
                        </Popup>
                    </>
                )}
                {currentUser ? (
                    <button className="button logout" onClick={handleLogout}>
                        Log out
                    </button>
                ) : (
                    <div className="buttons">
                        <button
                            className="button login"
                            onClick={() => setShowLogin(true)}
                        >
                            Log in
                        </button>
                        <button
                            className="button register"
                            onClick={() => setShowRegister(true)}
                        >
                            Register
                        </button>
                    </div>
                )}
                {showRegister && <Register setShowRegister={setShowRegister} />}
                {showLogin && (
                    <Login
                        setShowLogin={setShowLogin}
                        setCurrentUser={setCurrentUser}
                        myStorage={myStorage}
                    />
                )}
            </ReactMapGL>
        </div>
    );
}

export default App;

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}
