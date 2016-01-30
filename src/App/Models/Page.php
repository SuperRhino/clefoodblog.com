<?php
namespace App\Models;

use Core\Database\Model;

class Page extends Model {

    var $id;
    var $title;
    var $uri;
    var $article;
    var $preview_image;
    var $category;
    var $meta_title;
    var $meta_description;
    var $meta_keywords;
    var $author_id;
    var $post_date;
    var $updated_date;

    function __construct($values = [])
    {
        $this->id = (int) array_get($values, 'id');
        $this->title = array_get($values, 'title');
        $this->uri = array_get($values, 'uri');
        $this->article = array_get($values, 'article');
        $this->preview_image = array_get($values, 'preview_image');
        $this->category = array_get($values, 'category');
        $this->meta_title = array_get($values, 'meta_title');
        $this->meta_description = array_get($values, 'meta_description');
        $this->meta_keywords = array_get($values, 'meta_keywords');
        $this->author_id = (int) array_get($values, 'author_id');
        $this->post_date = array_get($values, 'post_date');
        $this->updated_date = array_get($values, 'updated_date');
    }

    public function toArray()
    {
        return [
            'id' => (int) $this->id,
            'title' => $this->title,
            'uri' => $this->uri,
            'article' => $this->article,
            'preview_image' => $this->preview_image,
            'category' => $this->category,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'post_date' => $this->post_date,
            'updated_date' => $this->updated_date,
        ];
    }

    public static function findMostRecent($limit = 3)
    {
        $query = static::$app->query->newSelect();
        $query->cols(['*'])
              ->from('pages')
              ->orderBy(['updated_date desc', 'post_date desc'])
              ->limit($limit);

        $pages = [];
        $res = static::$app->db->fetchAll($query);
        foreach ($res as $page) {
            $pages []= new Page($page);
        }

        return $pages;
    }
}