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
  return new Promise((resolve) => {
    VK.api('friends.get',{fields: 'photo_100', order: 'name', name_case: 'nom'}, (answer) => {
      if(answer.response) {
        resolve(answer.response);
      }
    });
  })
}).then((vkUsers) => {
  var vkFriendsBlock = document.querySelector('.filter-app-friends-your');
  console.log(vkUsers);
  vkUsers.forEach((user) => {
    let userItem = document.createElement('div');
    userItem.classList.add('item');
    userItem.innerHTML = `
        <div class="item-logo" style="background: url(${user.photo_100}); background-size: contain; "></div>
        <h3 class="item-title">${user.first_name} ${user.last_name}</h3>
        <div class="close item-close">
          <i class="fa fa-plus" aria-hidden="true"></i>
        </div>`
    vkFriendsBlock.appendChild(userItem);
  })
}).then(() => {
  let userVkFilterInput = document.querySelector('.filter-app-search-input');
  userVkFilterInput.addEventListener('keyup', (event) => {

  })
})