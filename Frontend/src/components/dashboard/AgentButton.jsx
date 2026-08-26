import { useState, useEffect } from "react";
import { apiUrl } from "../../lib/api";
import { Link } from "react-router";
import DashboardButton from "./DashboardButton";
export default function AgentButton() {
  const [count, setCount] = useState("");
  useEffect(() => {
    const x = async () => {
      try {
        const res = await fetch(apiUrl("/abc/abc"));
        setCount(res?.data?.count);
      } catch (e) {
        console.log(e);
      }
    };
    x();
  }, []);
  const x = count ? `(${count})` : "";
  return (
    <Link to={"/dashboard/agent"}>
      <DashboardButton variant="primary">Agent {x} </DashboardButton>
    </Link>
  );
}
