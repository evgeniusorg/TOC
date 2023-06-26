import React, {useCallback, useState} from 'react';
import './style.scss';
import {Theme} from "./constants";
import { Header } from '../components/Header/Header';
import { Toc } from '../components/TOC/Toc';

function App() {
  const [theme, setTheme] = useState(Theme.light);

  const onChangeTheme = useCallback(() => {
    setTheme(theme === Theme.light ? Theme.dark : Theme.light);
  }, [theme]);

  return (
    <div className={`app ${theme}`}>
      <Header theme={theme} onChangeTheme={onChangeTheme} />
      <div className="app__content">
        <Toc />
        <div className="app__main">

        </div>
      </div>
    </div>
  );
}

export default App;
