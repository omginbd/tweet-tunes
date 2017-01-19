<?php
/**
 * Created by PhpStorm.
 * User: austinh
 * Date: 1/19/17
 * Time: 11:38 AM
 */

require "twitteroauth/autoload.php";

use Abraham\TwitterOAuth\TwitterOAuth;

session_start();

$query = $_GET['query'];

$user = "";
$apiKey = "";
$apiSecret = "";
$token = "";
$tokenSecret = "";

$connection = getConnectionWithAccessToken($apiKey, $apiSecret, $token, $tokenSecret);
$resource = "search/tweets";

$statuses = $connection->get($resource, ["q" => $query]);
echo json_encode($statuses);
return;


/* FUNCTIONS */
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
    $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
    return $connection;
}

