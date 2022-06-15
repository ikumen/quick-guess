import React, { PropsWithChildren, useEffect, useRef } from "react";

export type SpeechApiTokenContextType = {
  token: () => string|undefined
}

export const SpeechApiTokenContext = React.createContext<SpeechApiTokenContextType>({
  token: () => undefined
});

export function SpeechApiTokenProvider({children}: PropsWithChildren<any>) {
  const token = useRef<string>();
  
  useEffect(() => {
    async function fetchApiKey() {
      const auth = await fetch(`/api/speech/token`)
        .then(resp => resp.json());
      token.current = auth.token;
    }   

    fetchApiKey().then(function(){
      window.setInterval(fetchApiKey, 60000 * 10) // TODO: make configurable
    });
  }, []);

  const defaultContext: SpeechApiTokenContextType = {
    token: () => token.current 
  };

  return <SpeechApiTokenContext.Provider value={defaultContext}>
    {children}
  </SpeechApiTokenContext.Provider>
}