import React, {FC, memo, MouseEvent, useEffect, useRef, useState} from 'react';
import { Anchor } from '../../app/types';

import './style.scss';

type AnchorsProps = {
  anchors: Anchor[];
};

const AnchorsContainer: FC<AnchorsProps> = ({ anchors }) => {
  const [active, setActive] = useState('');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // select first anchor
    if (anchors.length){
      setActive(anchors[0].anchor);
    }
  }, [anchors]);

  useEffect(() => {
    const handleObsever = (entries: any) => {
      entries.forEach((entry: any) => {
        if (entry?.isIntersecting && entry?.target?.id) {
          setActive(entry.target.id);
        }
      })
    }

    observer.current = new IntersectionObserver(handleObsever, {
      rootMargin: "-20% 0% -35% 0px"}
    )

    const elements = document.querySelectorAll("h1, h2, h3, h4");
    elements.forEach((elem) => observer.current?.observe(elem))

    return () => observer.current?.disconnect();
  }, [])

  const onClick = (event: MouseEvent<HTMLDivElement>, anchorId: string) => {
    event.preventDefault();
    setActive(anchorId);

    // scroll to selected anchor
    const el = document.querySelector(anchorId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    };
  };

  return (
    <div className="anchors">
      {!!anchors.length &&
        <div className="anchors__container">
          <div className="anchors__title">On this page:</div>
          <div className="anchors__content">
            {anchors.map((anchor) => {
              return (
                <div
                  className={`anchors__link ${active === anchor.anchor ? 'anchors__link_active' : ''}`}
                  key={anchor.id}
                  data-id={anchor.id}
                  onClick={(event: MouseEvent<HTMLDivElement>) => onClick(event, '#' + anchor.anchor)}
                >
                  {anchor.title}
                </div>
              );
            })}
          </div>
        </div>
      }
    </div>
  );
};

export const Anchors = memo(AnchorsContainer);
