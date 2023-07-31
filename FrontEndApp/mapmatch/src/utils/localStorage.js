export const lsGetToken = () => {
    const lstoken = localStorage.getItem("token");
    return lstoken;
};

export const lsSetToken = (token) =>
    localStorage.setItem("token", token);

export const lsRemoveToken = () => localStorage.removeItem("token");

export const lsReplaceToken = (token) => {
    lsRemoveToken();
    lsSetToken(token);
};

export const lsGetUser = () => JSON.parse(localStorage.getItem("user") || "{}");

export const lsSetUser = (user) =>
    localStorage.setItem("user", JSON.stringify(user));

export const lsRemoveUser = () => localStorage.removeItem("user");
