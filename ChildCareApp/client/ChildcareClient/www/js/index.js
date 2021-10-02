document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
}

//This method created the button from the approriate children
async function createButton(textBtn) {
  $("#btnContainer").append("<button class='ui-btn' id='scanBtn'>" + textBtn + "</button>");
}

function fetchChildrenDetails() {
  fetch("http://localhost:3000/children/saajidh.nizam@cqumail.com")
    .then((res) => res.json())
    .then((data) => {
      if (data.length != 0) {
        for (var childernNo = 0; childernNo < data.length; childernNo++) {
          var childName = data[childernNo].Name;
          createButton(childName);
        }
      }
    });
}

$(document).on("pagecreate", "#home", function (event) {
  $("#displayLocalDataBtn").on("click", function (e) {
    $("body").pagecontainer("change", "#localdatapage", {
      transition: "slide",
    });
    retrieveLocalData();
  });

  $("#displayCloudBtn").on("click", function (e) {
    $("body").pagecontainer("change", "#dataCloud", { transition: "slide" });
    fetchFromCloud();
  });

  $("#dropbtn").on("click", function (e) {
    document.getElementById("dropdownMenu").classList.toggle("show");
  });

  $("#uploadCloudBtn").on("click", function (e) {
    $("body").pagecontainer("change", "#uploadCloud", { transition: "slide" });
    postAlbumData();
  });
});

$(document).ready(function () {
  fetchChildrenDetails();
});
