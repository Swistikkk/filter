VK.init({
  apiId: 5629026,
});

function getFromLocalStorage(key) {
  return JSON.parse(localStorage[key] || null);
};

let vkUsers = getFromLocalStorage('vkUsers') || null;
let myFriends = getFromLocalStorage('myFriends') || [];

window.addEventListener('load', () => {
  let searchInputMyFriend = document.querySelector('.filter-app-search-input__myFriends input');
  let vkFriendsBlock = document.querySelector('.filter-app-friends-your__wrapper');
  let myFriendBlock = document.querySelector('.filter-app-friends-in-list__wrapper');
  let searchInputVkFriends = document.querySelector('.filter-app-search-input input');
  let saveButton = document.querySelector('.filter-app-footer button');

  if(!vkUsers) {
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
            vkUsers = answer.response;
            console.log(vkUsers);
            resolve();
          }
        });
      })
    }).then(() => {
      initFilterApp(vkFriendsBlock, myFriendBlock);
    })
  } else {
    initFilterApp(vkFriendsBlock, myFriendBlock);
  }


  vkFriendsBlock.addEventListener('click', (event) => {
    actionOnClick(event, 'vk', vkFriendsBlock, myFriendBlock);
  });

  myFriendBlock.addEventListener('click', (event) => {
    actionOnClick(event, 'myFriend', vkFriendsBlock, myFriendBlock);
  });


  searchInputVkFriends.addEventListener('keyup', (event) => {
    let inputValue = event.currentTarget.value;
    let searchArrayOfUsers = vkUsers.filter((user) => {
      return user.first_name.includes(inputValue) == true;
    });

    renderUsers(searchArrayOfUsers, vkFriendsBlock);
  });

  searchInputMyFriend.addEventListener('keyup', (event) => {
    let inputValue = event.currentTarget.value;
    let searchArrayOfUsers = myFriends.filter((user) => {
      return user.first_name.includes(inputValue) == true;
    });

    renderUsers(searchArrayOfUsers, myFriendBlock, 'remove');
  });


  // Drag & Drop HTML5 Api
  vkFriendsBlock.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  vkFriendsBlock.addEventListener('drop', (event) => {
    event.preventDefault();

    var data = event.dataTransfer.getData("userItem");
    myFriendBlock.removeChild(document.getElementById(data));

    setMyFriends(data);
    renderUsers(vkUsers, vkFriendsBlock);
  });

  myFriendBlock.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  myFriendBlock.addEventListener('drop', (event) => {
    event.preventDefault();

    var data = event.dataTransfer.getData("userItem");
    vkFriendsBlock.removeChild(document.getElementById(data));

    setVkUsers(data);
    renderUsers(myFriends, myFriendBlock, 'remove');
  });

  // Save button to localStorage
  saveButton.addEventListener('click', (event) => {
    localStorage.setItem('vkUsers', JSON.stringify(vkUsers));
    localStorage.setItem('myFriends', JSON.stringify(myFriends));
  });
});


function initFilterApp(vkFriendsBlock, myFriendBlock,) {
  renderUsers(vkUsers, vkFriendsBlock);
  renderUsers(myFriends, myFriendBlock, 'remove');
}

function renderUsers(arrayOfUsers, blockToAppend, action) {
  blockToAppend.innerHTML = '';

  arrayOfUsers.forEach((user) => {
    let userItem = document.createElement('div');
    let innerNodes = `<div class="item-logo" style="background: url(${user.photo_100}); background-size: contain; "></div>
                      <h3 class="item-title">${user.first_name} ${user.last_name}</h3>`;

    userItem.setAttribute('draggable', true);
    userItem.classList.add('item');
    userItem.setAttribute('data-id', user.user_id);
    userItem.setAttribute('id', user.user_id);

    if(action == 'remove') {
      innerNodes = innerNodes.concat(`
        <div class="close item-close">
           <i class="fa fa-times" aria-hidden="true"></i>
        </div>
      `);
    } else {
      innerNodes = innerNodes.concat(`
        <div class="close item-close">
           <i class="fa fa-plus" aria-hidden="true"></i>
        </div>
      `);
    };

    userItem.innerHTML = innerNodes;

    userItem.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData("userItem", event.target.dataset.id);
    });

    blockToAppend.appendChild(userItem);
  });
};

function setVkUsers(id) {
  vkUsers = vkUsers.filter((user) => {
    if(user.user_id == id) {
      myFriends.push(user);
    }

    return user.user_id != id
  });
};

function setMyFriends(id) {
  myFriends = myFriends.filter((user) => {
    if(user.user_id == id) {
      vkUsers.unshift(user);
    }

    return user.user_id != id;
  });
};

function actionOnClick(event, nameOfArray, vkFriendsBlock, myFriendBlock) {
  if(event.target.classList.contains('item-close') || event.target.classList.contains('fa-times') || event.target.classList.contains('fa-plus')) {
    console.log('enter in if');
    let idUser = event.target.parentElement.parentElement.dataset.id;

    if(nameOfArray == 'vk') {
      setVkUsers(idUser);
    } else {
      setMyFriends(idUser);
    }

    renderUsers(vkUsers, vkFriendsBlock);
    renderUsers(myFriends, myFriendBlock, 'remove');
  }
}


