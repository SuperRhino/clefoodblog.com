<?php

use Phinx\Migration\AbstractMigration;

class CreatePagesTable extends AbstractMigration
{
    public function change()
    {
        $this->table('pages')
             ->addColumn('title', 'string', ['limit' => 20, 'null' => false])
             ->addColumn('description', 'text', ['null' => true])
             ->addColumn('event_id', 'integer', ['null' => true])
             ->addColumn('post_date', 'datetime', ['null' => false])
             ->addColumn('updated_date', 'datetime', ['null' => false])
             ->addIndex('title')
             ->addIndex('event_id')
             ->addIndex('post_date')
             ->addIndex('updated_date')
             ->create();
    }
}
