"use strict";

VK.init({
  apiId: 5629026
});


//глобальный массив всех юзеров
let users;

window.addEventListener("DOMContentLoaded", (event) => {
  return new Promise((resolve, reject) => {
    VK.Auth.login(function(response) {
      if(response.session) {
        console.log(response);
        resolve();
      } else {
        console.log(response);
        reject();
      }
    }, 2 | 4)
  }).then(() => {
    return new Promise((resolve, reject) => {
      VK.api('friends.get', {fields: 'photo_100', name_case: 'nom'}, function(answer) {
        resolve(answer.response);
        console.log(answer);
      });
    });
  }).then((answer) => {
    if(answer) {
      window.users = answer;
      console.log(users);
      createUserBlock(answer);

      var firstFriendInput = document.querySelector(".firstFriendInput");
      firstFriendInput.addEventListener('keyup', (event) => {
        var searchFriend = firstFriendInput.value;
        var newArrayOfUsers = filterUsers(users, searchFriend.toLowerCase());

        createUserBlock(newArrayOfUsers);
      });
    }
  });

  function createUserBlock(users) {
    var usersBlock = document.querySelector('.filter-app-friends-your');
    //usersBlock.innerHTML = "";

    var docFragment = document.createDocumentFragment();

    users.forEach((user, index) => {
      let div = document.createElement('div');
      div.id = index;
      div.classList.add('item');

      if(!div.draggable) {
        div.setAttribute("draggable", "true");

        div.addEventListener('drag', (event) => {
          console.log(event);
          var photo = event.currentTarget.querySelector('.item-logo').style.background;
          var firstName = event.currentTarget.querySelector('.item-title_firstName').innerHTML;
          var secondName = event.currentTarget.querySelector('.item-title_secondName').innerHTML;
          var userInfo = {
            photo_100: null,
            first_name: firstName,
            last_name: secondName
          };

          event.dataTransfer.setData('text/plain', JSON.stringify(userInfo));
          console.log(event.dataTransfer.getData(userInfo));
        })
      }

      div.innerHTML = `
                        <div class="item-logo" style="background: url(${user.photo_100});"></div>
                        <h3 class="item-title">
                          <span class="item-title_firstName">${user.first_name}</span>
                          <span class="item-title_secondName">${user.last_name}</span></h3>
                        <div class="close item-close">
                          <i class="fa fa-plus" aria-hidden="true"></i>
                        </div>
                      `;
      docFragment.appendChild(div);
    })
    usersBlock.appendChild(docFragment);
  };

  function filterUsers(array, value) {
    let filteredArray = [];

    array.forEach((user) => {
      if(user.first_name.toLowerCase().indexOf(value) != -1) {
        filteredArray.push(user);
      }
    });

    return filteredArray;
  };

  var friendsInList = document.querySelector(".filter-app-friends-in-list");
  friendsInList.addEventListener('drop', (event) => {
    event.preventDefault();

    console.log(event);
  });
});
