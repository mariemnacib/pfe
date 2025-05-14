import LineChartOne from "components/charts/line/LineChartOne";
import ComponentCard from "components/common/ComponentCard";
import PageBreadcrumb from "components/common/PageBreadCrumb";
import { Metadata } from "next";

// rest of the file content unchanged
export const metadata: Metadata = {
  title: "Keepass - Line Chart",
  description:
    "This is a line chart page.",  
};
export default function LineChart() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        <ComponentCard title="Line Chart 1">
          <LineChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
