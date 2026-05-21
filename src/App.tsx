import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity } from "@/types";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/possibleActivities.json")
      .then((response) => response.json())
      .then((data: Activity[]) => setActivities(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
  
     <div className="p-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Γεια σου! Let's plan our trip.
          </h1>
          <p className="text-sm text-slate-500">
            Loaded {activities.length} activities. (Check your browser
  console!)
          </p>
        </div>
      );

}

export default App;


