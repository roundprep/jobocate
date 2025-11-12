import { useState } from 'react';

// Reusable UI Components
export const Section = ({ title, description, children, className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    <div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export const Toggle = ({ enabled, setEnabled, label, description }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-900">{label}</p>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
    <button
      type="button"
      className={`${enabled ? 'bg-orange-600' : 'bg-gray-200'} 
        relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent 
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500`}
      onClick={() => setEnabled(!enabled)}
    >
      <span className={`${enabled ? 'translate-x-5' : 'translate-x-0'} 
        inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200`} />
    </button>
  </div>
);

export const InputField = ({ label, type = 'text', name, value, onChange, error, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 
        focus:ring-orange-500 sm:text-sm ${error ? 'border-red-500' : ''}`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', ...props }) => {
  const baseStyles = 'inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'border-transparent text-white bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
    secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-orange-500',
    danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true" 
          onClick={onClose}
        />
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {title}
              </h3>
              <div className="mt-2">
                {children}
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button variant="danger" className="ml-3" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
