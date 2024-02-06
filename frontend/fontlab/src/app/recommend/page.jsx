'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import gsap from "gsap";
const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyB_GyHWhr9JP70Yam_9tOrlmZNpjNAPEO4";

async function recommendFont(inputFont) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  const parts = [{ text: `give 10 - 15 font pair recommendation which will go best with the
 use case i give you as an input that will be like Healthcare , automobile , infrastructure , social media , Finance,Education,Fashion,Travel,Technology,Food & Beverage,Entertainment,Retail,Real Estate,Sports,Art & Design,Beauty & Wellness,Government,Nonprofit,Other, response should be 10-15 pair of fonts in an array only 1 array no triple back ticks just array should be the response which are available on google fonts ` + inputFont }];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  return response.text();
}

export default function FontRecommendation() {
  const [inputFont, setInputFont] = useState('');
  const [recommendedFonts, setRecommendedFonts] = useState([]);
const [useCases, setUseCases] = useState([
  'Healthcare',
  'Automobile',
  'Infrastructure',
  'Social Media',
  'Finance',
  'Education',
  'Fashion',
  'Travel',
  'Technology',
  'Food & Beverage',
  'Entertainment',
  'Retail',
  'Real Estate',
  'Sports',
  'Art & Design',
  'Beauty & Wellness',
  'Government',
  'Nonprofit',
  'Other'
]);

  const handleSelectUseCase = async (useCase) => {
    setInputFont(useCase);
    try {
      const recommendation = await recommendFont(useCase);
      setRecommendedFonts(JSON.parse(recommendation));
    } catch (error) {
      console.error("Error recommending font:", error);
    }
    setUseCases([]); // Remove the options once a use case is selected
  };

 useEffect(() => {
    gsap.set(".greenball", { xPercent: -50, yPercent: -50 });
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
      <div className="greenball blur-3xl bg-cyan-400/50 w-96 h-96 fixed top-0 left-0 rounded-full"></div>
      <div className="px-4">
        <div className=" mx-auto text-center text-7xl max-sm:text-4xl max-md:text-6xl font-bold mt-10">
          Choose your <span className="text-grad">"Use Case"</span> !!
        </div>
      </div>
   <div className="flex flex-wrap justify-center">
  {useCases.map(useCase => (
    <div
      key={useCase}
      className={`cursor-pointer bg-white shadow-md p-6 rounded-lg text-center ${inputFont === useCase ? 'bg-gray-200' : ''}`}
      onClick={() => handleSelectUseCase(useCase)}
      style={{ minWidth: '160px', maxWidth: '200px', margin: '8px' }} // Adjust the width and margin as needed
    >
      {useCase}
    </div>
  ))}
</div>

<div className="md:mx-40 sm:ml-0 text-2xl mt-8">

{recommendedFonts.map((pair, index) => (
  <div key={index} className="flex mb-4">
    {pair.map((font, i) => (
      <div key={i} className="w-1/2 pr-4 md:ml-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div style={{ fontFamily: font, marginBottom: '10px' }}>
            {font}
          </div>
          <div style={{ fontFamily: font, fontSize: '24px', marginBottom: '10px' }}>
            AaBbZz 1290
          </div>
          <a href={`https://fonts.google.com/?query=${font}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Google Font URL</a>
        </div>
      </div>
    ))}
    {index % 2 == 0 && (
      <div className="w-1/2 hidden md:block pr-4 md:ml-10">

        <div className="bg-white shadow-md rounded-lg p-6">
       <br/>      ❤️‍🔥
        </div>
      </div>
    )}
  </div>
))}

</div>


<div className="bottom-navigation bottom-0 fixed w-full p-4 md:hidden bg-white shadow-2xl h-fit">
        <div className="flex items-center justify-around md:hidden">
          <div className="flex flex-col items-center">
            <a href="https://aisha-ficial-fontforge-fusionfont-select-merger-app-lv2ipd.streamlit.app/">
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
                className={` mx-auto opacity-100 active:opacity-100`}
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
                className={` mx-auto opacity-40`}
              />
              <div className="text-xs text-center">Trending</div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
