<?php
namespace Budget\Support\Interfaces;

use \Budget\Helper\Helper;
/**
 *
 */
interface HelperAwareInterface
{
    public function setHelper(Helper $helper);
    public function helper();
}
