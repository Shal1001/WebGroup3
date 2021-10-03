//This method created the button from the approriate children
async function createButton(textBtn, childid) {
  $("#btnContainer").append("<button class='ui-btn' data-index-number=" + childid + " id='childBtn'>" + textBtn + "</button>" );
}


function fetchChildrenDetails() {
  fetch("http://localhost:3000/children/saajidh.nizam@cqumail.com")
    .then((res) => res.json())
    .then((data) => {
      if (data.length != 0) {
        for (var childernNo = 0; childernNo < data.length; childernNo++) {
          var childName = data[childernNo].Name;
          var childid = data[childernNo]._id;
          createButton(childName, childid);
        }
      } else {
        $("#btnContainer").append("<p>No children assign to you room</p>");
      }
    });
}


function fetchChildrenDetailsById(ChildId) {
  var childByIdURL = `http://localhost:3000/children/id/${ChildId}`;
  fetch(childByIdURL)
    .then((res) => res.json())
    .then((data) => {
      if (data.length != 0) {
          var childName = data[childernNo].Name;
          var childid = data[childernNo]._id;
          createButton(childName, childid);
      } else {
        $("#btnContainer").append("<p>No children assign to you room</p>");
      }
    });
}



$(document).ready(function () {
  fetchChildrenDetails();
  $('#btnContainer').on('click', '#childBtn', function()
    {
      $("body").pagecontainer("change", "#daily-reflections-page", {
        transition: "slide",
      });
      
      var valueText = $(this).html();
      var childId = $(this).attr("data-index-number");
    });
});
