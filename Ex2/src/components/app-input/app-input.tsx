import clsx from 'clsx';
import React from 'react';
import './styles.css';

interface AppInputProps {
  className?: any;
  fullwidth?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: any;
}

const AppInput: React.FC<AppInputProps> = ({
  className,
  fullwidth,
  ...props
}) => {
  return (
    <input
      {...props}
      className={clsx('input', fullwidth && 'input-fullwidth', className)}
    />
  );
};

export default AppInput;
