<?php

namespace Budget\Template;

// Pimple dependencies
use \Pimple\Container;

// RequestInterface
use Psr\Http\Message\RequestInterface;

// From `charcoal-app`
use \Charcoal\App\Template\AbstractTemplate;
use \Charcoal\App\AppConfig;

// From `charcoal-core`
use \Charcoal\Model\ModelLoader;

// Model Aware
use Budget\Support\Traits\ModelAwareTrait;
use Budget\Support\Interfaces\ModelAwareInterface;

// Config Aware
use Budget\Support\Traits\ConfigAwareTrait;
use Budget\Support\Interfaces\ConfigAwareInterface;

abstract class AbstractBudgetTemplate extends AbstractTemplate implements
	ModelAwareInterface,
	ConfigAwareInterface
{
	use ModelAwareTrait;
	use ConfigAwareTrait;

	public function setDependencies(Container $dependencies)
	{
		// ConfigAwareTrait
		$this->setAppConfig($dependencies['config']);
		// ModelAwareTrait
		$this->setModelFactory($dependencies['model/factory']);
	}

	/**
	 * Init with request parameters
	 * @param array $request GET or POST parameters.
	 * @return AbstractBudgetTemplate $this.
	 */
	public function init(RequestInterface $request)
	{
		return $this;
	}

	/**
	 * AppConfig uses the "URL" property in config
	 *
	 * @see AppConfig::baseUrl
	 * @return string Base URL
	 */
	public function baseUrl()
	{
		return $this->appConfig()->baseUrl();
	}
}
