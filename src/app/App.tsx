import { useState } from "react";
import { DefinitionPopup } from "./components/DefinitionPopup";
import { ClickableBox } from "./components/ClickableBox";
import { definitions, DefinitionData } from "./data/definitions";
import { CollaborationModule } from "./components/CollaborationModule";
import { Info } from "lucide-react";

export default function App() {
  const [selectedDefinition, setSelectedDefinition] = useState<DefinitionData | null>(null);

  const openDefinition = (key: string) => {
    setSelectedDefinition(definitions[key]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Modèle de Présence Interactif
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Info className="w-4 h-4" />
            Cliquez sur les éléments pour afficher leurs définitions
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-white border-4 border-black relative p-0">
          <div className="grid grid-cols-[1fr_1fr] relative">
            {/* LEFT SIDE: Pink zone + Yellow zone + Green zone */}
            <div>
              {/* TOP SECTION: Sense of presence only */}
              <div className="p-[5mm]">
                <div className="bg-pink-200 p-8 relative">
                  <div className="text-center font-bold text-xl mb-6">Sense of presence</div>
                  <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <ClickableBox
                      onClick={() => openDefinition("spatial-presence")}
                      className="bg-pink-300 p-4 text-base font-semibold text-center border-2 border-pink-400"
                    >
                      Spatial presence
                    </ClickableBox>
                    <ClickableBox
                      onClick={() => openDefinition("social-presence")}
                      className="bg-pink-300 p-4 text-base font-semibold text-center border-2 border-pink-400"
                    >
                      Social presence
                    </ClickableBox>
                  </div>
                </div>
              </div>

              {/* MIDDLE SECTION: Yellow zone with step labels OUTSIDE on the left */}
              <div className="px-[5mm] pb-[5mm] relative">
            <div className="grid grid-cols-[180px_1fr] gap-4">
              {/* Step labels - OUTSIDE yellow zone */}
              <div className="flex flex-col justify-around py-6">
                <div className="h-[90px] flex items-center">
                  <ClickableBox
                    onClick={() => openDefinition("step3")}
                    className="bg-yellow-200 border-2 border-yellow-500 px-3 py-2 text-xs font-semibold text-center w-full"
                  >
                    Step 3 : conscious
                  </ClickableBox>
                </div>
                <div className="h-[70px] flex items-center">
                  <ClickableBox
                    onClick={() => openDefinition("step2")}
                    className="bg-yellow-200 border-2 border-yellow-500 px-3 py-2 text-xs font-semibold text-center w-full"
                  >
                    Step 2 : unconscious
                  </ClickableBox>
                </div>
                <div className="h-[150px] flex items-center">
                  <ClickableBox
                    onClick={() => openDefinition("step1")}
                    className="bg-yellow-200 border-2 border-yellow-500 px-3 py-2 text-xs font-semibold text-center w-full"
                  >
                    Step 1 : unconscious
                  </ClickableBox>
                </div>
              </div>

              {/* Yellow zone with process elements */}
              <div className="bg-yellow-100 border-2 border-yellow-400 p-6 relative">
                <div className="flex flex-col items-center gap-4 max-w-md mx-auto relative">
                  
                  {/* GROUP 1: Suspension of disbelief + Involvement */}
                  <div className="border-4 border-purple-500 bg-purple-50 p-3 rounded-lg w-full relative">
                    <div className="space-y-2">
                      <ClickableBox
                        onClick={() => openDefinition("suspension-of-disbelief")}
                        className="bg-teal-400 border-2 border-teal-600 px-4 py-2 font-semibold w-full text-center text-sm"
                      >
                        Suspension of disbelief
                      </ClickableBox>
                      <ClickableBox
                        onClick={() => openDefinition("involvement")}
                        className="bg-teal-400 border-2 border-teal-600 px-4 py-2 font-semibold w-full text-center text-sm"
                      >
                        Involvement
                      </ClickableBox>
                    </div>
                  </div>

                  {/* GROUP 2: Judgement */}
                  <div className="relative w-full flex justify-center">
                    <div className="relative">
                      <ClickableBox
                        onClick={() => openDefinition("judgement")}
                        className="bg-teal-400 border-2 border-teal-600 px-4 py-2 font-semibold text-sm"
                      >
                        Judgement
                      </ClickableBox>
                    </div>
                  </div>

                  {/* GROUP 3: Emotions */}
                  <div className="relative w-full flex justify-center">
                    <div className="relative">
                      <ClickableBox
                        onClick={() => openDefinition("emotions")}
                        className="bg-teal-400 border-2 border-teal-600 px-6 py-2 font-semibold rounded-full text-sm"
                        shape="oval"
                      >
                        Emotions
                      </ClickableBox>
                    </div>
                  </div>

                  {/* GROUP 4: Mental model + Self-presence */}
                  <div className="border-4 border-purple-500 bg-purple-50 p-3 rounded-lg w-full relative">
                    <div className="space-y-2">
                      <ClickableBox
                        onClick={() => openDefinition("mental-model")}
                        className="bg-teal-400 border-2 border-teal-600 px-4 py-2 font-semibold w-full text-center text-sm"
                      >
                        Mental model
                      </ClickableBox>
                      <ClickableBox
                        onClick={() => openDefinition("self-presence")}
                        className="bg-teal-400 border-2 border-teal-600 px-4 py-2 font-semibold w-full text-center text-sm"
                      >
                        Self-presence
                      </ClickableBox>
                    </div>
                  </div>

                </div>
              </div>
              </div>
              </div>

            </div>

            {/* RIGHT SIDE: Red framed outcomes box */}
            <div className="p-[5mm]">
              <div className="border-4 border-red-600 bg-pink-200 p-8 w-full relative h-[172px] flex items-center">
                <div className="grid grid-cols-3 gap-3 w-full">
                  <ClickableBox
                    onClick={() => openDefinition("absence-of-presence")}
                    className="p-4 text-center font-bold text-sm bg-pink-200 border border-red-300"
                  >
                    Absence of<br />presence
                  </ClickableBox>
                  <ClickableBox
                    onClick={() => openDefinition("cybersickness")}
                    className="p-4 text-center font-bold text-sm bg-pink-200 border border-red-300"
                  >
                    Cyber-<br />sickness
                  </ClickableBox>
                  <ClickableBox
                    onClick={() => openDefinition("break-in-presence")}
                    className="p-4 text-center font-bold text-sm bg-pink-200 border border-red-300"
                  >
                    Break in<br />presence
                  </ClickableBox>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: Green zone - Immersive environment (FULL WIDTH) */}
          <div className="p-[5mm]">
            <div className="bg-green-200 p-12 relative">
              <div className="absolute left-4 top-4 font-bold text-lg">
                Immersive environment
              </div>
              
              <div className="flex justify-center items-center gap-8 pt-8">
                {/* Individual Box */}
                <div className="border-4 border-black bg-white p-6 text-center">
                  <ClickableBox
                    onClick={() => openDefinition("individual")}
                    className="w-full"
                  >
                    <div className="font-bold text-lg mb-4">Individual</div>
                    <div className="flex justify-center">
                      <svg className="w-16 h-20" viewBox="0 0 64 80" fill="currentColor">
                        <circle cx="32" cy="16" r="12" />
                        <rect x="20" y="32" width="24" height="40" rx="4" />
                      </svg>
                    </div>
                  </ClickableBox>
                </div>

                {/* Double arrow between Individual and Technological */}
                <svg className="w-20 h-20" viewBox="0 0 80 80">
                  <defs>
                    <marker id="arrowBlackLeft" markerWidth="10" markerHeight="10" refX="0" refY="5" orient="auto">
                      <polygon points="10,0 0,5 10,10" fill="black" />
                    </marker>
                    <marker id="arrowBlackRight" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                      <polygon points="0,0 10,5 0,10" fill="black" />
                    </marker>
                  </defs>
                  <line 
                    x1="5" 
                    y1="40" 
                    x2="75" 
                    y2="40" 
                    stroke="black" 
                    strokeWidth="2"
                    markerStart="url(#arrowBlackLeft)"
                    markerEnd="url(#arrowBlackRight)"
                  />
                </svg>

                {/* Technological Box */}
                <div className="border-4 border-black bg-white p-6 text-center">
                  <ClickableBox
                    onClick={() => openDefinition("technological")}
                    className="w-full"
                  >
                    <div className="font-bold text-lg mb-4">Technological</div>
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-10 h-10 text-blue-500" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="20" cy="20" r="16" />
                          <circle cx="20" cy="20" r="3" fill="currentColor" />
                          {[0, 60, 120, 180, 240, 300].map((angle, idx) => {
                            const x = 20 + 10 * Math.cos((angle * Math.PI) / 180);
                            const y = 20 + 10 * Math.sin((angle * Math.PI) / 180);
                            return <circle key={idx} cx={x} cy={y} r="1.5" fill="currentColor" />;
                          })}
                        </svg>
                      ))}
                    </div>
                  </ClickableBox>
                </div>

                {/* Double arrow between Technological and Environmental */}
                <svg className="w-20 h-20" viewBox="0 0 80 80">
                  <line 
                    x1="5" 
                    y1="40" 
                    x2="75" 
                    y2="40" 
                    stroke="black" 
                    strokeWidth="2"
                    markerStart="url(#arrowBlackLeft)"
                    markerEnd="url(#arrowBlackRight)"
                  />
                </svg>

                {/* Environmental Box */}
                <div className="border-4 border-black bg-white p-6 text-center">
                  <ClickableBox
                    onClick={() => openDefinition("environmental")}
                    className="w-full"
                  >
                    <div className="font-bold text-lg mb-4">Environmental</div>
                    <div className="flex justify-center">
                      <svg className="w-20 h-20 text-red-500" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="3">
                        <circle cx="40" cy="40" r="32" />
                        <path d="M 15 35 Q 25 25, 35 35 T 55 35 T 75 35" strokeWidth="2.5" fill="none" />
                        <path d="M 15 45 Q 25 35, 35 45 T 55 45 T 75 45" strokeWidth="2.5" fill="none" />
                      </svg>
                    </div>
                  </ClickableBox>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collaboration Module */}
        <CollaborationModule />
      </div>

      {/* Definition Popup */}
      {selectedDefinition && (
        <DefinitionPopup
          definition={selectedDefinition}
          onClose={() => setSelectedDefinition(null)}
        />
      )}
    </div>
  );
}
