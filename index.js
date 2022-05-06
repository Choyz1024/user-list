// URLs
const baseURL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'

// element
const dataPanel = document.querySelector('#data-panel')
const searchButton = document.querySelector('#search-submit-button')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

// data
const userData = []
let searchData = []
const userPerPage = 18
const currentPage = 1

// functions
const displayUser = (data) => {
  let rawHTML = ``
  data.forEach((user) => {
    rawHTML += `
        <div
            class="card m-2 position-relative"
            style="width: 12rem; cursor: pointer"
            data-bs-toggle="modal"
            data-bs-target="#user-modal"
            data-id=${user.id}
        >
            <img src=${user.avatar} class="card-img-top" alt="User Image" />
            <div class="card-body" data-id=${user.id}>
                <h5 class="card-title">${user.name} ${user.surname}</h5>
            </div>
            <i class="position-absolute bottom-0 end-0 fa fa-heart" aria-hidden="true"></i>
        </div>
        `
  })
  dataPanel.innerHTML = rawHTML
}

const displayModal = (id) => {
  const title = document.querySelector('#modal-title')
  const image = document.querySelector('#user-image')
  const info = document.querySelector('#user-info')
  title.textContent = ''
  image.src = ''
  info.innerHTML = ``
  axios
    .get(baseURL + id)
    .then((res) => {
      const data = res.data
      title.textContent = data.name + ' ' + data.surname
      image.src = data.avatar
      info.innerHTML = `
            <p>email : ${data.email}</p>
            <p>gender : ${data.gender}</p>
            <p>age : ${data.age}</p>
            <p>region : ${data.region}</p>
            <p>birthday : ${data.birthday}</p>
            `
    })
    .catch((err) => {
      console.log(err)
    })
}

const displayPaginator = (Data) => {
  const pages = Math.ceil(Data.length / userPerPage)
  let rawHTML = ``
  for (let page = 1; page <= pages; page++) {
    rawHTML += `
        <li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>
        `
  }
  paginator.innerHTML = rawHTML
}

const getUserByPages = (page) => {
  const data = searchData.length ? searchData : userData
  const startIndex = (page - 1) * userPerPage
  return data.slice(startIndex, startIndex + userPerPage)
}

const addToFavorite = (id) => {
  const list = JSON.parse(localStorage.getItem('favoriteUser')) || []
  const user = userData.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('此用戶已經在收藏清單中！')
  }
  list.push(user)
  localStorage.setItem('favoriteUser', JSON.stringify(list))
}

// event listener

dataPanel.addEventListener('click', (e) => {
  const id = Number(e.target.parentElement.dataset.id)
  displayModal(id)
  if (e.target.tagName === 'I') {
    addToFavorite(id)
  }
})

searchButton.addEventListener('click', (e) => {
  e.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  searchData = userData.filter((user) => (user.name + user.surname).toLowerCase().includes(keyword))
  if (searchData.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的使用者`)
  }
  displayPaginator(searchData)
  displayUser(getUserByPages(currentPage))
})

paginator.addEventListener('click', (e) => {
  const page = Number(e.target.dataset.page)
  displayUser(getUserByPages(page))
})

// fetching data from server

axios
  .get(baseURL)
  .then((res) => {
    userData.push(...res.data.results)
    displayPaginator(userData)
    displayUser(getUserByPages(currentPage))
  })
  .catch((err) => {
    console.log(err)
  })
