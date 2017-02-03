'use strict';

var allUsers = void 0;

window.addEventListener('load', function (event) {
    VK.init({
        apiId: 5629026
    });

    return new Promise(function (resolve, reject) {
        VK.Auth.login(function (response) {
            if (response.status == 'connected') {
                resolve();
            } else {
                console.log(response);
            }
        }, 2 | 4);
    }).then(function () {
        VK.api('friends.get', { fields: 'photo_100', order: 'name', name_case: 'nom' }, function (answer) {});
    });
});
//# sourceMappingURL=build.js.map
