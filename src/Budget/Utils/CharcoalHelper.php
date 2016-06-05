<?php

namespace Budget\Utils;

// Pimple dependencies
use \Pimple\Container;

// PSR-7 (HTTP Messaging) dependencies
use Psr\Http\Message\RequestInterface;

// PSR-3 (logger) dependencies
use \Psr\Log\LoggerAwareInterface;
use \Psr\Log\LoggerAwareTrait;

// From `charcoal-app`
// use \Charcoal\App\Template\AbstractTemplate;
use \Charcoal\App\AppConfig;

// Module `charcoal-config` dependencies
use \Charcoal\Config\AbstractEntity;

// From `charcoal-core`
// use \Charcoal\Model\ModelLoader;

// Model Aware
use Budget\Support\Traits\ModelAwareTrait;
use Budget\Support\Interfaces\ModelAwareInterface;

// Config Aware
use Budget\Support\Traits\ConfigAwareTrait;
use Budget\Support\Interfaces\ConfigAwareInterface;

/**
 * Helper
 * Basic helper to handle all Charcoal interactions
 */
class CharcoalHelper extends AbstractEntity implements
    ConfigAwareInterface,
    LoggerAwareInterface,
    ModelAwareInterface
{
    use ConfigAwareTrait;
    use LoggerAwareTrait;
    use ModelAwareTrait;

    /**
     * @param Container  $container  The dependencies.
     */
    public function __construct(Container $container)
    {
        $this->setDependencies($container);
    }

    /**
     * Initialize the template with a request.
     *
     * @param RequestInterface $request The request to intialize.
     * @return boolean
     */
    public function init(RequestInterface $request)
    {
        // This method is a stub. Reimplement in children methods to ensure template initialization.
        return true;
    }

    /**
     * Give an opportunity to children classes to inject dependencies from a Pimple Container.
     *
     * Does nothing by default, reimplement in children classes.
     *
     * The `$container` DI-container (from `Pimple`) should not be saved or passed around, only to be used to
     * inject dependencies (typically via setters).
     *
     * @param Container $container A dependencies container instance.
     * @return void
     */
    public function setDependencies(Container $dependencies)
    {
        // ConfigAwareTrait
        $this->setAppConfig($dependencies['config']);
        // ModelAwareTrait
        $this->setModelFactory($dependencies['model/factory']);
    }
}
