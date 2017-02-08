'use strict';

function getFromLocalStorage(key) {
  return JSON.parse(localStorage[key] || null);
};

var vkUsers = getFromLocalStorage('vkUsers') || null;
var myFriends = getFromLocalStorage('myFriends') || [];

window.addEventListener('load', function () {
  var searchInputMyFriend = document.querySelector('.filter-app-search-input__myFriends input');
  var vkFriendsBlock = document.querySelector('.filter-app-friends-your__wrapper');
  var myFriendBlock = document.querySelector('.filter-app-friends-in-list__wrapper');
  var searchInputVkFriends = document.querySelector('.filter-app-search-input input');
  var saveButton = document.querySelector('.filter-app-footer button');

  if (!vkUsers) {
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
            vkUsers = answer.response;
            console.log(vkUsers);
            resolve();
          }
        });
      });
    }).then(function () {
      initFilterApp(vkFriendsBlock, myFriendBlock);
    });
  } else {
    initFilterApp(vkFriendsBlock, myFriendBlock);
  }

  vkFriendsBlock.addEventListener('click', function (event) {
    actionOnClick(event, 'vk', vkFriendsBlock, myFriendBlock);
  });

  myFriendBlock.addEventListener('click', function (event) {
    actionOnClick(event, 'myFriend', vkFriendsBlock, myFriendBlock);
  });

  searchInputVkFriends.addEventListener('keyup', function (event) {
    var inputValue = event.currentTarget.value;
    var searchArrayOfUsers = vkUsers.filter(function (user) {
      return user.first_name.includes(inputValue) == true;
    });

    renderUsers(searchArrayOfUsers, vkFriendsBlock);
  });

  searchInputMyFriend.addEventListener('keyup', function (event) {
    var inputValue = event.currentTarget.value;
    var searchArrayOfUsers = myFriends.filter(function (user) {
      return user.first_name.includes(inputValue) == true;
    });

    renderUsers(searchArrayOfUsers, myFriendBlock, 'remove');
  });

  // Drag & Drop HTML5 Api
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

  // Save button to localStorage
  saveButton.addEventListener('click', function (event) {
    localStorage.setItem('vkUsers', JSON.stringify(vkUsers));
    localStorage.setItem('myFriends', JSON.stringify(myFriends));
  });
});

function initFilterApp(vkFriendsBlock, myFriendBlock) {
  renderUsers(vkUsers, vkFriendsBlock);
  renderUsers(myFriends, myFriendBlock, 'remove');
}

function renderUsers(arrayOfUsers, blockToAppend, action) {
  blockToAppend.innerHTML = '';

  arrayOfUsers.forEach(function (user) {
    var userItem = document.createElement('div');
    var innerNodes = '<div class="item-logo" style="background: url(' + user.photo_100 + '); background-size: contain; "></div>\n                      <h3 class="item-title">' + user.first_name + ' ' + user.last_name + '</h3>';

    userItem.setAttribute('draggable', true);
    userItem.classList.add('item');
    userItem.setAttribute('data-id', user.user_id);
    userItem.setAttribute('id', user.user_id);

    if (action == 'remove') {
      innerNodes = innerNodes.concat('\n        <div class="close item-close">\n           <i class="fa fa-times" aria-hidden="true"></i>\n        </div>\n      ');
    } else {
      innerNodes = innerNodes.concat('\n        <div class="close item-close">\n           <i class="fa fa-plus" aria-hidden="true"></i>\n        </div>\n      ');
    };

    userItem.innerHTML = innerNodes;

    userItem.addEventListener('dragstart', function (event) {
      event.dataTransfer.setData("userItem", event.target.dataset.id);
    });

    blockToAppend.appendChild(userItem);
  });
};

function setVkUsers(id) {
  vkUsers = vkUsers.filter(function (user) {
    if (user.user_id == id) {
      myFriends.push(user);
    }

    return user.user_id != id;
  });
};

function setMyFriends(id) {
  myFriends = myFriends.filter(function (user) {
    if (user.user_id == id) {
      vkUsers.unshift(user);
    }

    return user.user_id != id;
  });
};

function actionOnClick(event, nameOfArray, vkFriendsBlock, myFriendBlock) {
  if (event.target.classList.contains('item-close') || event.target.classList.contains('fa-times') || event.target.classList.contains('fa-plus')) {
    console.log('enter in if');
    var idUser = event.target.parentElement.parentElement.dataset.id;

    if (nameOfArray == 'vk') {
      setVkUsers(idUser);
    } else {
      setMyFriends(idUser);
    }

    renderUsers(vkUsers, vkFriendsBlock);
    renderUsers(myFriends, myFriendBlock, 'remove');
  }
}
//# sourceMappingURL=build.js.map
