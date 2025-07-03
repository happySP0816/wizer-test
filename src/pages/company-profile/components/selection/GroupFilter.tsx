import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/components/ui/radio-group";
import { Label } from "@/components/components/ui/label";

type GroupFilterProps = {
    onSelectGroup: (group: string) => void;
    data: { group: string }[];
};

const GroupFilter = ({ onSelectGroup, data }: GroupFilterProps) => {
    const [selectedGroup, setSelectedGroup] = useState("");
    // const [selectedGroup, setSelectedGroup] = React.useState<string>(
    //     Object.keys(decisionGroups.groups)[0] || ""
    //   );

    const handleChange = (value: string) => {
        setSelectedGroup(value);
        onSelectGroup(value);
    };

    return (
        <div>
            <div className="text-lg font-bold mb-2">Filter by Group</div>
            <RadioGroup value={selectedGroup} onValueChange={handleChange} className="flex flex-col gap-2">
                {data.map((item) => (
                    <div key={item.group} className="flex items-center space-x-2">
                        <RadioGroupItem value={item.group} id={item.group} />
                        <Label htmlFor={item.group} className="cursor-pointer">{item.group}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default GroupFilter;
