import React, { PropsWithChildren, useEffect, useRef } from "react";

export type DeepgramApiKeyContextType = {
  key: () => string|undefined
}

export const DeepgramApiKeyContext = React.createContext<DeepgramApiKeyContextType>({
  key: () => undefined
});

export function DeepgramApiKeyProvider({children}: PropsWithChildren<any>) {
  const key = useRef<string>();
  
  useEffect(() => {
    async function fetchApiKey() {
      const auth = await fetch(`/api/deepgram/token`)
        .then(resp => resp.json());
      key.current = auth.key;
    }   

    fetchApiKey().then(function(){
      window.setInterval(fetchApiKey, 60000 * 10) // TODO: make configurable
    });
  }, []);

  const defaultContext: DeepgramApiKeyContextType = {
    key: () => key.current 
  };

  return <DeepgramApiKeyContext.Provider value={defaultContext}>
    {children}
  </DeepgramApiKeyContext.Provider>
}