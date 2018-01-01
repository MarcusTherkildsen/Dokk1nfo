<!DOCTYPE html>
<html lang="da">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Problemer med at finde rundt på Dokk1? Ikke længere!">
    <meta name="keywords" content="Alt om Dokk1nfo">
    <meta name="author" content="Dokk1nfo">
    <title>Printere - Dokk1nfo</title>
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
                    <li class="active"><a href="/print">Print</a></li>
                    <li><a href="/parkering">Parkering</a></li>
                    <li><a href="/kø">Kø</a></li>
                    <li><a href="/besøg">Besøg</a></li>
                    <li><a href="/om">Om</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container">
    
    <?php

    function append_to_file($path, $text)
    {
        $handle = fopen($path, "a");
        fwrite($handle, str_rot13(base64_encode($text)) . "\n");
        fclose($handle);
    }

    $floor = '';
    $error = '';
    $time = date("m-d H:i:s");
    $address = $_SERVER['REMOTE_ADDR'];
    $year = date("Y");

    // How to handle form requests
    if ($_SERVER["REQUEST_METHOD"] == "POST" and htmlentities($_POST['setFloor'])) {

        
        $floor = $_POST['setFloor'];
        $floor = $floor-1 ;
        

        //$floor = 1;
        $tip = '<p class="tip">Tip: Tryk på billedet for at forstørre det.</p>';
        $filename = "./img/print/" . "$floor" . ".jpg";
        if (file_exists($filename)) {
            $picture = "<a href='/img/print/" . "$floor" . ".jpg'><img src='/img/print/" . "$floor" . ".jpg' style='width:100%' title='Tryk for fuld skærm'></a>";
            append_to_file("logs/$year.log", $time . ", " . $address . ", P, " . $floor);
        }


    }
    ?>
    
        <div class="row center">
            <h2>Find printere</h2>
            <p class="center">
                Vælg niveau.
            </p>
            <div class="col-xs-12 col-xs-offset-0 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                <form class="form-horizontal" method="POST">
                    <div class="form-group">
                        <div class="btn-group btn-group-lg center" role="group" aria-label="...">
                            <button type="submit" name="setFloor" value="2" class="btn btn-default">1</button>
                            <button type="submit" name="setFloor" value="3" class="btn btn-default" disabled>2</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <? if ($error) {echo $error;} ?>
                    </div>
                </form>
            </div>
        </div>

        <div class="row bot">
            <div class="col-xs-12 col-md-10 col-md-offset-1">
                <div class="box">
                    <?php
                        echo $picture;
                        echo $tip;
                    ?>
                </div>
            </div>
        </div>
    </div>

    <script type='text/javascript' src='/js/jquery.min.js'></script>
    <script type='text/javascript' src="/js/bootstrap.min.js"></script>

</body>
</html>
0
