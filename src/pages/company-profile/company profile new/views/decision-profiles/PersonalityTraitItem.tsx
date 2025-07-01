import { ProgressCircle } from "../../components/circle-charts/ProgressCircle";

interface Trait {
    value: number;
    name: string;
    color: string;
    label: string;
}

interface PersonalityTraitProps {
    data: Trait[];
    title: string;
    name: string;
}

// Individual Personality Trait Item Component
const PersonalityTraitItem = ({
    value,
    name,
    color,
    fontSize,
}: {
    value: number;
    name: string;
    color: string;
    fontSize: string;
}) => (
    <div className="flex flex-col items-center gap-1">
        <ProgressCircle value={value} size={50} innerCircleColor="#e0e0e0" outerCircleColor={color} strokeWidth={4} />
        <div className="w-20 text-center font-bold" style={{ fontSize }}>{name}</div>
    </div>
);

// Main Personality Trait Component
const PersonalityTrait = ({data, title, name}: PersonalityTraitProps) => {
    const largestTrait = data.reduce((max: Trait, trait: Trait) => 
        trait.value > max.value ? trait : max, data[0]
    );
    
    return (
        <div className="flex flex-col md:flex-row items-center gap-8 h-[300px] w-full pr-10">
            {/* Primary Personality Trait */}
            <div className="flex flex-col items-center gap-4 w-[300px] h-full justify-center">
                <ProgressCircle value={largestTrait.value} size={150} innerCircleColor="#bcbcbb" outerCircleColor="#5CB85C" strokeWidth={4} />
                <div className="text-base font-bold">{largestTrait.name}</div>
            </div>

            {/* Text Section */}
            <div className="flex-1">
                <div className="text-lg font-bold">{title}</div>
                <div className="text-base font-bold text-black mb-4">
                    Overall: <span className="font-normal">{largestTrait.name}</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                    xxx
                </div>
                <div className="text-sm font-bold text-[#7B69AF] mt-2 mb-4">
                    {name}
                </div>
                <div className="flex flex-row justify-between mt-1">
                    {data.map((trait: Trait) => (
                        <PersonalityTraitItem key={trait.label} {...trait} fontSize="12px"/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PersonalityTrait;