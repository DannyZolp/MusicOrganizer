import formatRelative from "date-fns/formatRelative";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Loading } from "../../components/General/Loading";
import { GetUniversalOrganization } from "../../functions/UniversalOrganization";
import { IPageProps } from "../../types/interface/IPageProps";
import { definitions } from "../../types/supabase";

interface Data {
  color: string;
  name: string;
  value: number;
}

const Dashboard = ({ supabase }: IPageProps) => {
  const [data, setData] = useState<Data[]>([]);
  const [leases, setLeases] = useState<definitions["leases"][]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase
      .from<definitions["scores"]>("scores")
      .select("id")
      .eq("organization_id", GetUniversalOrganization())
      .then(({ data: scores }) => {
        if (scores) {
          supabase
            .from<definitions["leases"]>("leases")
            .select("id, score_id, group_id, groups ( name, color )")
            .eq("organization_id", GetUniversalOrganization())
            .is("returned_at", null)
            .then(({ data: leases }) => {
              if (leases) {
                let groupIds = [] as string[];
                let groupNames = [] as string[];
                let groupColors = [] as string[];
                let counts = [] as number[];
                let amountIn = 0;

                for (let lease of leases) {
                  const pos = groupIds.findIndex((g) => lease.group_id === g);
                  if (pos >= 0) {
                    counts[pos]++;
                  } else {
                    groupIds.push(lease.group_id ?? "");
                    // @ts-expect-error
                    groupNames.push(lease.groups.name);
                    // @ts-expect-error
                    groupColors.push(lease.groups.color);
                    counts.push(1);
                  }
                }

                for (let score of scores) {
                  if (leases.findIndex((l) => l.score_id === score.id) < 0) {
                    // the score does not have an active lease associated with it
                    amountIn++;
                  }
                }

                setData([
                  ...groupIds.map((_g, idx) => {
                    return {
                      color: groupColors[idx],
                      name: groupNames[idx],
                      value: counts[idx],
                    };
                  }),
                  {
                    name: "IN",
                    color: "limegreen",
                    value: amountIn,
                  },
                ]);

                supabase
                  .from<definitions["leases"]>("leases")
                  .select("id, scores ( name ), groups ( name ), created_at")
                  .order("created_at", { ascending: false })
                  .eq("organization_id", GetUniversalOrganization())
                  .is("returned_at", null)
                  .limit(15)
                  .then(({ data }) => {
                    if (data) {
                      setLeases(data);
                      setLoading(false);
                    }
                  });
              }
            });
        }
      });
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="title">Dashboard</h1>
      {loading ? (
        <Loading />
      ) : (

      <div className="columns mb-4">
      <div className="column">
        <h2 className="subtitle">Current Scores Checked Out</h2>
        <Pie
          data={{
            labels: data.map((d) => d.name),
            datasets: [
              {
                data: data.map((d) => d.value),
                backgroundColor: data.map((d) => d.color),
              },
            ],
          }}
        />
      </div>
      <div className="column">
        <h2 className="subtitle">Recent Leases</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Score</th>
              <th>Group</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {leases.map((l, idx) => (
              <tr key={idx}>
                {/** @ts-expect-error */}
                <td>{l.scores.name}</td>
                {/** @ts-expect-error */}
                <td>{l.groups.name}</td>
                <td>
                  {formatRelative(new Date(l.created_at ?? ""), new Date())}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
      )}
    </div>
  );
};

export default Dashboard;
