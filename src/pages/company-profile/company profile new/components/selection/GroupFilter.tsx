import React from "react";

// import { diversityChartData } from "../../utils/ChartData.ts.old";

type GroupFilterProps = {
    onSelectGroup: (group: string) => void;
    data: any;
};

const GroupFilter: React.FC<GroupFilterProps> = ({ onSelectGroup, data }) => {
    const [selectedGroup, setSelectedGroup] = React.useState("");
    // const [selectedGroup, setSelectedGroup] = React.useState<string>(
    //     Object.keys(decisionGroups.groups)[0] || ""
    //   );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const groupName = event.target.value;
        setSelectedGroup(groupName);
        onSelectGroup(groupName);
    };

    return (
        <div>
            <div className="text-lg font-bold mb-2">Filter by Group</div>
            <div role="radiogroup" className="flex flex-col gap-2">
                {data.map((item: any) => (
                    <label key={item.group} className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="group"
                            value={item.group}
                            checked={selectedGroup === item.group}
                            onChange={handleChange}
                            className="form-radio text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="text-base">{item.group}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default GroupFilter;
