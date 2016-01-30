<?php
namespace App\Controllers;

use Core\BaseController;
use App\Models\Page;

class HomeController extends BaseController
{
    public function index()
    {
        $data = [
            'pages' => Page::findMostRecent(),
        ];

        return $this->view('home.html', $data);
    }

    /**
     * ADMIN ROUTE
     * add an event
     */
    public function addPage()
    {
        return $this->view('add-page.html');
    }
}