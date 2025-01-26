import { FC, ReactNode, createContext, useContext, useState, useCallback } from 'react';

type TabType = {
  initialVisibility: boolean;
  setVisibility?: (val: boolean) => void;
};

const QuickAccessVisibleState = createContext<boolean>(false);
const QuickAccessVisibilitySetterContext = createContext<(val: boolean) => void>(() => {});

export const useQuickAccessVisible = () => useContext(QuickAccessVisibleState);
export const useSetQuickAccessVisible = () => useContext(QuickAccessVisibilitySetterContext);

export const QuickAccessVisibleStateProvider: FC<{ tab: TabType; children: ReactNode }> = ({ children, tab }) => {
  const { initialVisibility } = tab;
  const [visible, setVisible] = useState<boolean>(initialVisibility);

  // Callback to set visibility safely
  const setVisibility = useCallback(
    (val: boolean) => {
      if (val !== visible) {
        setVisible(val);
      }
    },
    [visible]
  );

  // Update the setter on the `tab` object
  if (tab) {
    tab.setVisibility = setVisibility;
  }

  return (
    <QuickAccessVisibleState.Provider value={visible}>
      <QuickAccessVisibilitySetterContext.Provider value={setVisibility}>
        {children}
      </QuickAccessVisibilitySetterContext.Provider>
    </QuickAccessVisibleState.Provider>
  );
};
