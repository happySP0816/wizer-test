import React from "react";

interface ProgressCircleProps {
    value: number
    size: number
    innerCircleColor: string
    outerCircleColor: string
    strokeWidth: number
}

export const ProgressCircle = (props: ProgressCircleProps) => {
    return (
        <div
            className="relative flex justify-center items-center"
            style={{ width: props.size, height: props.size, marginBottom: "0.25rem" }}
        >
            <svg width="100%" height="100%" viewBox="0 0 36 36">
                <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    strokeWidth={props.strokeWidth/2}
                    stroke={props.innerCircleColor}
                />
                <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="transparent"
                    stroke={props.outerCircleColor}
                    strokeWidth={props.strokeWidth}
                    strokeDasharray={`${props.value}, 100`}
                    strokeDashoffset="0"
                    transform="rotate(-90 18 18)"
                />
            </svg>
            <span
                className="absolute font-bold"
                style={{
                    fontSize: `${1.125 * props.size / 100}rem`,
                    color: "black",
                }}
            >
                {props.value}%
            </span>
        </div>
    )
}