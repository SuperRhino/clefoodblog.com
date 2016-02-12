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

        $pageData = $this->json();
        $pageData['author_id'] = $user->id;

        $page = new Page($pageData);
        $page->save();

        return $this->success($page->toArray());
    }

    public function uploadFile()
    {
        // $pageId = $this->params('pageId');
        if (empty($_FILES)) {
            throw new BadRequestException('Missing file upload');
        }

        $fileKey    = 'file';
        $tmpFile    = $_FILES[$fileKey]['tmp_name'];
        $targetName = basename($_FILES[$fileKey]['name']);
        $targetPath = $this->app->getSetting('base_path') . $this->app->getSetting('app.paths.upload_path');
        $targetFile = $targetPath .'/'. $targetName;
        $fileUri    = $this->app->getSetting('app.paths.upload_dir') .'/'. $targetName;

        if (! move_uploaded_file($tmpFile, $targetFile)) {
            // Possible file upload attack!!
            throw new BadRequestException('Upload failed');
        }

        // File is valid, and was successfully uploaded
        // TODO Insert Into DB

        return $this->success([
            'file_uri' => $fileUri,
        ]);
    }
}