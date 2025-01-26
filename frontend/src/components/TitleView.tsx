import { DialogButton, Focusable, Navigation, staticClasses } from '@decky/ui';
import { CSSProperties, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BsGearFill } from 'react-icons/bs';
import { FaArrowLeft, FaStore } from 'react-icons/fa';

import { useDeckyState } from './DeckyState';

const titleStyles: CSSProperties = {
  display: 'flex',
  paddingTop: '3px',
  paddingRight: '16px',
  position: 'sticky',
  top: '0px',
};

const buttonStyles: CSSProperties = {
  height: '28px',
  width: '40px',
  minWidth: 0,
  padding: '10px 12px',
};

const TitleView: FC = () => {
  const { activePlugin, closeActivePlugin } = useDeckyState();
  const { t } = useTranslation();

  const handleNavigation = (path: string) => {
    Navigation.Navigate(path);
    Navigation.CloseSideMenus();
  };

  if (!activePlugin) {
    return (
      <Focusable style={titleStyles} className={staticClasses.Title}>
        <div style={{ marginRight: 'auto', flex: 0.9 }}>Decky</div>
        <DialogButton
          style={buttonStyles}
          onClick={() => handleNavigation('/decky/store')}
          onOKActionDescription={t('TitleView.decky_store_desc')}
        >
          <FaStore style={{ marginTop: '-4px', display: 'block' }} />
        </DialogButton>
        <DialogButton
          style={buttonStyles}
          onClick={() => handleNavigation('/decky/settings')}
          onOKActionDescription={t('TitleView.settings_desc')}
        >
          <BsGearFill style={{ marginTop: '-4px', display: 'block' }} />
        </DialogButton>
      </Focusable>
    );
  }

  return (
    <Focusable className={staticClasses.Title} style={titleStyles}>
      <DialogButton style={buttonStyles} onClick={closeActivePlugin}>
        <FaArrowLeft style={{ marginTop: '-4px', display: 'block' }} />
      </DialogButton>
      {activePlugin.titleView || <div style={{ flex: 0.9 }}>{activePlugin.name}</div>}
    </Focusable>
  );
};

export default TitleView;
