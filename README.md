# TEPT
TEPT is a JavaScript library where the four letters stand for Text, Effects, Position, and Time. The main function of this library is to display text on videos on a web page with some simple special effects with user-defined time and position. This library provides conveniences for developers who would like to show comments as part of the video (e.g. like Danmaku, live streams), or making web applications with videos showing subtitles or closed captions. 

Visit the landing page here: https://csc309-nico-tept.herokuapp.com/

## Getting Started
The following instructions will help you get a copy of the library and use it in your website development.
* Download `TEPT.js` and `TEPT.css` on your local machine. These could be found at `/pub/js` and `/pub` in this repository.
* Reference both `TEPT.js` and `TEPT.css` in the HTML file which you will be using this library.

  ```html
  <link rel="stylesheet" type="text/css" href="TEPT.css"> 
  <script type="text/javascript" src="js/TEPT.js"></script>
  ```
  
* Embed your video using the HTML `<video>` tag, an example is shown. Your video must have the format that is supported by HTML and your browser. However, TEPT also supports YouTube videos embedded, which will be explained later in this introduction.

  ```html
  <video id="test_video" autoplay="autoplay" controls>
    <source src="test.mp4" type="video/mp4">
		<source src="test.ogg" type="video/ogg">
  </video>  
  ```
  
* Add to the script for this HTML the following to initialize the library.

  ```javascript
  const tept = new TEPT();
  ```
  
* Set up the library by giving the id of the video element you just embedded. By doing this, the library will create a canvas element covering the whole video scope where texts will be shown.

  ```javascript
  tept.setVideo('test_video')
  ```
  
  * You can also set up the library with a list of 4 percentages to limit the area for displaying text. This example shows that texts could appear between anywhere from left edge to the right edge of the video, but only between 0.3\*height and 0.7\*height:
  
    ```javascript
    tept.setVideo('test_video', [0.0, 1.0, 0.3, 0.7])
    ```
    
* Now you can create text to be displayed on top of the video by using the `createText` function by giving the text `content`, `start time`, `end time`, `color`, `size`, `positionPer`, `effect` parameters.
  * `content` is a String that is the actual text to be shown.
  * `start time` and `end time` are decimal numbers representing time by seconds, your text will be shown between this two seconds. It is recommended to use the `getVideoTime` method provided by the TEPT library which gets the current second of the video.
  * `color` is a String indicating the color of the text to be shown, this could be any format supported by HTML.
  * `size` is an integer for the font size.
  *  `positionPer` is an 2d array that are percentages indicating the x(positionPer\[0\]\*width) and y(positionPer\[1\]\*height) coordinates of where the text will be shown.
  * `effect` is a String that is either `no change`, `left to right`, `right to left`, `top to bottom`, `bottom to top`, or `push up`, which are the existing effects(motions of the texts) in this version of TEPT. See demos in the [landing page](https://csc309-nico-tept.herokuapp.com/) to see how different effects look like.

  ```javascript
    tept.createText('This is an example of text', 1.5, 5.5, 'white', '30', [0.5, 0.5], 'no change');
  ```

  * This example will display the text "This is an example of text" at the middle of the video scope, in white, when it plays to 1.5 second and stays at the same place for 4 seconds.
* There are more ways to set up a text as you can set up default values which allows you to use the `createText` method providing less parameters, see [API documentation](https://csc309-nico-tept.herokuapp.com/?tab=api) to see more instructions.

### Using TEPT with YouTube videos
If you are planning to use this library with an YouTube video, you are required to embed the YouTube video using [YouTube iframe API](https://developers.google.com/youtube/iframe_api_reference). The following gives instructions on how to use TEPT with embedded YouTube video.

* Reference the iframe API in your HTML together with `TEPT.js` and `TEPT.css`

  ```html
  <link rel="stylesheet" type="text/css" href="TEPT.css">
  <script src="https://www.youtube.com/iframe_api"></script>
  <script type="text/javascript" src="js/TEPT.js"></script>
  ```
* Create a `<div>` to be the container of the video player, this will be replaced by `<iframe>` when we set up the video player in JS script

  ```html
  <div id="youtube_video"></div> 
  ```
  
* In the JavaScript, initialize TEPT library, set up the YouTube player, then set up the library using `setYoutubeVideo` giving two variables: `player` which is the video player we setted up just now, and the id of `<iframe>`. You can also give the 4 percentage array mentioned before.

  ```javascript
  const tept = new TEPT();
  
  let player;
  function onYouTubeIframeAPIReady() {
      player = new YT.Player('youtube_video', {
          width: 640,
          height: 360,
          videoId: 'H8YW1tlsmE8'    // this is the unique video id given by every YouTube video
      });
      
      // set video for TEPT
      player.addEventListener('onReady', function(e){
        tept.setYoutubeVideo(player, 'youtube_video');
      })
  }
  ```

* Now you can create texts to be shown on the YouTube video as the same way explained with videos embedded using HTML `<video>` tags above.
  
The detailed online documentation can be viewed here: https://csc309-nico-tept.herokuapp.com/?tab=api
