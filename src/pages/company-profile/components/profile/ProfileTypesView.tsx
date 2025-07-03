import DecisionProfilesDashboard from "./decisionProfiles";

const ProfileTypesView = ({ data, insights }: any) => {
  return (
    <DecisionProfilesDashboard data={data} insights={insights} />
  );
};

export default ProfileTypesView;
