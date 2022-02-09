async function request(path, options = {}) {
    const url = `http://localhost:3039${path}`;
    const response = await fetch(url, options);
    return response.json();
}
export async function getRest(arg = {}) {
    const params = new URLSearchParams(arg);
    return request(`/restaurants?${params.toString()}`);
}
export async function getIdeaPoints(_teamId) {
    return request(`/ideaPoint/${_teamId}`);
}
export async function getHold(_origin) {
    return request(`/alert/${_origin}`);
}
export async function getTeamsCount() {
    return request(`/teamscount`);
}
export async function getIdeas() {
    return request(`/teamsview`);
}
export async function getIdeaPlayers(_ideaId) {
    return request(`/teamsuser/${_ideaId}`);
}
export async function getIdeaOne(_teamId) {
    return request(`/oneidea/${_teamId}`);
}
export async function getPlayers(_playerId) {
    return request(`/playerview/${_playerId}`);
}
export async function getTeams(_playerId) {//show teamids of the 
    return request(`/playteams/${_playerId}`);//player ptcp in
}
export async function getPlayersId(_playerAddr) {
    return request(`/playerid/${_playerAddr}`);
}
export async function getTeamPlayers(_teamId) {
    return request(`/teamplayers/${_teamId}`);
}
export async function putUpdateIdea(record) {
    console.log('v', JSON.stringify(record));
    return request(`/joinidea`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "PUT",
    });
}
export async function postHoldIdea(record) {
    console.log('v', JSON.stringify(record));
    return request(`/requirejoin`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "POST",
    });
}
export async function postCreateIdea(record) {
    console.log('v', JSON.stringify(record));
    return request(`/ideacreate`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "POST",
    });
}
export async function postUserRegi(record) {
    console.log('v', JSON.stringify(record));
    return request(`/regiplayer`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "POST",
    });
}
export async function dltHold(_holdId) {
    console.log('v', _holdId);
    return request(`/dlthold/${_holdId}`, {
      headers: {"Content-Type": "application/json"},
      method: "DELETE",
    });
}