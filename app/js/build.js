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
}).then(function (usersVk) {
  var vkUsers = getFromLocalStorage('vkUsers') || usersVk;
  var myFriends = getFromLocalStorage('myFriends') || [];
  var searchInputMyFriend = document.querySelector('.filter-app-search-input__myFriends input');
  var vkFriendsBlock = document.querySelector('.filter-app-friends-your__wrapper');
  var myFriendBlock = document.querySelector('.filter-app-friends-in-list__wrapper');
  var searchInputVkFriends = document.querySelector('.filter-app-search-input input');
  var saveButton = document.querySelector('.filter-app-footer button');

  function getFromLocalStorage(key) {
    if (localStorage[key]) {
      return JSON.parse(localStorage[key]);
    }

    return false;
  };

  function renderUsers(arrayOfUsers, blockToAppend, action) {
    blockToAppend.innerHTML = '';

    arrayOfUsers.forEach(function (user) {
      var userItem = document.createElement('div');

      userItem.setAttribute('draggable', true);
      userItem.classList.add('item');
      userItem.setAttribute('data-id', user.user_id);
      userItem.setAttribute('id', user.user_id);

      if (action == 'remove') {
        userItem.innerHTML = '\n        <div class="item-logo" style="background: url(' + user.photo_100 + '); background-size: contain; "></div>\n        <h3 class="item-title">' + user.first_name + ' ' + user.last_name + '</h3>\n        <div class="close item-close">\n          <i class="fa fa-times" aria-hidden="true"></i>\n        </div>';
      } else {
        userItem.innerHTML = '\n        <div class="item-logo" style="background: url(' + user.photo_100 + '); background-size: contain; "></div>\n        <h3 class="item-title">' + user.first_name + ' ' + user.last_name + '</h3>\n        <div class="close item-close">\n          <i class="fa fa-plus" aria-hidden="true"></i>\n        </div>';
      }

      userItem.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData("userItem", event.target.dataset.id);
      });

      blockToAppend.appendChild(userItem);
    });
  }

  renderUsers(vkUsers, vkFriendsBlock);
  renderUsers(myFriends, myFriendBlock, 'remove');

  searchInputVkFriends.addEventListener('keyup', function (event) {
    var inputValue = event.currentTarget.value;
    var searchArrayOfUsers = vkUsers.filter(function (user) {
      if (user.first_name.indexOf(inputValue) != -1) {
        return true;
      } else {
        return false;
      }
    });

    renderUsers(searchArrayOfUsers, vkFriendsBlock);
  });

  searchInputMyFriend.addEventListener('keyup', function (event) {
    var inputValue = event.currentTarget.value;
    var searchArrayOfUsers = myFriends.filter(function (user) {
      if (user.first_name.indexOf(inputValue) != -1) {
        return true;
      } else {
        return false;
      }
    });

    renderUsers(searchArrayOfUsers, myFriendBlock, 'remove');
  });

  vkFriendsBlock.addEventListener('click', function (event) {
    if (event.target.classList.contains('item-close') || event.target.classList.contains('fa-plus')) {
      // ToDO Сделать проверку если это крести и если это блок крестика
      var idUser = event.target.parentElement.parentElement.dataset.id;

      setVkUsers(idUser);

      renderUsers(vkUsers, vkFriendsBlock);
      renderUsers(myFriends, myFriendBlock, 'remove');
    }
  });

  myFriendBlock.addEventListener('click', function (event) {
    if (event.target.classList.contains('item-close') || event.target.classList.contains('fa-times')) {
      // ToDO Сделать проверку если это крести и если это блок крестика
      var idUser = event.target.parentElement.parentElement.dataset.id;

      setMyFriends(idUser);
      renderUsers(vkUsers, vkFriendsBlock);
      renderUsers(myFriends, myFriendBlock, 'remove');
    }
  });

  function setVkUsers(id) {
    vkUsers = vkUsers.filter(function (user) {
      if (user.user_id == id) {
        myFriends.push(user);
      }

      if (user.user_id != id) {
        return true;
      } else {
        return false;
      }
    });
  }

  function setMyFriends(id) {
    myFriends = myFriends.filter(function (user) {
      if (user.user_id == id) {
        vkUsers.unshift(user);
      }

      if (user.user_id != id) {
        return true;
      } else {
        return false;
      }
    });
  }

  // Drop to vkFriendBlock

  vkFriendsBlock.addEventListener('dragover', function (event) {
    event.preventDefault();
  });

  vkFriendsBlock.addEventListener('drop', function (event) {
    event.preventDefault();

    var data = event.dataTransfer.getData("userItem");
    myFriendBlock.removeChild(document.getElementById(data));

    setMyFriends(data);
    renderUsers(vkUsers, vkFriendsBlock);
  });

  // Drop to myFriendsBlock

  myFriendBlock.addEventListener('dragover', function (event) {
    event.preventDefault();
  });

  myFriendBlock.addEventListener('drop', function (event) {
    event.preventDefault();

    var data = event.dataTransfer.getData("userItem");
    vkFriendsBlock.removeChild(document.getElementById(data));

    setVkUsers(data);
    renderUsers(myFriends, myFriendBlock, 'remove');
  });

  saveButton.addEventListener('click', function (event) {
    localStorage.setItem('vkUsers', JSON.stringify(vkUsers));
    localStorage.setItem('myFriends', JSON.stringify(myFriends));
  });
});
//# sourceMappingURL=build.js.map
