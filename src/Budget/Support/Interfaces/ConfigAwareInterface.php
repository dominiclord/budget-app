<?php
namespace Budget\Support\Interfaces;

use Charcoal\App\AppConfig;

/**
 *
 */
interface ConfigAwareInterface
{
    public function setAppConfig(AppConfig $helper);
    public function appConfig();
}
