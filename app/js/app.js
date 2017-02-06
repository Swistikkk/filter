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
}).then((usersVk) => {
  let vkUsers = usersVk;
  let myFriends = [];
  let searchInputMyFriend = document.querySelector('.filter-app-search-input__myFriends input');
  let vkFriendsBlock = document.querySelector('.filter-app-friends-your__wrapper');
  let myFriendBlock = document.querySelector('.filter-app-friends-in-list__wrapper');
  let searchInputVkFriends = document.querySelector('.filter-app-search-input input');

  function renderUsers(arrayOfUsers, blockToAppend, action) {
    blockToAppend.innerHTML = '';

    arrayOfUsers.forEach((user) => {
      let userItem = document.createElement('div');

      userItem.classList.add('item');
      userItem.setAttribute('data-id', user.user_id);

      if(action == 'remove') {
        userItem.innerHTML = `
        <div class="item-logo" style="background: url(${user.photo_100}); background-size: contain; "></div>
        <h3 class="item-title">${user.first_name} ${user.last_name}</h3>
        <div class="close item-close">
          <i class="fa fa-times" aria-hidden="true"></i>
        </div>`;
      } else {
        userItem.innerHTML = `
        <div class="item-logo" style="background: url(${user.photo_100}); background-size: contain; "></div>
        <h3 class="item-title">${user.first_name} ${user.last_name}</h3>
        <div class="close item-close">
          <i class="fa fa-plus" aria-hidden="true"></i>
        </div>`;
      }

      blockToAppend.appendChild(userItem);
    });
  }

  renderUsers(vkUsers, vkFriendsBlock);

  searchInputVkFriends.addEventListener('keyup', (event) => {
    let inputValue = event.currentTarget.value;
    let searchArrayOfUsers = vkUsers.filter((user) => {
      if(user.first_name.indexOf(inputValue) != -1) {
        return true;
      } else {
        return false;
      }
    });

    renderUsers(searchArrayOfUsers, vkFriendsBlock);
  });

  searchInputMyFriend.addEventListener('keyup', (event) => {
    let inputValue = event.currentTarget.value;
    let searchArrayOfUsers = myFriends.filter((user) => {
      if(user.first_name.indexOf(inputValue) != -1) {
        return true;
      } else {
        return false;
      }
    });

    renderUsers(searchArrayOfUsers, myFriendBlock, 'remove');
  });

  vkFriendsBlock.addEventListener('click', (event) => {
    if(event.target.classList.contains('item-close') || event.target.classList.contains('fa-plus')) {
      // ToDO Сделать проверку если это крести и если это блок крестика
      let idUser = event.target.parentElement.parentElement.dataset.id;

      vkUsers = vkUsers.filter((user) => {
        if(user.user_id == idUser) {
          myFriends.push(user);
        }

        if(user.user_id != idUser) {
          return true;
        } else {
          return false;
        }
      });

      renderUsers(vkUsers, vkFriendsBlock);
      renderUsers(myFriends, myFriendBlock, 'remove');
    }
  });

  myFriendBlock.addEventListener('click', (event) => {
    if(event.target.classList.contains('item-close') || event.target.classList.contains('fa-times')) {
      // ToDO Сделать проверку если это крести и если это блок крестика
      let idUser = event.target.parentElement.parentElement.dataset.id;

      myFriends = myFriends.filter((user) => {
        if(user.user_id == idUser) {
          vkUsers.unshift(user);
        }

        if(user.user_id != idUser) {
          return true;
        } else {
          return false;
        }
      });

      renderUsers(vkUsers, vkFriendsBlock);
      renderUsers(myFriends, myFriendBlock, 'remove');
    }
  });
});

