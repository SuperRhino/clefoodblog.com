<?php
namespace App\Models;

use Core\Database\Model;

class Event extends Model {

    var $id;
    var $title;
    var $description;
    var $details_uri;
    var $post_date;
    var $event_date;

    function __construct($values = [])
    {
        $this->id = (int) array_get($values, 'id');
        $this->title = array_get($values, 'title');
        $this->description = array_get($values, 'description');
        $this->details_uri = array_get($values, 'details_uri');
        $this->post_date = array_get($values, 'post_date');
        $this->event_date = array_get($values, 'event_date');
    }

    public function toArray()
    {
        return [
            'id' => (int) $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'details_uri' => $this->details_uri,
            'post_date' => $this->post_date,
            'event_date' => $this->event_date,
        ];
    }

    public static function findMostRecent($limit = 3)
    {
        $query = static::$app->query->newSelect();
        $query->cols(['*'])
              ->from('events')
              ->orderBy(['event_date desc', 'post_date desc'])
              ->limit($limit);

        $Events = [];
        $events = static::$app->db->fetchAll($query);
        foreach ($events as $event) {
            $Events []= new Event($event);
        }

        return $Events;
    }
}