<?php
/**
 * Created by PhpStorm.
 * User: austinh
 * Date: 1/19/17
 * Time: 11:38 AM
 */

require "twitteroauth/autoload.php";

use Abraham\TwitterOAuth\TwitterOAuth;

const API_KEY = "";
const API_SECRET = "";
const OAUTH_TOKEN = "";
const OAUTH_SECRET = "";

if (isset($_GET['query'])) {
    getTweets();
} elseif ($_GET['tweetId']) {
    embedTweet();
} else {
    echo "";
    return;
}

function getTweets()
{
    session_start();

    $query = $_GET['query'];
    $connection = getConnectionWithAccessToken(API_KEY, API_SECRET, OAUTH_TOKEN, OAUTH_SECRET);
    $resource = "search/tweets";

    $statuses = $connection->get($resource, ["q" => $query, "filter" => "safe"]);
    echo json_encode($statuses);
    return;
}

function embedTweet()
{
    session_start();

    $tweetId = $_GET['tweetId'];
    $connection = getConnectionWithAccessToken(API_KEY, API_SECRET, OAUTH_TOKEN, OAUTH_SECRET);
    $resource = "statuses/oembed";

    $embeddedTweet = $connection->get($resource, ["id" => $tweetId]);
    echo json_encode($embeddedTweet);
    return;
}

/* FUNCTIONS */
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret)
{
    $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
    return $connection;
}

