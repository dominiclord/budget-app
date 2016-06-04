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
use \Charcoal\Object\Content;

use \Budget\Object\Transaction;

/**
 * Transaction category Taxonomy
 *
 * ## Properties from {@see \Charcoal\Object\CategoryTrait}
 *
 * @var string     $categoryItemType
 * @var integer    $categoryItemCount
 * @var Collection $categoryItems
 */
class TransactionCategory extends AbstractModel implements
    CategoryInterface
{
    use CategoryTrait;

    /**
     * Determine how many items in this category.
     *
     * @return integer
     */
    public function numCategoryItems()
    {
        # return parent::numCategoryItems();
        return (integer) $this->category_item_count;
    }

    /**
     * Load the service's items.
     *
     * @return Transaction[]|Collection
     */
    public function loadCategoryItems()
    {
        $factory = $this->factory();
        $item = $factory->create(Transaction::class);

        $loader = $this->createCollectionLoader();
        $loader->setModel($item);
        $loader->addFilter('active', true);
        $loader->addFilter([
            'property'  => 'category',
            'val'       => $this->id(),
            'operator'  => 'FIND_IN_SET'
        ]);

        return $loader->load();
    }
}