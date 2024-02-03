'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

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
 use case i give you as an input that will be like Healthcare , automobile , infrastructure , social media etc, response should be 10-15 pair of fonts in an array only 1 array no triple back ticks just array should be the response which are available on google fonts ` + inputFont }];

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


  return (
    <div>
      <div className="ball blur-3xl bg-purple-400/50 w-96 h-96 fixed top-0 left-0 rounded-full"></div>
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

      <div className="mx-40 text-2xl mt-8">
        {recommendedFonts.map((pair, index) => (
          <div key={index} className="flex mb-4">
            {pair.map((font, i) => (
              <div key={i} style={{ fontFamily: font, marginRight: '20px' }}>
                {font}
              </div>
            ))}
            <div style={{ fontFamily: pair[0], fontSize: '24px' }}>
              AaBbCcxYyZz 12390
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
