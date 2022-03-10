export const SetUniversalOrganization = (id: string) => {
  window.localStorage.setItem("universal_org", id);
};

export const GetUniversalOrganization = () => {
  return window.localStorage.getItem("universal_org") ?? "";
};

export const ClearUniversalOrganization = () => {
  window.localStorage.removeItem("universal_org");
};
