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

        $meta_image = $page->preview_image;
        if (stripos($meta_image, 'http') !== 0) {
            $meta_image = $this->app->getSetting('app.urls.site') . $meta_image;
        }
        $this->setMetadata([
            'url' => $this->app->getSetting('app.urls.site') . $page->uri,
            'title' => $page->meta_title,
            'description' => $page->meta_description,
            'keywords' => $page->meta_keywords,
            'image' => $meta_image,
            'og_type' => 'article',
            'article_section' => $page->category,
            'article_date' => date('Y-m-d', strtotime($page->post_date)),
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

        $this->setMetadata([
            'url' => $this->app->getSetting('app.urls.site') . 'category/'.$categoryName,
            'title' => $categoryName.' Archives',
            'description' => 'Article archives for Cleveland Food Blog '.$categoryName.' category.',
            'keywords' => $page->meta_keywords.','.$categoryName,
            'og_type' => 'object',
        ]);

        return $this->view('category.html', $data);

    }
}