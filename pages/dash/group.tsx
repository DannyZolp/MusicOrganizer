import { useEffect, useState } from "react";
import { Loading } from "../../components/General/Loading";
import { AboutGroup } from "../../components/Group/About";
import { CreateGroup, IGroup } from "../../components/Group/Create";
import { UpdateGroup } from "../../components/Group/Update";
import { GetUniversalOrganization } from "../../functions/UniversalOrganization";
import { IPageProps } from "../../types/interface/IPageProps";
import { definitions } from "../../types/supabase";

const Group = ({ supabase }: IPageProps) => {
  const [showAbout, setShowAbout] = useState("");
  const [showEdit, setShowEdit] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const [groups, setGroups] = useState<definitions["groups"][]>([]);
  const [piecesCheckedOut, setPiecesCheckedOut] = useState<number[]>([]);

  const fetchGroups = () => {
    setLoading(true);
    supabase
      .from("groups")
      .select("*")
      .eq("organization_id", GetUniversalOrganization())
      .then(({ data, error }) => {
        if (error) throw error;
        if (data) {
          setGroups(data);

          Promise.all(
            data.map((group) => {
              return supabase
                .from<definitions["leases"]>("leases")
                .select("score_id", { count: "exact", head: true })
                .eq("group_id", group.id)
                .is("returned_at", null)
                .eq("organization_id", GetUniversalOrganization())
                .then((c) => c.count);
            })
          ).then((checkedOut) => {
            if (checkedOut) {
              setPiecesCheckedOut(checkedOut as number[]);
              setLoading(false);
            }
          });
        }
      });
  };

  const createGroup = (group: IGroup) => {
    supabase
      .from("groups")
      .insert([
        {
          ...group,
          owner_id: supabase.auth.user()?.id,
          organization_id: GetUniversalOrganization(),
        },
      ])
      .then(() => setShowCreate(false))
      .then(fetchGroups);
  };

  const updateGroup = (group: definitions["groups"]) => {
    supabase
      .from("groups")
      .update(group)
      .eq("id", group.id)
      .then(() => setShowEdit(""))
      .then(fetchGroups);
  };

  const deleteGroup = (groupId: string) => {
    supabase.from("groups").delete().eq("id", groupId).then(fetchGroups);
  };

  useEffect(fetchGroups, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="container mt-4">
      {showAbout ? (
        <AboutGroup
          group={groups.find((g) => g.id === showAbout)}
          close={() => setShowAbout("")}
          edit={() => {
            setShowEdit(showAbout);
            setShowAbout("");
          }}
          del={() => {
            deleteGroup(showAbout);
            setShowAbout("");
          }}
          scores={supabase
            .from<definitions["leases"]>("leases")
            .select("scores ( * )")
            .eq("group_id", showAbout)
            .is("returned_at", null)
            .then((s) => s.data)}
        />
      ) : null}
      {showEdit ? (
        <UpdateGroup
          close={() => setShowEdit("")}
          update={updateGroup}
          group={groups.find((g) => g.id === showEdit) as definitions["groups"]}
        />
      ) : null}
      {showCreate ? (
        <CreateGroup
          close={() => {
            setShowCreate(false);
          }}
          create={(g) => {
            createGroup(g);
            setShowCreate(false);
          }}
        />
      ) : null}

      <h1 className="title">Groups</h1>
      <div className="buttons">
        <button
          onClick={() => setShowCreate(true)}
          className="button is-primary"
        >
          Create Group
        </button>
      </div>
      <div className="columns is-multiline">
        {groups.map((group, idx) => (
          <div className="column is-one-third" key={idx}>
            <div
              className="card is-clickable"
              onClick={() => setShowAbout(group.id)}
            >
              <header className="card-header">
                <h1 className="card-header-title">
                  <span
                    style={{
                      backgroundColor: group.color,
                      height: "1rem",
                      width: "1rem",
                      marginRight: "0.5rem",
                    }}
                  />
                  {group.name}
                </h1>
              </header>
              <div className="card-content">
                <p>
                  {group.description ? group.description : "No description"}
                </p>
                <hr />
                <p>
                  {piecesCheckedOut[idx] ?? 0}{" "}
                  {piecesCheckedOut[idx] === 1 ? "score" : "scores"} currently
                  checked out
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <table className="table">
          <thead>
            <tr>
              <th>
                Name
              </th>
              <th>
                <abbr title="Number of Pieces Checked Out"># Pieces</abbr>
              </th>
            </tr>
  
          </thead>
          <tbody>
            {
              groups.map((group, idx) => (
                <tr>
                  <td><a href={`/dash/group/${group.id}`}>{group.name}</a></td>
                  <td>{piecesCheckedOut[idx]}</td>
                </tr>
              ))
            }
          </tbody>
  
        </table> */}
    </div>
  );
};

export default Group;
