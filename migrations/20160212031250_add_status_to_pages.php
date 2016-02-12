<?php

use Phinx\Migration\AbstractMigration;

class AddStatusToPages extends AbstractMigration
{
    public function change()
    {
        $this->table('pages')
             ->addColumn('status', 'integer', ['null' => false, 'limit' => 1, 'default' => 0])
             ->addIndex('status')
             ->update();
    }
}
