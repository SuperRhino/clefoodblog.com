<?php
namespace App\Controllers;

use App\Models\Category;
use App\Models\Page;
use Core\BaseController;
use Core\Http\Exception\NotFoundException;
use Tackk\Cartographer\Sitemap;
use Tackk\Cartographer\ChangeFrequency;

class SitemapController extends BaseController
{
    /**
     * Build basic sitemap:
     */
    public function index()
    {
        $sitemap    = new Sitemap();
        $pages      = Page::findAllActive();
        $categories = Category::findAllActive();

        // Add all page routes:
        $lastmod = empty($pages[0]) ? '-1 week' : (
                        ! empty($pages[0]->updated_date) ? $pages[0]->updated_date : $pages[0]->post_date
                    );
        $lastmod = date('Y-m-d', strtotime($lastmod));
        $baseUrl = $this->app->getSetting('app.urls.site');
        $sitemap->add($baseUrl, $lastmod, ChangeFrequency::WEEKLY, 1.0);

        // Append all blog pages:
        foreach($pages as $page) {
            $url = $baseUrl . $page->uri;
            $lastmod = ! empty($page->updated_date) ? $page->updated_date : $page->post_date;
            $lastmod = date('Y-m-d', strtotime($lastmod));
            $sitemap->add($url, $lastmod, ChangeFrequency::WEEKLY, 0.5);
        }

        // Append all category pages:
        foreach($categories as $cat) {
            $url = $baseUrl . 'category/' . $cat['category'];
            $lastmod = date('Y-m-d', strtotime($cat['lastmod']));
            $sitemap->add($url, $lastmod, ChangeFrequency::WEEKLY, 0.3);
        }

        return $this->sendXml($sitemap->toString());
    }

    public function rss()
    {
        $pages = Page::findAllActive(true);

        $lastmod = empty($pages[0]) ? '-1 week' : (
                        ! empty($pages[0]['updated_date']) ? $pages[0]['updated_date'] : $pages[0]['post_date']
                    );

        return $this->viewXml('xml/rss.xml', [
            'lastmod' => date('r', strtotime($lastmod)),
            'pages' => $pages,
        ]);
    }
}