'use client'
// pages/index.js

import { useState , useEffect} from 'react';
import axios from 'axios';
import gsap from 'gsap'
// Import Google Generative AI library
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyB_GyHWhr9JP70Yam_9tOrlmZNpjNAPEO4"; // Update with your actual API key

// Function to recommend font using Google Generative AI
async function recommendFont() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [
    { text: "so give an array of 15  most trending fonts based on google search response should be in an array only 1 array no triple back ticks just array  which are available on google fonts should be an array the response should be an array no matter what the response should be an array , the response should be an array" }
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  console.log(response.text())
  return response.text();
}
export default function FontRecommendation() {
  const [recommendedFonts, setRecommendedFonts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
    const recommendation = await recommendFont();
    // Split the recommendation string into an array of fonts
    let fontsArray = recommendation.split(',');
    // Remove square brackets and double quotes from each font name
    fontsArray = fontsArray.map(font => font.replace(/[\[\]"]/g, '').trim());
    setRecommendedFonts(fontsArray);
    setLoading(false); // Set loading to false once data is fetched
  } catch (error) {
    console.error("Error recommending font:", error);
    setLoading(false); // Set loading to false in case of error
  }
    };

    fetchFonts();
  }, []);

  useEffect(() => {
    // GSAP animation setup
    gsap.set(".blueball", { xPercent: -50, yPercent: -50 });
    let targets = gsap.utils.toArray(".blueball");
    window.addEventListener("mouseleave", (e) => {
      gsap.to(targets, {
        duration: 0.5,
        scale: 0,
        ease: "power1.out",
        overwrite: "auto",
        stagger: 0.02,
      });
    });
    window.addEventListener("mouseenter", (e) => {
      gsap.to(targets, {
        duration: 0.5,
        scale: 1,
        ease: "power1.out",
        overwrite: "auto",
        stagger: 0.02,
      });
    });
    window.addEventListener("mousemove", (e) => {
      gsap.to(targets, {
        duration: 0.5,
        x: e.clientX,
        y: e.clientY,
        ease: "power1.out",
        overwrite: "auto",
        stagger: 0.02,
      });
    });
  }, []);

  return (
    <>
      <div className="blueball blur-3xl bg-cyan-400/50 w-96 h-96 fixed top-0 left-0 rounded-full"></div>

      <div className="px-4">
        <div className=" mx-auto text-center text-7xl max-sm:text-4xl max-md:text-6xl font-bold mt-10">
          Check the top 15  <span className="text-grad">"Trending Fonts of the month"</span> !!
        </div>
      </div>

      <div className="container mt-20 px-0 position-relative">
        {loading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
            <h3>Loading...</h3>
          </div>
        )}
        <div className="row mx-0">
          {recommendedFonts.map((font, index) => (
            <>
              <link href={`https://fonts.googleapis.com/css2?family=${font}`} rel="stylesheet" />
            <div key={index} className="col-12 md:ml-80 justify-center col-md-6 col-lg-4 col-xl-3 px-2 mb-4">
                <div className=" flex text-xl justify-center text-pink-700">Rank: {index + 1}</div>
              <div className="bg-white rounded-md shadow-md p-4">

                <div  style={{ fontFamily: font}}q className="font-bold flex justify-center text-xl mb-2">{font} AaBbzZ 911 </div>

                <a href={`https://fonts.google.com/?query=${font}`} target="_blank" rel="noopener noreferrer" className="flex justify-center text-blue-500 underline">Google Font URL</a>
              </div>
            </div>
            </>
          ))}
        </div>
      </div>
       <div className="bottom-navigation bottom-0 fixed w-full p-4 md:hidden bg-white shadow-2xl h-fit">
        <div className="flex items-center justify-around md:hidden">
          <div className="flex flex-col items-center">
            <a href="http://localhost:8502/">
              <img
                src="/fuse.png"
                alt=""
                height={30}
                width={30}
                className={` mx-auto opacity-40`}
              />
              <div className="text-xs text-center">Fuse</div>
            </a>
          </div>
          <div className="flex flex-col items-center">
            <a href="/pair">
              <img
                src="/pair.png"
                alt=""
                height={30}
                width={30}
                className={` mx-auto opacity-40 hover:opacity-100`}
              />
              <div className="text-xs text-center">Pair</div>
            </a>
          </div>
          <div className="flex flex-col items-center">
            <a href="/recommend">
              <img
                src="/recommend.png"
                alt=""
                height={30}
                width={30}
                className={` mx-auto opacity-40 active:opacity-100`}
              />
              <div className="text-xs text-center">Recommend</div>
            </a>
          </div>

          <div className="flex flex-col items-center">
            <a href="/trending">
              <img
                src="/nutricon.png"
                alt=""
                height={30}
                width={30}
                className={` mx-auto opacity-100`}
              />
              <div className="text-xs text-center">Trending</div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
//
