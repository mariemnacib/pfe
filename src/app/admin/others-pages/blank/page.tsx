import PageBreadcrumb from "components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Blank Page ",
  description: "This is a blank page",};

export default function BlankPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Blank Page" />
      {/* Blank page content */}
    </div>
  );
}
