// https://www.thesportsdb.com/api.php
const apiAddress = 'https://www.thesportsdb.com/api/v1/json/1'

const body = document.querySelector("body")
const title = document.querySelector("#title")
const content = document.querySelector("#content")

let sports = []
let leagues = []
let teams = []


const addContent = (text) => {
  const newParagraph=document.createElement('p')
  text 
  ? newParagraph.append(text)
  : newParagraph.append(`This is paragraph ${content.children.length + 1}`)
  content.appendChild(newParagraph)
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

const getAllSports = async () => {
  clearContent()
  if (sports.length > 0){
    console.log("Loading sports from cache")
    console.log(sports)
    sports.forEach(item => item.strSport && item.strSport && item.strSportThumb && 
      appendCard(() => getAllLeagues(item.strSport), item.strSport,item.strSportThumb)
    )
    return sports
  } 
  else {
    const newSports = fetch(`${apiAddress}/all_sports.php`,
      {
      //  headers :{
      //   "x-auth-token": "194378278e394272b97aceb6b9da3d19",
      //  },
      })
      .then(res => {
          console.log("Fetching data", res)
          return res.json()
      })
      .then(data => {
        console.log(data)
        sports = data.sports
        data.sports.forEach(item => item.strSport && item.strSport && item.strSportThumb && 
            appendCard(() => getAllLeagues(item.strSport), item.strSport,item.strSportThumb)
        )
      })
      .catch(err => console.log("Something went wrong fetching the data...", err))
    return newSports
  }
}

const getAllLeagues = async (sportName) => {
  clearContent()
  if (leagues.length > 0 && leagues[0].strSport === sportName){
    console.log("Loading leagues from cache")
    console.log(leagues)
    leagues.forEach(item => appendCard(() => getLeagueTeams(item.idLeague), item.strLeague, item.strBadge))
    return leagues
  }
  else {
    const newLeagues = fetch(`${apiAddress}/${sportName ? "search_all_leagues.php?s=" + sportName : "all_leagues.php"}`, {})
      .then(res => {
          console.log("Fetching data", res)
          return res.json()
        })
        .then(data => {
          console.log(data)
          if (sportName){
            leagues = data.countrys
            data.countrys.forEach(item => appendCard(() => getLeagueTeams(item.idLeague), item.strLeague, item.strBadge))
          }
          else {
            leagues = data.leagues
            data.leagues.forEach(item => appendCard(() => getLeagueTeams(item.idLeague), item.strLeague))
          }
        })
        .catch(err => console.log("Something went wrong fetching the data...", err))
    return newLeagues
  }
}

const getLeagueTeams = async (idLeague) => {
  clearContent()
  if (teams.length > 0 && teams[0].idLeague === idLeague){
    console.log("Loading teams from cache")
    console.log(teams)
    teams.forEach(item => appendCard(getAllSports, item.strTeam, item.strTeamBadge))
    return teams
  }
  else {
    const newTeams = fetch(`${apiAddress}/lookup_all_teams.php?id=${idLeague}`, {})
      .then(res => {
          console.log("Fetching data", res)
          return res.json()
        })
        .then(data => {
          console.log(data)
          if (idLeague){
            teams = data.teams
            data.teams.forEach(item => appendCard(() => getAllLeagues(item.strSport), item.strTeam, item.strTeamBadge))
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
