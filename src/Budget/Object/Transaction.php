<?php

namespace Budget\Object;

use \DateTime;
use \Exception;
use \InvalidArgumentException;

use \Pimple\Container;

// Dependencies from `charcoal-core`
use \Charcoal\Model\AbstractModel;

// Model Aware
use Budget\Support\Traits\ModelAwareTrait;
use Budget\Support\Interfaces\ModelAwareInterface;

use \Budget\Support\Traits\PublicDataTrait;
use \Budget\Support\Interfaces\PublicDataInterface;

class Transaction extends AbstractModel implements
    ModelAwareInterface,
    PublicDataInterface
{
    use ModelAwareTrait;
    use PublicDataTrait {
        publicData as publicDataFromTrait;
    }

    protected $active = true;
    protected $type;
    protected $amount;
    protected $category;
    protected $description;
    protected $creationDate;
    protected $modifiedDate;

    private $categoryObject;

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
        $creationDate = new DateTime($this->creationDate());

        $supplants = [
            'category' => $this->categoryAsObject(),
            'creationDate' => $creationDate->format('Y-m-d')
        ];
        return $this->publicDataFromTrait($supplants);
    }

    /**
     * Return transaction category as object
     * @return TransactionCategory
     */
    public function categoryAsObject()
    {
        if (!$this->categoryObject) {
            $categoryObject = $this
                ->obj('budget/object/transaction-category')
                ->load($this->category())
                ->publicData();

            $this->categoryObject = $categoryObject;
        }
        return $this->categoryObject;
    }

    /** Getters */
    public function category() { return $this->category; }
    public function active() { return $this->active; }
    public function type() { return $this->type; }
    public function amount() { return $this->amount; }
    public function description() { return $this->description; }
    public function creationDate() { return $this->creationDate; }
    public function modifiedDate() { return $this->modifiedDate; }

    /** Setters */
    public function setActive($active)
    {
        $this->active = $active;
        return $this;
    }
    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }
    public function setAmount($amount)
    {
        $this->amount = $amount;
        return $this;
    }
    public function setCategory($category)
    {
        $this->category = $category;
        return $this;
    }
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }
    public function setCreationDate($creationDate)
    {
        $this->creationDate = $creationDate;
        return $this;
    }
    public function setModifiedDate($modifiedDate)
    {
        $this->modifiedDate = $modifiedDate;
        return $this;
    }
}
