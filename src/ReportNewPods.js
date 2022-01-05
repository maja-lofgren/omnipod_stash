import React from "react";
import {useParams } from "react-router-dom";

export const ReportNewPods = () => {
    const { nrofnewpods } = useParams();
    return (
    <>
       <p>nya poddar inlästa: {nrofnewpods} st!</p>
    </>
    )
}