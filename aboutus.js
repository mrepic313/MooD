import React from "react";
import "./AboutUs.css"; 

export default function AboutUs() {
    const aboutUsInfo = 
    "Welcome! We aim to make your life better with our personalized journals and AI-powered chatbot."

    return (
        <div className="about-us-container">
            <h1>About Us</h1>
            <p>{aboutUsInfo}</p>
            <div className="developer-images">
                <img className="image-placeholder" alt = "Dev1Image" height = "200px" src=""
            ></img>
                <img className="image-placeholder" alt = "Dev2Image" height = "200px" src=""
            ></img>
               <img className="image-placeholder" alt = "Dev3Image" height = "200px" src=""
            ></img>
                <img className="image-placeholder" alt = "Dev3Image" height = "200px" src=""
            ></img>
            </div>
            <div className="developer-images">
                <div>Gavin Wang</div>
                <div>Frank Sun</div>
                <div>Patrick Sun</div>
                <div>Joshua Hoang</div>
            </div>
        </div>
    );
}