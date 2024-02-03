'use client'
// pages/index.js

import { useState , useEffect} from 'react';
import axios from 'axios';
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

  return (
    <div>

<div className="ball blur-3xl bg-purple-400/50 w-96 h-96 fixed top-0 left-0 rounded-full"></div>

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
        <div  className="mx-40 text-2xl">
          <div style={{ display: 'flex' }}>
  <div style={{ flex: 1, backgroundColor: 'rgba(255, 0, 0, 0.5)', padding: '10px', marginRight: '10px', borderRadius: '10px', boxShadow: '0 24px 16px rgba(0, 0, 0, 0.1)' }}>
    <h2>Recommended Font:</h2>
    <p>{recommendedFont}</p>
    </div>
    <div className="text-xl" style={{ flex: 1, backgroundColor: 'rgba(0, 0, 255, 0.5)', padding: '10px', marginRight: '10px', borderRadius: '10px', boxShadow: '0 24px 16px rgba(0, 0, 0, 0.1)' }}>
    <p>Google Font <a href={`https://fonts.google.com/?query=${recommendedFont}`} target="_blank" rel="noopener noreferrer">Link : {`https://fonts.google.com/?query=${recommendedFont}`}</a></p>
  </div>
  <div style={{ flex: 1, backgroundColor: 'rgba(255, 255,255, 0.4)', padding: '10px', marginRight: '10px', borderRadius: '10px', boxShadow: '0 24px 16px rgba(0, 0, 0, 0.1)' }}>
    <p>Preview:</p>
    <link href={`https://fonts.googleapis.com/css2?family=${recommendedFont}`} rel="stylesheet" />
    <div style={{ fontFamily: recommendedFont, fontSize: '24px' }}>
      AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz 1234567890
    </div>
  </div>
</div>

        </div>
      )}
    </div>
  );
}
