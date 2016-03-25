<?php

namespace Budget\Template;

// From `charcoal-app`
use \Charcoal\App\Template\AbstractTemplate;

// From `charcoal-base`
use \Charcoal\Charcoal;

// From `charcoal-core`

use Budget\Traits\HelperTrait;
use Budget\Object\User;


/**
 * Base template controller for a500
 */
class BudgetTemplate extends AbstractTemplate
{
	use HelperTrait;

	/**
	 * Local copy of config
	 * @var array
	 */
	protected $cfg;


	/**
	 * Metas
	 * @var string
	 * @var string
	 * @var string
	 */
	protected $metaTitle;
	protected $metaPrefix;
	protected $metaDescription;

	/**
	 * This should be removed at some point.
	 *
	 * @var [type]
	 */
	private $app;

	protected $rescues;
	protected $user;

	/**
	 * Auth urls
	 * Twitter, google, facebook
	 *
	 * @var array
	 */
	protected $auth;

	protected $mode;
	protected $type;

	/**
	 * @return \Charcoal\App\App
	 */
	protected function app()
	{
		if ($this->app === null) {
			$this->app = \Charcoal\App\App::instance();
		}
		return $this->app;
	}

	/**
	 * @return array
	 */
	public function cfg()
	{
		if ($this->cfg) {
			return $this->cfg;
		}
		$base_config = $this->app()->config()->get('budget');

		$this->cfg = $base_config;
		return $this->cfg;
	}

	/**
	 * @return string
	 */
	public function ident() {
		return 'default';
	}
}
