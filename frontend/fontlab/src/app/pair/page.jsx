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
    { text: "give a font recommendation which will go best with the font i give you as an input the response should be in only one word which are available on google fonts" + inputFont }
  ];

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
  const [recommendedFont, setRecommendedFont] = useState(null);
const [allFonts, setAllFonts] = useState([]);
//  const [filteredFonts, setFilteredFonts] = useState([]);
  useEffect(() => {
    // Fetch list of Google Fonts
    axios.get('https://www.googleapis.com/webfonts/v1/webfonts?key=' +  "AIzaSyCII3sRhnzXwdry3ztdCiuLLI0_VktUm_8 ")
      .then(response => {
        const fonts = response.data.items.map(font => font.family);
        setAllFonts(fonts);
      })
      .catch(error => {
        console.error('Error fetching fonts:', error);
      });
  }, []);



 const handleInputChange = (event) => {
  const selectedFont = event.target.value;
  setInputFont(selectedFont);
};

  const handleRecommendation = async () => {
    try {
      // Call the function to recommend the font using Google Generative AI
      const recommendation = await recommendFont(inputFont);
      // Set the recommended font to the state
      setRecommendedFont(recommendation);
    } catch (error) {
      console.error("Error recommending font:", error);
      // Handle error, maybe set an error state to display to the user
    }
  };
 useEffect(() => {
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
          Ready to get a <span className="text-grad">"Font Pair"</span> ?
        </div>
        </div>

  <p className="text-sm max-sm:text-xs text-xl  text-gray-600 mt-20 mx-auto text-center">
   <select
 className="mr-5"
        value={inputFont}
        onChange={handleInputChange}
      >
        {allFonts.map(font => (
//            <link href={`https://fonts.googleapis.com/css2?family=${font}`} rel="stylesheet" />

          <option style={{ fontFamily: font }} key={font}
         value={font}>{font}</option>
        ))}

      </select> or
      <input className="ml-5"
  type="text"
  placeholder="Type the font you want"
  value={inputFont}
  onChange={(event) => setInputFont(event.target.value)}
/>
</p>
 <div className=" analyze-button mb-8 cursor-pointer mx-auto px-4 py-2 bg-gradient-to-r from-violet-700 to-violet-800 shadow-md rounded-full text-white w-fit mt-6 hover:from-slate-800 hover:to-slate-600 transition duration-300 ease-in-out">
      <button onClick={handleRecommendation}>Recommend</button></div>

  {recommendedFont && (
  <div className="mx-5 md:py-10 md:mx-40 text-2xl">
    <div className="md:flex flex-wrap">
      <div className="w-full md:w-1/3 mb-4 md:mb-0">
        <div className="bg-red-500 md:py-10 bg-opacity-50 p-4 rounded-lg shadow-md">
          <h2 className="text-white">Recommended Font:</h2>
          <p className="text-white">{recommendedFont}</p>
        </div>
      </div>
      <div className="w-full md:w-1/3 mb-4  md:mb-0">
        <div className="bg-blue-500 md:py-10 ml-2 bg-opacity-50 p-4 rounded-lg shadow-md">
          <p className="text-white">Google Font <a href={`https://fonts.google.com/?query=${recommendedFont}`} target="_blank" rel="noopener noreferrer">Link : {`https://fonts.google.com/?query=${recommendedFont}`}</a></p>
        </div>
      </div>
      <div className="w-full md:w-1/3">
        <div className="bg-white md:py-10 ml-2 bg-opacity-75 p-4 rounded-lg shadow-md">
          <p>Preview:</p>
          <link href={`https://fonts.googleapis.com/css2?family=${recommendedFont}`} rel="stylesheet" />
          <div style={{ fontFamily: recommendedFont, fontSize: '24px' }}>
            AaBbYyZz 12890
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      <div className="bottom-navigation bottom-0 fixed w-full p-4 md:hidden bg-white shadow-2xl h-fit">
        <div className="flex items-center justify-around md:hidden">
          <div className="flex flex-col items-center">
            <a href="/fuse">
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
                className={` mx-auto opacity-100 hover:opacity-100`}
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
