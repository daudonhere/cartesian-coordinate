import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 1. Volatile State (Lost on Reload)
export function VolatileStateExample() {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-2 w-full">
      <Input 
        placeholder="Type here..." 
        value={value} 
        onChange={(e) => setValue(e.target.value)}
        className="h-8 text-xs"
      />
      <div className="bg-muted/30 p-2 rounded text-xs">
        <p className="font-semibold text-muted-foreground mb-1">Current Value:</p>
        <p className="font-medium break-all">{value || "(empty)"}</p>
      </div>
      <p className="text-[10px] text-muted-foreground text-center">
        Refresh the page to see this clear.
      </p>
    </div>
  );
}

// 2. Session Storage (Persists on Reload)
export function SessionStorageExample() {
  const [value, setValue] = useState(() => {
    return sessionStorage.getItem("session_demo_key") || "";
  });

  useEffect(() => {
    sessionStorage.setItem("session_demo_key", value);
  }, [value]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Input 
        placeholder="Type here..." 
        value={value} 
        onChange={(e) => setValue(e.target.value)}
        className="h-8 text-xs"
      />
      <div className="bg-muted/30 p-2 rounded text-xs">
        <p className="font-semibold text-muted-foreground mb-1">Session Storage:</p>
        <p className="font-medium break-all">{value || "(empty)"}</p>
      </div>
      <p className="text-[10px] text-muted-foreground text-center">
        Persists on reload. Clears on tab close.
      </p>
    </div>
  );
}

// 3. Local Storage (Persists Forever)
export function LocalStorageExample() {
  const [value, setValue] = useState(() => {
    return localStorage.getItem("local_demo_key") || "";
  });

  useEffect(() => {
    localStorage.setItem("local_demo_key", value);
  }, [value]);

  const clearStorage = () => {
    setValue("");
    localStorage.removeItem("local_demo_key");
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Input 
        placeholder="Type here..." 
        value={value} 
        onChange={(e) => setValue(e.target.value)}
        className="h-8 text-xs"
      />
      <div className="bg-muted/30 p-2 rounded text-xs">
        <p className="font-semibold text-muted-foreground mb-1">Local Storage:</p>
        <p className="font-medium break-all">{value || "(empty)"}</p>
      </div>
      <Button variant="destructive" size="sm" className="h-6 text-[10px]" onClick={clearStorage}>
        Force Clear
      </Button>
      <p className="text-[10px] text-muted-foreground text-center">
        Persists on reload and browser restart.
      </p>
    </div>
  );
}
