import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loading } from "../../components/General/Loading";
import { AboutScore } from "../../components/Score/About";
import { CheckScore } from "../../components/Score/Check";
import { CreateScore } from "../../components/Score/Create";
import { UpdateScore } from "../../components/Score/Update";
import { GetUniversalOrganization } from "../../functions/UniversalOrganization";
import { IPageProps } from "../../types/interface/IPageProps";
import { IScoreInput } from "../../types/interface/IScoreInput";
import { definitions } from "../../types/supabase";

// this is the amount of scores that will be loaded each time
const loadSize = 20;

const Score = ({ supabase }: IPageProps) => {
  const router = useRouter();
  const { check } = router.query;

  const [fetched, setFetched] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState("");
  const [showAbout, setShowAbout] = useState("");
  const [showCheck, setShowCheck] = useState("");
  const [last, setLast] = useState<number>(loadSize + 1);
  const [noneLeft, setNoneLeft] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const [scores, setScores] = useState<definitions["scores"][]>([]);
  const [groups, setGroups] = useState<definitions["groups"][]>([]);
  const [checkedToGroup, setCheckedToGroup] = useState<
    (definitions["leases"] | null)[]
  >([]);

  const fetchScores = () => {
    setFetched(false);
    if (search.length > 0) {
      supabase
        .from<definitions["scores"]>("scores")
        .select(
          `
        id,
        custom_id,
        name,
        author,
        level,
        description
        `,
          { count: "exact" }
        )
        .eq("organization_id", GetUniversalOrganization())
        .range(0, loadSize)
        .order("name")
        .textSearch("name", search)
        .then(({ data }) => {
            setScores(data ?? []);

            Promise.all(
              (data ?? []).map((s) => {
                return supabase
                  .from<definitions["leases"]>("leases")
                  .select(
                    `
              id,
              score_id,
              groups (
                name
              )
            `
                  )
                  .eq("organization_id", GetUniversalOrganization())
                  .is("returned_at", null)
                  .eq("score_id", s.id)
                  .then(({ data }) => (data ? data[0] : null));
              })
            ).then((groups) => {
              setCheckedToGroup(groups);

              supabase
                .from<definitions["groups"]>("groups")
                .select("id, name")
                .then(({ data }) => {
                  setGroups(data ? data : []);
                  setFetched(true);
                });
            });
        });
    } else {
      supabase
        .from<definitions["scores"]>("scores")
        .select(
          `
      id,
      custom_id,
      name,
      author,
      level,
      description
      `,
          { count: "exact" }
        )
        .eq("organization_id", GetUniversalOrganization())
        .range(0, loadSize)
        .order("name")
        .then(({ data }) => {
          if (data) {
            setScores(data);

            Promise.all(
              data.map((s) => {
                return supabase
                  .from<definitions["leases"]>("leases")
                  .select(
                    `
            id,
            score_id,
            groups (
              name
            )
          `
                  )
                  .eq("organization_id", GetUniversalOrganization())
                  .is("returned_at", null)
                  .eq("score_id", s.id)
                  .then(({ data }) => (data ? data[0] : null));
              })
            ).then((groups) => {
              setCheckedToGroup(groups);

              supabase
                .from<definitions["groups"]>("groups")
                .select("id, name")
                .then(({ data }) => {
                  setGroups(data ? data : []);
                  setFetched(true);
                });
            });
          }
        });
    }
  };

  const createScore = (score: IScoreInput) => {
    supabase
      .from<definitions["scores"]>("scores")
      .insert({
        ...score,
        owner_id: supabase.auth.user()?.id,
        organization_id: GetUniversalOrganization(),
      })
      .then(() => {
        setShowCreate(false);
      })
      .then(fetchScores);
  };

  const updateScore = (score: definitions["scores"]) => {
    supabase
      .from<definitions["scores"]>("scores")
      .update({
        ...score,
      })
      .eq("id", score.id)
      .then(() => setShowUpdate(""))
      .then(fetchScores);
  };

  const deleteScore = (id: string) => {
    supabase
      .from<definitions["scores"]>("scores")
      .delete()
      .eq("id", id)
      .then(fetchScores);
  };

  const checkScore = (id: string, groupId?: string) => {
    if (groupId) {
      // we have to create a new check in
      // first, we "close" the previous lease (just in case there was an issue)
      supabase
        .from<definitions["leases"]>("leases")
        .update({
          returned_at: new Date().toISOString(),
        })
        .is("returned_at", null)
        .eq("score_id", id)
        .then(() => {
          // create the new lease
          supabase
            .from<definitions["leases"]>("leases")
            .insert({
              score_id: id,
              group_id: groupId,
              owner_id: supabase.auth.user()?.id,
              organization_id: GetUniversalOrganization(),
            })
            .then(({ error }) => {
              if (error) toast(error.message, { type: "error" });
            })
            .then(() => setShowCheck(""))
            .then(fetchScores);
        });
    } else {
      // we have to check in the previous lease and create a new "empty" lease
      supabase
        .from<definitions["leases"]>("leases")
        .update({
          returned_at: new Date().toISOString(),
        })
        .is("returned_at", null)
        .eq("score_id", id)
        .then(({ error }) => {
          if (error) toast(error.message, { type: "error" });
        })
        .then(() => setShowCheck(""))
        .then(fetchScores);
    }
  };

  const loadNext = () => {
    setLoadingMore(true);
    supabase
      .from<definitions["scores"]>("scores")
      .select(
        `
      id,
      custom_id,
      name,
      author,
      level,
      description
      `
      )
      .range(last, last + loadSize)
      .order("name")
      .textSearch("name", search)
      .then(({ data }) => {
        if (data) {
          if (data.length <= 0) {
            setLoadingMore(false);
            setNoneLeft(true);
          } else {
            setLoadingMore(false);
            setLast(last + loadSize);
            setScores([...scores, ...data]);
          }
        }
      });
  };

  useEffect(() => {
    setFetched(false);
    const timeout = setTimeout(fetchScores, 1000);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(fetchScores, []);

  useEffect(() => {
    if (check) {
      setShowCheck(check as string);
    }
  }, [check]);

  return (
    <>
      {showCreate ? (
        <CreateScore
          create={(s) => {
            createScore(s);
          }}
          close={() => setShowCreate(false)}
        />
      ) : null}
      {showAbout ? (
        <AboutScore
          score={scores.find((s) => s.id === showAbout)}
          close={() => setShowAbout("")}
          edit={() => {
            setShowUpdate(showAbout);
            setShowAbout("");
          }}
          del={() => {
            deleteScore(showAbout);
            setShowAbout("");
          }}
          fetchLeases={supabase
            .from<definitions["leases"]>("leases")
            .select(
              `
            id,
            created_at,
            returned_at,
            groups (
              name
            )
          `
            )
            .eq("score_id", showAbout)
            .order("created_at", { ascending: false })
            .then(({ data }) => data)}
        />
      ) : null}
      {showUpdate ? (
        <UpdateScore
          update={(s) => {
            updateScore(s);
          }}
          close={() => setShowUpdate("")}
          score={scores.find((s) => s.id === showUpdate)}
        />
      ) : null}
      {showCheck ? (
        <CheckScore
          check={(id, gid) => {
            checkScore(id, gid);
          }}
          score={scores.find((s) => s.id === showCheck)}
          lease={checkedToGroup.find((g) => g?.score_id === showCheck)}
          groups={groups}
          close={() => setShowCheck("")}
        />
      ) : null}
      <main className="container mt-4">
        <h1 className="title">Scores</h1>
        <div className="buttons">
          <button
            onClick={() => setShowCreate(true)}
            className="button is-primary"
          >
            Add Score
          </button>
        </div>
        <input
          className="input is-rounded mb-2"
          type="text"
          placeholder="Search by Name"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        {fetched ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <abbr title="Identification Code">ID</abbr>
                  </th>
                  <th>Checked to</th>
                  <th>
                    <abbr title="Level">Lvl</abbr>
                  </th>
                  <th>
                    <FontAwesomeIcon icon={faSortDown} /> Name
                  </th>
                  <th>Author</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, idx) => (
                  <tr key={idx}>
                    <td>{score.custom_id}</td>
                    <td>
                      <a
                        onClick={() => setShowCheck(score.id)}
                        className={
                          checkedToGroup[idx] ? "" : "has-text-success"
                        }
                      >
                        {checkedToGroup[idx]
                          ? // @ts-expect-error
                            checkedToGroup[idx].groups.name
                          : "[ IN ]"}
                      </a>
                    </td>
                    <td>{score?.level ?? "(None)"}</td>
                    <td>
                      <a onClick={() => setShowAbout(score.id)}>{score.name}</a>
                    </td>
                    <td>{score.author}</td>
                    <td>
                      {(score?.description?.length ?? 0) < 1
                        ? "(None)"
                        : (score?.description?.length ?? 0) > 150
                        ? score?.description?.substring(0, 150) + "..."
                        : score.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="is-flex m-2">
              <button
                onClick={loadNext}
                className={`button ${loadingMore ? "is-loading" : ""}`}
                disabled={noneLeft}
              >
                Load More
              </button>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </main>
    </>
  );
};

export default Score;
