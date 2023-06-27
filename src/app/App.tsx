import React, { useCallback, useEffect, useState } from 'react';
import { Theme } from './constants';
import { Header } from '../components/Header/Header';
import { Toc } from '../components/TOC/Toc';
import { getParsingData } from '../helpers/helpers';
import { Main } from '../components/Main/Main';
import { Anchors } from '../components/Anchors/Ancors';
import { ApiAnchor, Page } from './types';

import './style.scss';

function App() {
  const [theme, setTheme] = useState<Theme>(Theme.light);
  const [tree, setTree] = useState<Page[]>([]);
  const [anchors, setAnchors] = useState<ApiAnchor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const activePageUrl = window.location.pathname.slice(1);

  const onChangeTheme = useCallback(() => {
    setTheme(theme === Theme.light ? Theme.dark : Theme.light);
  }, [theme]);

  const onSetIsLoading = useCallback((val: boolean) => setIsLoading(val), []);

  useEffect(() => {
    // load data from json
    const getData = async () => {
      try {
        const response = await fetch('./data.json');
        if (response.ok) {
          const responseData = await response.json();
          // parsing of data
          const [newTree, activePageAnchors] = getParsingData(responseData, activePageUrl);

          setTree(newTree);
          setAnchors(activePageAnchors);
          setIsLoading(false);
        } else {
          throw new Error(response.statusText);
        }
      } catch(error) {
        setIsLoading(false);
        console.error(error);
      }
    };

    getData();
  }, []);

  return (
    <div className={`app ${theme}`}>
      <Header theme={theme} onChangeTheme={onChangeTheme} />

      <div className="app__content">
        <Toc tree={tree} isLoading={isLoading} onSetIsLoading={onSetIsLoading} />
        <Main />
        <Anchors anchors={anchors} />
      </div>
    </div>
  );
}

export default App;
