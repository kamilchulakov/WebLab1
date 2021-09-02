<?php
error_reporting(0);

function isDataValid($x, $y, $r)
{
    return
        in_array($x, array(-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2), false) &&
        is_numeric($y) && $y > -3 && $y < 5 &&
        in_array($r, array(1, 2, 3, 4, 5), false);
}

function atQuarterCircle($x, $y, $r)
{
    return (($x >= 0) && ($y <= 0) && (($x * $x + $y * $y) <= $r * $r / 4));
}

function atTriangle($x, $y, $r)
{
    return (($x <= 0) && ($y >= 0) && ($x + $r >= 2*$y));
}

function atRectangle($x, $y, $r)
{
    return (($x >= 0) && ($y >= 0) && ($y <= $r / 2) && ($x <= $r));
}


function atArea($x, $y, $r)
{
    if (atQuarterCircle($x, $y, $r) || atTriangle($x, $y, $r) || atRectangle($x, $y, $r)) return "inside";
    else return "outside";
}

session_start();
date_default_timezone_set('Europe/Moscow');

if (!isset($_SESSION["tableRows"])) {
    $_SESSION["tableRows"] = array();
}

$x = isset($_GET["x"]) ? $_GET["x"] : 0;
$y = isset($_GET["y"]) ? str_replace(",", ".", $_GET["y"]) : 0;
$r = isset($_GET["r"]) ? $_GET["r"] : 3;

if (!isDataValid($x, $y, $r)) {
    http_response_code(400);
    return;
}

$coordsStatus = atArea($x, $y, $r);
$currentTime = date("H : i : s");
$benchmarkTime = number_format(microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"], 10, ".", "") * 1000000;

$_SESSION["tableRows"][] = array(
    'x' => $x,
    'y' => $y,
    'r' => $r,
    'coordsStatus' => $coordsStatus,
    'currentTime' => $currentTime,
    'benchmarkTime' => $benchmarkTime
);
echo json_encode($_SESSION["tableRows"]);

