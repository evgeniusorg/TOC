import React, { FC, memo, useEffect, useState } from 'react';
import { getFilterTree } from '../../helpers/helpers';
import { Page } from '../../app/types';
import { Cell } from '../Cell/Cell';
import { Skeleton } from '../Skeleton/Skeleton';
import { SKELETONS, DEBOUNCE_DELAY, SEARCH_MIN_LENGTH } from './constants';

import './style.scss';

let searchTimeoutId: ReturnType<typeof setTimeout>;

type TocProps = {
  tree: Page[],
  isLoading: boolean;
  onSetIsLoading: (val: boolean) => void;
};

const TocComponent: FC<TocProps> = ({ isLoading, tree, onSetIsLoading }) => {
  const [sortedTree, setSortedTree] = useState<Page[]>(tree);
  const [search, setSearch] = useState<string>('');

  useEffect(() => setSortedTree(tree), [tree]);

  const onFilterTree = (value: string) => {
    const clearSearch = value.trim().toLowerCase();

    if (clearSearch.length < SEARCH_MIN_LENGTH) {
      setSortedTree(tree);
      onSetIsLoading(false);
      return;
    }

    setSortedTree(getFilterTree(tree, clearSearch));
    onSetIsLoading(false);
  }

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearch(value);
    onSetIsLoading(true);

    if (searchTimeoutId) {
      clearTimeout(searchTimeoutId);
    }

    // debounce for filter of tree
    searchTimeoutId = setTimeout(() => onFilterTree(value), DEBOUNCE_DELAY);
  }

  return (
    <div className="toc">
      <input className="toc__input" placeholder="Search" onChange={onChangeSearch} value={search} />

      {isLoading
        ? <div className="toc_loading">
          {SKELETONS.map((width, index) => (<Skeleton width={width} key={index} />))}
        </div>
        : <div className="toc__list">
          {sortedTree.map((page: Page ) => (<Cell key={page.id} page={page} />)) }
        </div>
      }
    </div>
  );
};

export const Toc = memo(TocComponent);