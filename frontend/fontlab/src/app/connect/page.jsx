"use client";
import { useState, useEffect } from "react";
/* The line `import { getCalApi } from "@calcom/embed-react";` is importing the `getCalApi` function
from the `@calcom/embed-react` package. This function is used to initialize the Calendar API
provided by Cal.com. */
// import { getCalApi } from "@calcom/embed-react";
import calligraphistData from "./artist.json"; // Assuming you have the JSON data in a file
import gsap from "gsap";
export default function NutritionistsPage() {
  const [selectedCalligraphist, setSelectedCalligraphist] = useState(null);

  const handleBookMeeting = (calligraphist) => {
    console.log("Booking Zoom meeting with:", calligraphist.name);
    setSelectedCalligraphist(calligraphist);
  };

  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi();
        console.log("Calendar API initialized:", cal);
        console.log("Namespace:", cal.ns);
        if (cal.ns) {
          cal.ns["15min"]("ui", {
            styles: { branding: { brandColor: "#000000" } },
            hideEventTypeDetails: false,
            layout: "month_view",
          });
        }
      } catch (error) {
        console.error("Error initializing calendar API:", error);
      }
    })();
  }, []);
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
      <div className="container mx-auto px-4 py-8 z-1">
           <h1 className="text-7xl max-sm:text-5xl nutricon font-bold mx-auto text-center">
          Calligraphist Connect
        </h1>
        <p className="mx-auto text-center mb-8">
          Connect with Handwriting experts globally.
        </p>
        <h1 className="text-5xl max-sm:text-3xl font-bold mb-6 text">
          Calligraphist
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {calligraphistData.calligraphists.map((calligraphist) => (
            <div
              key={calligraphist.id}
              className="border rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={calligraphist.profile_picture}
                alt={calligraphist.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{calligraphist.name}</h2>
                <p className="text-gray-600 mb-2">
                  {calligraphist.specialization.join(", ")}
                </p>
                <p className="text-gray-600 mb-2">{calligraphist.location}</p>
                <button
                  onClick={() => handleBookMeeting(calligraphist)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Book Zoom Meeting
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedCalligraphist && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                Book a Zoom Meeting with {selectedCalligraphist.name}
              </h2>
              <a href="https://cal.com/rahul-singh-qo81cx/15min?date=2024-02-04&month=2024-02" target="_blank" rel="noreferrer">
                <button
                  onClick={() => setSelectedCalligraphist(null)}
                  className="text-white bg-black px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Book Now
                </button>
              </a>
            </div>
          </div>
        )}
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
