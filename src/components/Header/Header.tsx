import React, { FC, memo } from 'react';
import { Theme } from '../../app/constants';

import './style.scss';

type Props = {
  theme: Theme;
  onChangeTheme: () => void;
};

const HeaderContainer: FC<Props> = ({ theme, onChangeTheme }) => {
  return (
    <div className="header">
      <h4 className="header__title">Table of Contents component</h4>
      <div className="header__theme">Theme: <a className="header__link" onClick={onChangeTheme}>{theme}</a></div>
    </div>
  );
};

export const Header = memo(HeaderContainer);