<?php

namespace Budget\Object;

use \DateTime;
use \Exception;
use \InvalidArgumentException;

use \Pimple\Container;

// Dependencies from `charcoal-core`
use \Charcoal\Model\AbstractModel;

// Dependencies from 'charcoal-base'
use \Charcoal\Object\CategoryInterface;
use \Charcoal\Object\CategoryTrait;

// Model Aware
use Budget\Support\Traits\ModelAwareTrait;
use Budget\Support\Interfaces\ModelAwareInterface;

use \Budget\Support\Traits\PublicDataTrait;
use \Budget\Support\Interfaces\PublicDataInterface;

/**
 * Transaction category Taxonomy
 *
 * ## Properties from {@see \Charcoal\Object\CategoryTrait}
 *
 * @var string     $categoryItemType
 * @var integer    $categoryItemCount
 * @var Collection $categoryItems
 */
class TransactionLocation extends AbstractModel implements
    CategoryInterface,
    ModelAwareInterface,
    PublicDataInterface
{
    use CategoryTrait;
    use ModelAwareTrait;
    use PublicDataTrait {
        publicData as publicDataFromTrait;
    }

    /**
     * @param Container  $container  The dependencies.
     */
    public function setDependencies(Container $container)
    {
        $this->setModelFactory($container['model/factory']);
    }

    /**
     * Overriding PublicDataTrait's publicData method
     * @return array                 Object data
     */
    public function publicData(array $supplants = null)
    {
        $supplants = [
            'count' => $this->numCategoryItems()
        ];
        return $this->publicDataFromTrait($supplants);
    }

    /**
     * Load the category's items.
     * Implementation of CategoryTrait method
     *
     * @return Transaction[]|Collection
     */
    public function loadCategoryItems()
    {
        $loader = $this->collection('budget/object/transaction')
            ->addFilter('active', true)
            ->addFilter([
                'property'  => 'location',
                'val'       => $this->id(),
                'operator'  => 'FIND_IN_SET'
            ]);
        return $loader->load();
    }
}
