import React from "react";

type ToggleProps = {
    view: string;
    setView: (view: string) => void;
};

const toggleOptions = ["Internal", "External", "All"];

const ToggleButtonGroupComponent: React.FC<ToggleProps> = ({ view, setView }) => {
    return (
        <div className="inline-flex rounded-md shadow-sm bg-gray-100">
            {toggleOptions.map(option => (
                <button
                    key={option}
                    type="button"
                    className={`px-4 py-2 text-sm font-medium border border-gray-300 first:rounded-l-md last:rounded-r-md focus:z-10 transition-colors
                        ${view === option ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}
                        -ml-px first:ml-0
                    `}
                    onClick={() => setView(option)}
                    aria-pressed={view === option}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default ToggleButtonGroupComponent;
