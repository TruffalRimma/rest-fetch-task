/*
Постановка задачи:

ШАГ 1. Заполнить navbar и user-information page (GET)
ШАГ 2. Заполнить таблицу Users (GET)
ШАГ 3. Реализовать создание нового User (POST)
ШАГ 4. Заполнить и вызвать модальное окно Edit (GET + JQUERY)
ШАГ 5. Реализовать редактирование выбранного User (PUT)
ШАГ 6. Заполнить и вызвать модальное окно Delete (GET + JQUERY)
ШАГ 7. Реализовать удаление выбранного User (DELETE)
 */

// url к rest-контроллерам
const USER_INFO = 'http://localhost:8080/rest/user';
const URL_REST = 'http://localhost:8080/rest';

// для GET-запросов
function sendRequest(method, url) {
    return fetch(url).then(response => {
        return response.json()
    })
}

// ШАГ 1. Вносим данные в navbar и вкладку User-information

let navInfo = document.querySelector('#navHeader');
let tableContent = document.querySelector('#tableContent');
let roles = {}
let role = ''
let role2 = ''

sendRequest('GET', USER_INFO)
    .then(data => {
        // вытаскиваем роли
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
            `<strong>${data.email}</strong> with roles roles: ${role} ${role2}`
        // table
        tableContent.innerHTML = `
            <td>${data.id}</td>
            <td>${data.username}</td>
            <td>${data.nickname}</td>
            <td>${data.email}</td>
            <td>${role} ${role2}</td>`
    }).catch(err => console.log(err))


// ШАГ 2. Вносим данные в таблицу Users

let usersTable = document.querySelector('#usersTable');
let rolesForUsers = {}
let roleForUsers = ''
let role2ForUsers = ''

sendRequest('GET', URL_REST)
    .then(data => {
        data.forEach(user => {
            // вытаскиваем роли
            user.roles.forEach((value, key) => {
                rolesForUsers[key] = value
            })
            for (let key in rolesForUsers) {
                if (key === '0') {
                    if (rolesForUsers[0].role === 'ROLE_USER') {
                        roleForUsers = 'USER'
                    } else if (rolesForUsers[0].role === 'ROLE_ADMIN') {
                        roleForUsers = 'ADMIN'
                    }
                } else if (key === '1') {
                    if (rolesForUsers[1].role === 'ROLE_USER') {
                        role2ForUsers = 'USER'
                    } else if (rolesForUsers[1].role === 'ROLE_ADMIN') {
                        role2ForUsers = 'ADMIN'
                    }
                }
            }
            // вносим основную иформацию + кнопки для вызова модальных окон Edit и Delete
            usersTable.innerHTML += `
                <div id="${user.id}">
                <tr data-id=${user.id}>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.nickname}</td>
                <td>${user.email}</td>
                <td>${roleForUsers} ${role2ForUsers}</td>
                <td>
                    <a type="button" class="btn btn-dark" data-bs-toggle="modal"
                        data-bs-target="#editModal" id="editBtn">
                        Edit
                    </a>
                </td>
                <td>
                    <a type="button" class="btn btn-danger" data-bs-toggle="modal"
                        data-bs-target="#deleteModal" id="deleteBtn">
                        Delete
                    </a>
                </td>
                </tr>
                </div>`

            // опустошаем внесенную информацию для работы со следующим User
            rolesForUsers = {}
            roleForUsers = ''
            role2ForUsers = ''
        })
    }).catch(err => console.log(err))

// ШАГ 3. Добавление нового User

$(document).ready(function () {
    document.getElementById('addUserForm').addEventListener('submit', submitForm);

    function submitForm(event) {
        event.preventDefault();
        let formData = new FormData(event.target);
        let obj = {};
        formData.forEach((value, key) => {
            if (key === 'roles2' && value === 'ROLE_USER') {
                obj['roles'] = [{
                    id: 1,
                    role: value,
                    authority: value
                }]
            } else if (key === 'roles2' && value === 'ROLE_ADMIN') {
                obj['roles'] = [{
                    id: 2,
                    role: value,
                    authority: value
                }]
            } else {
                obj[key] = value
            }
        })

        let request = new Request(URL_REST, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'manual'
        });

        fetch(request).then(
            function (response) {
                console.log(response);
                alert('Пользователь успешно создан!')
                window.location.replace('http://localhost:8080/admin');
            }).catch(err => console.log(err))
    }
})

$(document).ready(function () {
    usersTable.addEventListener('click', (e) => {
        e.preventDefault();

        let editButtonIsPressed = e.target.id === 'editBtn'
        let delButtonIsPressed = e.target.id === 'deleteBtn'

        /*
        Если в CSS мы обращаемся к имени атрибута напрямую, указывая его полностью,
        то в JavaScript это делается через метод dataset.
        Само имя атрибута преобразовывается в переменную по следующим правилам:

            1. data- отбрасывается;
            (в usersTable добавила атрибут в тег <tr data-id=${user.id}>)
            2. любой дефис идущий перед буквой отбрасывается, а буква за ним становится заглавной

        Теперь мы можем обращаться к любым атрибутам data через метод dataset,
        причём не только получать, но и устанавливать значения.
        Храниться они будут до перезагрузки страницы или до установки нового значения.
         */

        let id = e.target.parentElement.parentElement.dataset.id

        // ШАГ 4. Заполняем и вызываем модальное окно Edit

        if (editButtonIsPressed) {
            sendRequest('GET', `${URL_REST}/${id}`)
                .then(user => {
                    $('.editModal #id').val(user.id);
                    $('.editModal #username').val(user.username);
                    $('.editModal #nickname').val(user.nickname);
                    $('.editModal #email').val(user.email);
                    $('.editModal #password').val(user.password);
                    $('.editModal #roles3').val(user.roles);
                })
            $('.editModal #editModal').modal();

            // ШАГ 5. Реализуем редактирование выбранного User (PUT)

            const buttonDelete = $('#edit');
            buttonDelete.click(
                function () {
                    document.getElementById('editForm').addEventListener('submit', submitForm);

                    function submitForm(event) {
                        event.preventDefault();
                        let formData = new FormData(event.target);
                        let obj = {};
                        formData.forEach((value, key) => {
                            if (key === 'roles' && value === 'ROLE_USER') {
                                obj['roles'] = [{
                                    id: 1,
                                    role: value,
                                    authority: value
                                }]
                            } else if (key === 'roles' && value === 'ROLE_ADMIN') {
                                obj['roles'] = [{
                                    id: 2,
                                    role: value,
                                    authority: value
                                }]
                            } else {
                                obj[key] = value
                            }
                        })

                        let request = new Request(URL_REST, {
                            method: 'PUT',
                            body: JSON.stringify(obj),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            redirect: 'manual'
                        });
                        console.log(request)

                        fetch(request).then(
                            function (response) {
                                console.log(response);
                                // закрываем модальное окно
                                $('#editModalModal').modal('toggle')
                                alert('Пользователь успешно изменён!')
                                window.location.replace('http://localhost:8080/admin');
                            }).catch(err => console.log(err))
                    }
                }
            )
        }

        // ШАГ 6. Заполняем и вызываем модальное окно Delete

        if (delButtonIsPressed) {
            sendRequest('GET', `${URL_REST}/${id}`)
                .then(user => {
                    $('.deleteModal #id1').val(user.id);
                    $('.deleteModal #username1').val(user.username);
                    $('.deleteModal #nickname1').val(user.nickname);
                    $('.deleteModal #email1').val(user.email);
                })
            $('.deleteModal #deleteModal').modal();

            // ШАГ 7. Реализуем удаление выбранного User (DELETE)

            const buttonDelete = $('#delete');
            buttonDelete.click(
                function () {
                    $.ajax(`${URL_REST}/${id}`, {
                        method: "DELETE",
                        data: {id: `${id}`},
                        dataType: "text",
                        success: function () {
                            // закрываем модальное окно
                            $('#deleteModal').modal('toggle')
                            alert('Пользователь успешно удалён!')
                            window.location.replace('http://localhost:8080/admin');
                        }
                    })
                }
            )
        }
    })
})