// части HTML-кода, в которые требуется внести данные
let navInfo = document.querySelector('#navHeader');
let tableContent = document.querySelector('#tableContent')

// переменные для работы с ролями
let roles = {}
let role = ''
let role2 = ''

// url, ведущий к rest-контроллеру
fetch('http://localhost:8080/rest/user')
    .then(response => {
        return response.json()
    }).then(data => {
        console.log(data)
    // вытаскиваем роли из JSON
    data.roles.forEach((value, key) => {
        roles[key] = value
    })
    for (let key in roles) {
        if (key === '0') {
            if (roles[0].role === 'ROLE_USER') {
                role = 'USER'
            } else if (roles[0].role === 'ROLE_ADMIN') {
                role = 'ADMIN'
            }
        } else if (key === '1') {
            if (roles[1].role === 'ROLE_USER') {
                role2 = 'USER'
            } else if (roles[1].role === 'ROLE_ADMIN') {
                role2 = 'ADMIN'
            }
        }
    }

    // navbar
    navInfo.innerHTML =
        `<strong>${data.email}</strong> with roles: ${role} ${role2}`

    // table
    tableContent.innerHTML = `
            <td>${data.id}</td>
            <td>${data.username}</td>
            <td>${data.nickname}</td>
            <td>${data.email}</td>
            <td>${role} ${role2}</td>`
    }).catch(err => console.log(err))
