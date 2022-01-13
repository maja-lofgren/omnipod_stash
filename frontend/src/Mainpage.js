import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function Mainpage({ Typ }) {
    const navigate = useNavigate();
    const [nrToAdd, setNrToAdd] = useState();
    const [nrTotal, setNrTotal] = useState();
    const [totalCount, setTotalCount] = useState("-");
    const [buttonActive, setbuttonActive] = useState(true);

    useEffect(async () => {
        setTotalCount("-")
        await getCount();
    }, [navigate]) //run only on navigation change!

    const updateCountAddition = async (e) => {
        try {
            var add = nrToAdd;
            if (e != null) {
                add = e;
            }
            console.log("adding " + add);
            setNrToAdd("");
            setbuttonActive(false);
            if (isNaN(+add)) {
                console.log("not a number!");
                alert("Not a number!")
                return;
            }
            await axios.get('/addtocount', { params: { typ: Typ, nr: add, source='gui', id: new Date() } });
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
            const res = await axios.get('/setcount', { params: { typ: Typ, nr: countTotal, source='gui', id: new Date() } });
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
            console.log('/getcount/' + Typ);
            const res = await axios.get('/getcount/' + Typ);    
            
            if (res.data.Count !== undefined) {
                console.log("Count: " + res.data.Count);
                setTotalCount(res.data.Count);
            }

        } catch (e) {
            console.log(e);
        }
    };


    return (
        <>
            <div>
                <button
                    onClick={() => navigate('/pod')}
                    disabled={Typ == "pod"}
                    className="tabBtn">Pods</button>
                <button
                    onClick={() => navigate('/sensor')}
                    disabled={Typ == "sensor"}
                    className="tabBtn">Sensors</button>
                <button
                    onClick={() => navigate('/insulin')}
                    disabled={Typ == "insulin"}
                    className="tabBtn">Insulin</button>
            </div>
            <br />
            <text style={{ fontSize: "40px" }}>
               In storage
            </text>
            <text style={{ fontSize: "70px" }}>
                {totalCount}
            </text>

            <br /><br />

            <div style={{ textAlign: 'center' }}>
                <div title={"adds x-number of " + Typ + "s to stash (negative or positive number)"}>
                    <p style={{ marginBottom: '-20px', marginTop: '-10px' }}>Add/Remove {Typ}s</p>
                    <br />
                    <input type="text"
                        autoFocus
                        value={nrToAdd}
                        onChange={(e) => setNrToAdd(e.target.value)}
                    />
                    <button
                        onClick={() => updateCountAddition(null)}
                        disabled={!buttonActive} >OK</button>
                </div>
                <br />
                <div title={"Sets current number of " + Typ + "s in stash (positive number)"}>
                    <p style={{ marginBottom: '-20px', marginTop: '-10px' }}>Set total nr of {Typ}s</p>
                    <br />
                    <input type="text"
                        value={nrTotal}
                        onChange={(e) => setNrTotal(e.target.value)}
                    />
                    <button
                        onClick={setCountTotal}
                        disabled={!buttonActive} >OK</button>
                </div>
            </div>
            <br />
            <div title={"Same as Add " + Typ + "s above, but with predefined values"}>
                <p style={{ textAlign: 'center' }}> Quick-alter</p>
                <button onClick={() => updateCountAddition(-1)} disabled={!buttonActive}>-1</button>
                <button onClick={() => updateCountAddition(1)} disabled={!buttonActive}>1</button>
                <br />
                <br />
                <button onClick={() => updateCountAddition(5)} disabled={!buttonActive}>5</button>
                <button onClick={() => updateCountAddition(10)} disabled={!buttonActive}>10</button>
            </div>

            <br />
            <br />

            <br />
            {/* <text>Email to: {process.env.EMAIL_TO}</text>
            <text>Send email when count is less than: {Typ == "pods" ? process.env.PODLIMIT : process.env.SENSORLIMIT}</text> */}
        </>
    )
}