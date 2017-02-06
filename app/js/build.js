'use strict';

VK.init({
  apiId: 5629026
});

new Promise(function (resolve, reject) {
  VK.Auth.login(function (response) {
    if (response.status == 'connected') {
      resolve();
    } else {
      console.log(response);
    }
  }, 2 | 4);
}).then(function () {
  return new Promise(function (resolve) {
    VK.api('friends.get', { fields: 'photo_100', order: 'name', name_case: 'nom' }, function (answer) {
      if (answer.response) {
        resolve(answer.response);
      }
    });
  });
}).then(function (vkUsers) {
  var vkFriendsBlock = document.querySelector('.filter-app-friends-your');
  console.log(vkUsers);
  vkUsers.forEach(function (user) {
    var userItem = document.createElement('div');
    userItem.classList.add('item');
    userItem.innerHTML = '\n        <div class="item-logo" style="background: url(' + user.photo_100 + '); background-size: contain; "></div>\n        <h3 class="item-title">' + user.first_name + ' ' + user.last_name + '</h3>\n        <div class="close item-close">\n          <i class="fa fa-plus" aria-hidden="true"></i>\n        </div>';
    vkFriendsBlock.appendChild(userItem);
  });
});
//# sourceMappingURL=build.js.map
