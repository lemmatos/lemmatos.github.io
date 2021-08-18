// https://www.thesportsdb.com/api.php
const apiAddress = 'https://www.thesportsdb.com/api/v1/json/1'

const body = document.querySelector("body")
const title = document.querySelector("#title")
const mainHeader = document.querySelector("#main_header")
const content = document.querySelector("#content")

let sports = []
let leagues = []
let teams = []

const DATA_TYPES = {
  SPORT: "SPORT",
  LEAGUE: "LEAGUE",
  TEAM: "TEAM",
}

// -----------------------------
// DOM manipulation
// -----------------------------

const addContent = (text) => {
  const newParagraph = document.createElement('p')
  text 
  ? newParagraph.append(text)
  : newParagraph.append(`This is paragraph ${content.children.length + 1}`)
  content.appendChild(newParagraph)
}

const clearMain = () => {
  clearMainHeader()
  clearContent()
  appendMainHeader("Select one option to start...")
}

const clearMainHeader = () => {
  const childCount = mainHeader.childElementCount
  for (i=0 ; i < childCount ; i++){
    mainHeader.lastChild.remove()
  }
}
const clearContent = () => {
  const childCount = content.childElementCount
  for (i=0 ; i < childCount ; i++){
    content.lastChild.remove()
  }
}

const appendCard = (onClick, title, imageUrl) => {
  const newDiv = document.createElement('div')
  const newH3 = document.createElement('h3')
  const newImage = document.createElement('img')

  newDiv.classList.add('card')
  newH3.append(title)
  
  if(imageUrl) {
    newDiv.appendChild(newImage)
    newImage.setAttribute('src', imageUrl)
    newImage.setAttribute('alt', `${title} image`)
  }
  // newLink.setAttribute('href', ``)
  newDiv.appendChild(newH3)
  newDiv.onclick = onClick

  content.appendChild(newDiv)
}

const appendMainHeader = (title, description) => {
  const newH2 = document.createElement('h2')
  const newDescription = document.createElement('p')

  newH2.append(title)

  if (description){
    newDescription.append(description)
  }

  mainHeader.appendChild(newH2)
  mainHeader.appendChild(newDescription)
}

const generateCards = (type) => {
  console.log("Generating cards...")
  console.log(type)
  clearMainHeader()
  clearContent()
  switch (type){
    case DATA_TYPES.SPORT:
      console.log(sports)
      appendMainHeader("Sports")
      sports.forEach(item => item.strSport && item.strSport && item.strSportThumb && 
        appendCard(() => getLeagues(item.strSport), item.strSport,item.strSportThumb)
      )
      break;
    case DATA_TYPES.LEAGUE:
      console.log(leagues)
      console.log(leagues[0].strSport)
      if (leagues[0].strBadge){
        appendMainHeader(leagues[0].strSport, sports.find(sport => sport.strSport === leagues[0].strSport).strSportDescription)
        leagues.forEach(item => appendCard(() => getLeagueTeams(item.idLeague), item.strLeague, item.strBadge))
      }
      else {
        appendMainHeader("All sport leagues")
        leagues.forEach(item => appendCard(() => getLeagueTeams(item.idLeague), item.strLeague))
      }
    break;
    case DATA_TYPES.TEAM:
      console.log(teams)
      appendMainHeader(teams[0].strLeague, leagues.find(league => league.idLeague === teams[0].idLeague).strDescriptionEN)
      teams.forEach(item => appendCard(() => getLeagues(item.strSport), item.strTeam, item.strTeamBadge))
      break;
    default:
      break;
  }

}

// -----------------------------
// Data fetching
// -----------------------------

const getAllSports = async () => {
  
  if (sports.length > 0){
    console.log("Loading sports from cache")
    generateCards(DATA_TYPES.SPORT)
    return sports
  } 
  else {
    const newSports = fetch(`${apiAddress}/all_sports.php`, {})
      .then(res => {
          console.log("Fetching data", res)
          return res.json()
      })
      .then(data => {
        sports = data.sports
        generateCards(DATA_TYPES.SPORT)
      })
      .catch(err => console.log("Something went wrong fetching the data...", err))
    return newSports
  }
}

const getLeagues = async (sportName) => {
  if (leagues.length > 0 && leagues[0].strSport === sportName){
    console.log("Loading leagues from cache")
    generateCards(DATA_TYPES.LEAGUE)
    return leagues
  }
  else {
    const newLeagues = fetch(`${apiAddress}/${sportName ? "search_all_leagues.php?s=" + sportName : "all_leagues.php"}`, {})
      .then(res => {
          console.log("Fetching data", res)
          return res.json()
        })
        .then(data => {
          if (sportName){
            leagues = data.countrys
            generateCards(DATA_TYPES.LEAGUE)
          }
          else {
            leagues = data.leagues
            generateCards(DATA_TYPES.LEAGUE)
          }
        })
        .catch(err => console.log("Something went wrong fetching the data...", err))
    return newLeagues
  }
}

const getLeagueTeams = async (idLeague) => {
  if (teams.length > 0 && teams[0].idLeague === idLeague){
    console.log("Loading teams from cache")
    generateCards(DATA_TYPES.TEAM)
    return teams
  }
  else {
    const newTeams = fetch(`${apiAddress}/lookup_all_teams.php?id=${idLeague}`, {})
      .then(res => {
          console.log("Fetching data", res)
          return res.json()
        })
        .then(data => {
          if (idLeague){
            teams = data.teams
            generateCards(DATA_TYPES.TEAM)
          }
          else {
            throw `League ID provided was "${idLeague}"`
          }
        })
        .catch(err => console.log("Something went wrong fetching the data...", err))
    return newTeams
  }
}

getAllSports()
