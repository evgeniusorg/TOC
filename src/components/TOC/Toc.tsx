import React, {FC, useEffect, useState} from 'react';
import './style.scss';
import {filterTree, getTree} from "../../helpers/helpers";
import { Page } from '../../app/types';
import { Cell } from '../Cell/Cell';

let searchTimeoutId: ReturnType<typeof setTimeout>;

export const Toc: FC = () => {
  const [fullData, setFullData] = useState<Page[]>([]);
  const [data, setData] = useState<Page[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // загружаем данные
    const getData = async () => {
      const response = await fetch('./data.json');
      if (response.ok) {
          const responseData = await response.json();
          const tree = getTree(responseData);
          setFullData(tree);
          setData(tree);
          setIsLoading(false);
      } else {
        console.log(response.statusText);
      }
    };

    getData();
  }, []);

  const searchFn = (value: string) => {
    const clearSearch = value.trim().toLowerCase();

    if (clearSearch.length < 3) {
      setData(fullData);
      setIsLoading(false);
      return;
    }

    setData(filterTree(fullData, clearSearch));
    setIsLoading(false);
  }

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearch(value);
    setIsLoading(true);

    if (searchTimeoutId) {
      clearTimeout(searchTimeoutId);
    }

    searchTimeoutId = setTimeout(() => searchFn(value), 1500);
  }

  return (
    <div className="toc">
      <input className="toc__input" placeholder="Search" onChange={onChangeSearch} value={search} />

      {isLoading
        ? <div>loading...</div>
        : <div className="toc__list">
          {data.map((item: Page ) => (<Cell key={item.id} data={item} />)) }
        </div>
      }
    </div>
  );
};