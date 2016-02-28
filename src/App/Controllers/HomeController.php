<?php
namespace App\Controllers;

use Core\BaseController;
use App\Models\Page;
use Core\Http\Exception\NotFoundException;

class HomeController extends BaseController
{
    public function index()
    {
        $data = [
            'pages' => Page::findMostRecent(),
        ];

        return $this->view('home.html', $data);
    }

    public function showPage($request)
    {
        $pageName = $request->getAttribute('pageName');
        $page = Page::findByPageName($pageName);
        if (! $page) {
            throw new NotFoundException('Page not found');
            // $this->notFound();
        }

        $this->setMetadata([
            'title' => $page->meta_title,
            'description' => $page->meta_description,
            'keywords' => $page->meta_keywords,
        ]);

        return $this->view('blog-page.html', ['page' => $page->toArray()]);
    }

    public function showCategory($request)
    {
        $categoryName = $request->getAttribute('categoryName');
        $data = [
            'category' => $categoryName,
            'pages' => Page::findActiveByCategory($categoryName),
        ];

        return $this->view('category.html', $data);

    }
}