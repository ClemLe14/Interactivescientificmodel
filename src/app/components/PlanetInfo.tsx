import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { motion } from "motion/react";

interface PlanetData {
  name: string;
  description: string;
  diameter: string;
  distance: string;
  orbitalPeriod: string;
  moons: string;
  facts: string[];
  color: string;
}

interface PlanetInfoProps {
  planet: PlanetData;
  onClose: () => void;
}

export function PlanetInfo({ planet, onClose }: PlanetInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
    >
      <Card className="bg-slate-900/95 border-slate-700 text-white backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full border-2 border-white/30"
                style={{
                  backgroundColor: planet.color,
                  boxShadow: `0 0 20px ${planet.color}60`,
                }}
              />
              <div>
                <CardTitle className="text-2xl">{planet.name}</CardTitle>
                <CardDescription className="text-slate-300">
                  {planet.description}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Diamètre</p>
              <p className="text-lg font-semibold">{planet.diameter}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Distance du Soleil</p>
              <p className="text-lg font-semibold">{planet.distance}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Période orbitale</p>
              <p className="text-lg font-semibold">{planet.orbitalPeriod}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Lunes</p>
              <p className="text-lg font-semibold">{planet.moons}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-slate-400 mb-2">Faits intéressants</p>
            <ul className="space-y-1">
              {planet.facts.map((fact, index) => (
                <li key={index} className="text-sm text-slate-200 flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
