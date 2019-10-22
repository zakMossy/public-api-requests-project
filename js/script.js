let users = {
  cell: "cellphone",
  dob: {
    date: "Birthday",
    age: 17
  },
  email: "Email",
  location: {
    street: "Street",
    city: "City",
    state: "State",
    postcode: 12345
  },
  name: {
    title: "Mr/Mrs",
    first: "Zak",
    last: "Mosbacher"
  },
  picture: {
    large: "https://placeimg.com/300/300/people"
  }
};
var modal = "";
var cardNr = 0;
var cardsVis = [];
var pos = 0;

$.ajax({
  url:
    "https://randomuser.me/api/?results=12&nat=gb&inc=name,location,email,dob,cell,picture&noinfo",
  dataType: "json",
  success: function(data) {
    createList(data.results);                                                   // create list of employee cards
    setModalData(users)
      .insertAfter("#gallery")
      .hide();                                                                  // hide modal initially
    modalButton();                                                              // add close modal button
    toggle();                                                                   // add toggle button
    saveUserArray(data.results);                                                // save array to variable
    addSearch();                                                                // add search box
  }
});                                                                             //retrieves data and uses all the functions below when everything works

function setModalData(item){
  modal =
  `<div class="modal-container">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${item.picture.large}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${item.name.title} ${item.name.first} ${item.name.last}</h3>
              <p class="modal-text">${item.email}</p>
              <p class="modal-text cap">${item.location.city}</p>
              <hr>
              <p class="modal-text">${item.cell}</p>
              <p class="modal-text">${item.location.street}, ${item.location.city}, ${item.location.state} ${item.location.postcode}</p>
              <p class="modal-text">Birthday: ${item.dob.date}</p>
          </div>
      </div>
      <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
   </div>`;
  return $(modal);
}                                                                               //creates the modal

function saveUserArray(data){
  users = data;
}                                                                               //saves the data to an array

function createList(users) {
  var listItem = "";
  $.each(users, function(index, item) {
    listItem +=
    `<div class="card">
          <div class="card-img-container">
              <img class="card-img" src="${item.picture.large}" alt="profile picture">
          </div>
          <div class="card-info-container">
              <h3 id="name" class="card-name cap">${item.name.first} ${item.name.last}</h3>
              <p class="card-text">${item.email}</p>
              <p class="card-text cap">${item.location.city}, ${item.location.state}</p>
          </div>
      </div>`;

    cardsVis.push(index);                                                       // array of visible card indices before search
  });                                                                           // writes the data on the site
  $("#gallery").html(listItem);                                                 // insert on #gallery
}

function addSearch() {
  $(".search-container").html(`
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`);                                                                  // creates the search bar which is interactive
  $(document).on("submit", "form", e => {
    e.preventDefault();
    var searchValue = $("#search-input")
      .val()
      .toLowerCase();
    cardsVis = [];
    $(".card").hide();                                                          // hide all the cards again before showing them
    $.each(users, function(index, value) {
      if (
        $(".card")
          .eq(index)
          .is(":visible")
      ) {
        cardsVis.push(index);
      }
    });
  });
}                                                                               // adds functionality to the searching process

function updateData(nr) {
  let item = users[nr];
  $(".modal-img").attr("src", `${item.picture.large}`);
  $(".modal-name").html(`${item.name.title} ${item.name.first} ${item.name.last}`);
  $(".modal-text")
    .eq(0)
    .html(`${item.email}`);
  $(".modal-text")
    .eq(1)
    .html(`${item.location.city}`);
  $(".modal-text")
    .eq(2)
    .html(`${item.cell}`);
  $(".modal-text")
    .eq(3)
    .html(`${item.location.street}, ${item.location.city}, ${item.location.state} ${item.location.postcode}`);
  $(".modal-text")
    .eq(4)
    .html(`Birthday: ${item.dob.date.split("T")[0]}`);
}                                                                               // this function updates the date inside of the modal

$("#gallery").on("click", ".card", function() {
  cardNr = $(this).index();
  pos = cardsVis.indexOf(cardNr);
  updateData(cardNr);
  if (cardsVis.length === 1) {
    $(".modal-btn-container").hide();
  } else {
    $(".modal-btn-container").show();
  }                                                                             // hides the previous and next buttons if theres only 1 search result
  $(".modal-container").show();
});                                                                             // this function opens the modal with the correct info

function modalButton() {
  $("#modal-close-btn").on("click", function() {
    $(".modal-container").hide();
  });
}                                                                               // adds functionality to close the modal

 function toggle() {
   $(".modal-btn-container").on("click", ".btn", function() {
     if ($(this).attr("id") === "modal-next") {
       if (pos < cardsVis.length - 1) {
         pos += 1;
         cardNr = cardsVis[pos];
       } else {
         pos = 0;
         cardNr = cardsVis[pos];
       }
     } else if ($(this).attr("id") === "modal-prev") {
        if (pos > 0) {
          pos -= 1;
          cardNr = cardsVis[pos];
      } else {
         pos = cardsVis.length - 1;
         cardNr = cardsVis[pos];
        }
     }
     updateData(cardNr);
   });                                                                          // this function slides through all the modals
 }
