import React, { FC, useMemo, useRef, useState, memo, MouseEvent } from 'react';
import { Page } from '../../app/types';

import './style.scss';

type CellProps = {
  page: Page;
}

const CellContainer: FC<CellProps> = ({ page }) => {
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(page.isOpen));
  const ref = useRef<HTMLAnchorElement>(null);

  const onOpenClick = (event: MouseEvent<HTMLAnchorElement>) => {
     if (!ref.current) {
       return;
     }

     // remove focus
     ref.current.blur();

    if (page.pages) {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  }

  // left padding for page level
  const cellStyle = useMemo(() => ({ 'paddingLeft': page.level * 16 + 22 + 'px' }), []);

  // calc max height for sub-pages list
  const listStyle = useMemo(() => ({ 'maxHeight': isOpen ? 2 * 38 * page.pagesCount + 'px' : ''}), [isOpen])  ;

  // calc background color for opened list
  const isOpenBackgroundColor = isOpen ? page.level % 2 === 0 ? 'cell__block_active' : 'cell__subblock_active' : '';

  return (
    <div className={`cell__block ${isOpenBackgroundColor}`}>
      <a
        className={`cell ${page.isActive ? 'cell_active' : '' }`}
        style={cellStyle}
        href={page.url}
        ref={ref}
        onClick={onOpenClick}
      >
        {page.pages ?
          <svg
            className={`cell__down-icon ${isOpen ? 'cell__down-icon_active' : ''}`}
            width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11 8L5 2.75L5 13.25L11 8Z"
            />
          </svg> : <div className="cell__empty-icon"></div>
        }
        <div className="cell__link" >{page.title}</div>
      </a>

      <div className="cell__list" style={listStyle}>
        {page.pages && (page.pages).map((item: Page) => (<Cell key={item.id} page={item} />))}
      </div>
    </div>
  );
};

export const Cell = memo(CellContainer);