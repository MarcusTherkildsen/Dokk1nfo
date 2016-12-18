<!doctype html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Problemer med at finde rundt på Dokk1? Ikke længere!">
    <meta name="keywords" content="Alt om Dokk1nfo">
    <meta name="author" content="Dokk1nfo">
    <title>Alt om Dokk1 - Dokk1nfo</title>
    <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">-->
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/navnav.css">
    <link rel="stylesheet" href="/css/search.css">
    <!--Website thumbnail-->
    <meta property="og:image" content="http://www.dokk1nfo.dk/img/thumb.jpeg"/>
    <link rel="image_src" href="http://www.dokk1nfo.dk/img/thumb.jpeg"/>
</head>

<body>
  <nav class="navbar navbar-default navbar-static-top">
      <div class="container">
          <div class="navbar-header">
              <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                  <span class="sr-only">Toggle navigation</span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="http://www.dokk1nfo.dk/">
                  <p class="nav-logo">
                      <span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>Dokk1nfo.dk&nbsp;
                      <span class="logo-last">Alt om Dokk1</span>
                  </p>
              </a>
          </div>
          <div id="navbar" class="navbar-collapse collapse">
              <ul class="nav navbar-nav navbar-right">
                  <li><a href="/om">Om</a></li>
              </ul>
          </div>
      </div>
  </nav>

  <div class="container">
    <div id="list">
      <div class="top">
      <form id="plot_form">
        <input class="search" id="shelf_id" placeholder="fx Turen går til" required="required" autofocus>
        <button class="sort">Søg</button>
      </form>
        <div style="padding-bottom: 10px;">
          <p class="helptext">Her kan du søge efter <b>alle emner</b> på Dokk1. Klik på resultat for kort.<br>Grøn: kan udlånes. Rød: kan ikke udlånes.</p>
        </div>
      </div>
    </div>
    
    <!--Background image set in navnav.css-->

    <!--Fancy bootstrap list-->
    <div class="row text-center" id="navid">
      <ul>
      
        <!--Populated in javascript-->

      </ul>
    </div>

  <!--Stupid way of making a working overlay-->
    <div class="overlay-bg">
    </div>
    <div class="overlay-content popup1">
        <div class="row bot">
          <div class="col-xs-12 col-md-10 col-md-offset-1">
              <div class="box">
                  <canvas id="myCanvas">
                    Din browser understøtter ikke HTML5 canvas. Opdatér eller prøv en anden browser.
                  </canvas>
              </div>
          </div>
        </div>

        <div class="center">
          <button class="close-btn">Luk</button>
        </div>
    </div>


  </div>

  <!--<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js'></script>-->
  <!--<script type='text/javascript' src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>-->
  <script type='text/javascript' src='/js/jquery.min.js'></script>
  <script type='text/javascript' src='/js/plot_dot.js'></script><!--Needs to be after jQuery import-->
  <script type='text/javascript' src='/js/loadingoverlay.min.js'></script>
  <script type='text/javascript' src="/js/bootstrap.min.js"></script>
  
</body>
</html>