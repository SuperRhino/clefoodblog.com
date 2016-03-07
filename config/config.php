<?php
// Load Env Config
(new Dotenv\Dotenv('../'))->load();

$env = strtolower(getenv('ENV'));
$site_url = 'http://clefoodblog.com/';
$assets = json_decode(file_get_contents('../asset-manifest.json'), true);
switch ($env) {
    case 'dev':
        $site_url = 'http://dev.clefoodblog.com/';
        $assets = array_combine(array_keys($assets), array_keys($assets));
        break;
}

$container = new Slim\Container([
    'settings' => [
        'env' => $env,
        'base_path' => realpath(__DIR__.'/../'),

        'app.name'        => 'CleFoodBlog',
        'app.description' => 'A journey thru the Cleveland food scene from a couple of people who really love cardamom bombs',
        'app.keywords'    => 'cleveland,food,blog,restaurant',

        'app.urls.site'   => $site_url,
        'app.urls.assets' => '/build',
        'app.paths.js'    => '/build/js',
        'app.paths.css'   => '/build/css',
        'app.assets'      => $assets,

        'app.paths.upload_path' => '/public/uploads',
        'app.paths.upload_dir'  => '/uploads',

        'hashids.salt'       => 'C7WPHfv6N73WxzNfDPDtGEHmzUKbbyE2',
        'hashids.min-length' => 3,

        'db.host'    => getenv('DB_HOST'),
        'db.name'    => getenv('DB_NAME'),
        'db.user'    => getenv('DB_USER'),
        'db.pass'    => getenv('DB_PASS'),
        'db.charset' => 'utf8',

        'ga.tracking_id' => 'UA-67735723-1',
    ],
]);

return $container;