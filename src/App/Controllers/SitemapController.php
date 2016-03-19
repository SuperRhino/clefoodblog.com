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
        $lastmod = ! empty($pages[0]) ? date($pages[0]->lastmod, 'Y-m-d') : date(strtotime('-1 week'), 'Y-m-d');
        $baseUrl = $this->app->getSetting('app.urls.site');
        $sitemap->add($baseUrl, $lastmod, ChangeFrequency::WEEKLY, 1.0);

        // Append all blog pages:
        foreach($pages as $page) {
            $url = $baseUrl . $page->uri;
            $lastmod = date($page->updated_date, 'Y-m-d');
            $sitemap->add($url, $lastmod, ChangeFrequency::WEEKLY, 0.5);
        }

        // Append all category pages:
        foreach($categories as $cat) {
            $url = $baseUrl . 'category/' . $cat['category'];
            $lastmod = date($cat['lastmod'], 'Y-m-d');
            $sitemap->add($url, $lastmod, ChangeFrequency::WEEKLY, 0.3);
        }

        return $this->sendXml($sitemap->toString());
    }
}