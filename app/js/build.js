"use strict";

VK.init({
  apiId: 5629026
});

var users = void 0;

new Promise(function (resolve, reject) {
  VK.Auth.login(function (response) {
    if (response.session) {
      console.log(response);
      resolve();
    } else {
      console.log(response);
      reject();
    }
  }, 2 | 4);
}).then(function () {
  return new Promise(function (resolve, reject) {
    VK.api('friends.get', { fields: 'photo_100', name_case: 'nom' }, function (answer) {
      resolve(answer.response);
      console.log(answer);
    });
  });
}).then(function (answer) {
  if (answer) {
    window.users = answer;
    console.log(users);
    createUserBlock(answer);

    var firstFriendInput = document.querySelector(".firstFriendInput");
    firstFriendInput.addEventListener('keyup', function (event) {
      var searchFriend = firstFriendInput.value;
      var newArrayOfUsers = filterUsers(users, searchFriend.toLowerCase());

      createUserBlock(newArrayOfUsers);
    });
  }
});

function createUserBlock(users) {
  var usersBlock = document.querySelector('.filter-app-friends-your');
  usersBlock.innerHTML = "";
  var docFragment = document.createDocumentFragment();
  users.forEach(function (user) {
    var div = document.createElement('div');
    div.classList.add('item');
    if (!div.draggable) {
      div.setAttribute("draggable", "true");
      div.addEventListener('drag', function (event) {
        console.log(event);
      });
    }
    div.innerHTML = '\n                      <div class="item-logo" style="background: url(' + user.photo_100 + '); background-size: contain;"></div>\n                      <h3 class="item-title">' + user.first_name + ' ' + user.last_name + '</h3>\n                      <div class="close item-close">\n                        <i class="fa fa-plus" aria-hidden="true"></i>\n                      </div>\n                    ';
    docFragment.appendChild(div);
  });
  usersBlock.appendChild(docFragment);
}

function filterUsers(array, value) {
  var filteredArray = [];

  array.forEach(function (user) {
    if (user.first_name.toLowerCase().indexOf(value) != -1) {
      filteredArray.push(user);
    }
  });

  return filteredArray;
}

var friendsInList = document.querySelector(".filter-app-friends-in-list");
firstFriendInput.addEventListener('drop', function (event) {
  event.preventDefault();
});
//# sourceMappingURL=build.js.map
