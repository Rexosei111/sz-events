import AdminLayout from "@/components/admin/layout";
import React from "react";

export default function Dashboad() {
  return <div>Dashboad</div>;
}

Dashboad.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
};
