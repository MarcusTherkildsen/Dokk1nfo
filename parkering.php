<!DOCTYPE html>
<html lang="da">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Problemer med at finde rundt på Dokk1? Ikke længere!">
    <meta name="keywords" content="Alt om Dokk1nfo">
    <meta name="author" content="Dokk1nfo">
    <title>Parkering - Dokk1nfo</title>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/navnav.css">
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
                  <li><a href="/">Søg</a></li>
                  <li><a href="/toilet">Toilet</a></li>
                  <li><a href="/print">Print</a></li>
                  <li class="active"><a href="/parkering">Parkering</a></li>
                  <li><a href="/kø">Kø</a></li>
                  <li><a href="/besøg">Besøg</a></li>
                  <li><a href="/om">Om</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container" id="parkering_list">
        <ul>
      
        <!--Populated in javascript-->

        </ul>     
    </div>

    <script type='text/javascript' src='/js/jquery.min.js'></script>
    <script type='text/javascript' src="/js/parkering.js"></script><!--Needs to be after jQuery import-->
    <script type='text/javascript' src="/js/bootstrap.min.js"></script>

</body>
</html>