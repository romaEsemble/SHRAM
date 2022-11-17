import {colors} from '@theme/Colors.js';
import React, {useContext, useEffect, useState} from 'react';

const ThemeContext = React.createContext();

export const ThemeContextProvider = ({children}) => {
  const [themeID, setThemeID] = useState();

  useEffect(() => {
    (async () => {
      setThemeID(colors[0].key);
    })();
  }, []);

  return (
    <ThemeContext.Provider value={{themeID, setThemeID}}>
      {themeID ? children : console.log('no theme id found')}
    </ThemeContext.Provider>
  );
};

export function withTheme(Components) {
  return (props) => {
    const {themeID} = useContext(ThemeContext);
    const getTheme = (themeID) => colors.find((theme) => theme.key === themeID);

    return themeID !== undefined ? (
      <Components {...props} theme={getTheme(themeID)} />
    ) : (
      <></>
    );
  };
}
