"use strict";

VK.init({
  apiId: 5629026
});

new Promise((resolve, reject) => {
  VK.Auth.login(function(response) {
    if(response.session) {
      console.log(response);
      resolve();
    } else {
      console.log(response);
      reject();
    }
  }, 2 | 4);
}).then(() => {
  return new Promise((resolve, reject) => {
    VK.api('friends.get', {fields: 'photo_100', name_case: 'nom'}, function(answer) {
      resolve(answer.response);
      console.log(answer);
    });
  });
}).then((answer) => {
  if(answer) {
    createUserBlock(answer);
  }
})

function createUserBlock(users) {
  var usersBlock = document.querySelector('.filter-app-friends-your');
  var docFragment = document.createDocumentFragment();
  users.forEach((user) => {
    let div = document.createElement('div');
    div.classList.add('item');
    div.innerHTML = `
                      <div class="item-logo" style="background: url(${user.photo_100}); background-size: contain;"></div>
                      <h3 class="item-title">${user.first_name} ${user.last_name}</h3>
                      <div class="close item-close">
                        <i class="fa fa-plus" aria-hidden="true"></i>
                      </div>
                    `;
    docFragment.appendChild(div);
  })
  usersBlock.appendChild(docFragment);
}
