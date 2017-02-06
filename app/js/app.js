function getUsers() {
    VK.init({
        apiId: 5629026,
    });

    new Promise((resolve, reject) => {
        VK.Auth.login(function(response){
            if(response.status == 'connected') {
                resolve();
            } else {
                console.log(response);
            }
        }, 2 | 4);
    }).then(()=> {
        VK.api('friends.get',{fields: 'photo_100', order: 'name', name_case: 'nom'},function(answer) {
            return answer.response;
        });
    })
}

window.addEventListener('load', (event) => {

});

let allUsers = getUsers();

console.log(allUsers);