import { Typography } from '@/components/components/ui/typography';

interface BarLegendProps {
    profileColors: Record<string, string>
}

const BarLegend = (props: BarLegendProps) => {
    return (
        <div className="absolute right-0 top-0 flex flex-col gap-1">
            <Typography variant="body2" className="mb-1">Profile Types</Typography>
            {Object.keys(props.profileColors).map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                    {/* Legend Color Box */}
                    <span style={{ backgroundColor: props.profileColors[label as keyof typeof props.profileColors], width: 15, height: 15, display: 'inline-block', borderRadius: 3 }} />
                    {/* Label Text */}
                    <Typography variant="body2">{label.charAt(0).toUpperCase() + label.slice(1)}</Typography>
                </div>
            ))}
        </div>
    );
}

export default BarLegend