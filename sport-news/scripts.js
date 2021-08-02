// http://api.football-data.org/v2/competitions
// {
//   "_links": {
//       "self": {
//           "href": "http://api.football-data.org/v1/competitions/424"
//       }
//       "teams": {
//           "href": "http://api.football-data.org/v1/competitions/424/teams"
//       }
//       "fixtures": {
//           "href": "http://api.football-data.org/v1/competitions/424/fixtures"
//       }
//       "leagueTable": {
//           "href": "http://api.football-data.org/v1/competitions/424/leagueTable"
//       }
//   }
//   "id": 424
//   "caption": "European Championships France 2016"
//   "league": "EC"
//   "year": "2016"
//   "currentMatchday": 3
//   "numberOfMatchdays": 7
//   "numberOfTeams": 24
//   "numberOfGames": 38
//   "lastUpdated": "2016-06-22T04:34:39Z"
// }

// const apiAddress = 'http://api.football-data.org/v2/competitions'
// const apiAddress = 'https://api.tvmaze.com/singlesearch/shows?q=girls'
// const apiAddress = 'https://api.tvmaze.com/shows'

// https://www.thesportsdb.com/api.php
const apiAddress = 'https://www.thesportsdb.com/api/v1/json/1'

const body = document.querySelector("body")
const title = document.querySelector("#title")
const content = document.querySelector("#content")

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

const addCard = (sportName, title, imageUrl) => {
  const newDiv = document.createElement('div')
  const newH3 = document.createElement('h3')
  const newImage = document.createElement('img')

  newDiv.classList.add('card')

  newH3.append(title)
  
  if(imageUrl) {
    newDiv.appendChild(newImage)
    newImage.setAttribute('src', imageUrl)
    newImage.setAttribute('alt', title)
  }
  // newLink.setAttribute('href', ``)
  newDiv.appendChild(newH3)
  newDiv.onclick = () => getAllLeagues(sportName)

  content.appendChild(newDiv)
}

const getAllSports = async () => {
  clearContent()
  const competitions = fetch(`${apiAddress}/all_sports.php`,
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
        // data.competitions.forEach(item => addContent("id: " + item.id + " - Show name: " + item.name))
        data.sports.forEach(item => addCard(item.strSport, item.strSport,item.strSportThumb))
      })
      .catch(err => console.log("something went wrong fetching the data", err))
  return competitions
}

const getAllLeagues = async (sportName) => {
  clearContent()
  const competitions = fetch(`${apiAddress}/${sportName ? "search_all_leagues.php?s=" + sportName : "all_leagues.php"}`, {})
    .then(res => {
        console.log("Fetching data", res)
        return res.json()
      })
      .then(data => {
        console.log(data)
        sportName
        ? data.countrys.forEach(item => addCard(item.strSport, item.strLeague, item.strBadge))
        : data.leagues.forEach(item => addCard(item.strSport, item.strLeague))
      })
      .catch(err => console.log("something went wrong fetching the data", err))
  return competitions
}