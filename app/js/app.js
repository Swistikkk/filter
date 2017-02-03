let allUsers;

window.addEventListener('load', (event) => {
    VK.init({
        apiId: 5629026,
    });

    return new Promise((resolve, reject) => {
        VK.Auth.login(function(response){
            if(response.status == 'connected') {
                resolve();
                console.log(response);
            } else {
                console.log(response);
            }
        }, 2 | 4);
    }).then(()=> {
        VK.api('friends.get',{fields: 'photo_100', order: 'name', name_case: 'nom'},function(answer) {
            allUsers = answer.response;
            console.log(answer);
        });
    });
});