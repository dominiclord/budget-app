<?php
namespace Pomerleau\Object;

use \Pimple\Container;

use \Pomerleau\Object\AbstractCategory;

// Model Aware
use Pomerleau\Support\Traits\ModelAwareTrait;
use Pomerleau\Support\Interfaces\ModelAwareInterface;


/**
 * Project class
 * A project could be a civil work or a building.
 *
 */
class ProjectCategory extends AbstractCategory implements
	ModelAwareInterface
{
	use ModelAwareTrait;

	protected $projectSection;

	/**
	 * Type
	 *
	 *
	 * @var string (chocie)
	 */
	protected $type;

	public function setDependencies(Container $container)
	{
		$this->setModelFactory($container['model/factory']);
		$this->setCatalog($container['translation/catalog']);
	}

/**
 * SETTERS
 */
	public function setType($type)
	{
		$this->type = $type;
	}


/**
 * GETTERS
 */
	public function type()
	{
		return $this->type;
	}


	public function url()
	{
		if (!$this->projectSection) {
			$this->projectSection = $this->obj('pomerleau/object/section')->loadFrom('template_ident', 'pomerleau/template/project-list');
		}

		return $this->projectSection->url(). '?type='.$this->type().'&category='.$this->id();

	}
}
