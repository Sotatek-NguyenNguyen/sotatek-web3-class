import React from 'react';
import clsx from 'clsx';
import './styles.css';

interface AppButtonProps {
  children: any;
  className?: any;
  onClick?: () => any;
  loading?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  children,
  className,
  loading,
  ...props
}) => {
  return (
    <button className={clsx(`button`, className)} {...props} disabled={loading}>
      {children}
    </button>
  );
};

export default AppButton;
