import React from "react";
import DemographicCard from "components/keepass/DemographicCard";
import StatisticsChart from "components/keepass/StatisticsChart";

const AdminPage = () => {
  return (
    <div>
      <DemographicCard />
      <StatisticsChart />
    </div>
  );
};

export default AdminPage;
