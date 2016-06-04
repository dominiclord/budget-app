<?php
namespace Budget\Support\Traits;

use Pimple\Container;

use \Budget\Helper\Helper;

/**
 * Coupled with the helper service provider
 * of Budget. Help dealing with methods such
 * as urlize, or any other "global" methods
 * necessary
 */
trait HelperAwareTrait
{
	protected $helper;

	public function setHelper(Helper $helper)
	{
		$this->helper = $helper;
		return $this;
	}

	public function helper()
	{
		return $this->helper;
	}

	abstract public function setDependencies(Container $container);
}
