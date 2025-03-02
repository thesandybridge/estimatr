"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function setupOrg() {
      try {
        const res = await fetch("/api/create-org", { method: "POST" });
        const data = await res.json();
        if (data.success) {
          console.log("✅ Organization set up successfully:", data.orgId);
        } else {
          console.error("❌ Error setting up organization:", data.error);
        }
      } catch (error) {
        console.error("❌ Network error setting up organization:", error);
      } finally {
        setLoading(false);
      }
    }

    setupOrg();
  }, []);

  return <div>{loading ? "Setting up your organization..." : "Welcome to the Dashboard!"}</div>;
}
