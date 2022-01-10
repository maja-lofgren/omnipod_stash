import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function Mainpage({ Typ }) {
    const navigate = useNavigate();
    const [nrToAdd, setNrToAdd] = useState();
    const [nrTotal, setNrTotal] = useState();
    const [totalCount, setTotalCount] = useState("-");
    const [buttonActive, setbuttonActive] = useState(true);

    useEffect(async ()=>{
        setTotalCount("-")
        await getCount(); 
    },[navigate]) //run only on navigation change!

    var otherSite = "sensor";
    if (Typ == "sensor") {
        otherSite = "pods";
    }

    const updateCountAddition = async (e) => {
        try {
            var add = nrToAdd;
            if (e != null) {
                add = e;
            }
            console.log("adding " + add + "pods");
            setNrToAdd("");
            setbuttonActive(false);
            if (isNaN(+add)) {
                console.log("not a number!");
                alert("Not a number!")
                return;
            }
            await axios.get('/addto' + Typ + 'count/' + add);
            await getCount();
        } catch (e) {
            console.log(e);
        } finally {
            setbuttonActive(true);
        }
    };
    const setCountTotal = async () => {
        try {
            let countTotal = nrTotal;
            setNrTotal("");
            setbuttonActive(false);

            if (isNaN(+countTotal)) {
                console.log("not a number!");
                alert("Not a number!")
                return;
            }
            const res = await axios.get('/set' + Typ + 'count/' + countTotal);
            await getCount();
        } catch (e) {
            console.log(e);
        } finally {
            setbuttonActive(true);
        }
    };
    const getCount = async () => {
        try {
            console.log("getCount of: " + Typ);
            const res = await axios.get('/get' + Typ + 'count');
            if (Typ == "pod") {
                if (res.data.podCount !== undefined) {
                    setTotalCount(res.data.podCount);
                }
            } else {
                if (res.data.sensorCount !== undefined) {
                    setTotalCount(res.data.sensorCount);
                }
            }

        } catch (e) {
            console.log(e);
        }
    };
    
    
    return (
        <>
            

            <text style={{ fontSize: "40px" }}>
                {Typ}-count
            </text>
            <text style={{ fontSize: "70px" }}>
                {totalCount}
            </text>

            <br /><br />

            <div style={{ textAlign: 'center' }}>
                <div title={"adds x-number of " + Typ + "s to stash (negative or positive number)"}>
                    <p style={{marginBottom:'-20px',marginTop:'-10px'}}>Register new {Typ}s</p>
                    <br />
                    <input type="text"
                        autoFocus
                        value={nrToAdd}
                        onChange={(e) => setNrToAdd(e.target.value)}
                        style={{ width: '40px', textAlign: 'center' }}

                    />
                    <button
                        onClick={() => updateCountAddition(null)}
                        disabled={!buttonActive}
                        style={{ width: '200px' }}
                    >Add {Typ}s</button>
                </div>
                <br />
                <div title={"Sets current number of " + Typ + "s in stash (positive number)"}>
                <p style={{marginBottom:'-20px',marginTop:'-10px'}}>Set total {Typ}-count</p>
                    <br />
                    <input type="text"
                        value={nrTotal}
                        onChange={(e) => setNrTotal(e.target.value)}
                        style={{ width: '40px', textAlign: 'center' }}

                    />
                    <button
                        onClick={setCountTotal}
                        disabled={!buttonActive}
                        style={{ width: '200px' }}
                    >Set {Typ}s</button>
                </div>
            </div>
            <br />
            <div title={"Same as Add " + Typ + "s above, but with predefined values"}>
                <p style={{ textAlign: 'center' }}> Quick-add</p>
                <button onClick={() => updateCountAddition(-1)} disabled={!buttonActive}>-1</button>
                <button onClick={() => updateCountAddition(1)} disabled={!buttonActive}>1</button>
                <br />
                <br />
                <button onClick={() => updateCountAddition(5)} disabled={!buttonActive}>5</button>
                <button onClick={() => updateCountAddition(10)} disabled={!buttonActive}>10</button>
            </div>

            <br />
            <br />
            <button onClick={() => navigate('/' + otherSite)}>
                Change to {otherSite}
            </button>
            <br />
            {/* <text>Email to: {process.env.EMAIL_TO}</text>
            <text>Send email when count is less than: {Typ == "pods" ? process.env.PODLIMIT : process.env.SENSORLIMIT}</text> */}
        </>
    )
}