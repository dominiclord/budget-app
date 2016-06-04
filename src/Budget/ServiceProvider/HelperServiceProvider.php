<?php

namespace Budget\ServiceProvider;

use \Pimple\Container;
use \Pimple\ServiceProviderInterface;

use \Charcoal\Model\ModelLoader;

use \Budget\Helper\Helper;
use \Budget\Translation\Catalog;

/**
 * Email Service Provider
 */
class HelperServiceProvider implements ServiceProviderInterface
{

	/**
	 * @param Container $container A pimple container instance.
	 * @return void
	 */
	public function register(Container $container)
	{
		/**
		 * @return Helper
		 */
		$container['budget/helper'] = function (Container $container) {
			return Helper::instance();
		};

	}
}
