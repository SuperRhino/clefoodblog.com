<?php
namespace App\Controllers\Api;

use App\Models\User;
use App\Models\Page;
use Core\BaseApiController;
use Core\Http\Exception\BadRequestException;
use Core\Http\Exception\NotFoundException;

class PageController extends BaseApiController
{
    public function addPage()
    {
        $user = $this->app->getCurrentUser();
        if (! $user) {
            throw new NotFoundException('User not found');
        }

        // $title = $this->json('title');
        // $article = $this->json('article');
        // $uri = $this->json('uri');
        // $category = $this->json('category');
        // $meta_title = $this->json('meta_title');
        // $meta_description = $this->json('meta_description');
        // $meta_keywords = $this->json('meta_keywords');
        // $post_date = $this->json('post_date');
        $pageData = $this->json();
        $pageData['author_id'] = $user->id;

        $page = new Page($pageData);
        $page->save();

        return $this->success($page->toArray());
    }
}