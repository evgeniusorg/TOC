import React, {FC, useMemo, useRef, useState, memo} from 'react';
import './style.scss';
import { Page } from '../../app/types';

type CellProps = {
  data: Page;
}

const CellContainer: FC<CellProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  const onOpenClick = (event: any) => {
     if (!ref.current) {
       return;
     }

     ref.current.blur();
     let parent = ref.current.parentElement;

    if (data.pages) {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  }

  const cellStyle = useMemo(() => ({ 'paddingLeft': data.level * 16 + 22 + 'px' }), []);
  const isOpenBackgroundColor = isOpen ? data.level % 2 === 0 ? 'cell__block_active' : 'cell__subblock_active' : '';

  return (
    <div className={`cell__block ${isOpenBackgroundColor}`}>
      <a className="cell" style={cellStyle} href={data.url} ref={ref} onClick={onOpenClick}>
        {data.pages ?
          <svg className={`cell__down-icon ${isOpen ? 'cell__down-icon_active' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11 8L5 2.75L5 13.25L11 8Z"
            />
          </svg> : <div className="cell__empty-icon"></div>
        }
        <div className="cell__link" >{data.title}</div>
      </a>

      <div className={`cell__list ${isOpen ? 'cell__list_is-open' : ''}`}>
        {data.pages && data.pages.map((item: Page) => (<Cell key={item.id} data={item} />))}
      </div>
    </div>
  );
};

export const Cell = memo(CellContainer);