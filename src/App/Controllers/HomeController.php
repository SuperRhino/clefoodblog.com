<?php
namespace App\Controllers;

use Core\BaseController;
use App\Models\Event;

class HomeController extends BaseController
{
    public function index()
    {
        $data = [
            'events' => Event::findMostRecent(),
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