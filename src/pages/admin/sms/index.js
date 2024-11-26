import AdminLayout from "@/components/admin/layout";
import React from "react";

export default function SMS() {
  return <div>SMS</div>;
}

SMS.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
};
