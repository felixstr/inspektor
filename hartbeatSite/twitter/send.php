<?php
$tweet = '';
$counter = '';
if (isset($_GET['t'])) {
	$tweet = intval($_GET['t']);
}
$result = array(
	'tweet' => $tweet,
);
if (!empty($tweet) && false) {
	
	require_once 'src/twitter.class.php';
	
	// ENTER HERE YOUR CREDENTIALS (see readme.txt)
	$consumerKey = 'IiTzUCr59eL7M5vzK0ESi5HSd';
	$consumerSecret = 'AdO5LoM1uFc81mSWupXEZEN2ULmqBjwI44M9CzwQlFVSs1NmiZ';
	$accessToken = '4456708763-GU2bvMmpZ4PFcBeMNecbQhO6D3SrN2qJbgMINnv';
	$accessTokenSecret = 'S4v9OjJbfkMzuZ9CDVs5RxV2sOb3DFFMCCN6jdEfm9pnm';
	$twitter = new Twitter($consumerKey, $consumerSecret, $accessToken, $accessTokenSecret);
	
	$result['status'] = 'ok';
	try {
		$tweet = $twitter->send('#bubum '.$tweet.'・'.date("G:i:s")); // you can add $imagePath as second argument
	} catch (TwitterException $e) {
// 		echo 'Error: ' . $e->getMessage();
// 		$result = $e->getMessage();
		$result['status'] = 'ok';
		$result['message'] = $e->getMessage();
	}
	
	header('Content-Type: application/json');
	echo json_encode($result);
	
}