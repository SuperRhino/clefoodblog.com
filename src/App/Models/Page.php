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
        $this->post_date = array_get($values, 'post_date') ?: date('Y-m-d H:i:s');
        $this->updated_date = array_get($values, 'updated_date');
    }

    public function save()
    {
        if (! $this->id) {
            $this->id = $this->createPage();
        }
    }

    protected function createPage()
    {
        $insert = 'INSERT INTO pages (title, uri, article, preview_image, category, meta_title, meta_description, meta_keywords, author_id, post_date)
                    VALUES ("'.$this->title.'",
                            "'.$this->uri.'",
                            "'.$this->article.'",
                            "'.$this->preview_image.'",
                            "'.$this->category.'",
                            "'.$this->meta_title.'",
                            "'.$this->meta_description.'",
                            "'.$this->meta_keywords.'",
                            '.$this->author_id.',
                            "'.$this->post_date.'")';
        static::$app->db->query($insert);

        return static::$app->db->lastInsertId();
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
            'meta_title' => ! empty($this->meta_title) ? $this->meta_title : $this->title,
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
              ->orderBy(['if(updated_date, updated_date, post_date) desc'])
              ->limit($limit);

        $pages = [];
        $res = static::$app->db->fetchAll($query);
        foreach ($res as $page) {
            $pages []= new Page($page);
        }

        return $pages;
    }

    public static function findByPageName($pageName)
    {
        $query = static::$app->query->newSelect();
        $query->cols(['*'])
              ->from('pages')
              ->where('uri="'.$pageName.'"')
              ->limit($limit);

        $result = static::$app->db->fetchOne($query);
        if (! $result) {
            return null;
        }

        return new Page($result);
    }
}