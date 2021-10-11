var serverIP = "192.168.0.100"; // This is the local computer IP

//This method created the button from the approriate children
async function createButton(textBtn, childid) {
  $("#btnContainer").append(
    "<button class='ui-btn' data-index-number=" +
      childid +
      " id='childBtn'>" +
      textBtn +
      "</button>"
  );
}

// This variable hold the username of the eduactor. ****take from login*****
var educatorUsername = "saajidh.nizam@cqumail.com";
// this method fetch the details of the childrens an educator
function fetchChildrenDetails() {
  var childByEduURL = `http://${serverIP}:3000/children/${educatorUsername}`;
  $.ajax({
    type: "GET",
    url: childByEduURL,
    dataType: "JSON",
    success: function (data) {
      if (data.length != 0) {
        console.log(data);
        storeChildrenDetails(data);

        var childrendDetailsArray = retrieveChildrensFromLocalStore();

        for (
          var childernNo = 0;
          childernNo < childrendDetailsArray.length;
          childernNo++
        ) {
          var childName = childrendDetailsArray[childernNo].Name;
          var childid = childrendDetailsArray[childernNo]._id;

          createButton(childName, childid);
        }
      } else {
        $("#btnContainer").append("<p>No children assign to you room</p>");
      }
    },
  });
}

var valData;

function fetchChildrenDetailsById(ChildId) {
  var childrenStorageData = localStorage.getItem(
    "childrenofEducatorLocalStorage"
  );
  var childrenStorageDataArray = JSON.parse(childrenStorageData)[0];

  for (
    var childernNo = 0;
    childernNo < childrenStorageDataArray.length;
    childernNo++
  ) {
    var childName = childrenStorageDataArray[childernNo].Name;
    var childid = childrenStorageDataArray[childernNo]._id;
    var childRoom = childrenStorageDataArray[childernNo].Room;
    if (childid == ChildId) {
      $(".reflection-name").empty();
      $(".reflection-name").append(childName);
      $(".reflection-room").empty();
      $(".reflection-room").append(childRoom);
    }
  }
}

// this method store the details of the children from the database in the localStroge
function storeChildrenDetails(childrenEndroledforEducator) {
  try {
    if (localStorage) {
      var childrenofEducatorLocalStorage;
      if (!localStorage["childrenofEducatorLocalStorage"])
        childrenofEducatorLocalStorage = [];
      else localStorage.clear();
      if (!(childrenofEducatorLocalStorage instanceof Array))
        childrenofEducatorLocalStorage = [];
      childrenofEducatorLocalStorage.push(childrenEndroledforEducator);

      localStorage.setItem(
        "childrenofEducatorLocalStorage",
        JSON.stringify(childrenofEducatorLocalStorage)
      );
      console.log("Given information successfully stored! Thank you.");
    }
  } catch (error) {
    console.error(
      "Error detected while the store data to the local storage" + error
    );
    alert(
      "Unable to retrive details of the children, Please try again in moment. Sorry for the inconvininace"
    );
  }
}

// This Method retrives the Children Details from the localstorage
function retrieveChildrensFromLocalStore() {
  try {
    var childrenStorageData = localStorage.getItem(
      "childrenofEducatorLocalStorage"
    );
    var childrenStorageDataArray = JSON.parse(childrenStorageData)[0];
    return childrenStorageDataArray;
  } catch (error) {
    console.error(
      "Error detected while the store data to the local storage" + error
    );
    alert(
      "Unable to retrive details of the children, Please try again in moment. Sorry for the inconvininace"
    );
  }
}

$(document).ready(function () {
  fetchChildrenDetails();
  $("#btnContainer").on("click", "#childBtn", function () {
    $("body").pagecontainer("change", "#daily-reflections-page", {
      transition: "slide",
    });
    //var valueText = $(this).html();
    var childId = $(this).attr("data-index-number");
    fetchChildrenDetailsById(childId);
  });

  //This method work with ce
  let app = {
    init: function () {
      document
        .getElementById("camera-take-images")
        .addEventListener("click", app.takephoto);
    },
    takephoto: function () {
      let option = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL, // 1
        sourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE, // use the image gallery
        encodingType: Camera.EncodingType.JPEG,
        cameraDirection: Camera.Direction.BACK, //use the back camera
        targetWidth: 1024,
      };
      navigator.camera.getPicture(app.ftw, app.wtf, option);
    },
    // This fuction is exicuted when the camera is successful
    ftw: function (imageURI) {
      console.log(imageURI);

      var base64Img = imageURI;
      var image = new Image();
      image.src = "data:image/jpeg;base64," + base64Img;

      $("#child-images").append(
        `<img display:none;width:60px;height:60px; src='${image}'></img>`
      );
      var childimgURL = `http://${serverIP}:3000/img`;

      var form = new FormData();
      form.append("image", image);

      //form.append("image", fileInput.files[0], `/${imageURI}`);

      console.log(form);
      var settings = {
        url: "http://192.168.0.100:3000/img",
        method: "POST",
        timeout: 0,
        headers: {
          test: "test",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          fileName: `${new Date().getTime()}.jpg`,
          fileContent: base64Img,
        }),
      };

      $.ajax(settings).done(function (response) {
        console.log(response);
      });

      console.log(imageURI);
    },
    wtf: function (message) {
      alert(message);
    },
  };

  document.addEventListener("deviceready", app.init);
});
