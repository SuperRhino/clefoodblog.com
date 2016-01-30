<?php
use Phinx\Migration\AbstractMigration;
class InsertTestData extends AbstractMigration
{
    public function up()
    {
        $insert = 'INSERT INTO `events` (`id`, `title`,`description`,`details_uri`,`event_date`,`post_date`) VALUES
                   (1, "Heading", "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.", "#", NULL, "2014-09-01 00:00:00"),
                   (2, "Heading Two", "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Donec id elit non mi porta gravida at eget metus. Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod.", NULL, "2014-10-01 00:00:00", "2014-09-01 00:00:00"),
                   (3, "Heading Three", "Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.", "#", NULL, "2014-09-01 00:00:00")';
        $this->execute($insert);

        $insert = 'INSERT INTO `users` (`id`, `username`, `password`) VALUES
                    (1, "ryan", MD5("kittyburger")),
                    (2, "shayna", MD5("kittyburger"))';
        $this->execute($insert);
    }
    public function down()
    {
        $this->execute('DELETE FROM `events` WHERE `id` <=3');
        $this->execute('DELETE FROM `users` WHERE `id` <=2');
    }
}