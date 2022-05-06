// URLs
const baseURL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'

// element
const dataPanel = document.querySelector('#data-panel')
const searchButton = document.querySelector('#search-submit-button')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

// data

const favoriteUser = JSON.parse(localStorage.getItem('favoriteUser')) || []
let searchData = []
const userPerPage = 15
const currentPage = 1

// functions
const displayUser = (data) => {
  let rawHTML = ``
  data.forEach((user) => {
    rawHTML += `
        <div
            class="card m-2"
            style="width: 12rem; cursor: pointer"
            data-bs-toggle="modal"
            data-bs-target="#user-modal"
            data-id=${user.id}
        >
            <img src=${user.avatar} class="card-img-top" alt="User Image" />
            <div class="card-body" data-id=${user.id}>
                <h5 class="card-title">${user.name} ${user.surname}</h5>
            </div>
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
  const startIndex = (page - 1) * userPerPage
  return favoriteUser.slice(startIndex, startIndex + userPerPage)
}

// event listener

dataPanel.addEventListener('click', (e) => {
  const id = Number(e.target.parentElement.dataset.id)
  displayModal(id)
})

searchButton.addEventListener('click', (e) => {
  e.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  const searchData = favoriteUser.filter((user) => (user.name + user.surname).toLowerCase().includes(keyword))
  if (searchData.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的使用者`)
  }
  displayPaginator(searchData)
  displayUser(searchData)
})

paginator.addEventListener('click', (e) => {
  const page = Number(e.target.dataset.page)
  displayUser(getUserByPages(page))
})

// display

displayPaginator(favoriteUser)
displayUser(getUserByPages(currentPage))
