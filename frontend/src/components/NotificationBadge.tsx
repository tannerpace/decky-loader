import React, { CSSProperties, FunctionComponent } from 'react';

interface NotificationBadgeProps {
  show?: boolean;
  style?: CSSProperties;
}

const NotificationBadge: FunctionComponent<NotificationBadgeProps> = ({ show = false, style }) => {
  if (!show) {
    return <></>;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        height: '10px',
        width: '10px',
        background: 'orange',
        borderRadius: '50%',
        ...style,
      }}
    />
  );
};

export default NotificationBadge;
