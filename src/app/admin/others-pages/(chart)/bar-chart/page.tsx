import BarChartOne from "components/charts/bar/BarChartOne";
import ComponentCard from "components/common/ComponentCard";
import PageBreadcrumb from "components/common/PageBreadCrumb";
import { Metadata } from "next";

// rest of the file content unchanged
export const metadata: Metadata = {
  title: "Keepass - Bar Chart",
  description:
    "This is a bar chart page.",
  };

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bar Chart" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart 1">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
