// import { queryAttr, queryImg, queryText } from "./utils";

// export const getTeams = (doc: Document) => {
//   const teamCardColumns = doc.querySelectorAll(
//     ".teamcard-columns-4 > div > .template-box",
//   );

//   return Array.from(teamCardColumns).map(getTeam);
// };

// const getTeam = (teamCard: Element) => {
//   return {
//     name: queryText(teamCard, "center > a") || "TBD",
//     url: queryAttr(teamCard, "center > a", "href"),
//     flag: queryImg(teamCard, "center .flag img"),
//     region: queryAttr(teamCard, "center .flag a", "title"),
//     logo: queryImg(teamCard, ".wikitable.logo img"),
//     players: getPlayers(teamCard),
//   };
// };

// const getPlayers = (teamCard: Element) => {
//   const rows = teamCard.querySelectorAll(
//     ".teamcard-inner .wikitable.list tbody tr",
//   );
//   return Array.from(rows)
//     .map(getPlayer)
//     .filter((player) => player !== null);
// };

// const getPlayer = (row: Element) => {
//   const playerName = queryText(row, "td > a");
//   const playerUrl = queryAttr(row, "td > a", "href");
//   const playerCountry = queryAttr(row, "span.flag img", "alt");
//   const playerFlagImg = queryImg(row, "span.flag img");
//   const isCoach = queryText(row, "th") === "C";
//   const isSubstitute = queryText(row, "th") === "S";

//   return playerName
//     ? {
//         name: playerName,
//         url: playerUrl,
//         country: playerCountry,
//         flag: playerFlagImg,
//         isCoach,
//         isSubstitute,
//       }
//     : null;
// };

export {};
