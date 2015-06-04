function toggleUpdating() {
  var lockButton = document.getElementById("lockButton");
  if (document.checkingForUpdate == true) {
    lockButton.className = "headerButton locked";
    lockButton.title = "Unlock Vizboard"
    document.checkingForUpdate = false;
    clearInterval(document.updater);
    document.updater = null;
  } else {
    lockButton.className = "headerButton unlocked"
    lockButton.title = "Lock Vizboard"
    document.updater = setInterval("checkForUpdate()", 100);
    document.checkingForUpdate = true;
  }
}

$(document)
  .ready(toggleUpdating);

function checkForUpdate() {
  $.ajax({
    url: "/chart/update",
    success: function(response) {
      if (response != "{}") {
        var servable = JSON.parse(response);
        document.isNewVisualization = true;
        doAndRedoOnResize(function() {
          var contentId = "content";
          var headerId = "header";
          if (document.lastServed) {
            document.lastServed.clearHeader();
          }
          document.getElementById(contentId)
            .innerHTML = "";
          if (servable.type == "chart") {
            document.lastServed = new C3Chart()
              .header(headerId)
              .content(contentId)
              .margin({
                top: 15,
                right: 15,
                left: 60
              })
              .data(servable.content)
              .draw();
          } else if (servable.type == "table") {
            document.lastServed = new Table()
              .header(headerId)
              .content(contentId)
              .margin({
                top: 40,
                right: 0,
                bottom: 0,
                left: 0
              })
              .data(servable.content)
              .draw();
          } else if (servable.type == "histogram") {
            document.lastServed = new Histogram()
              .header(headerId)
              .content(contentId)
              .margin({
                top: 30,
                right: 60,
                bottom: 60,
                left: 60
              })
              .data(servable.content)
              .draw();
          } else if (servable.type == "graph") {
            document.lastServed = new Graph()
              .header(headerId)
              .content(contentId)
              .data(servable.content)
              .draw();
          } else if (servable.type == "points-2d") {
            document.lastServed = new Scatter2D()
              .header(headerId)
              .content(contentId)
              .margin({
                top: 20,
                right: 15,
                bottom: 60,
                left: 60
              })
              .data(servable.content)
              .draw();
          } else if (servable.type == "matrix") {
            document.lastServed = new Matrix()
              .header(headerId)
              .content(contentId)
              .margin({
                top: 20,
                right: 15,
                bottom: 60,
                left: 60
              })
              .data(servable.content)
              .draw();
          } else {
            console.error("Unrecognized response: " + response);
          }
          document.isNewVisualization = false;
        });
      }
    }
  });
}
