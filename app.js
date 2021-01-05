var image_x = 0, image_y = 0;
var zoom = 0.5;
var mouse_x = 0, mouse_y = 0, finger_dist = 0;
var source_image_obj = new Image();
source_image_obj.addEventListener('load', function () {
  reset_settings();
}, false); // Reset (x,y,zoom) when new image loads

function load_url() {
  source_image_obj.src = document.getElementById("theurl").value; // load the image
}

function update_canvas() {
  var mainCanvas = document.getElementById("mainCanvas");
  var mainCanvasCTX = document.getElementById("mainCanvas").getContext("2d");
  var canvas_w = mainCanvas.width, canvas_h = mainCanvas.height; // make things easier to read below
  // Keep picture in bounds
  if (image_x - (canvas_w * zoom / 2) > source_image_obj.width) image_x = source_image_obj.width + (canvas_w * zoom / 2);
  if (image_y - (canvas_h * zoom / 2) > source_image_obj.height) image_y = source_image_obj.height + (canvas_h * zoom / 2);
  if (image_x + (canvas_w * zoom / 2) < 0) image_x = 0 - (canvas_w * zoom / 2);
  if (image_y + (canvas_h * zoom / 2) < 0) image_y = 0 - (canvas_h * zoom / 2);
  // Draw the scaled image onto the canvas
  mainCanvasCTX.clearRect(0, 0, canvas_w, canvas_h);
  mainCanvasCTX.drawImage(source_image_obj, image_x - (canvas_w * zoom / 2), image_y - (canvas_h * zoom / 2), canvas_w * zoom, canvas_h * zoom, 0, 0, canvas_w, canvas_h);
}

function reset_settings() {
  image_x = source_image_obj.width / 2;
  image_y = source_image_obj.height / 2;
  zoom = 1;
  update_canvas(); // Draw the image in its new position
}

/*document.addEventListener('wheel', function (e) {
  if (e.deltaY < 0) {
    zoom = zoom * 1.5;
  } else {
    zoom = zoom / 1.5;
  }
  update_canvas();
}, false); */

/* document.addEventListener('mousemove', function (e) {
  if (e.buttons > 0) {
    window.getSelection().empty();
    image_x = image_x + zoom * (mouse_x - e.clientX);
    image_y = image_y + zoom * (mouse_y - e.clientY);
  }
  mouse_x = e.clientX;
  mouse_y = e.clientY; // Save for next time
  update_canvas(); // draw the image in its new position
}, false);

function get_distance(e) {
  var diffX = e.touches[0].clientX - e.touches[1].clientX;
  var diffY = e.touches[0].clientY - e.touches[1].clientY;
  return Math.sqrt(diffX * diffX + diffY * diffY); // Pythagorean theorem
} */

mainCanvas.addEventListener('touchstart', function (e) {
  if (e.touches.length > 1) { // if multiple touches (pinch zooming)
    finger_dist = get_distance(e); // Save current finger distance
  } // Else just moving around
  mouse_x = e.touches[0].clientX; // Save finger position
  mouse_y = e.touches[0].clientY; //
}, false);

mainCanvas.addEventListener('touchmove', function (e) {
  e.preventDefault(); // Stop the window from moving
  if (e.touches.length > 1) { // If pinch-zooming
    var new_finger_dist = get_distance(e); // Get current distance between fingers
    zoom = zoom * Math.abs(finger_dist / new_finger_dist); // Zoom is proportional to change
    finger_dist = new_finger_dist; // Save current distance for next time

  } else { // Else just moving around
    image_x = image_x + (zoom * (mouse_x - e.touches[0].clientX)); // Move the image
    image_y = image_y + (zoom * (mouse_y - e.touches[0].clientY)); //
    mouse_x = e.touches[0].clientX; // Save finger position for next time
    mouse_y = e.touches[0].clientY; //
  }
  //update_canvas(); // draw the new position
}, false);

mainCanvas.addEventListener('touchend', function (e) {
  mouse_x = e.touches[0].clientX;
  mouse_y = e.touches[0].clientY; // could be down to 1 finger, back to moving image
}, false);
