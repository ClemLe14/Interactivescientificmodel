import { useState } from "react";
import { DefinitionPopup } from "./components/DefinitionPopup";
import { ClickableBox } from "./components/ClickableBox";
import { definitions, DefinitionData } from "./data/definitions";
import { CollaborationModule } from "./components/CollaborationModule";
import { Info } from "lucide-react";

export default function App() {
  const [selectedDefinition, setSelectedDefinition] = useState<DefinitionData | null>(null);

  const openDefinition = (key: string) => {
    const def = definitions[key];
    if (def && def.definition) {
      setSelectedDefinition(def);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interactive Presence Model
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Info className="w-4 h-4" />
            Click on elements to view their definitions
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Contact:{" "}
            <a href="mailto:audipres@unicaen.fr" className="text-blue-600 hover:underline">
              audipres@unicaen.fr
            </a>
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-white border-4 border-black relative p-0">

          {/* RED DASHED ARROWS OVERLAY: Green zone → Absence / Cybersickness / Break */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 1200 920"
            preserveAspectRatio="none"
          >
            {/* Arrow → Absence of presence */}
            <line x1="738" y1="628" x2="738" y2="205" stroke="#dc2626" strokeWidth="3" strokeDasharray="12,7" />
            <polygon points="738,191 729,210 747,210" fill="#dc2626" />
            {/* Arrow → Cybersickness */}
            <line x1="930" y1="628" x2="930" y2="205" stroke="#dc2626" strokeWidth="3" strokeDasharray="12,7" />
            <polygon points="930,191 921,210 939,210" fill="#dc2626" />
            {/* Arrow → Break in presence */}
            <line x1="1118" y1="628" x2="1118" y2="205" stroke="#dc2626" strokeWidth="3" strokeDasharray="12,7" />
            <polygon points="1118,191 1109,210 1127,210" fill="#dc2626" />
          </svg>

          <div className="grid grid-cols-[1fr_1fr] relative">
            {/* LEFT SIDE: Pink zone + Yellow zone + Green zone */}
            <div>
              {/* TOP SECTION: Sense of presence only */}
              <div className="px-[5mm] pt-[5mm]">
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

              {/* Arrow UP: Yellow zone → Pink zone */}
              <div className="flex" style={{paddingLeft: 'calc(5mm + 180px + 8px)'}}>
                <div className="flex-1 flex justify-center">
                  <svg width="20" height="44" viewBox="0 0 20 44">
                    <line x1="10" y1="42" x2="10" y2="14" stroke="#16a34a" strokeWidth="3"/>
                    <polygon points="10,0 20,16 0,16" fill="#16a34a" />
                  </svg>
                </div>
              </div>

              {/* MIDDLE SECTION: Yellow zone with step labels OUTSIDE on the left */}
              <div className="px-[5mm] relative">
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
                    <div className="flex flex-col gap-0 w-full">

                      {/* ROW: GROUP 1 (top): Suspension of disbelief + Involvement */}
                      <div className="flex items-center w-full">
                        <div className="flex-1">
                          <div className="border-4 border-purple-500 bg-purple-50 p-3 rounded-lg w-full relative">
                            <div className="space-y-1">
                              <ClickableBox
                                onClick={() => openDefinition("suspension-of-disbelief")}
                                className="bg-teal-400 border-2 border-teal-600 px-4 py-2 font-semibold w-full text-center text-sm"
                              >
                                Suspension of disbelief
                              </ClickableBox>
                              <div className="flex justify-center">
                                {/* Single arrow: Involvement → Suspension */}
                                <svg width="10" height="14" viewBox="0 0 10 14">
                                  <polygon points="5,0 10,7 0,7" fill="#16a34a" />
                                  <rect x="3.5" y="7" width="3" height="7" fill="#16a34a" />
                                </svg>
                              </div>
                              <ClickableBox
                                onClick={() => openDefinition("involvement")}
                                className="bg-teal-400 border-2 border-teal-600 px-4 py-2 font-semibold w-full text-center text-sm"
                              >
                                Involvement
                              </ClickableBox>
                            </div>
                          </div>
                        </div>
                        {/* Red dashed arrow → right border */}
                        <div className="w-[120px] flex items-center justify-end ml-2" style={{marginRight: '-24px'}}>
                          <svg width="110" height="16" viewBox="0 0 110 16">
                            <line x1="0" y1="8" x2="98" y2="8" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,3"/>
                            <polygon points="110,8 98,2 98,14" fill="#dc2626"/>
                          </svg>
                        </div>
                      </div>

                      {/* Arrow UP: Judgement → Group1 — aligned with flex-1 center */}
                      <div className="flex w-full">
                        <div className="flex-1 flex justify-center">
                          <svg width="14" height="20" viewBox="0 0 14 20">
                            <polygon points="7,0 14,10 0,10" fill="#16a34a" />
                            <rect x="5" y="10" width="4" height="10" fill="#16a34a" />
                          </svg>
                        </div>
                        <div className="w-[96px] shrink-0" />
                      </div>

                      {/* ROW: GROUP 2: Judgement */}
                      <div className="flex items-center w-full">
                        <div className="flex-1 flex justify-center">
                          <ClickableBox
                            onClick={() => openDefinition("judgement")}
                            className="bg-teal-400 border-2 border-teal-600 px-4 py-2 font-semibold text-sm"
                          >
                            Judgement
                          </ClickableBox>
                        </div>
                        {/* Non-adherence label + Red dashed arrow → right border */}
                        <div className="w-[120px] flex items-center justify-end gap-1.5 ml-2" style={{marginRight: '-24px'}}>
                          <span className="text-[10px] font-semibold text-red-700 whitespace-nowrap">Non-adherence</span>
                          <svg width="40" height="16" viewBox="0 0 40 16">
                            <line x1="0" y1="8" x2="28" y2="8" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,3"/>
                            <polygon points="40,8 28,2 28,14" fill="#dc2626"/>
                          </svg>
                        </div>
                      </div>

                      {/* Arrow UP: Emotions → Judgement — aligned with flex-1 center */}
                      <div className="flex w-full">
                        <div className="flex-1 flex justify-center">
                          <svg width="14" height="20" viewBox="0 0 14 20">
                            <polygon points="7,0 14,10 0,10" fill="#16a34a" />
                            <rect x="5" y="10" width="4" height="10" fill="#16a34a" />
                          </svg>
                        </div>
                        <div className="w-[96px] shrink-0" />
                      </div>

                      {/* ROW: GROUP 3: Emotions */}
                      <div className="flex items-center w-full">
                        <div className="flex-1 flex justify-center">
                          <ClickableBox
                            onClick={() => openDefinition("emotions")}
                            className="bg-teal-400 border-2 border-teal-600 px-6 py-2 font-semibold rounded-full text-sm"
                            shape="oval"
                          >
                            Emotions
                          </ClickableBox>
                        </div>
                        {/* Red dashed arrow → right border */}
                        <div className="w-[120px] flex items-center justify-end ml-2" style={{marginRight: '-24px'}}>
                          <svg width="110" height="16" viewBox="0 0 110 16">
                            <line x1="0" y1="8" x2="98" y2="8" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,3"/>
                            <polygon points="110,8 98,2 98,14" fill="#dc2626"/>
                          </svg>
                        </div>
                      </div>

                      {/* Arrow ↕ double: Group4 ↔ Emotions — aligned with flex-1 center */}
                      <div className="flex w-full">
                        <div className="flex-1 flex justify-center">
                          <svg width="14" height="20" viewBox="0 0 14 20">
                            <polygon points="7,0 14,8 0,8" fill="#16a34a" />
                            <rect x="5" y="8" width="4" height="4" fill="#16a34a" />
                            <polygon points="7,20 14,12 0,12" fill="#16a34a" />
                          </svg>
                        </div>
                        <div className="w-[96px] shrink-0" />
                      </div>

                      {/* ROW: GROUP 4 (bottom): Mental model + Self-presence */}
                      <div className="flex items-center w-full">
                        <div className="flex-1">
                          <div className="border-4 border-purple-500 bg-purple-50 p-3 rounded-lg w-full relative">
                            <div className="space-y-1">
                              <ClickableBox
                                onClick={() => openDefinition("mental-model")}
                                className="bg-teal-400 border-2 border-teal-600 px-4 py-2 font-semibold w-full text-center text-sm"
                              >
                                Mental model
                              </ClickableBox>
                              <div className="flex justify-center">
                                {/* Double-headed arrow: Self-presence ↕ Mental model */}
                                <svg width="10" height="14" viewBox="0 0 10 14">
                                  <polygon points="5,0 10,5 0,5" fill="#16a34a" />
                                  <rect x="3.5" y="5" width="3" height="4" fill="#16a34a" />
                                  <polygon points="5,14 10,9 0,9" fill="#16a34a" />
                                </svg>
                              </div>
                              <ClickableBox
                                onClick={() => openDefinition("self-presence")}
                                className="bg-teal-400 border-2 border-teal-600 px-4 py-2 font-semibold w-full text-center text-sm"
                              >
                                Self-presence
                              </ClickableBox>
                            </div>
                          </div>
                        </div>
                        {/* Red dashed arrow → right border */}
                        <div className="w-[120px] flex items-center justify-end ml-2" style={{marginRight: '-24px'}}>
                          <svg width="110" height="16" viewBox="0 0 110 16">
                            <line x1="0" y1="8" x2="98" y2="8" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,3"/>
                            <polygon points="110,8 98,2 98,14" fill="#dc2626"/>
                          </svg>
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

          {/* Arrow UP: Green zone → Yellow zone */}
          <div className="flex" style={{paddingLeft: 'calc(5mm + 180px + 8px)', paddingRight: '50%'}}>
            <div className="flex-1 flex justify-center">
              <svg width="20" height="44" viewBox="0 0 20 44">
                <line x1="10" y1="42" x2="10" y2="14" stroke="#16a34a" strokeWidth="3"/>
                <polygon points="10,0 20,16 0,16" fill="#16a34a" />
              </svg>
            </div>
          </div>

          {/* BOTTOM SECTION: Green zone - Immersive environment (FULL WIDTH) */}
          <div className="px-[5mm] pb-[5mm]">
            <div className="bg-green-200 p-12 relative">
              <div className="absolute left-4 top-4 font-bold text-lg">
                Immersive environment
              </div>
              
              <div className="flex justify-center items-center gap-8 pt-8">
                {/* Individual Box */}
                <div className="border-4 border-black bg-white w-[160px] h-[180px] flex flex-col items-center justify-center text-center p-4">
                  <ClickableBox
                    onClick={() => openDefinition("individual")}
                    className="w-full h-full flex flex-col items-center justify-center"
                  >
                    <div className="font-bold text-lg mb-3">Individual</div>
                    <div className="flex justify-center">
                      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="currentColor">
                        <circle cx="32" cy="14" r="11" />
                        <rect x="20" y="29" width="24" height="35" rx="4" />
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
                <div className="border-4 border-black bg-white w-[160px] h-[180px] flex flex-col items-center justify-center text-center p-4">
                  <ClickableBox
                    onClick={() => openDefinition("technological")}
                    className="w-full h-full flex flex-col items-center justify-center"
                  >
                    <div className="font-bold text-lg mb-3">Technological</div>
                    <div className="flex justify-center flex-wrap gap-1 w-[72px] mx-auto">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-7 h-7 text-blue-500" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
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
                <div className="border-4 border-black bg-white w-[160px] h-[180px] flex flex-col items-center justify-center text-center p-4">
                  <ClickableBox
                    onClick={() => openDefinition("environmental")}
                    className="w-full h-full flex flex-col items-center justify-center"
                  >
                    <div className="font-bold text-lg mb-3">Environmental</div>
                    <div className="flex justify-center">
                      <svg className="w-16 h-16 text-red-500" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="3">
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

        {/* Legend */}
        <div className="mt-6 bg-white border-2 border-gray-200 rounded-lg p-5">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Legend — Arrows</h3>
          <div className="flex flex-wrap gap-6">
            {/* Green solid upward */}
            <div className="flex items-center gap-3">
              <svg width="20" height="36" viewBox="0 0 20 36">
                <line x1="10" y1="34" x2="10" y2="10" stroke="#16a34a" strokeWidth="3"/>
                <polygon points="10,0 20,14 0,14" fill="#16a34a" />
              </svg>
              <span className="text-sm text-gray-600">Causal / process flow (bottom → top)</span>
            </div>
            {/* Green double-headed vertical */}
            <div className="flex items-center gap-3">
              <svg width="20" height="36" viewBox="0 0 20 36">
                <line x1="10" y1="6" x2="10" y2="30" stroke="#16a34a" strokeWidth="3"/>
                <polygon points="10,0 20,10 0,10" fill="#16a34a" />
                <polygon points="10,36 20,26 0,26" fill="#16a34a" />
              </svg>
              <span className="text-sm text-gray-600">Bidirectional relationship (within yellow zone)</span>
            </div>
            {/* Black double-headed horizontal */}
            <div className="flex items-center gap-3">
              <svg width="60" height="20" viewBox="0 0 60 20">
                <line x1="6" y1="10" x2="54" y2="10" stroke="black" strokeWidth="2"/>
                <polygon points="0,10 10,5 10,15" fill="black" />
                <polygon points="60,10 50,5 50,15" fill="black" />
              </svg>
              <span className="text-sm text-gray-600">Mutual interaction (between immersive environment components)</span>
            </div>
            {/* Red dashed horizontal */}
            <div className="flex items-center gap-3">
              <svg width="60" height="20" viewBox="0 0 60 20">
                <line x1="0" y1="10" x2="48" y2="10" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,3"/>
                <polygon points="60,10 48,4 48,16" fill="#dc2626" />
              </svg>
              <span className="text-sm text-gray-600">Disruption pathway (non-adherence / breakdown)</span>
            </div>
            {/* Red dashed vertical */}
            <div className="flex items-center gap-3">
              <svg width="20" height="36" viewBox="0 0 20 36">
                <line x1="10" y1="36" x2="10" y2="10" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,3"/>
                <polygon points="10,0 20,12 0,12" fill="#dc2626" />
              </svg>
              <span className="text-sm text-gray-600">Outcome of disruption (absence / cybersickness / break)</span>
            </div>
          </div>
        </div>

        {/* Collaboration Module */}
        <CollaborationModule />
      </div>

      {/* Definition Popup */}
      {selectedDefinition && (
        <DefinitionPopup
          title={selectedDefinition.title}
          definition={selectedDefinition.definition}
          isOpen={true}
          onClose={() => setSelectedDefinition(null)}
        />
      )}
    </div>
  );
}